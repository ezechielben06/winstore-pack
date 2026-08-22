// 📄 src/context/CartContext.jsx - Version avec variantes
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

  const getProductPrice = (product) => {
    // ✅ Si le produit a une variante sélectionnée avec un prix
    if (product.variant && product.variant.price) {
      return product.variant.price;
    }
    if (product.price) return product.price;
    if (product.priceRange) {
      const parts = product.priceRange.split('-');
      if (parts.length === 2) {
        return parseInt(parts[0]);
      }
      return parseInt(product.priceRange);
    }
    return 0;
  };

  const addToCart = (product, quantity = 1) => {
    const price = getProductPrice(product);
    
    // ✅ Générer un ID unique pour chaque combinaison produit + variante
    const variantId = product.variant ? product.variant.id : null;
    const cartId = variantId ? `${product.id}-${variantId}` : product.id;
    
    setCart(prev => {
      const existing = prev.find(item => {
        if (variantId && item.variant) {
          return item.id === product.id && item.variant.id === variantId;
        }
        return item.id === product.id && !item.variant;
      });
      
      if (existing) {
        return prev.map(item =>
          (variantId && item.variant && item.id === product.id && item.variant.id === variantId) ||
          (!variantId && item.id === product.id && !item.variant)
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      
      return [...prev, { 
        ...product,
        id: product.id,
        cartId: cartId,
        quantity, 
        price: price
      }];
    });
  };

  const removeFromCart = (cartId) => {
    setCart(prev => prev.filter(item => item.cartId !== cartId && item.id !== cartId));
  };

  const updateQuantity = (cartId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(cartId);
      return;
    }
    setCart(prev =>
      prev.map(item => {
        const itemId = item.cartId || item.id;
        if (itemId === cartId || item.id === cartId) {
          return { ...item, quantity };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem('cart');
  };

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  
  const totalPrice = cart.reduce((sum, item) => {
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