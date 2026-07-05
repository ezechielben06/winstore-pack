import { MessageCircle, X } from 'lucide-react';
import { useState, useEffect } from 'react';

const WhatsAppFloat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [show, setShow] = useState(true);

  useEffect(() => {
    // Cacher le bouton après 10 secondes sur mobile
    const timer = setTimeout(() => {
      if (window.innerWidth < 768) {
        setShow(false);
      }
    }, 10000);

    return () => clearTimeout(timer);
  }, []);

  const handleClick = () => {
    const phoneNumber = '2290153096537';
    const message = 'Bonjour WIN\'STORE PACKS ! 👋 Je souhaite passer une commande.';
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  if (!show) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {/* Message tooltip */}
      {!isOpen && (
        <div 
          className="bg-white shadow-lg rounded-2xl p-3 mb-2 animate-slide-up max-w-[200px] text-sm text-gray-700 border border-gray-100"
          onClick={() => setIsOpen(true)}
        >
          <p className="font-semibold text-green-600">💬 Discutons !</p>
          <p className="text-xs text-gray-500">Clique pour commander</p>
        </div>
      )}

      {/* Bouton principal */}
      <button
        onClick={handleClick}
        className="relative group"
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
      >
        {/* Pulse animation */}
        <div className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-30" />
        
        <div className="relative bg-gradient-to-r from-green-500 to-green-600 text-white p-4 rounded-full shadow-2xl shadow-green-500/40 hover:scale-110 transition-all duration-300 flex items-center gap-2">
          <MessageCircle className="w-6 h-6" />
          <span className="hidden md:inline font-semibold text-sm">WhatsApp</span>
        </div>
      </button>

      {/* Infos supplémentaires */}
      {isOpen && (
        <div className="bg-white shadow-xl rounded-2xl p-4 max-w-xs animate-slide-up border border-gray-100">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center text-white">
              <MessageCircle className="w-5 h-5" />
            </div>
            <div>
              <p className="font-semibold text-gray-800">Win'Store Packs</p>
              <p className="text-xs text-gray-500">Réponse en 5min ⚡</p>
            </div>
          </div>
          <p className="text-sm text-gray-600">
            💬 Discutons de votre pack idéal !
          </p>
          <button
            onClick={handleClick}
            className="w-full mt-3 bg-green-500 text-white py-2 rounded-full font-semibold hover:bg-green-600 transition-colors text-sm"
          >
            Ouvrir WhatsApp
          </button>
        </div>
      )}
    </div>
  );
};

export default WhatsAppFloat;