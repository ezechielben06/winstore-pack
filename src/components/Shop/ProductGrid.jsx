// 📄 src/components/Shop/ProductGrid.jsx - Version Ultra-Compacte
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
    <div className="w-full">
      {/* Packs */}
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
              <ProductCard key={product.id} product={product} isWomen={isWomen} />
            ))}
          </div>
        </div>
      )}

      {/* Produits */}
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
              <ProductCard key={product.id} product={product} isWomen={isWomen} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductGrid;