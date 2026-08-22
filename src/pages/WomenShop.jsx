// 📄 src/pages/WomenShop.jsx - Version corrigée
import { useState, useEffect, useMemo } from 'react';
import { Sparkles, Package, ArrowRight, Grid, List, Search, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import ProductGrid from '../components/Shop/ProductGrid';
import ProductCarousel from '../components/Shop/ProductCarousel';
import FilterBar from '../components/Shop/FilterBar';
import PackSection from '../components/Shop/PackSection';
import CreatePackButton from '../components/Shop/CreatePackButton';
import WomenLogo from '../components/Logo/WomenLogo';
import { womenProducts, womenPacks } from '../data/products';
import { useTheme } from '../context/ThemeContext';
import { supabase } from '../config/supabase';

const WomenShop = () => {
  const { isDark } = useTheme();
  const [category, setCategory] = useState('all');
  const [viewMode, setViewMode] = useState('grid');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showSearch, setShowSearch] = useState(false);

  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .or('id.ilike.w%,id.ilike.p%')
          .order('name');
        
        if (error) throw error;
        
        if (data && data.length > 0) {
          const prods = data.filter(p => p.category === 'product');
          const packs = data.filter(p => p.category === 'pack');
          setProducts({ women: prods, packs: packs });
        } else {
          setProducts({ women: womenProducts, packs: womenPacks });
        }
      } catch (error) {
        console.error('Erreur de chargement:', error);
        setProducts({ women: womenProducts, packs: womenPacks });
      }
      setLoading(false);
    };
    
    loadProducts();
  }, []);

  const allProducts = useMemo(() => [...(products.packs || []), ...(products.women || [])], [products]);

  const filteredProducts = useMemo(() => {
    let results = allProducts;
    
    if (category !== 'all') {
      results = results.filter(p => p.category === category);
    }
    
    if (searchTerm.trim()) {
      const query = searchTerm.toLowerCase().trim();
      results = results.filter(p => 
        p.name.toLowerCase().includes(query) ||
        p.description?.toLowerCase().includes(query) ||
        p.tags?.some(tag => tag.toLowerCase().includes(query)) ||
        p.id?.toLowerCase().includes(query)
      );
    }
    
    return results;
  }, [allProducts, category, searchTerm]);

  const popularPacks = (products.packs || []).filter(p => 
    p.popularity === '🌟' || p.popularity === '⭐'
  );

  const clearSearch = () => {
    setSearchTerm('');
    setShowSearch(false);
  };

  // ✅ Chargement
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-gold border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="mt-3 text-gray-500 dark:text-gray-400">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${
      isDark 
        ? 'bg-[#0d0d1a]' 
        : 'bg-gradient-to-b from-feminine-light/30 to-white'
    }`}>
      {/* Bannière */}
      <div className={`relative overflow-hidden ${
        isDark 
          ? 'bg-gradient-to-r from-[#1a1a3e] to-[#2d1b4e]' 
          : 'bg-gradient-to-r from-feminine-primary via-feminine-secondary to-feminine-light'
      } py-6 md:py-12`}>
        <div className="absolute top-0 right-0 w-32 h-32 md:w-64 md:h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-32 h-32 md:w-64 md:h-64 bg-white/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
        
        <div className="container mx-auto px-4 relative">
          <div className="flex flex-col items-center text-center md:flex-row md:text-left md:items-center gap-4 md:gap-6">
            <div className="flex items-center gap-3">
              <div className={`p-2 md:p-3 rounded-xl md:rounded-2xl ${
                isDark ? 'bg-white/10' : 'bg-white/20 backdrop-blur-sm'
              }`}>
                <WomenLogo className="w-10 h-10 md:w-16 md:h-16" text={false} />
              </div>
              <div>
                <h1 className="text-xl md:text-3xl lg:text-4xl font-display font-bold text-white">
                  Boutique Femme
                </h1>
                <p className="text-xs md:text-sm text-white/80 flex items-center gap-1 md:gap-2">
                  <Sparkles className="w-3 h-3 md:w-4 md:h-4" />
                  Glow, confiance et élégance
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 md:gap-6 bg-white/10 backdrop-blur-sm px-3 py-1.5 md:px-6 md:py-3 rounded-xl md:rounded-2xl">
              <div className="text-center">
                <p className="text-lg md:text-2xl font-bold text-white">{(products.packs || []).length}</p>
                <p className="text-[8px] md:text-xs text-white/70">Packs</p>
              </div>
              <div className="w-px h-6 md:h-10 bg-white/30" />
              <div className="text-center">
                <p className="text-lg md:text-2xl font-bold text-white">{(products.women || []).length}</p>
                <p className="text-[8px] md:text-xs text-white/70">Produits</p>
              </div>
              <div className="w-px h-6 md:h-10 bg-white/30" />
              <div className="text-center">
                <p className="text-lg md:text-2xl font-bold text-white">⭐ 4.9</p>
                <p className="text-[8px] md:text-xs text-white/70">Avis</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-3 md:px-4 py-4 md:py-12">
        <div className="flex flex-wrap items-center justify-between gap-2 md:gap-4 mb-4 md:mb-8">
          <Link 
            to="/" 
            className="text-xs md:text-sm text-gray-500 dark:text-gray-400 hover:text-feminine-primary dark:hover:text-feminine-primary transition-colors flex items-center gap-1"
          >
            <ArrowRight className="w-3 h-3 md:w-4 md:h-4 rotate-180" />
            <span className="hidden xs:inline">Retour</span>
          </Link>
          
          <div className="flex items-center gap-2 md:gap-3">
            <button
              onClick={() => setShowSearch(!showSearch)}
              className={`p-2 rounded-xl border transition-all ${
                showSearch 
                  ? 'border-gold text-gold bg-gold/10' 
                  : 'border-gray-200 dark:border-[#2d3748] text-gray-400 hover:text-gold'
              }`}
            >
              <Search className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-0.5 md:gap-1 bg-gray-100 dark:bg-[#2a2a4a] rounded-lg p-0.5 md:p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 md:p-2 rounded-md transition-all ${
                  viewMode === 'grid'
                    ? 'bg-white dark:bg-[#1a1a35] shadow-md text-feminine-primary dark:text-feminine-primary'
                    : 'text-gray-400 dark:text-gray-500'
                }`}
              >
                <Grid className="w-3.5 h-3.5 md:w-4 md:h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 md:p-2 rounded-md transition-all ${
                  viewMode === 'list'
                    ? 'bg-white dark:bg-[#1a1a35] shadow-md text-feminine-primary dark:text-feminine-primary'
                    : 'text-gray-400 dark:text-gray-500'
                }`}
              >
                <List className="w-3.5 h-3.5 md:w-4 md:h-4" />
              </button>
            </div>
            
            <CreatePackButton products={allProducts} isWomen={true} />
          </div>
        </div>

        {showSearch && (
          <div className="mb-4 animate-fade-in">
            <div className="flex items-center gap-2">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Rechercher un produit..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`w-full pl-9 pr-10 py-2.5 rounded-xl border text-sm ${
                    isDark 
                      ? 'bg-[#2a2a4a] border-[#2d3748] text-white placeholder-gray-400' 
                      : 'bg-white border-gray-200 text-gray-800'
                  } focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none transition-all`}
                  autoFocus
                />
                {searchTerm && (
                  <button
                    onClick={clearSearch}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-200 dark:hover:bg-[#3a3a5a] rounded-full transition-colors"
                  >
                    <X className="w-4 h-4 text-gray-400" />
                  </button>
                )}
              </div>
              <button
                onClick={clearSearch}
                className="px-4 py-2.5 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white transition-colors"
              >
                Annuler
              </button>
            </div>
            {searchTerm && (
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1.5">
                {filteredProducts.length} résultat{filteredProducts.length > 1 ? 's' : ''} pour "{searchTerm}"
              </p>
            )}
          </div>
        )}

        {popularPacks.length > 0 && !searchTerm && (
          <div className="mb-6 md:mb-12">
            <div className="flex items-center gap-2 md:gap-3 mb-2 md:mb-4">
              <span className="text-xl md:text-2xl">🌟</span>
              <h2 className="text-base md:text-2xl font-display font-bold text-gray-800 dark:text-white">
                Packs populaires
              </h2>
              <span className="text-[10px] md:text-sm text-gray-400 dark:text-gray-500">Les plus vendus</span>
            </div>
            <ProductCarousel 
              products={popularPacks} 
              title=""
              isWomen={true}
            />
          </div>
        )}

        {!searchTerm && (
          <PackSection 
            packs={products.packs || []} 
            products={products.women || []} 
            isWomen={true} 
          />
        )}

        <div className="mt-6 md:mt-8">
          <div className="flex items-center gap-2 md:gap-3 mb-3 md:mb-4">
            <Package className="w-4 h-4 md:w-5 md:h-5 text-feminine-primary dark:text-feminine-primary/80" />
            <h2 className="text-base md:text-xl font-display font-bold text-gray-800 dark:text-white">
              {searchTerm ? 'Résultats de recherche' : 'Tous les articles'}
            </h2>
            <span className="text-[10px] md:text-sm text-gray-400 dark:text-gray-500">
              ({filteredProducts.length})
            </span>
          </div>
          
          {!searchTerm && (
            <FilterBar 
              category={category}
              setCategory={setCategory}
              isWomen
            />
          )}
          
          {filteredProducts.length === 0 ? (
            <div className="text-center py-12">
              <Search className="w-12 h-12 mx-auto text-gray-300 dark:text-gray-600 mb-3" />
              <p className="text-gray-500 dark:text-gray-400">Aucun produit trouvé</p>
              <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
                Essayez de modifier votre recherche
              </p>
              <button
                onClick={clearSearch}
                className="mt-3 text-sm text-gold font-medium hover:underline"
              >
                Voir tous les produits
              </button>
            </div>
          ) : (
            // ✅ Passer loading à ProductGrid
            <ProductGrid 
              products={filteredProducts} 
              isWomen={true} 
              loading={loading} 
            />
          )}
        </div>

        <div className={`mt-6 md:mt-12 p-4 md:p-6 rounded-xl md:rounded-2xl text-center border ${
          isDark 
            ? 'bg-[#1a1a35] border-[#2a2a4a]' 
            : 'bg-gradient-to-r from-gold/10 to-feminine-light/30 border-gold/20'
        }`}>
          <div className="flex items-center justify-center gap-1 md:gap-2 mb-1 md:mb-2">
            <WomenLogo className="w-5 h-5 md:w-8 md:h-8" text={false} />
            <span className="text-gold font-bold text-xs md:text-base">✨</span>
          </div>
          <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400">
            💡 <span className="font-semibold">Astuce :</span> Crée ton pack personnalisé 
            en sélectionnant <span className="font-semibold text-feminine-primary dark:text-feminine-primary/80">3 articles ou plus</span> 
            <br className="hidden xs:block" />
            et bénéficie d'un prix avantageux !
          </p>
        </div>
      </div>
    </div>
  );
};

export default WomenShop;