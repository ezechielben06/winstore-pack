// 📄 src/components/Shop/PackBuilder.jsx
import { useState } from 'react';  // ✅ AJOUTÉ
import { X, Plus, ShoppingBag, Trash2, Package } from 'lucide-react';
import { useCart } from '../../context/CartContext';

const PackBuilder = ({ isOpen, onClose, products, isWomen }) => {
  const { addToCart } = useCart();
  const [selectedItems, setSelectedItems] = useState([]);
  const [packName, setPackName] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const theme = isWomen ? 'feminine' : 'masculine';
  const themeBg = isWomen ? 'bg-feminine-primary' : 'bg-masculine-primary';

  const availableProducts = products.filter(p => p.category === 'product');

  const filteredProducts = availableProducts.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const addItem = (product) => {
    if (selectedItems.find(item => item.id === product.id)) return;
    setSelectedItems([...selectedItems, product]);
  };

  const removeItem = (productId) => {
    setSelectedItems(selectedItems.filter(item => item.id !== productId));
  };

  const totalPrice = selectedItems.reduce((sum, item) => {
    const price = item.price || parseInt(item.priceRange?.split('-')[0]) || 0;
    return sum + price;
  }, 0);

  const createPack = () => {
    if (selectedItems.length < 3) {
      alert('Un pack doit contenir au moins 3 articles !');
      return;
    }

    const pack = {
      id: `custom-${Date.now()}`,
      name: packName || 'Pack Personnalisé',
      category: 'pack',
      price: totalPrice,
      description: `Pack composé de ${selectedItems.length} articles`,
      items: selectedItems.map(item => item.name),
      emoji: '🎨',
      isCustom: true,
    };

    addToCart(pack);
    onClose();
    setSelectedItems([]);
    setPackName('');
  };

  const reset = () => {
    setSelectedItems([]);
    setPackName('');
    setSearchTerm('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-6xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gradient-to-r from-gold/5 to-feminine-light/30">
          <div>
            <h2 className="text-2xl font-display font-bold flex items-center gap-2">
              <Package className="w-6 h-6 text-gold" />
              Crée ton pack personnalisé
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Sélectionne au moins 3 articles pour composer ton pack unique
            </p>
          </div>
          <button
            onClick={() => { onClose(); reset(); }}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex flex-col lg:flex-row h-[calc(90vh-120px)]">
          {/* Panel gauche */}
          <div className="flex-1 p-6 overflow-y-auto border-r border-gray-100">
            <input
              type="text"
              placeholder="🔍 Rechercher un produit..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 rounded-full border border-gray-200 focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none transition-all mb-4"
            />

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {filteredProducts.map((product) => {
                const isSelected = selectedItems.some(item => item.id === product.id);
                const price = product.price || parseInt(product.priceRange?.split('-')[0]) || 0;

                return (
                  <button
                    key={product.id}
                    onClick={() => addItem(product)}
                    disabled={isSelected}
                    className={`relative p-3 rounded-xl border-2 transition-all text-left ${
                      isSelected 
                        ? 'border-gold bg-gold/5 cursor-not-allowed opacity-60' 
                        : 'border-gray-200 hover:border-gold hover:shadow-md'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{product.emoji || '✨'}</span>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{product.name}</p>
                        <p className="text-xs text-gray-500">{price.toLocaleString()} FCFA</p>
                      </div>
                    </div>
                    {isSelected && (
                      <div className="absolute -top-1 -right-1 w-5 h-5 bg-gold rounded-full flex items-center justify-center text-white text-xs">
                        ✓
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            {filteredProducts.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                <p>Aucun produit disponible</p>
              </div>
            )}
          </div>

          {/* Panel droit */}
          <div className="lg:w-96 p-6 bg-gray-50 flex flex-col">
            <h3 className="font-semibold text-gray-700 mb-4 flex items-center gap-2">
              <Package className="w-4 h-4" />
              Ton pack ({selectedItems.length} articles)
            </h3>

            <input
              type="text"
              placeholder="Nom de ton pack (optionnel)"
              value={packName}
              onChange={(e) => setPackName(e.target.value)}
              className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none transition-all mb-4"
            />

            <div className="flex-1 overflow-y-auto space-y-2">
              {selectedItems.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  <Package className="w-12 h-12 mx-auto mb-2 opacity-30" />
                  <p className="text-sm">Sélectionne des produits</p>
                  <p className="text-xs">Minimum 3 articles</p>
                </div>
              ) : (
                selectedItems.map((item) => {
                  const price = item.price || parseInt(item.priceRange?.split('-')[0]) || 0;
                  return (
                    <div key={item.id} className="flex items-center gap-3 bg-white p-3 rounded-xl shadow-sm">
                      <span className="text-2xl">{item.emoji || '✨'}</span>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{item.name}</p>
                        <p className="text-xs text-gray-500">{price.toLocaleString()} FCFA</p>
                      </div>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="p-1 hover:bg-red-50 rounded-full text-red-400 hover:text-red-600 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  );
                })
              )}
            </div>

            <div className="border-t border-gray-200 pt-4 mt-4 space-y-3">
              {selectedItems.length >= 3 && (
                <div className="bg-gold/10 rounded-xl p-3 text-center">
                  <p className="text-sm font-semibold text-gold">
                    ✅ Pack personnalisable !
                  </p>
                </div>
              )}

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Total</p>
                  <p className="text-2xl font-display font-bold text-gray-900">
                    {totalPrice.toLocaleString()} FCFA
                  </p>
                </div>
                <button
                  onClick={createPack}
                  disabled={selectedItems.length < 3}
                  className={`px-6 py-3 rounded-full font-semibold transition-all flex items-center gap-2 ${
                    selectedItems.length >= 3
                      ? `${themeBg} text-white hover:scale-105 shadow-lg`
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  <ShoppingBag className="w-4 h-4" />
                  Créer le pack
                </button>
              </div>

              <p className="text-xs text-gray-400 text-center">
                {selectedItems.length < 3 
                  ? `Encore ${3 - selectedItems.length} articles minimum`
                  : '📦 Pack prêt à être ajouté au panier'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PackBuilder;