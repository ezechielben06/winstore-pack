// 📄 src/components/Shop/ProductCard.jsx - Version mobile robuste
import { useState } from 'react';
import { ShoppingBag, Heart, Share2, Package, Sparkles, Crown, Check } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useTheme } from '../../context/ThemeContext';

const ProductCard = ({ product, isWomen }) => {
  const { addToCart } = useCart();
  const { isDark } = useTheme();
  const [isLiked, setIsLiked] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  
  const isPack = product.category === 'pack';
  
  const colors = isWomen ? {
    primary: '#E91E8C',
    primaryDark: '#C2185B',
    primaryLight: '#FCE4EC',
  } : {
    primary: '#1A237E',
    primaryDark: '#0D1445',
    primaryLight: '#E8EAF6',
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
      className={`bg-white dark:bg-[#141425] transition-all duration-300 border ${
        isDark ? 'border-[#2A2A4A]' : 'border-gray-200/70'
      } ${isPack ? 'border-gold/30' : ''}`}
      style={{
        borderRadius: '8px',
        boxShadow: isPack 
          ? '0 4px 20px rgba(212,175,55,0.08)' 
          : '0 2px 12px rgba(0,0,0,0.04)',
        overflow: 'hidden',
        minWidth: 0, // ✅ Évite le débordement
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

        {/* Badge - Version compacte mobile */}
        <div 
          className="absolute top-2 left-2 px-2 py-0.5 text-[8px] font-bold tracking-wider uppercase"
          style={{
            background: isPack ? '#D4AF37' : colors.primary,
            color: isPack ? '#1A1A1A' : '#FFFFFF',
            borderRadius: '4px',
            letterSpacing: '0.06em',
          }}
        >
          {isPack ? 'Pack' : 'Produit'}
        </div>

        {/* Prix en bas - Version compacte */}
        <div 
          className="absolute bottom-2 left-2 right-2 px-2 py-1 flex items-center justify-between"
          style={{
            background: isPack ? 'rgba(212,175,55,0.95)' : 'rgba(255,255,255,0.95)',
            backdropFilter: 'blur(8px)',
            borderRadius: '4px',
          }}
        >
          <span 
            className="text-xs font-bold truncate"
            style={{ color: isPack ? '#1A1A1A' : '#1A1A1A' }}
          >
            {product.price 
              ? `${product.price.toLocaleString()} FCFA`
              : product.priceRange || ''
            }
          </span>
          {isPack && product.items && (
            <span className="text-[8px] font-medium opacity-60 flex-shrink-0" style={{ color: isPack ? '#1A1A1A' : '#666' }}>
              {product.items.length} art.
            </span>
          )}
        </div>

        {/* Actions - Version compacte */}
        <div className="absolute top-2 right-2 flex flex-col gap-1">
          <button 
            onClick={() => setIsLiked(!isLiked)}
            className="w-6 h-6 flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95 bg-white/90 dark:bg-[#1A1A2E]/90 backdrop-blur-sm"
            style={{ borderRadius: '4px' }}
          >
            <Heart size={12} className={isLiked ? 'fill-red-500 text-red-500' : 'text-gray-400'} />
          </button>
          <button 
            onClick={handleShare}
            className="w-6 h-6 flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95 bg-white/90 dark:bg-[#1A1A2E]/90 backdrop-blur-sm"
            style={{ borderRadius: '4px' }}
          >
            <Share2 size={12} className="text-gray-400 hover:text-gold transition-colors" />
          </button>
        </div>
      </div>

      {/* ===== BODY - Version compacte ===== */}
      <div className="p-2 sm:p-3">
        {/* Tags */}
        <div className="flex flex-wrap gap-0.5 mb-1">
          {product.tags && product.tags.slice(0, 2).map((tag, i) => (
            <span 
              key={i} 
              className="text-[7px] font-medium px-1.5 py-0.5 truncate max-w-[50px]"
              style={{ 
                color: isPack ? '#D4AF37' : '#666',
                background: isPack ? 'rgba(212,175,55,0.08)' : '#F0F0F0',
                borderRadius: '2px',
              }}
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Nom - Avec truncate */}
        <h3 className={`text-xs font-semibold leading-tight mb-0.5 truncate ${
          isPack ? 'text-gold' : 'text-gray-900 dark:text-white'
        }`}>
          {product.name}
        </h3>
        
        {product.description && (
          <p className="text-[9px] text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed break-words">
            {product.description}
          </p>
        )}

        {/* Statut */}
        <div className="mt-1 flex items-center gap-2">
          <span 
            className="text-[7px] font-medium px-1.5 py-0.5 truncate"
            style={{
              color: isPack ? '#D4AF37' : colors.primary,
              background: isPack ? 'rgba(212,175,55,0.08)' : colors.primaryLight,
              borderRadius: '2px',
            }}
          >
            {isPack ? `📦 ${product.items?.length || 0} art.` : 'À l\'unité'}
          </span>
        </div>

        {/* Actions */}
        <div className="mt-2 pt-2 flex items-center gap-1.5" style={{ borderTop: '1px solid', borderColor: isDark ? '#2A2A4A' : '#EEEEEE' }}>
          <button
            onClick={handleAddToCart}
            className={`flex-1 flex items-center justify-center gap-1 px-2 py-1.5 text-[9px] font-medium transition-all duration-200 active:scale-95 ${
              isAdded ? 'opacity-70 pointer-events-none' : ''
            }`}
            style={{
              background: isAdded ? '#D4AF37' : (isPack ? '#1A1A1A' : colors.primary),
              color: isAdded ? '#1A1A1A' : '#FFFFFF',
              borderRadius: '4px',
              letterSpacing: '0.03em',
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
                {isPack ? <Package size={10} /> : <ShoppingBag size={10} />}
                {isPack ? 'Choisir' : 'Ajouter'}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;