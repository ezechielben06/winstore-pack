// 📄 src/context/CartContext.jsx - Version corrigée
import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('cart');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  // ✅ Fonction pour obtenir le prix d'un produit
  const getProductPrice = (product) => {
    // Si le produit a un prix fixe
    if (product.price) return product.price;
    // Si le produit a une fourchette de prix
    if (product.priceRange) {
      const parts = product.priceRange.split('-');
      if (parts.length === 2) {
        return parseInt(parts[0]); // Prend le prix minimum
      }
      return parseInt(product.priceRange);
    }
    return 0;
  };

  const addToCart = (product, quantity = 1) => {
    // ✅ Calculer le prix une fois et le stocker dans l'article
    const price = getProductPrice(product);
    
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      // ✅ Stocker le prix calculé dans l'article
      return [...prev, { 
        ...product, 
        quantity, 
        price: price  // ← Le prix est stocké ici
      }];
    });
  };

  const removeFromCart = (id) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const updateQuantity = (id, quantity) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }
    setCart(prev =>
      prev.map(item =>
        item.id === id ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => setCart([]);

  // ✅ Calcul du total
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  
  const totalPrice = cart.reduce((sum, item) => {
    // ✅ Utiliser le prix stocké dans l'article
    const price = item.price || 0;
    return sum + (price * item.quantity);
  }, 0);

  return (
    <CartContext.Provider value={{
      cart,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      totalItems,
      totalPrice,
    }}>
      {children}
    </CartContext.Provider>
  );
};