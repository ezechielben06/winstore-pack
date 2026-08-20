// 📄 src/components/Shop/ProductGrid.jsx - Avec squelette
import ProductCard from './ProductCard';

// ✅ Composant Squelette
const ProductCardSkeleton = () => (
  <div className="rounded-xl overflow-hidden border border-gray-200 dark:border-[#2d3748] bg-white dark:bg-[#1a1a2e] animate-pulse">
    <div className="aspect-square bg-gray-200 dark:bg-[#2a2a4a]" />
    <div className="p-2.5 space-y-2">
      <div className="h-3 bg-gray-200 dark:bg-[#2a2a4a] rounded w-3/4" />
      <div className="h-2 bg-gray-200 dark:bg-[#2a2a4a] rounded w-1/2" />
      <div className="h-2 bg-gray-200 dark:bg-[#2a2a4a] rounded w-2/3" />
    </div>
  </div>
);

const ProductGrid = ({ products, isWomen, loading }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-2 gap-1.5">
        {[...Array(6)].map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500 dark:text-gray-400 text-sm">Aucun produit trouvé</p>
      </div>
    );
  }

  const packs = products.filter(p => p.category === 'pack');
  const items = products.filter(p => p.category === 'product');

  const themeColor = isWomen ? 'text-feminine-primary' : 'text-masculine-primary';
  const themeBg = isWomen ? 'bg-feminine-light' : 'bg-masculine-light';

  return (
    <div className="w-full">
      {packs.length > 0 && (
        <div className="mb-3">
          <div className="flex items-center gap-1 mb-1.5">
            <span className="text-[8px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
              Packs
            </span>
            <span className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
            <span className={`text-[7px] ${themeBg} ${themeColor} px-1.5 py-0.5 rounded-full`}>
              {packs.length}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-1.5">
            {packs.map((product) => (
              <div key={product.id}>
                <ProductCard product={product} isWomen={isWomen} />
              </div>
            ))}
          </div>
        </div>
      )}

      {items.length > 0 && (
        <div>
          <div className="flex items-center gap-1 mb-1.5">
            <span className="text-[8px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
              Produits
            </span>
            <span className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
            <span className="text-[7px] bg-blue-50 dark:bg-blue-500/10 text-blue-500 dark:text-blue-400 px-1.5 py-0.5 rounded-full">
              {items.length}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-1.5">
            {items.map((product) => (
              <div key={product.id}>
                <ProductCard product={product} isWomen={isWomen} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductGrid;