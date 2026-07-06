// 📄 src/components/Shop/SearchBar.jsx - Nouveau composant
import { Search, X } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';

const SearchBar = ({ onSearch, placeholder = "Rechercher un produit, un pack...", className = "" }) => {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      onSearch(query);
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [query, onSearch]);

  const clearSearch = () => {
    setQuery('');
    onSearch('');
    inputRef.current?.focus();
  };

  return (
    <div className={`relative ${className}`}>
      <div className={`relative flex items-center transition-all duration-200 ${
        isFocused 
          ? 'ring-2 ring-gold/30 shadow-sm' 
          : 'hover:shadow-sm'
      }`}>
        <Search className="absolute left-3 w-4 h-4 text-gray-400 dark:text-gray-500" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          className="w-full bg-gray-100 dark:bg-[#2a2a4a] rounded-lg pl-9 pr-9 py-2.5 text-sm text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 outline-none transition-colors"
        />
        {query && (
          <button
            onClick={clearSearch}
            className="absolute right-3 p-0.5 hover:bg-gray-200 dark:hover:bg-[#3a3a5a] rounded-full transition-colors"
          >
            <X className="w-4 h-4 text-gray-400" />
          </button>
        )}
      </div>
      
      {/* Résultats trouvés */}
      {query && (
        <div className="absolute top-full left-0 right-0 mt-1 text-xs text-gray-500 dark:text-gray-400 px-3 py-1">
          {onSearch.length === 0 ? 'Aucun résultat' : ''}
        </div>
      )}
    </div>
  );
};

export default SearchBar;