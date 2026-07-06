// 📄 src/components/Shop/ProductGrid.jsx - Version mobile robuste
import ProductCard from './ProductCard';

const ProductGrid = ({ products, isWomen }) => {
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
    <div className="w-full overflow-hidden">
      {/* Packs */}
      {packs.length > 0 && (
        <div className="mb-4">
          <h3 className="text-[10px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-2">
            <span className="w-4 h-px bg-gray-300 dark:bg-gray-600" />
            Packs
            <span className="w-4 h-px bg-gray-300 dark:bg-gray-600" />
            <span className={`text-[8px] ${themeBg} ${themeColor} px-1.5 py-0.5 rounded-full`}>
              {packs.length}
            </span>
          </h3>
          <div className="grid grid-cols-2 gap-2 sm:gap-3">
            {packs.map((product) => (
              <div key={product.id}>
                <ProductCard product={product} isWomen={isWomen} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Produits */}
      {items.length > 0 && (
        <div>
          <h3 className="text-[10px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-2">
            <span className="w-4 h-px bg-gray-300 dark:bg-gray-600" />
            Produits
            <span className="w-4 h-px bg-gray-300 dark:bg-gray-600" />
            <span className="text-[8px] bg-blue-50 dark:bg-blue-500/10 text-blue-500 dark:text-blue-400 px-1.5 py-0.5 rounded-full">
              {items.length}
            </span>
          </h3>
          <div className="grid grid-cols-2 gap-2 sm:gap-3">
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