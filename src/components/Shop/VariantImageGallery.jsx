// 📄 src/components/Shop/VariantImageGallery.jsx
import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const VariantImageGallery = ({ variants, currentImage, product }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  // ✅ Récupérer toutes les images des variantes
  const allImages = [];
  
  // Image principale du produit
  if (product?.image) {
    allImages.push({
      url: product.image,
      label: product.name,
      isMain: true
    });
  }

  // Images des variantes
  if (variants && variants.length > 0) {
    variants.forEach(v => {
      if (v.image) {
        allImages.push({
          url: v.image,
          label: v.value,
          variant: v
        });
      }
    });
  }

  // Si une seule image, l'afficher directement
  if (allImages.length === 0) {
    return null;
  }

  const currentImageUrl = allImages[selectedIndex]?.url || currentImage || product?.image;

  const nextImage = () => {
    setSelectedIndex((prev) => (prev + 1) % allImages.length);
  };

  const prevImage = () => {
    setSelectedIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
  };

  return (
    <div className="relative">
      {/* Image principale */}
      <div className="relative aspect-square rounded-2xl overflow-hidden bg-gray-100 dark:bg-[#1a1a2e]">
        <img
          src={currentImageUrl}
          alt={product?.name || 'Produit'}
          className="w-full h-full object-contain"
          loading="lazy"
          onError={(e) => {
            e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200"%3E%3Crect width="200" height="200" fill="%23f0f0f0"/%3E%3Ctext x="100" y="110" text-anchor="middle" fill="%23999" font-size="16"%3EImage%3C/text%3E%3C/svg%3E';
          }}
        />
        
        {/* Navigation si plusieurs images */}
        {allImages.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-white/90 dark:bg-[#1a1a2e]/90 shadow-lg hover:scale-110 transition-transform"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-white/90 dark:bg-[#1a1a2e]/90 shadow-lg hover:scale-110 transition-transform"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </>
        )}

        {/* Indicateur */}
        {allImages.length > 1 && (
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1">
            {allImages.map((_, index) => (
              <button
                key={index}
                onClick={() => setSelectedIndex(index)}
                className={`h-1.5 rounded-full transition-all ${
                  selectedIndex === index
                    ? 'w-4 bg-gold'
                    : 'w-1.5 bg-white/70'
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Miniatures */}
      {allImages.length > 1 && (
        <div className="flex gap-2 mt-3 overflow-x-auto pb-2">
          {allImages.map((img, index) => (
            <button
              key={index}
              onClick={() => setSelectedIndex(index)}
              className={`w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-all ${
                selectedIndex === index
                  ? 'border-gold shadow-md'
                  : 'border-transparent hover:border-gray-300 dark:hover:border-gray-600'
              }`}
            >
              <img
                src={img.url}
                alt={img.label}
                className="w-full h-full object-cover"
              />
              {img.variant && (
                <div className="text-[6px] text-center text-gray-500 dark:text-gray-400 truncate px-0.5">
                  {img.variant.value}
                </div>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default VariantImageGallery;