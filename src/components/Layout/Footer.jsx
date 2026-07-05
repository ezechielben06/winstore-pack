// 📄 src/components/Layout/Footer.jsx - Avec logos
import { Heart, Phone, Truck, Shield, Mail, Instagram, Facebook, Youtube } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import WomenLogo from '../Logo/WomenLogo';
import MenLogo from '../Logo/MenLogo';
import MainLogo from '../Logo/MainLogo';

const Footer = () => {
  const location = useLocation();
  const isWomen = location.pathname === '/femme';
  const isMen = location.pathname === '/homme';

  const getLogo = () => {
    if (isWomen) return <WomenLogo className="w-8 h-8" text={false} />;
    if (isMen) return <MenLogo className="w-8 h-8" text={false} />;
    return <MainLogo className="w-8 h-8" text={false} />;
  };

  return (
    <footer className="bg-gray-900 text-white">
      <div className="border-b border-gray-800">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              {getLogo()}
              <span className="text-lg font-display font-bold">
                WIN'<span className="text-gold">STORE</span>
              </span>
            </div>
            <div className="flex gap-2 w-full md:w-auto">
              <input
                type="email"
                placeholder="Ton email pour les offres"
                className="flex-1 md:w-64 px-4 py-2 rounded-full bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:border-gold focus:outline-none text-sm"
              />
              <button className="bg-gold text-gray-900 px-6 py-2 rounded-full font-semibold hover:bg-gold-light transition-colors text-sm">
                S'inscrire
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              {getLogo()}
              <h3 className="text-xl font-display font-bold">
                WIN'<span className="text-gold">STORE</span>
              </h3>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Tout en un pour votre quotidien. Des packs pensés pour révéler votre confiance et votre style.
            </p>
            <div className="flex gap-3 mt-4">
              <a href="#" className="bg-gray-800 p-2 rounded-full hover:bg-gold transition-colors">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" className="bg-gray-800 p-2 rounded-full hover:bg-gold transition-colors">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#" className="bg-gray-800 p-2 rounded-full hover:bg-gold transition-colors">
                <Youtube className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Liens rapides */}
          <div>
            <h4 className="font-semibold mb-4">Boutiques</h4>
            <ul className="space-y-3 text-gray-400 text-sm">
              <li>
                <Link to="/femme" className="hover:text-gold transition-colors flex items-center gap-2">
                  <WomenLogo className="w-4 h-4" text={false} />
                  Boutique Femme
                </Link>
              </li>
              <li>
                <Link to="/homme" className="hover:text-gold transition-colors flex items-center gap-2">
                  <MenLogo className="w-4 h-4" text={false} />
                  Boutique Homme
                </Link>
              </li>
            </ul>
          </div>

          {/* Informations */}
          <div>
            <h4 className="font-semibold mb-4">Informations</h4>
            <ul className="space-y-3 text-gray-400 text-sm">
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-gold" />
                +229 01 53 09 65 37
              </li>
              <li className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-gold" />
                Livraison disponible
              </li>
              <li className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-gold" />
                Paiement sécurisé
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-gold" />
                contact@winstore.com
              </li>
            </ul>
          </div>

          {/* Packs populaires */}
          <div>
            <h4 className="font-semibold mb-4">Packs populaires</h4>
            <ul className="space-y-3 text-gray-400 text-sm">
              <li className="hover:text-gold transition-colors cursor-pointer flex items-center gap-2">
                <WomenLogo className="w-4 h-4" text={false} />
                Campus Girl Pack
              </li>
              <li className="hover:text-gold transition-colors cursor-pointer flex items-center gap-2">
                <WomenLogo className="w-4 h-4" text={false} />
                Glow Queen Pack
              </li>
              <li className="hover:text-gold transition-colors cursor-pointer flex items-center gap-2">
                <MenLogo className="w-4 h-4" text={false} />
                Pack Sportif Homme
              </li>
              <li className="hover:text-gold transition-colors cursor-pointer flex items-center gap-2">
                <MenLogo className="w-4 h-4" text={false} />
                Pack Premium Homme
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400 text-sm">
          <p className="flex items-center justify-center gap-1">
            Made with <Heart className="w-4 h-4 text-feminine-primary fill-feminine-primary" /> by WIN'STORE PACKS
          </p>
          <p className="mt-1">© 2026 Tous droits réservés</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;