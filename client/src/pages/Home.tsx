import { useEffect, useState } from 'react';
import api from '../api';
import { useCart } from '../context/CartContext';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';
import clsx from 'clsx';
import { Link } from 'react-router-dom';

interface Product {
  _id: string;
  name: string;
  price: number;
  description: string;
  category: string;
  image: string;
}

const Home = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { addToCart } = useCart();

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (category) params.append('category', category);
      params.append('page', currentPage.toString());
      params.append('limit', '12');
      
      const response = await api.get(`/products?${params.toString()}`);
      setProducts(response.data.products || []);
      setTotalPages(response.data.totalPages || 1);
    } catch (error) {
      console.error('Failed to fetch products', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [search, category, currentPage]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [search, category]);

  const categories = ['Electronics', 'Footwear', 'Accessories', 'Clothing'];

  const handleAddToCart = (e: React.MouseEvent, product: Product) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Filters & Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div className="relative max-w-md w-full">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary focus:border-primary sm:text-sm"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="flex items-center space-x-2 overflow-x-auto pb-2 md:pb-0">
          <button
            onClick={() => setCategory('')}
            className={clsx(
              "px-4 py-2 rounded-full text-sm font-medium transition whitespace-nowrap",
              category === '' ? "bg-primary text-white shadow-md" : "bg-white text-gray-600 hover:bg-gray-100 border"
            )}
          >
            All
          </button>
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={clsx(
                "px-4 py-2 rounded-full text-sm font-medium transition whitespace-nowrap",
                category === c ? "bg-primary text-white shadow-md" : "bg-white text-gray-600 hover:bg-gray-100 border"
              )}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Product Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
           {[...Array(8)].map((_, i) => (
             <div key={i} className="bg-white rounded-lg shadow-sm h-80 animate-pulse"></div>
           ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product) => (
            <Link to={`/product/${product._id}`} key={product._id}>
            <div className="bg-white rounded-xl shadow-sm hover:shadow-xl transition-shadow duration-300 overflow-hidden flex flex-col group">
              <div className="relative h-64 overflow-hidden bg-gray-100">
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              
              <div className="p-5 flex flex-col flex-1">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-bold text-gray-900 line-clamp-1">{product.name}</h3>
                  <span className="bg-green-100 text-green-800 text-xs font-semibold px-2.5 py-0.5 rounded ml-2">
                   {product.category}
                  </span>
                </div>
                
                <p className="text-gray-500 text-sm mb-4 line-clamp-2">{product.description}</p>
                
                <div className="mt-auto flex items-center justify-between">
                  <span className="text-xl font-bold text-primary">${product.price.toFixed(2)}</span>
                  <button
                    onClick={(e) => handleAddToCart(e, product)}
                    className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary transition-colors flex items-center gap-2"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
            </Link>
          ))}
        </div>
      )}
      
      {!loading && products.length === 0 && (
          <div className="text-center py-20">
              <p className="text-gray-500 text-lg">No products found.</p>
          </div>
      )}

      {/* Pagination */}
      {!loading && totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-12">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            <ChevronLeft size={20} />
          </button>

          <div className="flex gap-2">
            {[...Array(totalPages)].map((_, i) => {
              const page = i + 1;
              // Show first page, last page, current page, and pages around current
              if (
                page === 1 ||
                page === totalPages ||
                (page >= currentPage - 1 && page <= currentPage + 1)
              ) {
                return (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={clsx(
                      "px-4 py-2 rounded-lg font-medium transition",
                      currentPage === page
                        ? "bg-primary text-white"
                        : "border border-gray-300 hover:bg-gray-50"
                    )}
                  >
                    {page}
                  </button>
                );
              } else if (page === currentPage - 2 || page === currentPage + 2) {
                return <span key={page} className="px-2 py-2">...</span>;
              }
              return null;
            })}
          </div>

          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      )}
    </div>
  );
};

export default Home;
