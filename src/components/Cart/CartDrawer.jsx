// 📄 src/components/Cart/CartDrawer.jsx - Version corrigée
import { X, Minus, Plus, Trash2, ShoppingBag, MessageCircle } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useState, useEffect } from 'react';

const CartDrawer = ({ isOpen, onClose }) => {
  const { cart, removeFromCart, updateQuantity, totalPrice, totalItems, clearCart } = useCart();
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  // ✅ Fermer avec Echap
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // ✅ Bloquer le scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleWhatsAppOrder = () => {
    if (cart.length === 0) return;
    setIsCheckingOut(true);

    const phoneNumber = '2290153096537';
    
    let message = '🛍️ *NOUVELLE COMMANDE WIN\'S PACK*%0A%0A';
    message += '📦 *Détails de la commande :*%0A%0A';
    
    cart.forEach((item, index) => {
      const itemName = item.variant ? `${item.name} (${item.variant.value})` : item.name;
      message += `${index + 1}. *${itemName}*%0A`;
      message += `   Quantité: ${item.quantity}%0A`;
      message += `   Prix: ${(item.price * item.quantity).toLocaleString()} FCFA%0A`;
      
      // ✅ SI C'EST UN PACK PERSONNALISÉ, AFFICHER LE DÉTAIL DES ARTICLES
      if (item.isCustom && item.items && item.items.length > 0) {
        message += `   📦 *Contenu du pack :*%0A`;
        // Compter les occurrences de chaque article
        const itemCount = {};
        item.items.forEach(i => {
          itemCount[i] = (itemCount[i] || 0) + 1;
        });
        Object.keys(itemCount).forEach(i => {
          message += `      • ${i}${itemCount[i] > 1 ? ` (x${itemCount[i]})` : ''}%0A`;
        });
      }
      
      // ✅ SI C'EST UN PACK NORMAL AVEC DES ARTICLES
      if (item.items && item.items.length > 0 && !item.isCustom) {
        message += `   📦 *Contenu du pack :*%0A`;
        item.items.slice(0, 5).forEach(i => {
          message += `      • ${i}%0A`;
        });
        if (item.items.length > 5) {
          message += `      • + ${item.items.length - 5} autres articles%0A`;
        }
      }
      
      message += '%0A';
    });
    
    message += `💰 *Total: ${totalPrice.toLocaleString()} FCFA*%0A%0A`;
    message += '📍 *Informations de livraison :*%0A';
    message += 'Nom: %0A';
    message += 'Adresse: %0A';
    message += 'Téléphone: %0A%0A';
    message += '🙏 Merci pour votre confiance ! WIN\'S PACK ✨';

    const url = `https://wa.me/${phoneNumber}?text=${message}`;
    window.open(url, '_blank');
    
    setTimeout(() => {
      setIsCheckingOut(false);
    }, 1500);
  };

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-50 transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className={`fixed right-0 top-0 h-full w-full max-w-md bg-white dark:bg-[#1a1a2e] z-50 shadow-2xl transition-transform duration-300 ease-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* ===== HEADER ===== */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-[#2d3748]">
          <div>
            <h2 className="text-xl font-display font-bold text-gray-800 dark:text-white flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-gold" />
              Mon Panier
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {totalItems} article{totalItems > 1 ? 's' : ''}
            </p>
          </div>
          <div className="flex items-center gap-1">
            {cart.length > 0 && (
              <button
                onClick={() => {
                  if (window.confirm('Vider le panier ?')) {
                    clearCart();
                  }
                }}
                className="p-2 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-full transition-colors text-red-400 hover:text-red-600"
                title="Vider le panier"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-[#2a2a4a] rounded-full transition-colors"
            >
              <X className="w-6 h-6 text-gray-500 dark:text-gray-400" />
            </button>
          </div>
        </div>

        {/* ===== CONTENU ===== */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 max-h-[55vh]">
          {cart.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingBag className="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
              <p className="text-gray-500 dark:text-gray-400 font-medium">Votre panier est vide</p>
              <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
                Ajoutez des articles pour composer votre pack
              </p>
              <button
                onClick={onClose}
                className="mt-4 text-sm text-gold font-medium hover:underline"
              >
                Continuer vos achats →
              </button>
            </div>
          ) : (
            cart.map((item) => {
              const itemPrice = item.price || 0;
              const totalItemPrice = itemPrice * item.quantity;
              const isPack = item.category === 'pack';
              const isCustom = item.isCustom;

              return (
                <div
                  key={item.id}
                  className={`flex items-center gap-3 p-3 rounded-xl ${
                    isPack 
                      ? 'bg-gold/5 border border-gold/20' 
                      : 'bg-gray-50 dark:bg-[#1a1a2e] border border-gray-100 dark:border-[#2d3748]'
                  }`}
                >
                  {/* Icone */}
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center text-2xl flex-shrink-0 bg-gray-200 dark:bg-[#2a2a4a]">
                    {item.emoji || (isPack ? '📦' : '✨')}
                  </div>

                  {/* Infos */}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-sm truncate text-gray-800 dark:text-white">
                      {item.name}
                      {isCustom && (
                        <span className="ml-1 text-[8px] font-bold text-gold bg-gold/20 px-1.5 py-0.5 rounded-full">
                          PERSONNALISÉ
                        </span>
                      )}
                    </h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {itemPrice.toLocaleString()} FCFA
                    </p>
                    {isCustom && item.items && (
                      <p className="text-[8px] text-gray-400 dark:text-gray-500 mt-0.5 truncate">
                        {item.items.length} articles
                      </p>
                    )}
                    <div className="flex items-center gap-2 mt-1">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-6 h-6 rounded-full bg-white dark:bg-[#2a2a4a] border border-gray-200 dark:border-[#2d3748] flex items-center justify-center hover:bg-gray-100 dark:hover:bg-[#3a3a5a] transition-colors"
                      >
                        <Minus className="w-3 h-3 text-gray-600 dark:text-gray-400" />
                      </button>
                      <span className="text-sm font-medium w-6 text-center text-gray-800 dark:text-white">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-6 h-6 rounded-full bg-white dark:bg-[#2a2a4a] border border-gray-200 dark:border-[#2d3748] flex items-center justify-center hover:bg-gray-100 dark:hover:bg-[#3a3a5a] transition-colors"
                      >
                        <Plus className="w-3 h-3 text-gray-600 dark:text-gray-400" />
                      </button>
                    </div>
                  </div>

                  {/* Prix total & Suppression */}
                  <div className="text-right flex-shrink-0">
                    <p className="font-bold text-sm text-gray-800 dark:text-white">
                      {totalItemPrice.toLocaleString()} FCFA
                    </p>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-red-400 hover:text-red-600 transition-colors text-sm"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* ===== FOOTER ===== */}
        {cart.length > 0 && (
          <div className="border-t border-gray-100 dark:border-[#2d3748] p-4 bg-gray-50 dark:bg-[#141425]">
            {/* Total */}
            <div className="flex justify-between items-center mb-4">
              <span className="text-gray-600 dark:text-gray-400">Total</span>
              <span className="text-2xl font-display font-bold text-gold">
                {totalPrice.toLocaleString()} FCFA
              </span>
            </div>

            {/* Bouton Commander */}
            <button
              onClick={handleWhatsAppOrder}
              disabled={isCheckingOut}
              className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-3.5 rounded-xl font-semibold hover:scale-[1.02] transition-all shadow-lg shadow-green-500/30 flex items-center justify-center gap-2 active:scale-95 disabled:opacity-70"
            >
              {isCheckingOut ? (
                <>
                  <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Envoi en cours...
                </>
              ) : (
                <>
                  <MessageCircle className="w-5 h-5" />
                  Commander via WhatsApp
                </>
              )}
            </button>

            {/* Infos */}
            <div className="flex items-center justify-center gap-3 mt-3 text-[10px] text-gray-400 dark:text-gray-500">
              <span>📦 Livraison disponible</span>
              <span className="w-px h-3 bg-gray-300 dark:bg-gray-600" />
              <span>💳 Paiement sécurisé</span>
              <span className="w-px h-3 bg-gray-300 dark:bg-gray-600" />
              <span>✨ Packs à partir de 3 articles</span>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default CartDrawer;