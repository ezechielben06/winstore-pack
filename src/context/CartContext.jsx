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

  const getProductPrice = (product) => {
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
      // ✅ Vérifier si le même produit AVEC LA MÊME VARIANTE existe déjà
      const existing = prev.find(item => {
        if (variantId && item.variant) {
          // Si l'article a une variante, comparer produit + variante
          return item.id === product.id && item.variant.id === variantId;
        }
        // Si l'article n'a pas de variante, comparer juste l'id
        return item.id === product.id && !item.variant;
      });
      
      if (existing) {
        // ✅ Si le même produit + même variante existe, augmenter la quantité
        return prev.map(item => {
          const itemVariantId = item.variant ? item.variant.id : null;
          if (item.id === product.id && itemVariantId === variantId) {
            return { ...item, quantity: item.quantity + quantity };
          }
          return item;
        });
      }
      
      // ✅ Ajouter un nouvel article avec un cartId unique
      return [...prev, { 
        ...product,
        cartId: cartId,
        quantity, 
        price: price
      }];
    });
  };

  const removeFromCart = (cartId) => {
    setCart(prev => prev.filter(item => {
      const itemId = item.cartId || item.id;
      return itemId !== cartId;
    }));
  };

  const updateQuantity = (cartId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(cartId);
      return;
    }
    setCart(prev =>
      prev.map(item => {
        const itemId = item.cartId || item.id;
        if (itemId === cartId) {
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