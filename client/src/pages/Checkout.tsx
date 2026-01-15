import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import api from '../api';

const Checkout = () => {
    const { items, cartTotal, clearCart } = useCart();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [shippingAddress, setShippingAddress] = useState({
        fullName: '',
        address: '',
        city: '',
        postalCode: '',
        country: ''
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await api.post('/orders', {
                items: items.map(item => ({
                    productId: item._id,
                    name: item.name,
                    price: item.price,
                    image: item.image,
                    quantity: item.quantity
                })),
                shippingAddress
            });

            clearCart();
            navigate('/orders');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to place order');
        } finally {
            setLoading(false);
        }
    };

    if (items.length === 0) {
        return (
            <div className="max-w-7xl mx-auto px-4 py-16 text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h2>
                <button
                    onClick={() => navigate('/')}
                    className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-indigo-700"
                >
                    Continue Shopping
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Shipping Form */}
                <div className="bg-white p-6 rounded-lg shadow">
                    <h2 className="text-xl font-bold mb-4">Shipping Address</h2>
                    
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                            <input
                                type="text"
                                value={shippingAddress.fullName}
                                onChange={e => setShippingAddress({ ...shippingAddress, fullName: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                            <input
                                type="text"
                                value={shippingAddress.address}
                                onChange={e => setShippingAddress({ ...shippingAddress, address: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                required
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                                <input
                                    type="text"
                                    value={shippingAddress.city}
                                    onChange={e => setShippingAddress({ ...shippingAddress, city: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Postal Code</label>
                                <input
                                    type="text"
                                    value={shippingAddress.postalCode}
                                    onChange={e => setShippingAddress({ ...shippingAddress, postalCode: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                            <input
                                type="text"
                                value={shippingAddress.country}
                                onChange={e => setShippingAddress({ ...shippingAddress, country: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Placing Order...' : 'Place Order'}
                        </button>
                    </form>
                </div>

                {/* Order Summary */}
                <div className="bg-white p-6 rounded-lg shadow h-fit">
                    <h2 className="text-xl font-bold mb-4">Order Summary</h2>
                    
                    <div className="space-y-4 mb-6">
                        {items.map(item => (
                            <div key={item._id} className="flex gap-4">
                                <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded" />
                                <div className="flex-1">
                                    <h3 className="font-medium text-gray-900">{item.name}</h3>
                                    <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                                </div>
                                <p className="font-semibold text-gray-900">${(item.price * item.quantity).toFixed(2)}</p>
                            </div>
                        ))}
                    </div>

                    <div className="border-t pt-4">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-gray-600">Subtotal</span>
                            <span className="font-semibold">${cartTotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-gray-600">Shipping</span>
                            <span className="font-semibold">Free</span>
                        </div>
                        <div className="border-t pt-2 mt-2">
                            <div className="flex justify-between items-center">
                                <span className="text-lg font-bold">Total</span>
                                <span className="text-lg font-bold text-primary">${cartTotal.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
