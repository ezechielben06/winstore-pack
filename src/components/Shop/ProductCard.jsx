// 📄 src/components/Shop/ProductCard.jsx - Version finale
import { useState } from 'react';
import { 
  ShoppingBag, Heart, Share2, Package, Sparkles, 
  Info, ChevronDown, ChevronUp, Crown, Check,
  Gift
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useTheme } from '../../context/ThemeContext';

const ProductCard = ({ product, isWomen }) => {
  const { addToCart } = useCart();
  const { isDark } = useTheme();
  const [isLiked, setIsLiked] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  
  const isPack = product.category === 'pack';
  
  // ✅ Palettes de couleurs
  const colors = isWomen ? {
    primary: '#E91E8C',
    primaryDark: '#C2185B',
    primaryLight: '#FCE4EC',
    accent: '#D4AF37',
  } : {
    primary: '#1A237E',
    primaryDark: '#0D1445',
    primaryLight: '#E8EAF6',
    accent: '#D4AF37',
  };

  const handleAddToCart = () => {
    addToCart(product);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const handleShare = async (e) => {
    e.stopPropagation();
    const text = `✨ "${product.name}" - WIN'STORE PACKS`;
    if (navigator.share) {
      try { await navigator.share({ title: product.name, text, url: window.location.href }); } 
      catch (err) {}
    } else {
      window.open(`https://wa.me/?text=${encodeURIComponent(text + ' ' + window.location.href)}`, '_blank');
    }
  };

  return (
    <div 
      className={`group bg-white dark:bg-[#141425] transition-all duration-300 ${
        isDark ? 'border border-[#2A2A4A]' : 'border border-gray-200/70'
      } ${isPack ? 'border-gold/30' : ''}`}
      style={{
        borderRadius: '8px',
        boxShadow: isPack 
          ? '0 4px 20px rgba(212,175,55,0.08)' 
          : '0 2px 12px rgba(0,0,0,0.04)',
      }}
    >
      {/* ===== IMAGE ===== */}
      <div 
        className="relative overflow-hidden"
        style={{ 
          aspectRatio: '1/1', 
          background: isDark ? '#1A1A2E' : '#F5F5F5',
          borderTopLeftRadius: '8px',
          borderTopRightRadius: '8px',
        }}
      >
        {product.image && !imageError ? (
          <img 
            src={product.image} 
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            onError={() => setImageError(true)}
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-6xl opacity-30">
            {isPack ? '📦' : (product.emoji || '✨')}
          </div>
        )}

        {/* ✅ Badge - Arrondi subtil */}
        <div 
          className="absolute top-3 left-3 px-3 py-1 text-[10px] font-bold tracking-wider uppercase"
          style={{
            background: isPack ? '#D4AF37' : colors.primary,
            color: isPack ? '#1A1A1A' : '#FFFFFF',
            borderRadius: '4px',
            letterSpacing: '0.06em',
          }}
        >
          {isPack ? 'Pack' : 'Produit'}
        </div>

        {/* Actions */}
        <div className="absolute top-3 right-3 flex flex-col gap-1.5">
          <button 
            onClick={() => setIsLiked(!isLiked)}
            className="w-8 h-8 flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95 bg-white/90 dark:bg-[#1A1A2E]/90 backdrop-blur-sm"
            style={{ borderRadius: '6px' }}
          >
            <Heart size={16} className={isLiked ? 'fill-red-500 text-red-500' : 'text-gray-400'} />
          </button>
          <button 
            onClick={handleShare}
            className="w-8 h-8 flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95 bg-white/90 dark:bg-[#1A1A2E]/90 backdrop-blur-sm"
            style={{ borderRadius: '6px' }}
          >
            <Share2 size={16} className="text-gray-400 hover:text-gold transition-colors" />
          </button>
        </div>

        {/* ✅ Prix - En bas de l'image */}
        <div 
          className="absolute bottom-3 left-3 right-3 px-3 py-1.5 flex items-center justify-between"
          style={{
            background: isPack ? 'rgba(212,175,55,0.95)' : 'rgba(255,255,255,0.95)',
            backdropFilter: 'blur(8px)',
            borderRadius: '6px',
          }}
        >
          <span 
            className="text-sm font-bold"
            style={{ color: isPack ? '#1A1A1A' : '#1A1A1A' }}
          >
            {product.price 
              ? `${product.price.toLocaleString()} FCFA`
              : product.priceRange || ''
            }
          </span>
          {isPack && product.items && (
            <span className="text-[9px] font-medium opacity-60" style={{ color: isPack ? '#1A1A1A' : '#666' }}>
              {product.items.length} articles
            </span>
          )}
        </div>
      </div>

      {/* ===== BODY ===== */}
      <div className="p-4">
        {/* Tags */}
        <div className="flex flex-wrap gap-1 mb-2">
          {product.tags && product.tags.slice(0, 2).map((tag, i) => (
            <span 
              key={i} 
              className="text-[9px] font-medium px-2 py-0.5"
              style={{ 
                color: isPack ? '#D4AF37' : '#666',
                background: isPack ? 'rgba(212,175,55,0.08)' : '#F0F0F0',
                borderRadius: '4px',
              }}
            >
              {tag}
            </span>
          ))}
          {isPack && (
            <span 
              className="text-[9px] font-medium px-2 py-0.5"
              style={{
                color: '#D4AF37',
                background: 'rgba(212,175,55,0.08)',
                borderRadius: '4px',
              }}
            >
              Éco +30%
            </span>
          )}
        </div>

        {/* Nom */}
        <h3 className={`text-sm font-semibold leading-tight mb-1 transition-colors ${
          isPack ? 'text-gold' : 'text-gray-900 dark:text-white'
        }`}>
          {product.name}
        </h3>
        
        {product.description && (
          <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        )}

        {/* ===== STATUT ===== */}
        <div className="mt-3 flex items-center gap-3">
          <span 
            className="text-[10px] font-medium px-2 py-0.5"
            style={{
              color: isPack ? '#D4AF37' : colors.primary,
              background: isPack ? 'rgba(212,175,55,0.08)' : colors.primaryLight,
              borderRadius: '4px',
            }}
          >
            {isPack ? `📦 ${product.items?.length || 0} articles` : '• À l\'unité'}
          </span>
        </div>

        {/* ===== ACTIONS ===== */}
        <div className="mt-3 pt-3 flex items-center gap-2" style={{ borderTop: '1px solid', borderColor: isDark ? '#2A2A4A' : '#EEEEEE' }}>
          {/* Bouton principal */}
          <button
            onClick={handleAddToCart}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-medium transition-all duration-200 active:scale-95 ${
              isAdded ? 'opacity-70 pointer-events-none' : ''
            }`}
            style={{
              background: isAdded ? '#D4AF37' : (isPack ? '#1A1A1A' : colors.primary),
              color: isAdded ? '#1A1A1A' : '#FFFFFF',
              borderRadius: '6px',
              letterSpacing: '0.03em',
            }}
          >
            {isAdded ? (
              <>
                <Check size={14} />
                Ajouté
              </>
            ) : (
              <>
                {isPack ? <Gift size={14} /> : <ShoppingBag size={14} />}
                {isPack ? 'Choisir le pack' : 'Ajouter'}
              </>
            )}
          </button>

          {/* Bouton détails - pour packs uniquement */}
          {isPack && product.items && (
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="px-3 py-2.5 transition-all duration-200 hover:scale-105 active:scale-95"
              style={{
                background: isDark ? '#2A2A4A' : '#F5F5F5',
                borderRadius: '6px',
              }}
            >
              <Info size={16} className={showDetails ? 'text-gold' : 'text-gray-400'} />
            </button>
          )}
        </div>

        {/* ===== DÉTAILS DU PACK ===== */}
        {isPack && product.items && showDetails && (
          <div 
            className="mt-3 p-3 transition-all duration-300"
            style={{
              background: isDark ? '#1A1A2E' : '#F8F8F8',
              borderRadius: '6px',
            }}
          >
            <p className="text-[9px] font-semibold uppercase tracking-wider text-gold/80 mb-2">
              Contenu du pack
            </p>
            <ul className="space-y-1">
              {product.items.slice(0, 4).map((item, i) => (
                <li key={i} className="text-[10px] text-gray-600 dark:text-gray-400 flex items-center gap-2">
                  <span className="w-1 h-1 rounded-full bg-gold flex-shrink-0" />
                  <span className="truncate">{item}</span>
                </li>
              ))}
              {product.items.length > 4 && (
                <li className="text-[10px] text-gray-400 dark:text-gray-500">
                  + {product.items.length - 4} autres articles
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