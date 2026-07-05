// 📄 src/components/Shop/PackSection.jsx
import { useState } from 'react';  // ✅ AJOUTÉ
import { Package, Sparkles } from 'lucide-react';
import ProductCard from './ProductCard';

const PackSection = ({ packs, products, isWomen }) => {
  const [viewMode, setViewMode] = useState('packs');

  return (
    <div className="mb-12">
      <div className="flex flex-wrap items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-display font-bold flex items-center gap-2">
            <Package className="w-6 h-6 text-gold" />
            Packs & Produits
          </h2>
        </div>

        <div className="flex items-center gap-2 bg-gray-100 rounded-full p-1">
          <button
            onClick={() => setViewMode('packs')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              viewMode === 'packs'
                ? isWomen ? 'bg-feminine-primary text-white' : 'bg-masculine-primary text-white'
                : 'text-gray-600 hover:bg-gray-200'
            }`}
          >
            <Package className="w-4 h-4 inline mr-1" />
            Packs
          </button>
          <button
            onClick={() => setViewMode('products')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              viewMode === 'products'
                ? isWomen ? 'bg-feminine-primary text-white' : 'bg-masculine-primary text-white'
                : 'text-gray-600 hover:bg-gray-200'
            }`}
          >
            <Sparkles className="w-4 h-4 inline mr-1" />
            Produits
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {viewMode === 'packs' 
          ? packs.map(pack => (
              <ProductCard key={pack.id} product={pack} isWomen={isWomen} />
            ))
          : products.filter(p => p.category === 'product').slice(0, 8).map(product => (
              <ProductCard key={product.id} product={product} isWomen={isWomen} />
            ))
        }
      </div>
    </div>
  );
};

export default PackSection;