// 📄 src/components/Shared/ProductImage.jsx - Avec squelette
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

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* ✅ Squelette de chargement */}
      {loading && (
        <div className="absolute inset-0 bg-gray-200 dark:bg-[#2A2A4A] animate-pulse flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-gold border-t-transparent rounded-full animate-spin" />
        </div>
      )}
      
      {!error && src ? (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          className={`w-full h-full transition-opacity duration-300 ${
            fit === 'contain' ? 'object-contain' : 'object-cover'
          } ${loading ? 'opacity-0' : 'opacity-100'}`}
          onLoad={() => setLoading(false)}
          onError={() => {
            setError(true);
            setLoading(false);
          }}
        />
      ) : (
        <div className={`w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 dark:from-[#1A1A2E] dark:to-[#141425]`}>
          <div className="text-center">
            <div className="text-6xl">{isPack ? '📦' : emoji}</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductImage;