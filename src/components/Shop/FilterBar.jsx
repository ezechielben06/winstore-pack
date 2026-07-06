// 📄 src/components/Shop/FilterBar.jsx - Mobile First
import { useState } from 'react';
import { Filter, ChevronDown } from 'lucide-react';

const FilterBar = ({ category, setCategory, isWomen }) => {
  const [isOpen, setIsOpen] = useState(false);
  const theme = isWomen ? 'feminine' : 'masculine';
  const themeBg = isWomen ? 'bg-feminine-primary' : 'bg-masculine-primary';
  
  const categories = [
    { id: 'all', label: 'Tous' },
    { id: 'pack', label: '📦 Packs' },
    { id: 'product', label: '🛍️ Produits' },
  ];

  const currentLabel = categories.find(c => c.id === category)?.label || 'Tous';

  return (
    <div className="mb-4 md:mb-6">
      {/* Mobile Filter Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full md:hidden flex items-center justify-between bg-white dark:bg-[#1a1a35] border border-gray-200 dark:border-[#2a2a4a] rounded-xl px-4 py-3"
      >
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-500 dark:text-gray-400" />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Filtrer</span>
          <span className="text-xs text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-[#2a2a4a] px-2 py-0.5 rounded-full">
            {currentLabel}
          </span>
        </div>
        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Filter Options */}
      <div className={`${isOpen ? 'block' : 'hidden'} md:block mt-2 md:mt-0`}>
        <div className="flex flex-wrap gap-1.5 md:gap-2">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                setCategory(cat.id);
                setIsOpen(false);
              }}
              className={`px-3 md:px-4 py-1.5 md:py-2 rounded-full text-xs md:text-sm font-medium transition-all ${
                category === cat.id
                  ? `${themeBg} text-white shadow-lg shadow-${theme}-primary/25`
                  : 'bg-white dark:bg-[#1a1a35] text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-[#2a2a4a] border border-gray-200 dark:border-[#2a2a4a]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FilterBar;