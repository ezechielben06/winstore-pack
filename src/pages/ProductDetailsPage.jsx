// 📄 src/pages/ProductDetailsPage.jsx - Version corrigée
import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, ShoppingBag, Heart, Share2, Star, 
  Crown, Package, Sparkles, Check, Minus, Plus,
  Truck, Shield, Clock, Gift, ChevronRight,
  Palette
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';
import { allProducts } from '../data/products';
import ProductCard from '../components/Shop/ProductCard';
import ProductImage from '../components/Shared/ProductImage';

const ProductDetailsPage = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isDark } = useTheme();
  
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [isLiked, setIsLiked] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);

  useEffect(() => {
    const all = [...allProducts.women, ...allProducts.men];
    const found = all.find(p => p.id === productId);
    
    if (found) {
      setProduct(found);
      
      if (found.variants && found.variants.length > 0) {
        setSelectedVariant(found.variants[0]);
        const colors = found.variants.filter(v => v.name === 'couleur' || v.name === 'color');
        const sizes = found.variants.filter(v => v.name === 'taille' || v.name === 'size');
        if (colors.length > 0) setSelectedColor(colors[0]);
        if (sizes.length > 0) setSelectedSize(sizes[0]);
      }
      
      const similar = all
        .filter(p => 
          p.id !== found.id && 
          (p.category === found.category || 
           p.tags?.some(t => found.tags?.includes(t)))
        )
        .slice(0, 4);
      setRelatedProducts(similar);
    } else {
      navigate('/');
    }
  }, [productId, navigate]);

  const handleAddToCart = () => {
    const productToAdd = {
      ...product,
      quantity,
      variant: selectedVariant || null
    };
    addToCart(productToAdd);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  // ✅ Fonction UNIVERSELLE pour obtenir le chemin de l'image
  const getImagePath = (image) => {
    if (!image) return null;
    // Si c'est déjà une URL complète
    if (image.startsWith('http://') || image.startsWith('https://')) {
      return image;
    }
    // Si ça commence par /, on garde tel quel
    if (image.startsWith('/')) {
      return image;
    }
    // Si ça commence par images/ (sans /)
    if (image.startsWith('images/')) {
      return `/${image}`;
    }
    // Cas normal : simple nom de fichier
    return `/images/${image}`;
  };

  // ✅ Obtenir l'image de la variante
  const getVariantImage = (variant) => {
    if (!variant?.image) return null;
    return getImagePath(variant.image);
  };

  // ✅ Obtenir le prix avec variante
  const getCurrentPrice = () => {
    if (selectedVariant && selectedVariant.price) {
      return selectedVariant.price;
    }
    return product?.price || parseInt(product?.priceRange?.split('-')[0]) || 0;
  };

  // ✅ Obtenir l'image affichée
  const getCurrentImage = () => {
    if (selectedVariant && selectedVariant.image) {
      return getVariantImage(selectedVariant);
    }
    return getImagePath(product?.image);
  };

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-gold border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="mt-4 text-gray-500 dark:text-gray-400">Chargement...</p>
        </div>
      </div>
    );
  }

  const isPack = product.category === 'pack';
  const isWomen = allProducts.women.some(p => p.id === product.id);
  const theme = isWomen ? 'feminine' : 'masculine';
  const themeBg = isWomen ? 'bg-feminine-primary' : 'bg-masculine-primary';

  const price = getCurrentPrice();
  const priceMax = product.priceRange ? parseInt(product.priceRange.split('-')[1]) : price;
  const currentImage = getCurrentImage();

  // ✅ Grouper les variantes par type
  const variantGroups = {};
  if (product.variants && product.variants.length > 0) {
    product.variants.forEach(v => {
      if (!variantGroups[v.name]) variantGroups[v.name] = [];
      variantGroups[v.name].push(v);
    });
  }

  const getVariantIcon = (name) => {
    const icons = {
      'couleur': '🎨',
      'color': '🎨',
      'taille': '📏',
      'size': '📏',
      'motif': '✨',
      'pattern': '✨',
      'matiere': '🧵',
      'material': '🧵'
    };
    return icons[name] || '📌';
  };

  const getVariantLabel = (name) => {
    const labels = {
      'couleur': 'Couleur',
      'color': 'Couleur',
      'taille': 'Taille',
      'size': 'Taille',
      'motif': 'Motif',
      'pattern': 'Motif',
      'matiere': 'Matière',
      'material': 'Matière'
    };
    return labels[name] || name;
  };

  return (
    <div className={`min-h-screen ${isDark ? 'bg-[#0d0d1a]' : 'bg-gray-50'}`}>
      {/* ===== BANNIÈRE ===== */}
      <div className={`relative overflow-hidden ${isDark ? 'bg-[#1a1a2e]' : themeBg} py-4 md:py-6`}>
        <div className="absolute top-0 right-0 w-32 h-32 md:w-64 md:h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-32 h-32 md:w-64 md:h-64 bg-white/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
        
        <div className="container mx-auto px-4 relative">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate(-1)}
              className="p-2 rounded-xl bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-lg md:text-2xl font-display font-bold text-white">
                {product.name}
              </h1>
              <p className="text-xs md:text-sm text-white/80 flex items-center gap-2">
                {isPack ? '📦 Pack' : '🛍️ Produit'}
                <span className="w-px h-3 bg-white/30" />
                {product.tags?.slice(0, 2).join(' • ')}
                {selectedVariant && (
                  <>
                    <span className="w-px h-3 bg-white/30" />
                    <span className="text-gold">{selectedVariant.value}</span>
                  </>
                )}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 max-w-6xl">
        <div className="grid md:grid-cols-2 gap-8">
          {/* ===== IMAGE ===== */}
          <div className={`relative rounded-2xl overflow-hidden ${isDark ? 'bg-[#1a1a2e]' : 'bg-white'} shadow-sm border ${isDark ? 'border-[#2d3748]' : 'border-gray-200'}`}>
            <ProductImage
              src={currentImage}
              alt={product.name}
              className="w-full aspect-square"
              emoji={product.emoji || '✨'}
              isPack={isPack}
              fit="contain"
            />
            
            {/* Badges */}
            <div className="absolute top-4 left-4 flex flex-col gap-2">
              {isPack && (
                <span className="bg-gradient-to-r from-gold to-yellow-500 text-gray-900 text-xs font-bold px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1.5">
                  <Crown className="w-3.5 h-3.5" />
                  PACK EXCLUSIF
                </span>
              )}
              {product.popularity && (
                <span className="bg-gold/90 text-gray-900 text-xs font-bold px-3 py-1.5 rounded-full shadow-lg backdrop-blur-sm">
                  {product.popularity} Populaire
                </span>
              )}
              {!isPack && (
                <span className="bg-blue-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
                  PRODUIT
                </span>
              )}
            </div>

            {/* Actions */}
            <div className="absolute top-4 right-4 flex flex-col gap-2">
              <button 
                onClick={() => setIsLiked(!isLiked)}
                className="w-10 h-10 rounded-full bg-white/90 dark:bg-[#1a1a2e]/90 backdrop-blur-sm flex items-center justify-center shadow-md hover:scale-110 transition-transform"
              >
                <Heart className={`w-5 h-5 ${isLiked ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} />
              </button>
              <button 
                onClick={() => {
                  const text = `✨ "${product.name}" - WIN'S PACK`;
                  if (navigator.share) {
                    navigator.share({ title: product.name, text, url: window.location.href });
                  } else {
                    window.open(`https://wa.me/?text=${encodeURIComponent(text + ' ' + window.location.href)}`, '_blank');
                  }
                }}
                className="w-10 h-10 rounded-full bg-white/90 dark:bg-[#1a1a2e]/90 backdrop-blur-sm flex items-center justify-center shadow-md hover:scale-110 transition-transform"
              >
                <Share2 className="w-5 h-5 text-gray-400 hover:text-gold" />
              </button>
            </div>

            {/* Badge prix */}
            <div className="absolute bottom-4 left-4 right-4 px-3 py-2 rounded-xl bg-white/95 dark:bg-[#1a1a2e]/95 backdrop-blur-sm shadow-lg border border-gray-100 dark:border-[#2d3748]">
              <div className="flex items-center justify-between">
                <div className="flex items-end gap-2">
                  <span className="text-xl font-display font-bold text-gray-900 dark:text-white">
                    {price.toLocaleString()} FCFA
                  </span>
                  {product.priceRange && (
                    <span className="text-sm text-gray-400 line-through">
                      {priceMax.toLocaleString()} FCFA
                    </span>
                  )}
                  {product.priceRange && (
                    <span className="text-sm font-semibold text-green-500">
                      -{Math.round(((priceMax - price) / priceMax) * 100)}%
                    </span>
                  )}
                </div>
                {isPack && product.items && (
                  <span className="text-xs font-medium bg-gold/20 px-2 py-1 rounded-full text-gold">
                    {product.items.length} articles
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* ===== INFOS PRODUIT ===== */}
          <div className="space-y-6">
            {/* En-tête */}
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-2">
                {isPack ? (
                  <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-gold/10 text-gold border border-gold/20">
                    <Package className="w-3 h-3 inline mr-1" />
                    Pack
                  </span>
                ) : (
                  <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-blue-50 text-blue-500 border border-blue-200/30">
                    <Sparkles className="w-3 h-3 inline mr-1" />
                    Produit
                  </span>
                )}
                {product.tags?.map((tag, i) => (
                  <span key={i} className="text-xs text-gray-400 bg-gray-100 dark:bg-[#2a2a4a] px-2.5 py-1 rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
              
              <h1 className="text-2xl md:text-3xl font-display font-bold text-gray-900 dark:text-white">
                {product.name}
              </h1>
              
              <p className="text-gray-500 dark:text-gray-400 mt-2 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Étoiles */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`w-4 h-4 ${i < 4 ? 'fill-gold text-gold' : 'fill-gray-200 text-gray-200 dark:fill-gray-700'}`} />
                ))}
              </div>
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">4.8</span>
              <span className="text-sm text-gray-400 dark:text-gray-500">(120 avis)</span>
            </div>

            {/* ✅ VARIANTES avec miniatures */}
            {Object.keys(variantGroups).length > 0 && (
              <div className={`p-4 rounded-xl ${isDark ? 'bg-[#1a1a2e]' : 'bg-gray-50'} border ${isDark ? 'border-[#2d3748]' : 'border-gray-200'}`}>
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                  <Palette className="w-4 h-4 text-gold" />
                  Choisissez votre variante
                </h3>
                
                {Object.keys(variantGroups).map((groupName) => {
                  const variants = variantGroups[groupName];
                  const isColor = groupName === 'couleur' || groupName === 'color';
                  
                  return (
                    <div key={groupName} className="mb-3 last:mb-0">
                      <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5 flex items-center gap-1">
                        {getVariantIcon(groupName)} {getVariantLabel(groupName)}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {variants.map((variant) => {
                          const isSelected = selectedVariant?.id === variant.id;
                          const variantImage = getVariantImage(variant);
                          
                          return (
                            <button
                              key={variant.id}
                              onClick={() => {
                                setSelectedVariant(variant);
                                if (isColor) setSelectedColor(variant);
                              }}
                              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                                isSelected
                                  ? 'bg-gold text-gray-900 shadow-md ring-2 ring-gold/50'
                                  : isDark
                                    ? 'bg-[#2a2a4a] text-gray-300 hover:bg-[#3a3a5a]'
                                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                              }`}
                            >
                              {/* ✅ Miniature de la variante */}
                              {variantImage ? (
                                <div className="w-6 h-6 rounded-full overflow-hidden flex-shrink-0 border border-gray-200">
                                  <img 
                                    src={variantImage} 
                                    alt={variant.value}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                      e.target.style.display = 'none';
                                    }}
                                  />
                                </div>
                              ) : isColor ? (
                                <span className="w-4 h-4 rounded-full flex-shrink-0" 
                                  style={{ 
                                    background: variant.color || variant.value.toLowerCase() 
                                  }} 
                                />
                              ) : null}
                              {variant.value}
                              {variant.price && variant.price !== price && (
                                <span className="ml-1 text-[8px] opacity-70">
                                  (+{variant.price.toLocaleString()} FCFA)
                                </span>
                              )}
                              {variant.stock !== undefined && variant.stock < 5 && (
                                <span className="ml-1 text-[8px] text-red-400">
                                  (stock: {variant.stock})
                                </span>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Quantité */}
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Quantité</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-8 h-8 rounded-full bg-gray-100 dark:bg-[#2a2a4a] flex items-center justify-center hover:bg-gray-200 dark:hover:bg-[#3a3a5a] transition-colors"
                >
                  <Minus className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                </button>
                <span className="w-10 text-center font-medium text-gray-800 dark:text-white">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-8 h-8 rounded-full bg-gray-100 dark:bg-[#2a2a4a] flex items-center justify-center hover:bg-gray-200 dark:hover:bg-[#3a3a5a] transition-colors"
                >
                  <Plus className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                </button>
              </div>
            </div>

            {/* Boutons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleAddToCart}
                className={`flex-1 ${themeBg} text-white py-3.5 rounded-xl font-semibold hover:scale-[1.02] transition-all shadow-lg ${themeBg}/30 flex items-center justify-center gap-2 active:scale-95 ${isAdded ? 'opacity-70' : ''}`}
              >
                {isAdded ? (
                  <>
                    <Check className="w-5 h-5" />
                    Ajouté au panier
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-5 h-5" />
                    Ajouter au panier
                  </>
                )}
              </button>
              
              <button
                onClick={() => {
                  const phoneNumber = '2290153096537';
                  const variantText = selectedVariant ? ` (${selectedVariant.value})` : '';
                  const message = `Bonjour WIN'S PACK ! 👋 Je souhaite commander "${product.name}${variantText}" (${quantity}x ${price.toLocaleString()} FCFA)`;
                  window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`, '_blank');
                }}
                className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white py-3.5 rounded-xl font-semibold hover:scale-[1.02] transition-all shadow-lg shadow-green-500/30 flex items-center justify-center gap-2 active:scale-95"
              >
                <Truck className="w-5 h-5" />
                Commander
              </button>
            </div>

            {/* Livraison */}
            <div className={`grid grid-cols-2 gap-3 p-4 rounded-xl ${isDark ? 'bg-[#1a1a2e]' : 'bg-gray-50'} border ${isDark ? 'border-[#2d3748]' : 'border-gray-200'}`}>
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-gold" />
                <span className="text-xs text-gray-600 dark:text-gray-400">Livraison disponible</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-gold" />
                <span className="text-xs text-gray-600 dark:text-gray-400">Paiement sécurisé</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-gold" />
                <span className="text-xs text-gray-600 dark:text-gray-400">24-72h de livraison</span>
              </div>
              <div className="flex items-center gap-2">
                <Gift className="w-4 h-4 text-gold" />
                <span className="text-xs text-gray-600 dark:text-gray-400">Pack à partir de 3 articles</span>
              </div>
            </div>
          </div>
        </div>

        {/* ===== CONTENU DU PACK ===== */}
        {isPack && product.items && (
          <div className="mt-8">
            <h2 className="text-xl font-display font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
              <Package className="w-5 h-5 text-gold" />
              Contenu du pack
            </h2>
            <div className={`rounded-2xl ${isDark ? 'bg-[#1a1a2e]' : 'bg-white'} shadow-sm border ${isDark ? 'border-[#2d3748]' : 'border-gray-200'} p-6`}>
              <ul className="grid sm:grid-cols-2 gap-3">
                {product.items.map((item, i) => (
                  <li key={i} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-[#1a1a2e] border border-gray-100 dark:border-[#2d3748]">
                    <span className="w-2 h-2 rounded-full bg-gold flex-shrink-0" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">{item}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-4 p-3 rounded-xl bg-gold/10 border border-gold/20 text-center">
                <p className="text-sm text-gold font-medium">
                  💎 Ce pack contient {product.items.length} articles de qualité
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ===== PRODUITS SIMILAIRES ===== */}
        {relatedProducts.length > 0 && (
          <div className="mt-12">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-display font-bold text-gray-800 dark:text-white">
                Produits similaires
              </h2>
              <Link 
                to={isWomen ? '/femme' : '/homme'}
                className="text-sm text-gold hover:underline flex items-center gap-1"
              >
                Voir tout
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {relatedProducts.map((p) => (
                <div key={p.id}>
                  <ProductCard product={p} isWomen={isWomen} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetailsPage;