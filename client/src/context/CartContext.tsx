import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import api from '../api';
import { useAuth } from './AuthContext';

export interface CartItem {
  _id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (product: any) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  cartTotal: number;
  itemCount: number;
  isCartOpen: boolean;
  setIsCartOpen: (isOpen: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [items, setItems] = useState<CartItem[]>(() => {
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  // Load cart from backend when user logs in
  useEffect(() => {
    const loadCartFromBackend = async () => {
      if (user?.token && !isSyncing) {
        setIsSyncing(true);
        try {
          const response = await api.get('/cart');
          const backendCart = response.data.items || [];
          
          // Merge localStorage cart with backend cart
          const localCart = items;
          const mergedCart = [...backendCart];
          
          localCart.forEach(localItem => {
            const existingIndex = mergedCart.findIndex(item => item._id === localItem._id);
            if (existingIndex >= 0) {
              // Item exists in both - use higher quantity
              mergedCart[existingIndex].quantity = Math.max(
                mergedCart[existingIndex].quantity,
                localItem.quantity
              );
            } else {
              // Item only in local cart - add it
              mergedCart.push(localItem);
            }
          });
          
          setItems(mergedCart);
          
          // Sync merged cart back to backend
          if (mergedCart.length > 0) {
            await api.post('/cart', { items: mergedCart });
          }
          
          // Clear localStorage since we're now using backend
          localStorage.removeItem('cart');
        } catch (error) {
          console.error('Error loading cart from backend:', error);
        } finally {
          setIsSyncing(false);
        }
      }
    };

    loadCartFromBackend();
  }, [user?.token]);

  // Sync cart to backend or localStorage
  useEffect(() => {
    const syncCart = async () => {
      if (user?.token && !isSyncing) {
        // Sync to backend if logged in
        try {
          await api.post('/cart', { items });
        } catch (error) {
          console.error('Error syncing cart to backend:', error);
        }
      } else {
        // Save to localStorage if guest
        localStorage.setItem('cart', JSON.stringify(items));
      }
    };

    if (items.length >= 0) {
      syncCart();
    }
  }, [items, user?.token]);

  const addToCart = (product: any) => {
    setItems(prev => {
      const existing = prev.find(item => item._id === product._id);
      if (existing) {
        return prev.map(item => 
          item._id === product._id 
            ? { ...item, quantity: item.quantity + 1 } 
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = async (productId: string) => {
    setItems(prev => prev.filter(item => item._id !== productId));
    
    // Also remove from backend if logged in
    if (user?.token) {
      try {
        await api.delete(`/cart/${productId}`);
      } catch (error) {
        console.error('Error removing item from backend cart:', error);
      }
    }
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity < 1) {
      removeFromCart(productId);
      return;
    }
    setItems(prev => prev.map(item => 
      item._id === productId ? { ...item, quantity } : item
    ));
  };

  const clearCart = async () => {
    setItems([]);
    
    // Also clear backend cart if logged in
    if (user?.token) {
      try {
        await api.delete('/cart');
      } catch (error) {
        console.error('Error clearing backend cart:', error);
      }
    }
  };

  const cartTotal = items.reduce((total, item) => total + item.price * item.quantity, 0);
  const itemCount = items.reduce((count, item) => count + item.quantity, 0);

  return (
    <CartContext.Provider value={{ 
      items, addToCart, removeFromCart, updateQuantity, clearCart, 
      cartTotal, itemCount, isCartOpen, setIsCartOpen 
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
