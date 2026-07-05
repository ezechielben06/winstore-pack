import { X, Minus, Plus, Trash2, ShoppingBag, MessageCircle, Share2 } from 'lucide-react';
import { useCart } from '../../context/CartContext';

const CartDrawer = ({ isOpen, onClose }) => {
  const { cart, removeFromCart, updateQuantity, totalPrice, totalItems } = useCart();

  // Fonction pour commander via WhatsApp
  const handleWhatsAppOrder = () => {
    const phoneNumber = '2290153096537';
    
    // Construire le message
    let message = '🛍️ *NOUVELLE COMMANDE WIN\'STORE PACKS*%0A%0A';
    message += '📦 *Détails de la commande :*%0A%0A';
    
    cart.forEach((item, index) => {
      message += `${index + 1}. *${item.name}*%0A`;
      message += `   Quantité: ${item.quantity}%0A`;
      message += `   Prix: ${(item.price * item.quantity).toLocaleString()} FCFA%0A%0A`;
    });
    
    message += `💰 *Total: ${totalPrice.toLocaleString()} FCFA*%0A%0A`;
    message += '📍 *Informations de livraison :*%0A';
    message += 'Nom: %0A';
    message += 'Adresse: %0A';
    message += 'Téléphone: %0A%0A';
    message += '🙏 Merci pour votre confiance ! WIN\'STORE PACKS ✨';

    // Ouvrir WhatsApp
    const url = `https://wa.me/${phoneNumber}?text=${message}`;
    window.open(url, '_blank');
    
    // Fermer le panier
    onClose();
  };

  // Fonction de partage
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'WIN\'STORE PACKS',
        text: 'Découvre les packs WIN\'STORE pour révéler ta confiance ! ✨',
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Lien copié dans le presse-papier ! 📋');
    }
  };

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/50 z-50 transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className={`fixed right-0 top-0 h-full w-full max-w-md bg-white z-50 shadow-2xl transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-gradient-to-r from-feminine-light to-white">
          <div>
            <h2 className="text-xl font-display font-bold text-gray-800">Mon Panier</h2>
            <p className="text-sm text-gray-500">{totalItems} articles</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500 hover:text-gold"
              title="Partager"
            >
              <Share2 className="w-5 h-5" />
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 max-h-[55vh]">
          {cart.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingBag className="w-20 h-20 mx-auto text-gray-200 mb-4" />
              <p className="text-gray-500 font-medium">Votre panier est vide</p>
              <p className="text-sm text-gray-400 mt-1">Ajoutez des articles pour composer votre pack</p>
            </div>
          ) : (
            cart.map((item) => (
              <div key={item.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:shadow-md transition-shadow">
                <div className="w-14 h-14 bg-gradient-to-br from-feminine-light to-pink-100 rounded-xl flex items-center justify-center text-3xl flex-shrink-0">
                  {item.emoji || (item.category === 'pack' ? '📦' : '✨')}
                </div>

                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-sm truncate">{item.name}</h4>
                  <p className="text-xs text-gray-500">
                    {item.price ? `${item.price.toLocaleString()} FCFA` : item.priceRange || ''}
                  </p>
                  <div className="flex items-center gap-2 mt-1.5">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="w-6 h-6 rounded-full bg-white border border-gray-200 flex items-center justify-center hover:bg-gray-100 transition-colors"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="text-sm font-medium w-6 text-center">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="w-6 h-6 rounded-full bg-white border border-gray-200 flex items-center justify-center hover:bg-gray-100 transition-colors"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                <div className="text-right">
                  <p className="font-bold text-sm text-gray-800">
                    {(item.price * item.quantity).toLocaleString()} FCFA
                  </p>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-red-400 hover:text-red-600 transition-colors text-sm"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div className="border-t border-gray-100 p-4 bg-gray-50/50 backdrop-blur-sm">
            {/* Message promo */}
            <div className="bg-gradient-to-r from-gold/10 to-feminine-primary/10 rounded-xl p-3 mb-4 text-center">
              <p className="text-sm text-gray-700">
                🎁 *Pack offert* à partir de 25 000 FCFA
              </p>
            </div>

            <div className="flex justify-between items-center mb-4">
              <div>
                <span className="text-gray-600">Total</span>
                <p className="text-xs text-gray-400">TVA incluse</p>
              </div>
              <span className="text-2xl font-display font-bold text-gold">
                {totalPrice.toLocaleString()} FCFA
              </span>
            </div>

            <div className="flex flex-col gap-2">
              <button
                onClick={handleWhatsAppOrder}
                className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-3.5 rounded-full font-semibold hover:scale-[1.02] transition-all shadow-lg shadow-green-500/30 flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-5 h-5" />
                Commander via WhatsApp
              </button>
              
              <div className="flex items-center gap-2 text-xs text-gray-400 justify-center">
                <span>📦 Livraison disponible</span>
                <span>•</span>
                <span>💳 Paiement sécurisé</span>
                <span>•</span>
                <span>✨ Packs à partir de 3 articles</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default CartDrawer;