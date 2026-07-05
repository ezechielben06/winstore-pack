// 📄 src/pages/WomenShop.jsx - Version améliorée
import { useState } from 'react';
import { Sparkles, Package, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import ProductGrid from '../components/Shop/ProductGrid';
import ProductCarousel from '../components/Shop/ProductCarousel';
import FilterBar from '../components/Shop/FilterBar';
import PackSection from '../components/Shop/PackSection';
import CreatePackButton from '../components/Shop/CreatePackButton';
import WomenLogo from '../components/Logo/WomenLogo';
import { womenProducts, womenPacks } from '../data/products';

const WomenShop = () => {
  const [category, setCategory] = useState('all');

  const allProducts = [...womenPacks, ...womenProducts];
  const filtered = allProducts.filter(p => {
    if (category === 'all') return true;
    return p.category === category;
  });

  const popularPacks = womenPacks.filter(p => p.popularity === '🌟' || p.popularity === '⭐');

  return (
    <div className="min-h-screen bg-gradient-to-b from-feminine-light/30 to-white">
      {/* Bannière avec logo */}
      <div className="relative bg-gradient-to-r from-feminine-primary via-feminine-secondary to-feminine-light py-12 overflow-hidden">
        {/* Décoration */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
        
        <div className="container mx-auto px-4 relative">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Logo et titre */}
            <div className="flex items-center gap-4">
              <div className="bg-white/20 backdrop-blur-sm p-3 rounded-2xl">
                <WomenLogo className="w-16 h-16" text={false} />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-display font-bold text-white">
                  Boutique Femme
                </h1>
                <p className="text-white/80 text-sm flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  Glow, confiance et élégance à chaque pack
                </p>
              </div>
            </div>

            {/* Statistiques */}
            <div className="flex items-center gap-6 bg-white/20 backdrop-blur-sm px-6 py-3 rounded-2xl">
              <div className="text-center">
                <p className="text-2xl font-bold text-white">{womenPacks.length}</p>
                <p className="text-xs text-white/70">Packs</p>
              </div>
              <div className="w-px h-10 bg-white/30" />
              <div className="text-center">
                <p className="text-2xl font-bold text-white">{womenProducts.length}</p>
                <p className="text-xs text-white/70">Produits</p>
              </div>
              <div className="w-px h-10 bg-white/30" />
              <div className="text-center">
                <p className="text-2xl font-bold text-white">⭐ 4.9</p>
                <p className="text-xs text-white/70">Avis clients</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Actions rapides */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <Link 
              to="/" 
              className="text-sm text-gray-500 hover:text-feminine-primary transition-colors flex items-center gap-1"
            >
              <ArrowRight className="w-4 h-4 rotate-180" />
              Retour à l'accueil
            </Link>
          </div>
          <CreatePackButton products={allProducts} isWomen={true} />
        </div>

        {/* Carousel Packs populaires */}
        {popularPacks.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-2xl">🌟</span>
              <h2 className="text-2xl font-display font-bold text-gray-800">Packs populaires</h2>
              <span className="text-sm text-gray-400">Les plus vendus</span>
            </div>
            <ProductCarousel 
              products={popularPacks} 
              title=""
              isWomen={true}
            />
          </div>
        )}

        {/* Section Packs & Produits */}
        <PackSection 
          packs={womenPacks} 
          products={womenProducts} 
          isWomen={true} 
        />

        {/* Filtres et grille */}
        <div className="mt-8">
          <div className="flex items-center gap-3 mb-4">
            <Package className="w-5 h-5 text-feminine-primary" />
            <h2 className="text-xl font-display font-bold text-gray-800">Tous les articles</h2>
            <span className="text-sm text-gray-400">({allProducts.length})</span>
          </div>
          <FilterBar 
            category={category}
            setCategory={setCategory}
            isWomen
          />
          <ProductGrid products={filtered} isWomen />
        </div>

        {/* Footer info */}
        <div className="mt-12 p-6 bg-gradient-to-r from-gold/10 to-feminine-light/30 rounded-2xl text-center border border-gold/20">
          <div className="flex items-center justify-center gap-2 mb-2">
            <WomenLogo className="w-8 h-8" text={false} />
            <span className="text-gold font-bold">✨</span>
          </div>
          <p className="text-gray-600">
            💡 <span className="font-semibold">Astuce :</span> Crée ton pack personnalisé 
            en sélectionnant <span className="font-semibold text-feminine-primary">3 articles ou plus</span> 
            et bénéficie d'un prix avantageux !
          </p>
        </div>
      </div>
    </div>
  );
};

export default WomenShop;