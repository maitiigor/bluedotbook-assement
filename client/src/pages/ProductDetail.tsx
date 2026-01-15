import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api';
import { useCart } from '../context/CartContext';

const ProductDetail = () => {
    const { id } = useParams();
    const [product, setProduct] = useState<any>(null);
    const { addToCart } = useCart();

    useEffect(() => {
        api.get(`/products/${id}`).then(res => setProduct(res.data));
    }, [id]);

    if (!product) return <div className="p-8">Loading...</div>;

    return (
        <div className="max-w-7xl mx-auto px-4 py-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="bg-gray-100 rounded-2xl overflow-hidden h-96 md:h-[500px]">
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex flex-col justify-center">
                    <span className="text-sm text-primary font-semibold uppercase tracking-wide">{product.category}</span>
                    <h1 className="text-4xl font-bold text-gray-900 mt-2 mb-4">{product.name}</h1>
                    <p className="text-gray-500 text-lg mb-8 leading-relaxed">{product.description}</p>
                    <div className="text-3xl font-bold text-gray-900 mb-8">${product.price.toFixed(2)}</div>
                    <div className="flex gap-4">
                        <button 
                            onClick={() => addToCart(product)}
                            className="flex-1 bg-black text-white py-4 px-6 rounded-lg font-bold text-lg hover:bg-gray-800 transition shadow-lg transform hover:-translate-y-1"
                        >
                            Add to Cart
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;
