// 📄 src/context/CartContext.jsx
import { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

// ✅ Calcule le prix d'un produit (variante > price > priceRange)
const getProductPrice = (product) => {
  if (product?.variant && product.variant.price != null) {
    return product.variant.price;
  }
  if (product?.price != null) {
    return product.price;
  }
  if (product?.priceRange) {
    const parts = String(product.priceRange).split("-");
    if (parts.length === 2) {
      const p = parseInt(parts[0], 10);
      return isNaN(p) ? 0 : p;
    }
    const p = parseInt(product.priceRange, 10);
    return isNaN(p) ? 0 : p;
  }
  return 0;
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem("cart");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // ✅ Persiste le panier
  useEffect(() => {
    try {
      localStorage.setItem("cart", JSON.stringify(cart));
    } catch (err) {
      console.warn("Impossible de sauvegarder le panier:", err);
    }
  }, [cart]);

  // ✅ Ajout au panier (variantes + packs personnalisés)
  const addToCart = (product, quantity = 1) => {
    const price = getProductPrice(product);
    const variantId = product.variant ? product.variant.id : null;
    const cartId = variantId ? `${product.id}-${variantId}` : product.id;

    setCart((prev) => {
      // Cherche une ligne identique (même produit + même variante)
      const existing = prev.find((item) => {
        if (variantId && item.variant) {
          return item.id === product.id && item.variant.id === variantId;
        }
        return item.id === product.id && !item.variant;
      });

      if (existing) {
        return prev.map((item) => {
          const itemVariantId = item.variant ? item.variant.id : null;
          if (item.id === product.id && itemVariantId === variantId) {
            return { ...item, quantity: item.quantity + quantity };
          }
          return item;
        });
      }

      return [
        ...prev,
        {
          ...product,
          cartId,
          quantity,
          price,
        },
      ];
    });
  };

  // ✅ Retire un article (par cartId)
  const removeFromCart = (cartId) => {
    setCart((prev) =>
      prev.filter((item) => (item.cartId || item.id) !== cartId)
    );
  };

  // ✅ Change la quantité
  const updateQuantity = (cartId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(cartId);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        (item.cartId || item.id) === cartId ? { ...item, quantity } : item
      )
    );
  };

  // ✅ Vide le panier
  const clearCart = () => {
    setCart([]);
    try {
      localStorage.removeItem("cart");
    } catch {}
  };

  // ✅ Totaux
  const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 0), 0);

  const totalPrice = cart.reduce((sum, item) => {
    const price = item.price || 0;
    return sum + price * (item.quantity || 0);
  }, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};