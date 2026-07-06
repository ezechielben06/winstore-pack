// 📄 src/components/Shop/ProductCard.jsx - Version définitive
import { useState } from 'react';
import { ShoppingBag, Heart, Share2, Package, Sparkles, Check, Crown, Gift, ChevronDown, ChevronUp } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useTheme } from '../../context/ThemeContext';

const ProductCard = ({ product, isWomen }) => {
  const { addToCart } = useCart();
  const { isDark } = useTheme();
  const [isLiked, setIsLiked] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  
  const isPack = product.category === 'pack';
  
  const colors = isWomen ? {
    primary: '#E91E8C',
    primaryLight: '#FCE4EC',
    primaryDark: '#C2185B',
  } : {
    primary: '#1A237E',
    primaryLight: '#E8EAF6',
    primaryDark: '#0D1445',
  };

  const handleAddToCart = () => {
    addToCart(product);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  // Couleur de fond pour l'image selon le type
  const getBgColor = () => {
    if (isPack) {
      return isDark ? '#1A1A35' : '#FFF8F0';
    }
    return isDark ? '#141425' : '#F5F5F5';
  };

  return (
    <div 
      className="w-full overflow-hidden"
      style={{
        borderRadius: '8px',
        background: isDark ? '#1A1A2E' : '#FFFFFF',
        border: isPack 
          ? `2px solid ${isDark ? '#D4AF37' : '#D4AF37'}`
          : `1px solid ${isDark ? '#2A2A4A' : '#EEEEEE'}`,
        boxShadow: isPack 
          ? '0 4px 20px rgba(212,175,55,0.15)' 
          : '0 2px 8px rgba(0,0,0,0.04)',
      }}
    >
      {/* ===== IMAGE ===== */}
      <div 
        className="relative flex items-center justify-center"
        style={{ 
          aspectRatio: '1/1',
          background: getBgColor(),
          borderBottom: isPack ? '2px solid #D4AF37' : 'none',
        }}
      >
        {/* Grand emoji */}
        <span className="text-7xl opacity-80">
          {isPack ? '📦' : (product.emoji || '✨')}
        </span>

        {/* Badge PACK/PRODUIT */}
        <div 
          className="absolute top-2 left-2 px-2 py-0.5 text-[8px] font-bold uppercase tracking-wider flex items-center gap-1"
          style={{
            background: isPack ? '#D4AF37' : colors.primary,
            color: isPack ? '#1A1A1A' : '#FFFFFF',
            borderRadius: '4px',
          }}
        >
          {isPack ? <Crown size={10} /> : <Sparkles size={10} />}
          {isPack ? 'PACK' : 'PRODUIT'}
        </div>

        {/* Popularité */}
        {product.popularity && (
          <div 
            className="absolute top-2 right-12 px-1.5 py-0.5 text-[7px] font-bold"
            style={{
              background: 'rgba(212,175,55,0.9)',
              color: '#1A1A1A',
              borderRadius: '2px',
            }}
          >
            {product.popularity}
          </div>
        )}

        {/* Prix */}
        <div 
          className="absolute bottom-2 left-2 right-2 px-2 py-1 flex items-center justify-between"
          style={{
            background: isPack ? 'rgba(212,175,55,0.95)' : 'rgba(255,255,255,0.95)',
            borderRadius: '6px',
            backdropFilter: 'blur(8px)',
            border: isPack ? '1px solid rgba(212,175,55,0.3)' : '1px solid rgba(0,0,0,0.05)',
          }}
        >
          <span 
            className={`text-xs font-bold truncate ${isPack ? 'text-gray-900' : 'text-gray-900'}`}
          >
            {product.price 
              ? `${product.price.toLocaleString()} FCFA`
              : product.priceRange || ''
            }
          </span>
          {isPack && product.items && (
            <span className="text-[8px] font-medium bg-white/30 px-1.5 py-0.5 rounded-full flex items-center gap-1">
              <Package size={8} />
              {product.items.length} articles
            </span>
          )}
        </div>

        {/* Actions */}
        <div className="absolute top-2 right-2 flex flex-col gap-1">
          <button 
            onClick={() => setIsLiked(!isLiked)}
            className="w-6 h-6 flex items-center justify-center bg-white/90 dark:bg-[#1A1A2E]/90 backdrop-blur-sm"
            style={{ borderRadius: '4px' }}
          >
            <Heart size={12} className={isLiked ? 'fill-red-500 text-red-500' : 'text-gray-400'} />
          </button>
          <button 
            onClick={() => {
              const text = `✨ "${product.name}" - WIN'STORE PACKS`;
              if (navigator.share) {
                navigator.share({ title: product.name, text, url: window.location.href });
              } else {
                window.open(`https://wa.me/?text=${encodeURIComponent(text + ' ' + window.location.href)}`, '_blank');
              }
            }}
            className="w-6 h-6 flex items-center justify-center bg-white/90 dark:bg-[#1A1A2E]/90 backdrop-blur-sm"
            style={{ borderRadius: '4px' }}
          >
            <Share2 size={12} className="text-gray-400" />
          </button>
        </div>

        {/* Badge économie pour packs */}
        {isPack && (
          <div 
            className="absolute bottom-12 right-2 px-1.5 py-0.5 text-[7px] font-bold"
            style={{
              background: 'rgba(212,175,55,0.9)',
              color: '#1A1A1A',
              borderRadius: '2px',
            }}
          >
            -30%
          </div>
        )}
      </div>

      {/* ===== BODY ===== */}
      <div className="p-2">
        {/* Tags */}
        <div className="flex flex-wrap gap-0.5 mb-0.5">
          {product.tags && product.tags.slice(0, 2).map((tag, i) => (
            <span 
              key={i} 
              className="text-[7px] font-medium px-1.5 py-0.5 truncate max-w-[50px]"
              style={{ 
                color: isPack ? '#D4AF37' : '#888',
                background: isPack ? 'rgba(212,175,55,0.08)' : '#F0F0F0',
                borderRadius: '2px',
              }}
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Nom */}
        <h3 className={`text-xs font-semibold leading-tight truncate flex items-center gap-1 ${
          isPack ? 'text-gold' : 'text-gray-900 dark:text-white'
        }`}>
          {isPack ? <Crown size={10} className="text-gold" /> : <Sparkles size={10} className="text-gray-400" />}
          {product.name}
        </h3>
        
        {product.description && (
          <p className="text-[8px] text-gray-500 dark:text-gray-400 line-clamp-1 leading-tight">
            {product.description}
          </p>
        )}

        {/* Statut distinct */}
        <div className="mt-1 flex items-center gap-1.5">
          {isPack ? (
            <span 
              className="text-[7px] font-medium px-1.5 py-0.5 flex items-center gap-0.5"
              style={{
                color: '#D4AF37',
                background: 'rgba(212,175,55,0.12)',
                borderRadius: '2px',
              }}
            >
              <Gift size={8} />
              Pack {product.items?.length || 0} articles
            </span>
          ) : (
            <span 
              className="text-[7px] font-medium px-1.5 py-0.5"
              style={{
                color: colors.primary,
                background: colors.primaryLight,
                borderRadius: '2px',
              }}
            >
              À l'unité
            </span>
          )}
        </div>

        {/* Bouton + Détails */}
        <div className="mt-1.5 flex items-center gap-1">
          <button
            onClick={handleAddToCart}
            className={`flex-1 flex items-center justify-center gap-1 px-2 py-1.5 text-[8px] font-medium transition-all active:scale-95 ${
              isAdded ? 'opacity-70' : ''
            }`}
            style={{
              background: isAdded ? '#D4AF37' : (isPack ? '#1A1A1A' : colors.primary),
              color: isAdded ? '#1A1A1A' : '#FFFFFF',
              borderRadius: '4px',
              minHeight: '28px',
            }}
          >
            {isAdded ? (
              <>
                <Check size={10} />
                Ajouté
              </>
            ) : (
              <>
                {isPack ? <Gift size={10} /> : <ShoppingBag size={10} />}
                {isPack ? 'Choisir le pack' : 'Ajouter'}
              </>
            )}
          </button>

          {isPack && product.items && (
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="px-2 py-1.5 transition-all active:scale-95"
              style={{
                background: isDark ? '#2A2A4A' : '#F0F0F0',
                borderRadius: '4px',
                minHeight: '28px',
              }}
            >
              {showDetails ? (
                <ChevronUp size={12} className="text-gold" />
              ) : (
                <ChevronDown size={12} className="text-gray-400" />
              )}
            </button>
          )}
        </div>

        {/* Détails du pack */}
        {isPack && product.items && showDetails && (
          <div 
            className="mt-1.5 p-2 transition-all duration-300"
            style={{
              background: isDark ? '#141425' : '#F8F8F8',
              borderRadius: '4px',
              border: `1px solid ${isDark ? '#2A2A4A' : '#EEEEEE'}`,
            }}
          >
            <p className="text-[7px] font-semibold uppercase tracking-wider text-gold/80 mb-1">
              Contenu du pack
            </p>
            <ul className="space-y-0.5">
              {product.items.slice(0, 5).map((item, i) => (
                <li key={i} className="text-[8px] text-gray-600 dark:text-gray-400 flex items-center gap-1.5">
                  <span className="w-1 h-1 rounded-full bg-gold flex-shrink-0" />
                  <span className="truncate">{item}</span>
                </li>
              ))}
              {product.items.length > 5 && (
                <li className="text-[7px] text-gray-400 dark:text-gray-500">
                  + {product.items.length - 5} autres articles
                </li>
              )}
            </ul>
            <div className="mt-1.5 pt-1.5 border-t border-gray-200 dark:border-[#2A2A4A] flex items-center justify-between">
              <span className="text-[7px] text-gray-400 dark:text-gray-500">
                💎 Économisez jusqu'à 30%
              </span>
              <span className="text-[7px] font-semibold text-gold flex items-center gap-0.5">
                <Crown size={8} />
                Pack exclusif
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCard;