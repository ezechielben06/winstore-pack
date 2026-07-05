// 📄 src/components/Shop/ProductGrid.jsx - Amélioré
import ProductCard from './ProductCard';

const ProductGrid = ({ products, isWomen }) => {
  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Aucun produit trouvé</p>
      </div>
    );
  }

  // Séparer packs et produits
  const packs = products.filter(p => p.category === 'pack');
  const items = products.filter(p => p.category === 'product');

  return (
    <div>
      {/* Packs */}
      {packs.length > 0 && (
        <div className="mb-8">
          <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
            <span className="w-8 h-px bg-gray-300" />
            Packs
            <span className="w-8 h-px bg-gray-300" />
            <span className="text-xs bg-feminine-light text-feminine-primary px-2 py-0.5 rounded-full">
              {packs.length}
            </span>
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {packs.map((product) => (
              <div key={product.id} className="relative">
                <div className="absolute -top-2 -left-2 z-10">
                  <span className="bg-gold text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
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
          <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
            <span className="w-8 h-px bg-gray-300" />
            Produits à l'unité
            <span className="w-8 h-px bg-gray-300" />
            <span className="text-xs bg-blue-50 text-blue-500 px-2 py-0.5 rounded-full">
              {items.length}
            </span>
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
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