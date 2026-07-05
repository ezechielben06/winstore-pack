const FilterBar = ({ category, setCategory, view, setView, isWomen }) => {
  const theme = isWomen ? 'feminine' : 'masculine';
  const categories = [
    { id: 'all', label: 'Tous' },
    { id: 'pack', label: '📦 Packs' },
    { id: 'product', label: '🛍️ Produits' },
  ];

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setCategory(cat.id)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              category === cat.id
                ? `bg-${theme}-primary text-white shadow-lg shadow-${theme}-primary/25`
                : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => setView('grid')}
          className={`p-2 rounded-lg transition-colors ${
            view === 'grid' ? `bg-${theme}-primary text-white` : 'bg-white text-gray-400 hover:text-gray-600'
          }`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
          </svg>
        </button>
        <button
          onClick={() => setView('list')}
          className={`p-2 rounded-lg transition-colors ${
            view === 'list' ? `bg-${theme}-primary text-white` : 'bg-white text-gray-400 hover:text-gray-600'
          }`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default FilterBar;