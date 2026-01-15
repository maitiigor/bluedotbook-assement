import React, { useEffect, useState } from 'react';
import api from '../api';
import { Plus, Edit, Trash2, X, Upload } from 'lucide-react';

const Admin = () => {
    const [products, setProducts] = useState<any[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<any>(null);
    const [formData, setFormData] = useState({
        name: '', price: '', category: '', description: '', image: '', stock: ''
    });
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string>('');

    const fetchProducts = async () => {
        const res = await api.get('/products');
        setProducts(res.data.products ?? []);
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleDelete = async (id: string) => {
        if (confirm('Are you sure?')) {
            await api.delete(`/products/${id}`);
            fetchProducts();
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const submitData = new FormData();
            submitData.append('name', formData.name);
            submitData.append('price', formData.price);
            submitData.append('category', formData.category);
            submitData.append('description', formData.description);
            submitData.append('stock', formData.stock);

            // Add file if selected, otherwise add image URL
            if (selectedFile) {
                submitData.append('image', selectedFile);
            } else if (formData.image) {
                submitData.append('image', formData.image);
            }

            if (editingProduct) {
                await api.put(`/products/${editingProduct._id}`, submitData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
            } else {
                await api.post('/products', submitData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
            }
            setIsModalOpen(false);
            setEditingProduct(null);
            setFormData({ name: '', price: '', category: '', description: '', image: '', stock: '' });
            setSelectedFile(null);
            setImagePreview('');
            fetchProducts();
        } catch (error) {
            console.error(error);
            alert('Operation failed');
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            const reader = new FileReader();
            reader.onload = (event) => {
                const result = event.target?.result;
                if (result) {
                    setImagePreview(result as string);
                }
            };
            reader.readAsDataURL(file);
        }
    };

    const openEdit = (product: any) => {
        setEditingProduct(product);
        setFormData({ ...product });
        setSelectedFile(null);
        setImagePreview(product.image);
        setIsModalOpen(true);
    };

    const openCreate = () => {
        setEditingProduct(null);
        setFormData({ name: '', price: '', category: '', description: '', image: '', stock: '' });
        setSelectedFile(null);
        setImagePreview('');
        setIsModalOpen(true);
    };

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Product Management</h1>
                <button
                    onClick={openCreate}
                    className="bg-primary text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-indigo-700 transition"
                >
                    <Plus size={20} /> Add Product
                </button>
            </div>

            <div className="bg-white shadow overflow-hidden rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {products.map((product) => (
                            <tr key={product._id}>
                                <td className="px-6 py-4 whitespace-nowrap flex items-center gap-3">
                                    <img src={product.image} className="h-10 w-10 rounded object-cover" alt="" />
                                    <span className="font-medium text-gray-900">{product.name}</span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-gray-500">${product.price}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-gray-500">{product.category}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex gap-3">
                                    <button onClick={() => openEdit(product)} className="text-indigo-600 hover:text-indigo-900"><Edit size={18} /></button>
                                    <button onClick={() => handleDelete(product._id)} className="text-red-600 hover:text-red-900"><Trash2 size={18} /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
                    <div className="bg-white rounded-xl shadow-xl max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold">{editingProduct ? 'Edit Product' : 'New Product'}</h2>
                            <button onClick={() => setIsModalOpen(false)}><X size={24} className="text-gray-500" /></button>
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <input
                                placeholder="Name"
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                                className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary border p-2"
                                required
                            />
                            <div className="grid grid-cols-2 gap-4">
                                <input
                                    placeholder="Price"
                                    type="number"
                                    value={formData.price}
                                    onChange={e => setFormData({ ...formData, price: e.target.value })}
                                    className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary border p-2"
                                    required
                                />
                                {/* <input
                                    placeholder="Category"
                                    value={formData.category}
                                    onChange={e => setFormData({ ...formData, category: e.target.value })}
                                    className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary border p-2"
                                    required
                                /> */}
                                <select
                                    value={formData.category}
                                    onChange={e => setFormData({ ...formData, category: e.target.value })}
                                    className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary border p-2"
                                    required
                                >
                                    <option value="">Select Category</option>
                                    <option value="Electronics">Electronic</option>
                                    <option value="Footware">Footware</option>
                                    <option value="Clothing">Clothing</option>
                                    <option value="Accessories">Accessories</option>
                                </select>
                            </div>
                            
                            {/* Image Upload Section */}
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">Product Image</label>
                                <div className="flex items-center gap-4">
                                    <label className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg cursor-pointer hover:bg-gray-200 transition">
                                        <Upload size={18} />
                                        <span>{selectedFile ? 'Change File' : 'Upload Image'}</span>
                                        <input 
                                            type="file" 
                                            onChange={handleFileChange} 
                                            accept="image/*"
                                            className="hidden"
                                        />
                                    </label>
                                    {selectedFile && (
                                        <span className="text-sm text-gray-600">{selectedFile.name}</span>
                                    )}
                                </div>
                                
                                {/* Image Preview */}
                                {imagePreview && (
                                    <div className="mt-2">
                                        <img 
                                            src={imagePreview} 
                                            alt="Preview" 
                                            className="h-32 w-32 object-cover rounded-lg border-2 border-gray-200"
                                        />
                                    </div>
                                )}
                                
                                {/* Or use URL */}
                                <div className="text-center text-sm text-gray-500">or</div>
                                <input
                                    placeholder="Image URL (optional if file uploaded)"
                                    value={formData.image}
                                    onChange={e => setFormData({ ...formData, image: e.target.value })}
                                    className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary border p-2"
                                />
                            </div>

                            <textarea
                                placeholder="Description"
                                value={formData.description}
                                onChange={e => setFormData({ ...formData, description: e.target.value })}
                                className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary border p-2"
                                required
                            />
                            <input
                                placeholder="Stock"
                                type="number"
                                value={formData.stock}
                                onChange={e => setFormData({ ...formData, stock: e.target.value })}
                                className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary border p-2"
                                required
                            />
                            <button
                                type="submit"
                                className="w-full bg-primary text-white py-2 rounded-lg font-medium hover:bg-indigo-700"
                            >
                                {editingProduct ? 'Update Product' : 'Create Product'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Admin;
