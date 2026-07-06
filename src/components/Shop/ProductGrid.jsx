// 📄 src/components/Shop/ProductGrid.jsx - Mobile First
import ProductCard from './ProductCard';

const ProductGrid = ({ products, isWomen }) => {
  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 dark:text-gray-400">Aucun produit trouvé</p>
      </div>
    );
  }

  const packs = products.filter(p => p.category === 'pack');
  const items = products.filter(p => p.category === 'product');

  const themeColor = isWomen ? 'text-feminine-primary' : 'text-masculine-primary';
  const themeBg = isWomen ? 'bg-feminine-light' : 'bg-masculine-light';

  return (
    <div>
      {/* Packs */}
      {packs.length > 0 && (
        <div className="mb-6 md:mb-8">
          <h3 className="text-xs md:text-sm font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-3 md:mb-4 flex items-center gap-2">
            <span className="w-6 md:w-8 h-px bg-gray-300 dark:bg-gray-600" />
            Packs
            <span className="w-6 md:w-8 h-px bg-gray-300 dark:bg-gray-600" />
            <span className={`text-[10px] md:text-xs ${themeBg} ${themeColor} px-1.5 md:px-2 py-0.5 rounded-full`}>
              {packs.length}
            </span>
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4 lg:gap-6">
            {packs.map((product) => (
              <div key={product.id} className="relative">
                <div className="absolute -top-1 -left-1 z-10">
                  <span className="bg-gold text-white text-[8px] md:text-[10px] font-bold px-1.5 md:px-2 py-0.5 rounded-full">
                    PACK
                  </span>
                </div>
                <ProductCard product={product} isWomen={isWomen} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Produits */}
      {items.length > 0 && (
        <div>
          <h3 className="text-xs md:text-sm font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-3 md:mb-4 flex items-center gap-2">
            <span className="w-6 md:w-8 h-px bg-gray-300 dark:bg-gray-600" />
            Produits à l'unité
            <span className="w-6 md:w-8 h-px bg-gray-300 dark:bg-gray-600" />
            <span className="text-[10px] md:text-xs bg-blue-50 dark:bg-blue-500/10 text-blue-500 dark:text-blue-400 px-1.5 md:px-2 py-0.5 rounded-full">
              {items.length}
            </span>
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4 lg:gap-6">
            {items.map((product) => (
              <ProductCard key={product.id} product={product} isWomen={isWomen} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductGrid;