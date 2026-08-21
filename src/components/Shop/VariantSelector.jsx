// 📄 src/components/Shop/VariantSelector.jsx
import { useState, useEffect } from 'react';
import { Check } from 'lucide-react';

const VariantSelector = ({ variants, selectedVariant, onSelect, isDark }) => {
  const [selected, setSelected] = useState(selectedVariant || variants?.[0] || null);

  useEffect(() => {
    if (selectedVariant) {
      setSelected(selectedVariant);
    }
  }, [selectedVariant]);

  const handleSelect = (variant) => {
    setSelected(variant);
    if (onSelect) {
      onSelect(variant);
    }
  };

  // ✅ Grouper les variantes par type
  const groupedVariants = {};
  if (variants && variants.length > 0) {
    variants.forEach(v => {
      const type = v.name || 'couleur';
      if (!groupedVariants[type]) {
        groupedVariants[type] = [];
      }
      groupedVariants[type].push(v);
    });
  }

  const getTypeLabel = (type) => {
    const labels = {
      'couleur': 'Couleur',
      'taille': 'Taille',
      'motif': 'Motif',
      'matiere': 'Matière',
      'parfum': 'Parfum'
    };
    return labels[type] || type;
  };

  const getTypeIcon = (type) => {
    const icons = {
      'couleur': '🎨',
      'taille': '📏',
      'motif': '✨',
      'matiere': '🧵',
      'parfum': '🌸'
    };
    return icons[type] || '📌';
  };

  if (!variants || variants.length === 0) {
    return null;
  }

  return (
    <div className={`p-4 rounded-xl ${isDark ? 'bg-[#1a1a2e]' : 'bg-gray-50'} border ${isDark ? 'border-[#2d3748]' : 'border-gray-200'}`}>
      <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
        <span className="text-gold">🎯</span>
        Choisissez votre variante
      </h3>

      {Object.keys(groupedVariants).map((type) => {
        const variantsOfType = groupedVariants[type];
        const isColor = type === 'couleur' || type === 'color';

        return (
          <div key={type} className="mb-3 last:mb-0">
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5 flex items-center gap-1">
              {getTypeIcon(type)} {getTypeLabel(type)}
            </p>
            <div className="flex flex-wrap gap-2">
              {variantsOfType.map((variant) => {
                const isSelected = selected?.id === variant.id;

                return (
                  <button
                    key={variant.id}
                    onClick={() => handleSelect(variant)}
                    className={`group relative flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      isSelected
                        ? 'bg-gold text-gray-900 shadow-md scale-105'
                        : isDark
                          ? 'bg-[#2a2a4a] text-gray-300 hover:bg-[#3a3a5a]'
                          : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                    }`}
                  >
                    {isColor && (
                      <span
                        className="inline-block w-4 h-4 rounded-full border-2 border-white/50 shadow-sm flex-shrink-0"
                        style={{ background: variant.color || variant.value.toLowerCase() }}
                      />
                    )}
                    {variant.image && !isColor && (
                      <img
                        src={variant.image}
                        alt={variant.value}
                        className="w-5 h-5 rounded object-cover flex-shrink-0"
                      />
                    )}
                    <span>{variant.value}</span>
                    {variant.price && variant.price > 0 && (
                      <span className="text-[8px] opacity-70 ml-0.5">
                        (+{variant.price.toLocaleString()} FCFA)
                      </span>
                    )}
                    {variant.stock !== undefined && variant.stock < 5 && variant.stock > 0 && (
                      <span className="text-[8px] text-amber-500 ml-0.5">
                        (stock: {variant.stock})
                      </span>
                    )}
                    {variant.stock === 0 && (
                      <span className="text-[8px] text-red-500 ml-0.5">
                        (rupture)
                      </span>
                    )}
                    {isSelected && (
                      <Check className="w-3 h-3 text-gray-900" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default VariantSelector;