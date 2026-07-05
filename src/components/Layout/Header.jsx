// 📄 src/components/Layout/Header.jsx - Version avec logo agrandi
import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, Menu, X, Instagram, Facebook, MessageCircle } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useState } from 'react';
import WomenLogo from '../Logo/WomenLogo';
import MenLogo from '../Logo/MenLogo';
import MainLogo from '../Logo/MainLogo';

const Header = ({ onCartClick }) => {
  const { totalItems } = useCart();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isWomen = location.pathname === '/femme';
  const isMen = location.pathname === '/homme';
  const isHome = location.pathname === '/';

  // ✅ Logo plus grand et visible
  const getLogo = () => {
    if (isWomen) {
      return <WomenLogo className="w-14 h-14" text={true} />;
    }
    if (isMen) {
      return <MenLogo className="w-14 h-14" text={true} />;
    }
    return <MainLogo className="w-16 h-16" text={true} />;
  };

  // Couleur du thème
  const getThemeColor = () => {
    if (isWomen) return 'text-feminine-primary';
    if (isMen) return 'text-masculine-primary';
    return 'text-gold';
  };

  const getThemeBg = () => {
    if (isWomen) return 'bg-feminine-primary';
    if (isMen) return 'bg-masculine-primary';
    return 'bg-gold';
  };

  const navLinks = [
    { to: '/', label: 'Accueil' },
    { to: '/femme', label: 'Boutique Femme' },
    { to: '/homme', label: 'Boutique Homme' },
  ];

  const socialLinks = [
    { 
      icon: <Facebook className="w-5 h-5" />, 
      href: 'https://facebook.com/winstorepacks',
      label: 'Facebook',
      color: 'hover:bg-blue-600'
    },
    { 
      icon: <Instagram className="w-5 h-5" />, 
      href: 'https://instagram.com/winstorepacks',
      label: 'Instagram',
      color: 'hover:bg-pink-600'
    },
    { 
      icon: <MessageCircle className="w-5 h-5" />, 
      href: 'https://wa.me/2290153096537',
      label: 'WhatsApp',
      color: 'hover:bg-green-600'
    },
  ];

  return (
    <header className="bg-white shadow-md sticky top-0 z-50 border-b-2 border-gray-100">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* ✅ Logo plus grand avec padding */}
          <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            {getLogo()}
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-10">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.to;
              let activeClass = '';
              if (isActive) {
                if (isWomen) activeClass = 'text-feminine-primary';
                else if (isMen) activeClass = 'text-masculine-primary';
                else activeClass = 'text-gold';
              }
              
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`font-medium text-base transition-all duration-300 hover:scale-105 ${
                    isActive 
                      ? `${activeClass} font-bold`
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}

            {/* Séparateur */}
            <div className="w-px h-8 bg-gray-200" />

            {/* Réseaux sociaux */}
            <div className="flex items-center gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`p-2.5 rounded-full bg-gray-100 hover:text-white transition-all duration-300 hover:scale-110 hover:shadow-lg ${social.color}`}
                  aria-label={social.label}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </nav>

          {/* Cart & Mobile Menu */}
          <div className="flex items-center gap-4">
            {/* WhatsApp Button (mobile) */}
            <a
              href="https://wa.me/2290153096537"
              target="_blank"
              rel="noopener noreferrer"
              className="md:hidden p-2.5 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors hover:scale-110"
            >
              <MessageCircle className="w-5 h-5" />
            </a>

            <button
              onClick={onCartClick}
              className="relative p-2.5 hover:bg-gray-100 rounded-full transition-colors hover:scale-110"
            >
              <ShoppingCart className="w-6 h-6 text-gray-700" />
              {totalItems > 0 && (
                <span className={`absolute -top-1 -right-1 text-white text-xs w-6 h-6 rounded-full flex items-center justify-center font-bold ${getThemeBg()} shadow-lg`}>
                  {totalItems}
                </span>
              )}
            </button>

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2.5 hover:bg-gray-100 rounded-full transition-colors"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <nav className="md:hidden mt-4 pt-4 border-t border-gray-200 flex flex-col gap-2">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.to;
              let activeClass = '';
              if (isActive) {
                if (isWomen) activeClass = 'bg-feminine-light text-feminine-primary';
                else if (isMen) activeClass = 'bg-masculine-light text-masculine-primary';
                else activeClass = 'bg-gray-100 text-gold';
              }
              
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`font-medium py-3 px-4 rounded-lg transition-all ${
                    isActive 
                      ? activeClass 
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
            
            {/* Mobile Social Links */}
            <div className="flex items-center gap-3 pt-3 border-t border-gray-200 mt-2">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex-1 py-2.5 px-3 rounded-lg bg-gray-100 text-gray-600 hover:text-white transition-all text-center text-sm font-medium ${social.color}`}
                >
                  {social.icon} {social.label}
                </a>
              ))}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;