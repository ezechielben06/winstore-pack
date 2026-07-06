// 📄 src/components/Layout/MobileBottomNav.jsx - Version corrigée
import { Link, useLocation } from 'react-router-dom';
import { Home, ShoppingBag, MessageCircle, Sparkles, Crown, ChevronUp, Package } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useTheme } from '../../context/ThemeContext';
import { useState } from 'react';

const MobileBottomNav = ({ onCartClick }) => {
  const { totalItems } = useCart();
  const location = useLocation();
  const { isDark } = useTheme();
  const [showShopSelector, setShowShopSelector] = useState(false);

  const isWomen = location.pathname === '/femme';
  const isMen = location.pathname === '/homme';

  const toggleShopSelector = () => setShowShopSelector(!showShopSelector);

  const navItems = [
    { 
      icon: <Home className="w-5 h-5" />, 
      label: 'Accueil', 
      path: '/',
      active: location.pathname === '/'
    },
    { 
      icon: isWomen ? (
        <Sparkles className="w-5 h-5 text-feminine-primary" />
      ) : isMen ? (
        <Crown className="w-5 h-5 text-masculine-primary" />
      ) : (
        <Package className="w-5 h-5" />
      ),
      label: isWomen ? 'Femme' : isMen ? 'Homme' : 'Boutique',
      path: isWomen ? '/femme' : isMen ? '/homme' : '/femme',
      active: location.pathname === '/femme' || location.pathname === '/homme',
      onClick: toggleShopSelector,
      hasSelector: true
    },
    { 
      icon: <ShoppingBag className="w-5 h-5" />, 
      label: 'Panier', 
      path: '#',
      onClick: onCartClick,
      badge: totalItems > 0 ? totalItems : null
    },
    { 
      icon: <MessageCircle className="w-5 h-5" />, 
      label: 'WhatsApp', 
      path: 'https://wa.me/2290153096537',
      external: true,
      highlight: true
    },
  ];

  return (
    <>
      <nav className={`fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around py-2 px-1 border-t ${
        isDark 
          ? 'bg-[#1a1a2e] border-[#2d3748]' 
          : 'bg-white border-gray-200'
      } shadow-lg md:hidden`}>
        {navItems.map((item, index) => {
          const isActive = item.active || (item.path !== '#' && location.pathname === item.path);
          
          return (
            <div key={index} className="flex-1 flex justify-center relative">
              {item.onClick ? (
                <button
                  onClick={item.onClick}
                  className={`relative flex flex-col items-center gap-0.5 p-2 rounded-xl transition-all hover:scale-110 active:scale-95 ${
                    isActive ? 'text-feminine-primary dark:text-feminine-primary' : 'text-gray-400 dark:text-gray-500'
                  }`}
                  aria-label={item.label}
                >
                  <div className="relative">
                    {item.icon}
                    {item.badge && (
                      <span className="absolute -top-1 -right-2 bg-feminine-primary text-white text-[9px] w-5 h-5 rounded-full flex items-center justify-center font-bold shadow-lg">
                        {item.badge > 9 ? '9+' : item.badge}
                      </span>
                    )}
                    {item.hasSelector && (
                      <ChevronUp className={`w-3 h-3 absolute -bottom-5 left-1/2 -translate-x-1/2 transition-transform ${
                        showShopSelector ? 'rotate-0' : 'rotate-180'
                      }`} />
                    )}
                  </div>
                  <span className="text-[9px] font-medium">
                    {item.label}
                  </span>
                </button>
              ) : item.external ? (
                <a
                  href={item.path}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex flex-col items-center gap-0.5 p-2 rounded-xl transition-all hover:scale-110 active:scale-95 ${
                    item.highlight ? 'text-green-500 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'
                  }`}
                >
                  <div className="relative">
                    {item.icon}
                  </div>
                  <span className={`text-[9px] font-medium ${
                    item.highlight ? 'text-green-500 dark:text-green-400' : ''
                  }`}>
                    {item.label}
                  </span>
                </a>
              ) : (
                <Link
                  to={item.path}
                  className={`flex flex-col items-center gap-0.5 p-2 rounded-xl transition-all hover:scale-110 active:scale-95 ${
                    isActive 
                      ? isWomen
                        ? 'text-feminine-primary dark:text-feminine-primary'
                        : isMen
                        ? 'text-masculine-primary dark:text-masculine-primary'
                        : 'text-gold dark:text-gold'
                      : 'text-gray-400 dark:text-gray-500'
                  }`}
                >
                  <div className="relative">
                    {item.icon}
                    {item.badge && (
                      <span className="absolute -top-1 -right-2 bg-feminine-primary text-white text-[9px] w-5 h-5 rounded-full flex items-center justify-center font-bold shadow-lg">
                        {item.badge > 9 ? '9+' : item.badge}
                      </span>
                    )}
                  </div>
                  <span className="text-[9px] font-medium">
                    {item.label}
                  </span>
                </Link>
              )}
            </div>
          );
        })}
      </nav>

      {/* Sélecteur de boutique */}
      {showShopSelector && (
        <div className="fixed bottom-16 left-4 right-4 z-50 bg-white dark:bg-[#1a1a2e] rounded-xl shadow-2xl border border-gray-200 dark:border-[#2d3748] p-3 animate-slide-up md:hidden">
          <div className="flex flex-col gap-2">
            <Link
              to="/femme"
              onClick={() => setShowShopSelector(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                location.pathname === '/femme'
                  ? 'bg-feminine-light dark:bg-feminine-primary/20 text-feminine-primary'
                  : 'hover:bg-gray-100 dark:hover:bg-[#2a2a4a]'
              }`}
            >
              <Sparkles className="w-5 h-5 text-feminine-primary" />
              <span className="font-medium">Boutique Femme</span>
              {location.pathname === '/femme' && (
                <span className="ml-auto text-xs text-feminine-primary font-bold">✓</span>
              )}
            </Link>
            <Link
              to="/homme"
              onClick={() => setShowShopSelector(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                location.pathname === '/homme'
                  ? 'bg-masculine-light dark:bg-masculine-primary/20 text-masculine-primary'
                  : 'hover:bg-gray-100 dark:hover:bg-[#2a2a4a]'
              }`}
            >
              <Crown className="w-5 h-5 text-masculine-primary" />
              <span className="font-medium">Boutique Homme</span>
              {location.pathname === '/homme' && (
                <span className="ml-auto text-xs text-masculine-primary font-bold">✓</span>
              )}
            </Link>
          </div>
        </div>
      )}
    </>
  );
};

export default MobileBottomNav;