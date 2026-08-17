// 📄 src/components/Admin/ProductList.jsx
import { useState } from 'react';
import { Edit, Trash2, Search, Package, Sparkles, Crown } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const ProductList = ({ products, onEdit, onDelete }) => {
  const { isDark } = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredProducts = products.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCategory = selectedCategory === 'all' || p.category === selectedCategory;
    return matchSearch && matchCategory;
  });

  const getCategoryBadge = (category) => {
    if (category === 'pack') {
      return {
        label: '📦 Pack',
        className: 'bg-gold/20 text-gold'
      };
    }
    return {
      label: '🛍️ Produit',
      className: 'bg-blue-100 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400'
    };
  };

  const getPriceDisplay = (product) => {
    if (product.price) return `${product.price.toLocaleString()} FCFA`;
    if (product.priceRange) return `${product.priceRange} FCFA`;
    return '-';
  };

  return (
    <div>
      {/* Filtres */}
      <div className="flex flex-wrap items-center gap-4 mb-6">
        <div className="flex-1 min-w-[200px] relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher un produit..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`w-full pl-9 pr-4 py-2 rounded-xl border text-sm ${
              isDark 
                ? 'bg-[#2a2a4a] border-[#2d3748] text-white placeholder-gray-400' 
                : 'bg-white border-gray-200 text-gray-800'
            } focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none transition-all`}
          />
        </div>

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className={`px-4 py-2 rounded-xl border text-sm ${
            isDark 
              ? 'bg-[#2a2a4a] border-[#2d3748] text-white' 
              : 'bg-white border-gray-200 text-gray-800'
          } focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none transition-all`}
        >
          <option value="all">Toutes les catégories</option>
          <option value="product">Produits</option>
          <option value="pack">Packs</option>
        </select>

        <span className="text-sm text-gray-500 dark:text-gray-400">
          {filteredProducts.length} résultat{filteredProducts.length > 1 ? 's' : ''}
        </span>
      </div>

      {/* Liste */}
      <div className={`rounded-2xl ${isDark ? 'bg-[#1a1a2e]' : 'bg-white'} shadow-sm border ${isDark ? 'border-[#2d3748]' : 'border-gray-200'} overflow-hidden`}>
        {filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <Package className="w-12 h-12 mx-auto text-gray-300 dark:text-gray-600 mb-3" />
            <p className="text-gray-500 dark:text-gray-400">Aucun produit trouvé</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className={`${isDark ? 'bg-[#141425]' : 'bg-gray-50'}`}>
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600 dark:text-gray-400">Produit</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600 dark:text-gray-400">Catégorie</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600 dark:text-gray-400">Prix</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600 dark:text-gray-400">Tags</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600 dark:text-gray-400">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-[#2d3748]">
                {filteredProducts.map((product) => {
                  const badge = getCategoryBadge(product.category);
                  return (
                    <tr key={product.id} className="hover:bg-gray-50 dark:hover:bg-[#1a1a2e] transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{product.emoji || '✨'}</span>
                          <div>
                            <p className="font-medium text-gray-800 dark:text-white">{product.name}</p>
                            <p className="text-xs text-gray-400 dark:text-gray-500">{product.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${badge.className}`}>
                          {badge.label}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="font-medium">{getPriceDisplay(product)}</span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-1">
                          {product.tags?.map((tag, i) => (
                            <span key={i} className="text-xs px-2 py-0.5 bg-gray-100 dark:bg-[#2a2a4a] rounded-full text-gray-600 dark:text-gray-400">
                              {tag}
                            </span>
                          ))}
                          {!product.tags?.length && (
                            <span className="text-xs text-gray-400">-</span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => onEdit(product)}
                            className="p-1.5 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-lg text-blue-500 transition-colors"
                            title="Modifier"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => onDelete(product.id)}
                            className="p-1.5 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg text-red-500 transition-colors"
                            title="Supprimer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductList;