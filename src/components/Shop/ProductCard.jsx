// 📄 src/components/Shop/ProductCard.jsx
import { useState } from 'react';  // ✅ AJOUTÉ
import { ShoppingBag, Star, Heart, Share2, Package, Sparkles, Info } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import ProductImage from '../Shared/ProductImage';

const ProductCard = ({ product, isWomen }) => {
  const { addToCart } = useCart();
  const [isLiked, setIsLiked] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  
  const theme = isWomen ? 'feminine' : 'masculine';
  const themeBg = isWomen ? 'bg-feminine-primary' : 'bg-masculine-primary';
  const themeLight = isWomen ? 'bg-feminine-light' : 'bg-masculine-light';
  const isPack = product.category === 'pack';

  const handleAddToCart = (e) => {
    e.stopPropagation();
    addToCart(product);
  };

  const handleShare = async (e) => {
    e.stopPropagation();
    const text = `✨ Découvre "${product.name}" chez WIN'STORE PACKS ! ${isPack ? '📦 Pack disponible' : '🛍️ Produit disponible'}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text: text,
          url: window.location.href,
        });
      } catch (err) {}
    } else {
      const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(text + ' ' + window.location.href)}`;
      window.open(whatsappUrl, '_blank');
    }
  };

  return (
    <div 
      className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-2 border border-gray-100/50"
      onMouseEnter={() => setShowDetails(true)}
      onMouseLeave={() => setShowDetails(false)}
    >
      {/* === IMAGE === */}
      <div className="relative overflow-hidden">
        <ProductImage
          src={product.image}
          alt={product.name}
          className="w-full aspect-square"
          emoji={product.emoji || (isPack ? '📦' : '✨')}
          fallback="/images/placeholder-product.jpg"
        />

        {/* === BADGES === */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {isPack && (
            <span className="bg-gradient-to-r from-feminine-primary to-gold text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1">
              <Package className="w-3 h-3" />
              PACK
            </span>
          )}
          {!isPack && (
            <span className="bg-blue-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              PRODUIT
            </span>
          )}
          {product.popularity && (
            <span className="bg-gold/90 text-gray-900 text-xs font-bold px-3 py-1.5 rounded-full shadow-lg backdrop-blur-sm">
              {product.popularity} Populaire
            </span>
          )}
        </div>

        {/* Prix */}
        {product.price && (
          <span className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-gray-900 font-bold px-3 py-1.5 rounded-full shadow-lg text-sm">
            {product.price.toLocaleString()} FCFA
          </span>
        )}
        {product.priceRange && !product.price && (
          <span className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-gray-600 font-medium px-3 py-1.5 rounded-full shadow-lg text-xs">
            {product.priceRange} FCFA
          </span>
        )}

        {/* === HOVER OVERLAY === */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-end p-4">
          <button
            onClick={handleAddToCart}
            className={`${themeBg} text-white px-6 py-3 rounded-full font-semibold hover:scale-105 transition-transform shadow-lg flex items-center gap-2 w-full max-w-[200px] justify-center`}
          >
            <ShoppingBag className="w-4 h-4" />
            {isPack ? 'Ajouter le pack' : 'Ajouter au panier'}
          </button>
        </div>

        {/* === ACTIONS RAPIDES === */}
        <div className="absolute top-3 right-3 flex flex-col gap-2">
          <button 
            onClick={() => setIsLiked(!isLiked)}
            className={`w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-md hover:scale-110 transition-transform ${isLiked ? 'text-red-500' : 'text-gray-400'}`}
          >
            <Heart className={`w-4 h-4 ${isLiked ? 'fill-red-500' : ''}`} />
          </button>
          <button 
            onClick={handleShare}
            className="w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-md hover:scale-110 transition-transform text-gray-400 hover:text-gold"
          >
            <Share2 className="w-4 h-4" />
          </button>
          <button 
            onClick={() => setShowDetails(!showDetails)}
            className="w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-md hover:scale-110 transition-transform text-gray-400 hover:text-gold"
          >
            <Info className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* === CONTENU === */}
      <div className="p-4">
        {/* Tags */}
        <div className="flex flex-wrap gap-1 mb-2">
          {product.tags && product.tags.slice(0, 2).map((tag, i) => (
            <span key={i} className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
              {tag}
            </span>
          ))}
          {isPack && product.items && (
            <span className="text-xs text-feminine-primary bg-feminine-light px-2 py-0.5 rounded-full">
              {product.items.length} articles
            </span>
          )}
        </div>

        <h3 className="font-semibold text-gray-800 group-hover:text-gold transition-colors text-base line-clamp-1">
          {product.name}
        </h3>
        
        {product.description && (
          <p className="text-sm text-gray-500 mt-1 line-clamp-2">{product.description}</p>
        )}

        {/* Différence PRODUIT vs PACK */}
        <div className="mt-2 flex items-center gap-2">
          {isPack ? (
            <div className="flex items-center gap-1 text-xs text-feminine-primary bg-feminine-light px-2 py-1 rounded-lg">
              <Package className="w-3 h-3" />
              Pack personnalisable
            </div>
          ) : (
            <div className="flex items-center gap-1 text-xs text-blue-500 bg-blue-50 px-2 py-1 rounded-lg">
              <Sparkles className="w-3 h-3" />
              À l'unité
            </div>
          )}
        </div>

        {/* Étoiles */}
        <div className="flex items-center gap-1 mt-2">
          <Star className="w-4 h-4 fill-gold text-gold" />
          <span className="text-sm font-medium text-gray-600">4.8</span>
          <span className="text-xs text-gray-400">(120 avis)</span>
        </div>

        {/* === FOOTER === */}
        <div className="mt-3 flex items-center justify-between border-t border-gray-100 pt-3">
          <div>
            {product.price && (
              <span className="font-bold text-gray-900 text-lg">
                {product.price.toLocaleString()} FCFA
              </span>
            )}
            {product.priceRange && !product.price && (
              <span className="text-sm text-gray-500">
                {product.priceRange} FCFA
              </span>
            )}
          </div>

          <button
            onClick={handleAddToCart}
            className={`${themeBg} text-white p-2.5 rounded-full hover:scale-110 transition-transform shadow-lg ${themeBg}/30`}
          >
            <ShoppingBag className="w-5 h-5" />
          </button>
        </div>

        {/* Détails du pack */}
        {isPack && product.items && showDetails && (
          <div className="mt-3 p-3 bg-gray-50 rounded-xl animate-slide-up">
            <p className="text-xs font-semibold text-gray-700 mb-2">📋 Contenu du pack :</p>
            <ul className="space-y-1">
              {product.items.slice(0, 5).map((item, i) => (
                <li key={i} className="text-xs text-gray-600 flex items-center gap-2">
                  <span className="w-1 h-1 rounded-full bg-gold" />
                  {item}
                </li>
              ))}
              {product.items.length > 5 && (
                <li className="text-xs text-gray-400">
                  + {product.items.length - 5} autres articles
                </li>
              )}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCard;