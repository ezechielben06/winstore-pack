// 📄 src/components/Shared/ProductImage.jsx
import { useState } from 'react';  // ✅ AJOUTÉ

const ProductImage = ({ 
  src, 
  alt, 
  className = '', 
  fallback = '/images/placeholder-product.jpg',
  emoji = '✨'
}) => {
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  if (error || !src) {
    return (
      <div className={`flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 ${className}`}>
        <div className="text-center">
          <div className="text-6xl mb-2">{emoji}</div>
          <p className="text-xs text-gray-400">Image non disponible</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {loading && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-feminine-primary border-t-transparent rounded-full animate-spin" />
        </div>
      )}
      
      <img
        src={src}
        alt={alt}
        className={`w-full h-full object-cover transition-opacity duration-300 ${
          loading ? 'opacity-0' : 'opacity-100'
        }`}
        onLoad={() => setLoading(false)}
        onError={() => {
          setError(true);
          setLoading(false);
        }}
        loading="lazy"
      />
    </div>
  );
};

export default ProductImage;