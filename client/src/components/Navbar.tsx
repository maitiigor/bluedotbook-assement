import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, LogOut, LayoutDashboard } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { itemCount, setIsCartOpen } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold text-primary">
              ShopMate
            </Link>
          </div>

          <div className="flex items-center space-x-6">
            <Link to="/" className="text-gray-600 hover:text-primary transition">
              Products
            </Link>
            
            {user?.isAdmin && (
               <Link to="/admin" className="text-gray-600 hover:text-primary transition flex items-center space-x-1">
                 <LayoutDashboard size={20} />
                 <span>Admin</span>
               </Link>

               
            )}

            <Link to="/orders" className="text-gray-600 hover:text-primary transition flex items-center space-x-1">
                 <LayoutDashboard size={20} />
                 <span>Orders</span>
               </Link>

            <button 
              onClick={() => setIsCartOpen(true)}
              className="relative text-gray-600 hover:text-primary transition"
            >
              <ShoppingCart size={24} />
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </button>

            {user ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm font-medium text-gray-700">Hi, {user.username}</span>
                <button 
                  onClick={handleLogout}
                  className="text-gray-500 hover:text-red-500 transition"
                  title="Logout"
                >
                  <LogOut size={20} />
                </button>
              </div>
            ) : (
              <Link 
                to="/login" 
                className="flex items-center space-x-1 text-gray-600 hover:text-primary transition"
              >
                <User size={20} />
                <span>Login</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
