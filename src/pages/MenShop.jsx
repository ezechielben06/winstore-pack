// 📄 src/pages/MenShop.jsx - Avec recherche
import { useState, useMemo } from 'react';
import { Sparkles, Package, ArrowRight, Crown, Grid, List } from 'lucide-react';
import { Link } from 'react-router-dom';
import ProductGrid from '../components/Shop/ProductGrid';
import ProductCarousel from '../components/Shop/ProductCarousel';
import FilterBar from '../components/Shop/FilterBar';
import PackSection from '../components/Shop/PackSection';
import CreatePackButton from '../components/Shop/CreatePackButton';
import SearchBar from '../components/Shop/SearchBar';
import MenLogo from '../components/Logo/MenLogo';
import { menProducts, menPacks } from '../data/products';
import { useTheme } from '../context/ThemeContext';

const MenShop = () => {
  const { isDark } = useTheme();
  const [category, setCategory] = useState('all');
  const [viewMode, setViewMode] = useState('grid');
  const [searchQuery, setSearchQuery] = useState('');

  const allProducts = [...menPacks, ...menProducts];

  // ✅ Filtrage par recherche et catégorie
  const filtered = useMemo(() => {
    let results = allProducts;

    if (category !== 'all') {
      results = results.filter(p => p.category === category);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      results = results.filter(p => 
        p.name.toLowerCase().includes(query) ||
        p.description?.toLowerCase().includes(query) ||
        p.tags?.some(tag => tag.toLowerCase().includes(query)) ||
        p.category?.toLowerCase().includes(query)
      );
    }

    return results;
  }, [allProducts, category, searchQuery]);

  const popularPacks = menPacks.filter(p => p.popularity === '🌟' || p.popularity === '⭐' || p.popularity === '🔥');

  return (
    <div className={`min-h-screen ${
      isDark 
        ? 'bg-[#0d0d1a]' 
        : 'bg-gradient-to-b from-masculine-light/30 to-white'
    }`}>
      {/* Bannière */}
      <div className={`relative overflow-hidden ${
        isDark 
          ? 'bg-gradient-to-r from-[#1a1a3e] to-[#1a237e]' 
          : 'bg-gradient-to-r from-masculine-primary via-masculine-secondary to-masculine-light'
      } py-6 md:py-8`}>
        <div className="absolute top-0 right-0 w-32 h-32 md:w-64 md:h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-32 h-32 md:w-64 md:h-64 bg-white/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
        
        <div className="container mx-auto px-4 relative">
          <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-6">
            <div className="flex items-center gap-3">
              <div className={`p-2 md:p-3 rounded-xl md:rounded-2xl ${
                isDark ? 'bg-white/10' : 'bg-white/20 backdrop-blur-sm'
              }`}>
                <MenLogo className="w-10 h-10 md:w-14 md:h-14" text={false} />
              </div>
              <div>
                <h1 className="text-xl md:text-3xl font-display font-bold text-white">
                  Boutique Homme
                </h1>
                <p className="text-xs md:text-sm text-white/80 flex items-center gap-1 md:gap-2">
                  <Crown className="w-3 h-3 md:w-4 md:h-4" />
                  Style, assurance et charisme
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 md:gap-6 bg-white/10 backdrop-blur-sm px-3 py-1.5 md:px-6 md:py-3 rounded-xl md:rounded-2xl ml-auto">
              <div className="text-center">
                <p className="text-lg md:text-2xl font-bold text-white">{menPacks.length}</p>
                <p className="text-[8px] md:text-xs text-white/70">Packs</p>
              </div>
              <div className="w-px h-6 md:h-10 bg-white/30" />
              <div className="text-center">
                <p className="text-lg md:text-2xl font-bold text-white">{menProducts.length}</p>
                <p className="text-[8px] md:text-xs text-white/70">Produits</p>
              </div>
              <div className="w-px h-6 md:h-10 bg-white/30" />
              <div className="text-center">
                <p className="text-lg md:text-2xl font-bold text-white">⭐ 4.8</p>
                <p className="text-[8px] md:text-xs text-white/70">Avis</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-3 md:px-4 py-4 md:py-8">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4 md:mb-6">
          <Link 
            to="/" 
            className="text-xs md:text-sm text-gray-500 dark:text-gray-400 hover:text-masculine-primary dark:hover:text-masculine-primary transition-colors flex items-center gap-1"
          >
            <ArrowRight className="w-3 h-3 md:w-4 md:h-4 rotate-180" />
            <span className="hidden xs:inline">Retour</span>
          </Link>
          
          <div className="flex items-center gap-2 md:gap-3">
            <div className="flex items-center gap-0.5 md:gap-1 bg-gray-100 dark:bg-[#2a2a4a] rounded-lg p-0.5 md:p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 md:p-2 rounded-md transition-all ${
                  viewMode === 'grid'
                    ? 'bg-white dark:bg-[#1a1a35] shadow-md text-masculine-primary dark:text-masculine-primary'
                    : 'text-gray-400 dark:text-gray-500'
                }`}
              >
                <Grid className="w-3.5 h-3.5 md:w-4 md:h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 md:p-2 rounded-md transition-all ${
                  viewMode === 'list'
                    ? 'bg-white dark:bg-[#1a1a35] shadow-md text-masculine-primary dark:text-masculine-primary'
                    : 'text-gray-400 dark:text-gray-500'
                }`}
              >
                <List className="w-3.5 h-3.5 md:w-4 md:h-4" />
              </button>
            </div>
            
            <CreatePackButton products={allProducts} isWomen={false} />
          </div>
        </div>

        {/* ✅ BARRE DE RECHERCHE */}
        <div className="mb-4 md:mb-6">
          <SearchBar 
            onSearch={setSearchQuery}
            placeholder="Rechercher un produit, un pack homme..."
          />
        </div>

        {!searchQuery && popularPacks.length > 0 && (
          <div className="mb-6 md:mb-10">
            <div className="flex items-center gap-2 md:gap-3 mb-2 md:mb-4">
              <span className="text-xl md:text-2xl">🔥</span>
              <h2 className="text-base md:text-2xl font-display font-bold text-gray-800 dark:text-white">
                Packs populaires
              </h2>
              <span className="text-[10px] md:text-sm text-gray-400 dark:text-gray-500">Les plus vendus</span>
            </div>
            <ProductCarousel 
              products={popularPacks} 
              title=""
              isWomen={false}
            />
          </div>
        )}

        {!searchQuery && (
          <PackSection 
            packs={menPacks} 
            products={menProducts} 
            isWomen={false}
          />
        )}

        <div className="mt-4 md:mt-6">
          <div className="flex items-center gap-2 md:gap-3 mb-3 md:mb-4">
            <Package className="w-4 h-4 md:w-5 md:h-5 text-masculine-primary dark:text-masculine-primary/80" />
            <h2 className="text-base md:text-xl font-display font-bold text-gray-800 dark:text-white">
              {searchQuery ? 'Résultats de recherche' : 'Tous les articles'}
            </h2>
            <span className="text-[10px] md:text-sm text-gray-400 dark:text-gray-500">
              ({filtered.length})
            </span>
          </div>
          
          <FilterBar 
            category={category}
            setCategory={setCategory}
            isWomen={false}
          />
          
          <ProductGrid products={filtered} isWomen={false} />
          
          {filtered.length === 0 && (
            <div className="text-center py-12">
              <div className="text-4xl mb-4">🔍</div>
              <p className="text-gray-500 dark:text-gray-400">
                Aucun résultat pour "<span className="font-semibold text-gray-800 dark:text-white">{searchQuery}</span>"
              </p>
              <button 
                onClick={() => setSearchQuery('')}
                className="mt-2 text-sm text-masculine-primary hover:underline"
              >
                Effacer la recherche
              </button>
            </div>
          )}
        </div>

        <div className={`mt-6 md:mt-10 p-4 md:p-6 rounded-xl md:rounded-2xl text-center border ${
          isDark 
            ? 'bg-[#1a1a35] border-[#2a2a4a]' 
            : 'bg-gradient-to-r from-gold/10 to-masculine-light/30 border-gold/20'
        }`}>
          <div className="flex items-center justify-center gap-1 md:gap-2 mb-1 md:mb-2">
            <MenLogo className="w-5 h-5 md:w-8 md:h-8" text={false} />
            <span className="text-gold font-bold text-xs md:text-base">⚡</span>
          </div>
          <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400">
            💡 <span className="font-semibold">Astuce :</span> Crée ton pack personnalisé 
            en sélectionnant <span className="font-semibold text-masculine-primary dark:text-masculine-primary/80">3 articles ou plus</span> 
            <br className="hidden xs:block" />
            et bénéficie d'un prix avantageux !
          </p>
        </div>
      </div>
    </div>
  );
};

export default MenShop;