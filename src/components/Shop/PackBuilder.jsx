// 📄 src/components/Shop/PackBuilder.jsx - Version avec guidance
import { useState, useMemo, useEffect } from 'react';
import { 
  X, Plus, ShoppingBag, Trash2, Package, Search, 
  Sparkles, Crown, Check, Minus, Gift, Zap,
  Filter, ChevronDown, ChevronUp, Lightbulb, 
  ArrowRight, ArrowLeft, Star, Wand2
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useTheme } from '../../context/ThemeContext';

const PackBuilder = ({ isOpen, onClose, products, isWomen }) => {
  const { addToCart } = useCart();
  const { isDark } = useTheme();
  
  const [selectedItems, setSelectedItems] = useState([]);
  const [packName, setPackName] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [showSuggestions, setShowSuggestions] = useState(true);

  const theme = isWomen ? 'feminine' : 'masculine';
  const themeColor = isWomen ? 'text-feminine-primary' : 'text-masculine-primary';
  const themeBg = isWomen ? 'bg-feminine-primary' : 'bg-masculine-primary';
  const themeLight = isWomen ? 'bg-feminine-light' : 'bg-masculine-light';
  const themeBorder = isWomen ? 'border-feminine-primary/20' : 'border-masculine-primary/20';

  // ✅ Suggestions de packs selon le thème
  const suggestions = useMemo(() => {
    const allProducts = products.filter(p => p.category === 'product');
    
    // Grouper par catégorie
    const grouped = {};
    allProducts.forEach(p => {
      (p.tags || []).forEach(tag => {
        if (!grouped[tag]) grouped[tag] = [];
        grouped[tag].push(p);
      });
    });

    // Suggestions populaires
    const popular = allProducts.filter(p => p.popularity);
    
    return {
      categories: Object.keys(grouped).slice(0, 6),
      popular: popular.slice(0, 4),
      byCategory: grouped,
    };
  }, [products]);

  // ✅ Filtrer les produits
  const availableProducts = useMemo(() => {
    return products.filter(p => p.category === 'product');
  }, [products]);

  // ✅ Catégories uniques
  const categories = useMemo(() => {
    const allTags = availableProducts.flatMap(p => p.tags || []);
    return ['all', ...new Set(allTags)];
  }, [availableProducts]);

  // ✅ Filtrer par recherche et catégorie
  const filteredProducts = useMemo(() => {
    let results = availableProducts;
    
    if (searchTerm.trim()) {
      const query = searchTerm.toLowerCase().trim();
      results = results.filter(p => 
        p.name.toLowerCase().includes(query) ||
        p.description?.toLowerCase().includes(query) ||
        p.tags?.some(tag => tag.toLowerCase().includes(query))
      );
    }
    
    if (selectedCategory !== 'all') {
      results = results.filter(p => p.tags?.includes(selectedCategory));
    }
    
    return results;
  }, [availableProducts, searchTerm, selectedCategory]);

  // ✅ Ajouter un produit
  const addItem = (product) => {
    if (selectedItems.find(item => item.id === product.id)) {
      setSelectedItems(prev => 
        prev.map(item => 
          item.id === product.id 
            ? { ...item, quantity: (item.quantity || 1) + 1 }
            : item
        )
      );
      return;
    }
    setSelectedItems([...selectedItems, { ...product, quantity: 1 }]);
    
    // Cacher les suggestions après la première sélection
    if (selectedItems.length === 0) {
      setShowSuggestions(false);
    }
  };

  // ✅ Retirer un produit
  const removeItem = (productId) => {
    setSelectedItems(selectedItems.filter(item => item.id !== productId));
    if (selectedItems.length === 1) {
      setShowSuggestions(true);
    }
  };

  // ✅ Modifier la quantité
  const updateQuantity = (productId, delta) => {
    setSelectedItems(prev => 
      prev.map(item => {
        if (item.id === productId) {
          const newQuantity = (item.quantity || 1) + delta;
          if (newQuantity <= 0) return null;
          return { ...item, quantity: newQuantity };
        }
        return item;
      }).filter(Boolean)
    );
  };

  // ✅ Calculs
  const totalPrice = selectedItems.reduce((sum, item) => {
    const price = item.price || parseInt(item.priceRange?.split('-')[0]) || 0;
    return sum + (price * (item.quantity || 1));
  }, 0);

  const totalItems = selectedItems.reduce((sum, item) => sum + (item.quantity || 1), 0);

  // ✅ Créer le pack
  const createPack = () => {
    if (selectedItems.length < 3) {
      alert('Un pack doit contenir au moins 3 articles !');
      return;
    }

    const pack = {
      id: `custom-${Date.now()}`,
      name: packName || 'Pack Personnalisé',
      category: 'pack',
      price: totalPrice,
      description: `Pack composé de ${totalItems} articles`,
      items: selectedItems.flatMap(item => 
        Array(item.quantity || 1).fill(item.name)
      ),
      emoji: '🎨',
      isCustom: true,
      popularity: '✨',
    };

    addToCart(pack);
    onClose();
    reset();
  };

  // ✅ Réinitialiser
  const reset = () => {
    setSelectedItems([]);
    setPackName('');
    setSearchTerm('');
    setSelectedCategory('all');
    setCurrentStep(1);
    setShowSuggestions(true);
  };

  // ✅ Prix d'un produit
  const getProductPrice = (product) => {
    return product.price || parseInt(product.priceRange?.split('-')[0]) || 0;
  };

  // ✅ Ajouter une suggestion complète
  const addSuggestion = (items) => {
    items.forEach(item => {
      addItem(item);
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className={`bg-white dark:bg-[#1a1a2e] rounded-2xl max-w-5xl w-full max-h-[95vh] overflow-hidden shadow-2xl ${
        isDark ? 'border border-[#2d3748]' : ''
      }`}>
        {/* ===== HEADER ===== */}
        <div className={`flex items-center justify-between p-4 border-b ${
          isDark ? 'border-[#2d3748]' : 'border-gray-100'
        } bg-gradient-to-r from-gold/5 to-${theme}-light/30`}>
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-xl ${themeLight}`}>
              <Wand2 className={`w-5 h-5 ${themeColor}`} />
            </div>
            <div>
              <h2 className="text-lg font-display font-bold text-gray-800 dark:text-white">
                {selectedItems.length === 0 ? 'Crée ton pack personnalisé' : 'Compose ton pack'}
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {selectedItems.length < 3 
                  ? `Sélectionne ${3 - selectedItems.length} article${3 - selectedItems.length > 1 ? 's' : ''} minimum`
                  : `${totalItems} articles sélectionnés`
                }
              </p>
            </div>
          </div>
          <button
            onClick={() => { onClose(); reset(); }}
            className="p-2 hover:bg-gray-100 dark:hover:bg-[#2a2a4a] rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        <div className="flex flex-col lg:flex-row h-[calc(95vh-80px)]">
          {/* ===== PANEL GAUCHE ===== */}
          <div className="flex-1 flex flex-col p-4 overflow-hidden">
            {/* ✅ Barre de progression */}
            <div className="flex items-center gap-2 mb-3">
              <div className="flex-1 h-1.5 rounded-full bg-gray-200 dark:bg-[#2a2a4a] overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-gold to-yellow-400 transition-all duration-500"
                  style={{ 
                    width: `${Math.min((selectedItems.length / 3) * 100, 100)}%` 
                  }}
                />
              </div>
              <span className="text-[10px] font-medium text-gray-400 dark:text-gray-500 whitespace-nowrap">
                {selectedItems.length < 3 ? `${selectedItems.length}/3` : '✅ Complet'}
              </span>
            </div>

            {/* ✅ Suggestions - Pour les clients qui ne connaissent pas les produits */}
            {showSuggestions && selectedItems.length === 0 && (
              <div className="mb-3 p-3 rounded-xl bg-gradient-to-r from-gold/10 to-${theme}-light/30 border border-gold/20 animate-fade-in">
                <div className="flex items-center gap-2 mb-2">
                  <Lightbulb className="w-4 h-4 text-gold" />
                  <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                    Besoin d'inspiration ?
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {suggestions.categories.map(cat => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className="px-2.5 py-1 rounded-full text-[10px] bg-white dark:bg-[#2a2a4a] border border-gray-200 dark:border-[#2d3748] hover:border-gold transition-colors"
                    >
                      {cat}
                    </button>
                  ))}
                </div>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {suggestions.popular.map(p => (
                    <button
                      key={p.id}
                      onClick={() => addItem(p)}
                      className="px-2.5 py-1 rounded-full text-[10px] bg-gold/10 text-gold border border-gold/20 hover:bg-gold/20 transition-colors"
                    >
                      {p.emoji} {p.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* ✅ Message d'encouragement */}
            {selectedItems.length > 0 && selectedItems.length < 3 && (
              <div className="mb-3 p-2 rounded-xl bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 animate-fade-in">
                <p className="text-[10px] text-blue-600 dark:text-blue-400 flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3" />
                  Encore {3 - selectedItems.length} article{3 - selectedItems.length > 1 ? 's' : ''} pour valider ton pack !
                </p>
              </div>
            )}

            {/* ✅ Barre de recherche et filtres */}
            <div className="flex flex-col gap-2 mb-3">
              <div className="flex items-center gap-2">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Rechercher un produit..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={`w-full pl-9 pr-4 py-2 rounded-xl border text-sm ${
                      isDark 
                        ? 'bg-[#2a2a4a] border-[#2d3748] text-white placeholder-gray-400' 
                        : 'bg-gray-100 border-gray-200 text-gray-800'
                    } focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none transition-all`}
                  />
                </div>
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`p-2 rounded-xl border transition-all ${
                    showFilters 
                      ? `border-gold text-gold ${isDark ? 'bg-gold/10' : 'bg-gold/5'}`
                      : `border-gray-200 dark:border-[#2d3748] text-gray-400`
                  }`}
                >
                  <Filter className="w-4 h-4" />
                </button>
              </div>

              {/* Filtres */}
              {showFilters && (
                <div className="flex flex-wrap gap-1.5 p-2 rounded-xl bg-gray-50 dark:bg-[#1a1a2e] animate-fade-in">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-2.5 py-1 rounded-full text-[10px] font-medium transition-all ${
                        selectedCategory === cat
                          ? `${themeBg} text-white`
                          : `bg-gray-200 dark:bg-[#2a2a4a] text-gray-600 dark:text-gray-400`
                      }`}
                    >
                      {cat === 'all' ? 'Tous' : cat}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Liste des produits */}
            <div className="flex-1 overflow-y-auto -mx-2 px-2">
              {filteredProducts.length === 0 ? (
                <div className="text-center py-12">
                  <Search className="w-12 h-12 mx-auto text-gray-300 dark:text-gray-600 mb-3" />
                  <p className="text-gray-500 dark:text-gray-400 text-sm">Aucun produit trouvé</p>
                  <p className="text-xs text-gray-400 dark:text-gray-500">Essayez une autre recherche</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {filteredProducts.map((product) => {
                    const isSelected = selectedItems.some(item => item.id === product.id);
                    const price = getProductPrice(product);
                    const quantity = selectedItems.find(item => item.id === product.id)?.quantity || 0;

                    return (
                      <button
                        key={product.id}
                        onClick={() => addItem(product)}
                        className={`relative p-2 rounded-xl border-2 transition-all text-left ${
                          isSelected 
                            ? `border-gold bg-gold/5 ${isDark ? 'bg-gold/10' : ''}`
                            : `border-gray-200 dark:border-[#2d3748] hover:border-gold/50 ${isDark ? 'hover:bg-[#2a2a4a]' : 'hover:bg-gray-50'}`
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">{product.emoji || '✨'}</span>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-xs truncate">{product.name}</p>
                            <p className="text-[10px] text-gray-500 dark:text-gray-400">
                              {price.toLocaleString()} FCFA
                            </p>
                            {product.tags && (
                              <div className="flex gap-0.5 mt-0.5">
                                <span className="text-[6px] text-gray-400 bg-gray-100 dark:bg-[#2a2a4a] px-1 py-0.5 rounded">
                                  {product.tags[0]}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                        
                        {isSelected && (
                          <div className="absolute -top-1 -right-1 flex items-center gap-0.5 bg-gold text-white text-[8px] font-bold px-1.5 py-0.5 rounded-full">
                            {quantity > 1 && <span>{quantity}</span>}
                            <Check className="w-3 h-3" />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="mt-2 text-[10px] text-gray-400 dark:text-gray-500">
              {filteredProducts.length} produits disponibles
            </div>
          </div>

          {/* ===== PANEL DROIT : Récapitulatif ===== */}
          <div className={`lg:w-80 p-4 border-t lg:border-t-0 lg:border-l ${
            isDark ? 'border-[#2d3748] bg-[#141425]' : 'border-gray-100 bg-gray-50/50'
          } flex flex-col`}>
            <h3 className="font-semibold text-gray-700 dark:text-gray-300 text-sm mb-3 flex items-center gap-2">
              <Gift className="w-4 h-4 text-gold" />
              Ton pack
              <span className="text-xs text-gray-400 dark:text-gray-500">
                ({totalItems} articles)
              </span>
            </h3>

            {/* Nom du pack */}
            <input
              type="text"
              placeholder="Nom de ton pack (optionnel)"
              value={packName}
              onChange={(e) => setPackName(e.target.value)}
              className={`w-full px-3 py-2 rounded-xl border text-sm ${
                isDark 
                  ? 'bg-[#2a2a4a] border-[#2d3748] text-white placeholder-gray-400' 
                  : 'bg-white border-gray-200 text-gray-800'
              } focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none transition-all mb-3`}
            />

            {/* Liste des articles sélectionnés */}
            <div className="flex-1 overflow-y-auto space-y-1.5">
              {selectedItems.length === 0 ? (
                <div className="text-center py-8">
                  <Gift className="w-12 h-12 mx-auto text-gray-300 dark:text-gray-600 mb-2" />
                  <p className="text-sm text-gray-400 dark:text-gray-500">Sélectionne des produits</p>
                  <p className="text-xs text-gray-400 dark:text-gray-500">Minimum 3 articles</p>
                </div>
              ) : (
                selectedItems.map((item) => {
                  const price = getProductPrice(item);
                  const quantity = item.quantity || 1;
                  const total = price * quantity;

                  return (
                    <div key={item.id} className={`flex items-center gap-2 p-2 rounded-xl ${
                      isDark ? 'bg-[#1a1a2e]' : 'bg-white'
                    } border ${isDark ? 'border-[#2d3748]' : 'border-gray-100'}`}>
                      <span className="text-xl">{item.emoji || '✨'}</span>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-xs truncate">{item.name}</p>
                        <p className="text-[10px] text-gray-500 dark:text-gray-400">
                          {total.toLocaleString()} FCFA
                        </p>
                      </div>
                      <div className="flex items-center gap-0.5">
                        <button
                          onClick={() => updateQuantity(item.id, -1)}
                          className="w-5 h-5 rounded-full bg-gray-200 dark:bg-[#2a2a4a] flex items-center justify-center hover:bg-gray-300 dark:hover:bg-[#3a3a5a] transition-colors"
                        >
                          <Minus className="w-3 h-3 text-gray-600 dark:text-gray-400" />
                        </button>
                        <span className="w-5 text-center text-xs font-medium">{quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, 1)}
                          className="w-5 h-5 rounded-full bg-gray-200 dark:bg-[#2a2a4a] flex items-center justify-center hover:bg-gray-300 dark:hover:bg-[#3a3a5a] transition-colors"
                        >
                          <Plus className="w-3 h-3 text-gray-600 dark:text-gray-400" />
                        </button>
                      </div>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="p-1 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-full text-red-400 hover:text-red-600 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  );
                })
              )}
            </div>

            {/* ✅ Badge de progression */}
            {selectedItems.length > 0 && selectedItems.length < 3 && (
              <div className={`mt-2 p-2 rounded-xl border ${themeBorder} ${themeLight} dark:bg-gold/5 text-center`}>
                <p className="text-[10px] text-gray-600 dark:text-gray-400">
                  ⚡ Plus que {3 - selectedItems.length} article{3 - selectedItems.length > 1 ? 's' : ''}
                </p>
              </div>
            )}

            {/* Total et actions */}
            <div className={`border-t pt-3 mt-3 space-y-3 ${
              isDark ? 'border-[#2d3748]' : 'border-gray-200'
            }`}>
              {selectedItems.length >= 3 && (
                <div className={`${themeLight} dark:bg-gold/10 rounded-xl p-2 text-center border ${themeBorder}`}>
                  <p className="text-xs font-semibold text-gold flex items-center justify-center gap-1.5">
                    <Check className="w-4 h-4" />
                    Pack prêt ! {packName || 'Personnalisé'}
                  </p>
                </div>
              )}

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Total</p>
                  <p className="text-xl font-display font-bold text-gray-900 dark:text-white">
                    {totalPrice.toLocaleString()} FCFA
                  </p>
                  <p className="text-[10px] text-gray-400 dark:text-gray-500">
                    {totalItems} articles
                  </p>
                </div>
                <button
                  onClick={createPack}
                  disabled={selectedItems.length < 3}
                  className={`px-5 py-2.5 rounded-xl font-semibold transition-all flex items-center gap-2 text-sm ${
                    selectedItems.length >= 3
                      ? `${themeBg} text-white hover:scale-105 shadow-lg ${themeBg}/30 active:scale-95`
                      : 'bg-gray-200 dark:bg-[#2a2a4a] text-gray-400 dark:text-gray-500 cursor-not-allowed'
                  }`}
                >
                  <ShoppingBag className="w-4 h-4" />
                  Créer le pack
                </button>
              </div>

              <p className="text-[10px] text-gray-400 dark:text-gray-500 text-center">
                {selectedItems.length < 3 
                  ? `💡 Sélectionne ${3 - selectedItems.length} article${3 - selectedItems.length > 1 ? 's' : ''} supplémentaire${3 - selectedItems.length > 1 ? 's' : ''}`
                  : '📦 Pack prêt à être ajouté au panier'
                }
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PackBuilder;