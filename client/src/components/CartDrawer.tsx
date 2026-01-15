import { X, Trash2, Plus, Minus } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import clsx from 'clsx';

const CartDrawer = () => {
  const { 
    isCartOpen, setIsCartOpen, items, removeFromCart, updateQuantity, cartTotal 
  } = useCart();
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleCheckout = () => {
    if (!user) {
      setIsCartOpen(false);
      navigate('/login');
    } else {
      setIsCartOpen(false);
      navigate('/checkout');
    }
  };

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div 
        className="absolute inset-0 bg-black bg-opacity-50 transition-opacity" 
        onClick={() => setIsCartOpen(false)}
      />
      
      <div className={clsx(
        "absolute inset-y-0 right-0 max-w-md w-full bg-white shadow-xl transform transition-transform duration-300",
        isCartOpen ? "translate-x-0" : "translate-x-full"
      )}>
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-lg font-semibold text-gray-900">Shopping Cart</h2>
            <button 
              onClick={() => setIsCartOpen(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <X size={24} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {items.length === 0 ? (
              <div className="text-center py-10">
                <p className="text-gray-500">Your cart is empty.</p>
                <button 
                  onClick={() => setIsCartOpen(false)}
                  className="mt-4 text-primary font-medium hover:underline"
                >
                  Continue Shopping
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div key={item._id} className="flex space-x-4 py-2">
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    className="h-20 w-20 object-cover rounded-md border"
                  />
                  <div className="flex-1">
                    <h3 className="text-sm font-medium text-gray-900">{item.name}</h3>
                    <p className="text-sm text-gray-500">${item.price.toFixed(2)}</p>
                    
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center border rounded-md">
                        <button 
                          onClick={() => updateQuantity(item._id, item.quantity - 1)}
                          className="p-1 px-2 hover:bg-gray-100 text-gray-600"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="px-2 text-sm font-medium">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item._id, item.quantity + 1)}
                          className="p-1 px-2 hover:bg-gray-100 text-gray-600"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                      
                      <button 
                        onClick={() => removeFromCart(item._id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {items.length > 0 && (
            <div className="p-4 border-t bg-gray-50">
              <div className="flex justify-between text-base font-medium text-gray-900 mb-4">
                <p>Subtotal</p>
                <p>${cartTotal.toFixed(2)}</p>
              </div>
              <button
                className="w-full bg-primary text-white py-3 px-4 rounded-md shadow hover:bg-indigo-700 transition font-medium"
                onClick={handleCheckout}
              >
                Checkout
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartDrawer;
