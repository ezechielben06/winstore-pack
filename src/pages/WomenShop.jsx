// 📄 src/pages/WomenShop.jsx - Version simplifiée mobile
import { useState, useMemo } from 'react';
import { Sparkles, Package, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import ProductGrid from '../components/Shop/ProductGrid';
import FilterBar from '../components/Shop/FilterBar';
import CreatePackButton from '../components/Shop/CreatePackButton';
import SearchBar from '../components/Shop/SearchBar';
import WomenLogo from '../components/Logo/WomenLogo';
import { womenProducts, womenPacks } from '../data/products';
import { useTheme } from '../context/ThemeContext';

const WomenShop = () => {
  const { isDark } = useTheme();
  const [category, setCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const allProducts = [...womenPacks, ...womenProducts];

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
        p.tags?.some(tag => tag.toLowerCase().includes(query))
      );
    }
    return results;
  }, [allProducts, category, searchQuery]);

  return (
    <div className={`min-h-screen ${isDark ? 'bg-[#0d0d1a]' : 'bg-white'}`}>
      {/* Bannière - Compacte */}
      <div className={`px-4 py-3 ${isDark ? 'bg-[#1a1a3e]' : 'bg-feminine-primary'}`}>
        <div className="flex items-center gap-3">
          <WomenLogo className="w-8 h-8" text={false} />
          <div>
            <h1 className="text-lg font-display font-bold text-white">Boutique Femme</h1>
            <p className="text-[10px] text-white/80">Glow, confiance et élégance</p>
          </div>
          <div className="ml-auto flex items-center gap-2 text-white/80 text-[10px]">
            <span>{womenPacks.length} packs</span>
            <span className="w-px h-4 bg-white/30" />
            <span>{womenProducts.length} produits</span>
          </div>
        </div>
      </div>

      <div className="px-3 py-3">
        {/* Retour + Création */}
        <div className="flex items-center justify-between mb-3">
          <Link to="/" className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
            <ArrowRight className="w-3 h-3 rotate-180" />
            Retour
          </Link>
          <CreatePackButton products={allProducts} isWomen={true} />
        </div>

        {/* Recherche */}
        <div className="mb-3">
          <SearchBar 
            onSearch={setSearchQuery}
            placeholder="Rechercher..."
          />
        </div>

        {/* Filtres */}
        <FilterBar category={category} setCategory={setCategory} isWomen />

        {/* Résultats */}
        <div className="mt-3">
          <div className="flex items-center gap-2 mb-2">
            <Package className="w-4 h-4 text-feminine-primary" />
            <h2 className="text-sm font-display font-bold text-gray-800 dark:text-white">
              {searchQuery ? 'Résultats' : 'Tous les articles'}
            </h2>
            <span className="text-[10px] text-gray-400">({filtered.length})</span>
          </div>
          <ProductGrid products={filtered} isWomen />
        </div>
      </div>
    </div>
  );
};

export default WomenShop;