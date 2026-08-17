// 📄 src/components/Shop/ProductCard.jsx - Version corrigée
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ShoppingBag, Heart, Share2, Package, Sparkles, Check, 
  Crown, Gift, ChevronDown, ChevronUp, Eye 
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useTheme } from '../../context/ThemeContext';
import ProductImage from '../Shared/ProductImage';

const ProductCard = ({ product, isWomen }) => {
  const { addToCart } = useCart();
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const [isLiked, setIsLiked] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  
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

  // ✅ Fonction UNIVERSELLE pour obtenir le chemin de l'image
  const getImagePath = (image) => {
    if (!image) return null;
    if (image.startsWith('http://') || image.startsWith('https://')) {
      return image;
    }
    if (image.startsWith('/')) {
      return image;
    }
    if (image.startsWith('images/')) {
      return `/${image}`;
    }
    return `/images/${image}`;
  };

  // ✅ Obtenir l'image du produit (priorité à la première variante)
  const getProductImage = () => {
    // Si le produit a une image
    if (product.image) {
      return getImagePath(product.image);
    }
    // Si le produit a des variantes avec des images
    if (product.variants && product.variants.length > 0) {
      const variantWithImage = product.variants.find(v => v.image);
      if (variantWithImage) {
        return getImagePath(variantWithImage.image);
      }
    }
    return null;
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const handleLike = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsLiked(!isLiked);
  };

  const handleShare = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    const text = `✨ "${product.name}" - WIN'S PACK`;
    if (navigator.share) {
      try {
        await navigator.share({ title: product.name, text, url: window.location.href });
      } catch (err) {}
    } else {
      window.open(`https://wa.me/?text=${encodeURIComponent(text + ' ' + window.location.href)}`, '_blank');
    }
  };

  const handleToggleDetails = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setShowDetails(!showDetails);
  };

  const goToDetails = (e) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(`/produit/${product.id}`);
  };

  const getBgColor = () => {
    if (isPack) {
      return isDark ? '#1A1A35' : '#FFF8F0';
    }
    return isDark ? '#141425' : '#F5F5F5';
  };

  const getPrice = () => {
    if (product.price) return product.price;
    if (product.priceRange) return parseInt(product.priceRange.split('-')[0]);
    return 0;
  };

  const getPriceMax = () => {
    if (product.priceRange) return parseInt(product.priceRange.split('-')[1]);
    return product.price || 0;
  };

  const hasDiscount = product.priceRange && getPriceMax() > getPrice();
  const discountPercent = hasDiscount ? Math.round(((getPriceMax() - getPrice()) / getPriceMax()) * 100) : 0;

  const imageUrl = getProductImage();

  return (
    <Link 
      to={`/produit/${product.id}`}
      className="block w-full overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 active:scale-[0.98] group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        borderRadius: '10px',
        background: isDark ? '#1A1A2E' : '#FFFFFF',
        border: isPack 
          ? `2px solid ${isDark ? '#D4AF37' : '#D4AF37'}`
          : `1px solid ${isDark ? '#2A2A4A' : '#EEEEEE'}`,
        boxShadow: isPack 
          ? '0 4px 20px rgba(212,175,55,0.12)' 
          : '0 2px 8px rgba(0,0,0,0.04)',
      }}
    >
      {/* ===== IMAGE ===== */}
      <div 
        className="relative overflow-hidden"
        style={{ 
          aspectRatio: '1/1',
          background: getBgColor(),
          borderBottom: isPack ? '2px solid #D4AF37' : 'none',
          borderTopLeftRadius: '10px',
          borderTopRightRadius: '10px',
        }}
      >
        <ProductImage
          src={imageUrl}
          alt={product.name}
          className="w-full h-full"
          emoji={product.emoji || '✨'}
          isPack={isPack}
          fit="cover"
        />

        {/* Badge PACK/PRODUIT */}
        <div 
          className="absolute top-2 left-2 px-2.5 py-1 text-[8px] font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-lg z-10"
          style={{
            background: isPack ? '#D4AF37' : colors.primary,
            color: isPack ? '#1A1A1A' : '#FFFFFF',
            borderRadius: '6px',
          }}
        >
          {isPack ? <Crown size={10} /> : <Sparkles size={10} />}
          {isPack ? 'PACK' : 'PRODUIT'}
        </div>

        {/* Badge de réduction */}
        {hasDiscount && (
          <div 
            className="absolute top-2 right-2 px-2 py-1 text-[8px] font-bold shadow-lg z-10"
            style={{
              background: '#EF4444',
              color: '#FFFFFF',
              borderRadius: '6px',
            }}
          >
            -{discountPercent}%
          </div>
        )}

        {/* Popularité */}
        {product.popularity && (
          <div 
            className="absolute top-2 right-14 px-1.5 py-0.5 text-[7px] font-bold z-10"
            style={{
              background: 'rgba(212,175,55,0.9)',
              color: '#1A1A1A',
              borderRadius: '4px',
            }}
          >
            {product.popularity}
          </div>
        )}

        {/* Prix */}
        <div 
          className="absolute bottom-2 left-2 right-2 px-3 py-1.5 flex items-center justify-between z-10"
          style={{
            background: isPack ? 'rgba(212,175,55,0.95)' : 'rgba(255,255,255,0.95)',
            borderRadius: '8px',
            backdropFilter: 'blur(8px)',
            border: isPack ? '1px solid rgba(212,175,55,0.3)' : '1px solid rgba(0,0,0,0.05)',
            boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
          }}
        >
          <div className="flex items-center gap-1.5">
            <span className={`text-xs font-bold truncate ${isPack ? 'text-gray-900' : 'text-gray-900'}`}>
              {getPrice().toLocaleString()} FCFA
            </span>
            {hasDiscount && (
              <span className="text-[8px] text-gray-400 line-through">
                {getPriceMax().toLocaleString()} FCFA
              </span>
            )}
          </div>
          {isPack && product.items && (
            <span className="text-[8px] font-medium bg-white/40 px-1.5 py-0.5 rounded-full flex items-center gap-1">
              <Package size={8} />
              {product.items.length} art.
            </span>
          )}
        </div>

        {/* Overlay "Voir détails" */}
        <div 
          className={`absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-center justify-center transition-opacity duration-300 z-10 ${
            isHovered ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <div className="flex flex-col items-center gap-2">
            <div className="bg-white/20 backdrop-blur-sm rounded-full p-3">
              <Eye className="w-6 h-6 text-white" />
            </div>
            <span className="text-white text-xs font-medium tracking-wider uppercase bg-black/40 backdrop-blur-sm px-3 py-1 rounded-full">
              Voir détails
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="absolute top-2 right-2 flex flex-col gap-1.5 z-10">
          <button 
            onClick={handleLike}
            className={`w-7 h-7 flex items-center justify-center backdrop-blur-sm transition-all hover:scale-110 ${
              isLiked ? 'bg-red-500/20' : 'bg-white/80 dark:bg-[#1A1A2E]/80'
            }`}
            style={{ borderRadius: '6px' }}
          >
            <Heart size={13} className={isLiked ? 'fill-red-500 text-red-500' : 'text-gray-400'} />
          </button>
          <button 
            onClick={handleShare}
            className="w-7 h-7 flex items-center justify-center bg-white/80 dark:bg-[#1A1A2E]/80 backdrop-blur-sm hover:scale-110 transition-all"
            style={{ borderRadius: '6px' }}
          >
            <Share2 size={13} className="text-gray-400 hover:text-gold transition-colors" />
          </button>
        </div>
      </div>

      {/* ===== BODY ===== */}
      <div className="p-2.5">
        {/* Tags */}
        <div className="flex flex-wrap gap-1 mb-1">
          {product.tags && product.tags.slice(0, 2).map((tag, i) => (
            <span 
              key={i} 
              className="text-[7px] font-medium px-1.5 py-0.5 truncate"
              style={{ 
                color: isPack ? '#D4AF37' : '#888',
                background: isPack ? 'rgba(212,175,55,0.08)' : '#F0F0F0',
                borderRadius: '4px',
                maxWidth: '50px',
              }}
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Nom */}
        <div className="flex items-center gap-1.5">
          {isPack ? (
            <Crown size={10} className="text-gold flex-shrink-0" />
          ) : (
            <Sparkles size={10} className="text-gray-400 flex-shrink-0" />
          )}
          <h3 className={`text-xs font-semibold leading-tight truncate ${
            isPack ? 'text-gold' : 'text-gray-900 dark:text-white'
          }`}>
            {product.name}
          </h3>
        </div>
        
        {product.description && (
          <p className="text-[7px] text-gray-400 dark:text-gray-500 line-clamp-1 leading-tight mt-0.5">
            {product.description}
          </p>
        )}

        {/* Statut */}
        <div className="mt-1.5 flex items-center gap-2">
          {isPack ? (
            <span 
              className="text-[7px] font-medium px-2 py-0.5 flex items-center gap-1"
              style={{
                color: '#D4AF37',
                background: 'rgba(212,175,55,0.12)',
                borderRadius: '4px',
              }}
            >
              <Gift size={8} />
              {product.items?.length || 0} articles
            </span>
          ) : (
            <span 
              className="text-[7px] font-medium px-2 py-0.5"
              style={{
                color: colors.primary,
                background: colors.primaryLight,
                borderRadius: '4px',
              }}
            >
              À l'unité
            </span>
          )}
          
          {!isPack && (
            <span 
              className="text-[7px] font-medium px-2 py-0.5"
              style={{
                color: '#10B981',
                background: 'rgba(16,185,129,0.1)',
                borderRadius: '4px',
              }}
            >
              Nouveau
            </span>
          )}
        </div>

        {/* Bouton Ajouter + Détails */}
        <div className="mt-2 flex items-center gap-1.5">
          <button
            onClick={handleAddToCart}
            className={`flex-1 flex items-center justify-center gap-1 px-2 py-1.5 text-[8px] font-medium transition-all active:scale-95 ${
              isAdded ? 'opacity-70' : ''
            }`}
            style={{
              background: isAdded ? '#D4AF37' : (isPack ? '#1A1A1A' : colors.primary),
              color: isAdded ? '#1A1A1A' : '#FFFFFF',
              borderRadius: '6px',
              minHeight: '26px',
            }}
          >
            {isAdded ? (
              <>
                <Check size={9} />
                Ajouté
              </>
            ) : (
              <>
                {isPack ? <Gift size={9} /> : <ShoppingBag size={9} />}
                {isPack ? 'Choisir' : 'Ajouter'}
              </>
            )}
          </button>

          <span
            onClick={goToDetails}
            className="px-2.5 py-1.5 transition-all active:scale-95 flex items-center gap-1 cursor-pointer"
            style={{
              background: isDark ? '#2A2A4A' : '#F0F0F0',
              borderRadius: '6px',
              minHeight: '26px',
            }}
          >
            <Eye size={10} className="text-gray-400 group-hover:text-gold transition-colors" />
            <span className="text-[7px] font-medium text-gray-500 dark:text-gray-400">Détails</span>
          </span>
        </div>

        {/* Détails du pack (accordéon) */}
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
    </Link>
  );
};

export default ProductCard;