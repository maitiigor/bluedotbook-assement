import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { Package, Clock, Truck, CheckCircle, XCircle } from 'lucide-react';

interface OrderItem {
    productId: string;
    name: string;
    price: number;
    image: string;
    quantity: number;
}

interface Order {
    _id: string;
    items: OrderItem[];
    totalAmount: number;
    status: string;
    shippingAddress: {
        fullName: string;
        address: string;
        city: string;
        postalCode: string;
        country: string;
    };
    createdAt: string;
}

const Orders = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const response = await api.get('/orders');
            setOrders(response.data);
        } catch (error) {
            console.error('Failed to fetch orders', error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'pending': return <Clock className="text-yellow-500" size={20} />;
            case 'processing': return <Package className="text-blue-500" size={20} />;
            case 'shipped': return <Truck className="text-indigo-500" size={20} />;
            case 'delivered': return <CheckCircle className="text-green-500" size={20} />;
            case 'cancelled': return <XCircle className="text-red-500" size={20} />;
            default: return <Clock className="text-gray-500" size={20} />;
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pending': return 'bg-yellow-100 text-yellow-800';
            case 'processing': return 'bg-blue-100 text-blue-800';
            case 'shipped': return 'bg-indigo-100 text-indigo-800';
            case 'delivered': return 'bg-green-100 text-green-800';
            case 'cancelled': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    if (loading) {
        return (
            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="animate-pulse space-y-4">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="bg-white rounded-lg shadow p-6 h-48"></div>
                    ))}
                </div>
            </div>
        );
    }

    if (orders.length === 0) {
        return (
            <div className="max-w-7xl mx-auto px-4 py-16 text-center">
                <Package size={64} className="mx-auto text-gray-400 mb-4" />
                <h2 className="text-2xl font-bold text-gray-900 mb-4">No orders yet</h2>
                <p className="text-gray-600 mb-6">Start shopping to create your first order!</p>
                <button
                    onClick={() => navigate('/')}
                    className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-indigo-700"
                >
                    Start Shopping
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">My Orders</h1>

            <div className="space-y-6">
                {orders.map(order => (
                    <div key={order._id} className="bg-white rounded-lg shadow overflow-hidden">
                        <div className="p-6 border-b border-gray-200">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <p className="text-sm text-gray-500">Order ID</p>
                                    <p className="font-mono text-sm">{order._id}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    {getStatusIcon(order.status)}
                                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                    </span>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                <div>
                                    <p className="text-gray-500">Order Date</p>
                                    <p className="font-medium">{new Date(order.createdAt).toLocaleDateString()}</p>
                                </div>
                                <div>
                                    <p className="text-gray-500">Total Amount</p>
                                    <p className="font-bold text-primary">${order.totalAmount.toFixed(2)}</p>
                                </div>
                            </div>
                        </div>

                        <div className="p-6">
                            <h3 className="font-semibold mb-4">Items</h3>
                            <div className="space-y-4">
                                {order.items.map((item, index) => (
                                    <div key={index} className="flex gap-4">
                                        <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded" />
                                        <div className="flex-1">
                                            <h4 className="font-medium text-gray-900">{item.name}</h4>
                                            <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                                        </div>
                                        <p className="font-semibold text-gray-900">${(item.price * item.quantity).toFixed(2)}</p>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-6 pt-6 border-t border-gray-200">
                                <h3 className="font-semibold mb-2">Shipping Address</h3>
                                <p className="text-sm text-gray-600">
                                    {order.shippingAddress.fullName}<br />
                                    {order.shippingAddress.address}<br />
                                    {order.shippingAddress.city}, {order.shippingAddress.postalCode}<br />
                                    {order.shippingAddress.country}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Orders;
