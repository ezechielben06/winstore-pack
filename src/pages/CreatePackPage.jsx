// 📄 src/pages/CreatePackPage.jsx - Design harmonisé
import { useState, useMemo } from 'react';
import { 
  ArrowLeft, Package, Search, 
  Sparkles, Crown, Check, Minus, Plus, 
  Trash2, Gift, Wand2, Lightbulb,
  ShoppingBag, Filter, ChevronDown
} from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';
import { allProducts } from '../data/products';

const CreatePackPage = () => {
  const { addToCart } = useCart();
  const { isDark } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  
  const isWomen = location.state?.from === 'femme' || false;
  const returnPath = location.state?.returnPath || (isWomen ? '/femme' : '/homme');
  
  const [selectedItems, setSelectedItems] = useState([]);
  const [packName, setPackName] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // ✅ Thème
  const theme = isWomen ? 'feminine' : 'masculine';
  const themeColor = isWomen ? 'text-feminine-primary' : 'text-masculine-primary';
  const themeBg = isWomen ? 'bg-feminine-primary' : 'bg-masculine-primary';
  const themeLight = isWomen ? 'bg-feminine-light' : 'bg-masculine-light';
  const themeBorder = isWomen ? 'border-feminine-primary/20' : 'border-masculine-primary/20';
  const themeGradient = isWomen 
    ? 'from-feminine-primary to-feminine-secondary' 
    : 'from-masculine-primary to-masculine-secondary';
  const themeBgGradient = isWomen 
    ? 'bg-gradient-to-b from-feminine-light/30 to-white' 
    : 'bg-gradient-to-b from-masculine-light/30 to-white';

  // ✅ Produits disponibles
  const availableProducts = useMemo(() => {
    const data = isWomen ? allProducts.women : allProducts.men;
    return data.filter(p => p.category === 'product');
  }, [isWomen]);

  // ✅ Catégories
  const categories = useMemo(() => {
    const allTags = availableProducts.flatMap(p => p.tags || []);
    return ['all', ...new Set(allTags)];
  }, [availableProducts]);

  // ✅ Suggestions
  const suggestions = useMemo(() => {
    const grouped = {};
    availableProducts.forEach(p => {
      (p.tags || []).forEach(tag => {
        if (!grouped[tag]) grouped[tag] = [];
        grouped[tag].push(p);
      });
    });
    return {
      categories: Object.keys(grouped).slice(0, 6),
      popular: availableProducts.filter(p => p.popularity).slice(0, 6),
    };
  }, [availableProducts]);

  // ✅ Filtrage
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
    if (selectedItems.length === 0) {
      setShowSuggestions(false);
    }
  };

  const removeItem = (productId) => {
    setSelectedItems(selectedItems.filter(item => item.id !== productId));
    if (selectedItems.length === 1) {
      setShowSuggestions(true);
    }
  };

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

  const totalPrice = selectedItems.reduce((sum, item) => {
    const price = item.price || parseInt(item.priceRange?.split('-')[0]) || 0;
    return sum + (price * (item.quantity || 1));
  }, 0);

  const totalItems = selectedItems.reduce((sum, item) => sum + (item.quantity || 1), 0);

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
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      navigate(returnPath);
    }, 2500);
  };

  const reset = () => {
    setSelectedItems([]);
    setPackName('');
    setSearchTerm('');
    setSelectedCategory('all');
    setShowSuggestions(true);
  };

  const getProductPrice = (product) => {
    return product.price || parseInt(product.priceRange?.split('-')[0]) || 0;
  };

  return (
    <div className={`min-h-screen ${isDark ? 'bg-[#0d0d1a]' : themeBgGradient}`}>
      {/* ===== BANNIÈRE ===== */}
      <div className={`relative overflow-hidden ${isDark ? 'bg-[#1a1a2e]' : themeBg} py-4 md:py-6`}>
        <div className="absolute top-0 right-0 w-32 h-32 md:w-64 md:h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-32 h-32 md:w-64 md:h-64 bg-white/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
        
        <div className="container mx-auto px-4 relative">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-xl bg-white/20 backdrop-blur-sm`}>
                <Wand2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-lg md:text-2xl font-display font-bold text-white">
                  Crée ton pack personnalisé
                </h1>
                <p className="text-xs md:text-sm text-white/80">
                  {isWomen ? '👩 Boutique Femme' : '👨 Boutique Homme'}
                </p>
              </div>
            </div>
            
            <button 
              onClick={() => navigate(returnPath)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition-colors text-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              Retour
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 max-w-7xl">
        {/* ===== BARRE DE PROGRESSION ===== */}
        <div className="max-w-2xl mx-auto mb-6">
          <div className="flex items-center gap-4">
            <div className="flex-1 h-2 rounded-full bg-gray-200 dark:bg-[#2a2a4a] overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-gold to-yellow-400 transition-all duration-500"
                style={{ 
                  width: `${Math.min((selectedItems.length / 3) * 100, 100)}%` 
                }}
              />
            </div>
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400 whitespace-nowrap">
              {selectedItems.length < 3 ? `${selectedItems.length}/3` : '✅ Complet'}
            </span>
          </div>
          
          <div className="text-center mt-2">
            {selectedItems.length === 0 && (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                💡 Sélectionne au moins 3 articles pour créer ton pack
              </p>
            )}
            {selectedItems.length > 0 && selectedItems.length < 3 && (
              <p className="text-sm text-blue-500 dark:text-blue-400">
                ⚡ Encore {3 - selectedItems.length} article{3 - selectedItems.length > 1 ? 's' : ''} pour valider ton pack
              </p>
            )}
            {selectedItems.length >= 3 && (
              <p className="text-sm text-green-500 dark:text-green-400 flex items-center justify-center gap-1.5">
                <Check className="w-4 h-4" />
                Pack prêt à être créé ! {packName && `"${packName}"`}
              </p>
            )}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* ===== COLONNE GAUCHE : Sélection ===== */}
          <div className="lg:col-span-2">
            <div className={`rounded-2xl ${isDark ? 'bg-[#1a1a2e]' : 'bg-white'} shadow-sm border ${isDark ? 'border-[#2d3748]' : 'border-gray-200'} p-4`}>
              {/* Suggestions */}
              {showSuggestions && selectedItems.length === 0 && (
                <div className="mb-4 p-4 rounded-xl bg-gradient-to-r from-gold/10 to-${theme}-light/30 border border-gold/20">
                  <div className="flex items-center gap-2 mb-3">
                    <Lightbulb className="w-5 h-5 text-gold" />
                    <span className="font-semibold text-gray-700 dark:text-gray-300">
                      Besoin d'inspiration ?
                    </span>
                  </div>
                  
                  <div className="mb-3">
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1.5">Catégories populaires :</p>
                    <div className="flex flex-wrap gap-1.5">
                      {suggestions.categories.map(cat => (
                        <button
                          key={cat}
                          onClick={() => setSelectedCategory(cat)}
                          className="px-3 py-1 rounded-full text-xs bg-white dark:bg-[#2a2a4a] border border-gray-200 dark:border-[#2d3748] hover:border-gold transition-colors"
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1.5">Articles populaires :</p>
                    <div className="flex flex-wrap gap-1.5">
                      {suggestions.popular.map(p => (
                        <button
                          key={p.id}
                          onClick={() => addItem(p)}
                          className="px-3 py-1 rounded-full text-xs bg-gold/10 text-gold border border-gold/20 hover:bg-gold/20 transition-colors"
                        >
                          {p.emoji} {p.name}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Recherche et filtres */}
              <div className="flex flex-col gap-3 mb-4">
                <div className="flex items-center gap-2">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Rechercher un produit..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className={`w-full pl-9 pr-4 py-2.5 rounded-xl border text-sm ${
                        isDark 
                          ? 'bg-[#2a2a4a] border-[#2d3748] text-white placeholder-gray-400' 
                          : 'bg-gray-50 border-gray-200 text-gray-800'
                      } focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none transition-all`}
                    />
                  </div>
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className={`p-2.5 rounded-xl border transition-all ${
                      showFilters 
                        ? `border-gold text-gold ${isDark ? 'bg-gold/10' : 'bg-gold/5'}`
                        : `border-gray-200 dark:border-[#2d3748] text-gray-400`
                    }`}
                  >
                    <Filter className="w-4 h-4" />
                  </button>
                </div>

                {showFilters && (
                  <div className="flex flex-wrap gap-1.5 p-2 rounded-xl bg-gray-50 dark:bg-[#1a1a2e]">
                    {categories.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
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
              <div className="max-h-[500px] overflow-y-auto">
                {filteredProducts.length === 0 ? (
                  <div className="text-center py-12">
                    <Search className="w-12 h-12 mx-auto text-gray-300 dark:text-gray-600 mb-3" />
                    <p className="text-gray-500 dark:text-gray-400">Aucun produit trouvé</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {filteredProducts.map((product) => {
                      const isSelected = selectedItems.some(item => item.id === product.id);
                      const price = getProductPrice(product);

                      return (
                        <button
                          key={product.id}
                          onClick={() => addItem(product)}
                          className={`p-3 rounded-xl border-2 transition-all text-left ${
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
                            </div>
                          </div>
                          {isSelected && (
                            <div className="mt-1 text-[10px] text-gold font-medium">
                              ✓ Sélectionné
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ===== COLONNE DROITE : Récapitulatif ===== */}
          <div className="lg:col-span-1">
            <div className={`sticky top-24 rounded-2xl ${isDark ? 'bg-[#1a1a2e]' : 'bg-white'} shadow-sm border ${isDark ? 'border-[#2d3748]' : 'border-gray-200'} p-4`}>
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
                className={`w-full px-3 py-2 rounded-xl border text-sm mb-3 ${
                  isDark 
                    ? 'bg-[#2a2a4a] border-[#2d3748] text-white placeholder-gray-400' 
                    : 'bg-gray-50 border-gray-200 text-gray-800'
                } focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none transition-all`}
              />

              {/* Articles sélectionnés */}
              <div className="max-h-[300px] overflow-y-auto space-y-1.5">
                {selectedItems.length === 0 ? (
                  <div className="text-center py-8">
                    <Package className="w-10 h-10 mx-auto text-gray-300 dark:text-gray-600 mb-2" />
                    <p className="text-xs text-gray-400 dark:text-gray-500">Aucun article</p>
                  </div>
                ) : (
                  selectedItems.map((item) => {
                    const price = getProductPrice(item);
                    const quantity = item.quantity || 1;
                    const total = price * quantity;

                    return (
                      <div key={item.id} className={`flex items-center gap-2 p-2 rounded-xl ${
                        isDark ? 'bg-[#1a1a2e]' : 'bg-gray-50'
                      }`}>
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
                            className="w-5 h-5 rounded-full bg-gray-200 dark:bg-[#2a2a4a] flex items-center justify-center hover:bg-gray-300 transition-colors"
                          >
                            <Minus className="w-3 h-3 text-gray-600 dark:text-gray-400" />
                          </button>
                          <span className="w-5 text-center text-xs font-medium">{quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, 1)}
                            className="w-5 h-5 rounded-full bg-gray-200 dark:bg-[#2a2a4a] flex items-center justify-center hover:bg-gray-300 transition-colors"
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

              {/* Total */}
              <div className={`border-t ${isDark ? 'border-[#2d3748]' : 'border-gray-200'} pt-3 mt-3`}>
                <div className="flex justify-between items-center mb-3">
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Total</p>
                    <p className="text-xl font-display font-bold text-gray-900 dark:text-white">
                      {totalPrice.toLocaleString()} FCFA
                    </p>
                  </div>
                  <button
                    onClick={createPack}
                    disabled={selectedItems.length < 3}
                    className={`px-5 py-2.5 rounded-xl font-semibold transition-all flex items-center gap-2 text-sm ${
                      selectedItems.length >= 3
                        ? `bg-gradient-to-r ${themeGradient} text-white hover:scale-105 shadow-lg shadow-${theme}-primary/30 active:scale-95`
                        : 'bg-gray-200 dark:bg-[#2a2a4a] text-gray-400 dark:text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    <ShoppingBag className="w-4 h-4" />
                    Créer
                  </button>
                </div>

                <p className="text-[10px] text-gray-400 dark:text-gray-500 text-center">
                  {selectedItems.length < 3 
                    ? `💡 ${3 - selectedItems.length} article${3 - selectedItems.length > 1 ? 's' : ''} requis`
                    : '✅ Pack prêt'
                  }
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ✅ Notification de succès */}
      {showSuccess && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-green-500 text-white px-6 py-3 rounded-xl shadow-2xl animate-bounce-in flex items-center gap-3">
          <Check className="w-5 h-5" />
          Pack créé avec succès ! 🎉
        </div>
      )}
    </div>
  );
};

export default CreatePackPage;