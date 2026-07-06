// 📄 src/components/Layout/Header.jsx - Version sans recherche
import { Link, useLocation } from "react-router-dom";
import { ShoppingCart, Menu, X } from "lucide-react";
import { useCart } from "../../context/CartContext";
import { useState } from "react";
import WomenLogo from "../Logo/WomenLogo";
import MenLogo from "../Logo/MenLogo";
import MainLogo from "../Logo/MainLogo";
import ThemeToggle from "../Shared/ThemeToggle";

const Header = ({ onCartClick }) => {
  const { totalItems } = useCart();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isWomen = location.pathname === "/femme";
  const isMen = location.pathname === "/homme";

  const getLogo = () => {
    if (isWomen)
      return <WomenLogo className="w-8 h-8 md:w-10 md:h-10" text={true} />;
    if (isMen)
      return <MenLogo className="w-8 h-8 md:w-10 md:h-10" text={true} />;
    return <MainLogo className="w-8 h-8 md:w-10 md:h-10" text={true} />;
  };

  const getThemeBg = () => {
    if (isWomen) return "bg-feminine-primary";
    if (isMen) return "bg-masculine-primary";
    return "bg-gold";
  };

  const navLinks = [
    { to: "/", label: "Accueil" },
    { to: "/femme", label: "Femme" },
    { to: "/homme", label: "Homme" },
  ];

  return (
    <header className="bg-white dark:bg-[#1a1a2e] shadow-sm sticky top-0 z-50 border-b border-gray-100 dark:border-[#2d3748] transition-colors duration-300">
      <div className="container mx-auto px-3 md:px-4">
        <div className="flex items-center justify-between h-14 md:h-16">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-1.5 md:gap-2 hover:opacity-80 transition-opacity flex-shrink-0"
          >
            {getLogo()}
          </Link>

          {/* Espaceur pour équilibrer */}
          <div className="flex-1" />

          {/* Actions */}
          <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
            {/* Theme Toggle */}
            <div className="hidden xs:block">
              <ThemeToggle />
            </div>

            {/* Panier */}
            <button
              onClick={onCartClick}
              className="relative p-1.5 sm:p-2 hover:bg-gray-100 dark:hover:bg-[#2a2a4a] rounded-lg transition-colors"
            >
              <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5 md:w-5 md:h-5 text-gray-700 dark:text-gray-300" />
              {totalItems > 0 && (
                <span
                  className={`absolute -top-0.5 -right-0.5 text-white text-[8px] sm:text-[10px] w-4 h-4 sm:w-5 sm:h-5 rounded-full flex items-center justify-center font-bold ${getThemeBg()} shadow-lg`}
                >
                  {totalItems > 9 ? "9+" : totalItems}
                </span>
              )}
            </button>

            {/* Menu Burger */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-1.5 sm:p-2 hover:bg-gray-100 dark:hover:bg-[#2a2a4a] rounded-lg transition-colors md:hidden"
            >
              {isMobileMenuOpen ? (
                <X className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700 dark:text-gray-300" />
              ) : (
                <Menu className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700 dark:text-gray-300" />
              )}
            </button>
          </div>
        </div>

        {/* Menu Mobile */}
        {isMobileMenuOpen && (
          <nav className="md:hidden pb-3 pt-2 border-t border-gray-200 dark:border-[#2d3748]">
            <div className="flex flex-col gap-0.5">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.to;
                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`font-medium py-2.5 px-3 rounded-lg transition-all text-sm ${
                      isActive
                        ? isWomen
                          ? "bg-feminine-light dark:bg-feminine-primary/20 text-feminine-primary dark:text-feminine-primary"
                          : isMen
                            ? "bg-masculine-light dark:bg-masculine-primary/20 text-masculine-primary dark:text-masculine-primary"
                            : "bg-gray-100 dark:bg-[#2a2a4a] text-gold dark:text-gold"
                        : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#2a2a4a]"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}

              {/* Theme Toggle - Mobile Menu */}
              <div className="flex items-center justify-between py-2.5 px-3 mt-1 border-t border-gray-200 dark:border-[#2d3748]">
                <span className="text-sm text-gray-600 dark:text-gray-300">
                  Mode sombre
                </span>
                <ThemeToggle />
              </div>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
