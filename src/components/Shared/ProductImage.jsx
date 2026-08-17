// 📄 src/components/Shared/ProductImage.jsx
import { useState } from 'react';

const ProductImage = ({ 
  src, 
  alt, 
  className = '', 
  emoji = '✨',
  isPack = false,
  fit = 'cover'
}) => {
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  if (error || !src) {
    return (
      <div className={`flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 dark:from-[#1A1A2E] dark:to-[#141425] ${className}`}>
        <div className="text-center">
          <div className="text-6xl">{isPack ? '📦' : emoji}</div>
          <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-1">Image non disponible</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {loading && (
        <div className="absolute inset-0 bg-gray-200 dark:bg-[#2A2A4A] animate-pulse flex items-center justify-center">
          <div className="w-8 h-8 border-3 border-gold border-t-transparent rounded-full animate-spin" />
        </div>
      )}
      
      <img
        src={src}
        alt={alt}
        className={`w-full h-full transition-opacity duration-300 ${
          fit === 'contain' ? 'object-contain' : 'object-cover'
        } ${loading ? 'opacity-0' : 'opacity-100'}`}
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