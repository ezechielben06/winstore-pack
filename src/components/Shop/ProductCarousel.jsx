// 📄 src/components/Shop/ProductCarousel.jsx
import { useState, useEffect, useRef } from 'react';  // ✅ AJOUTÉ
import { ChevronLeft, ChevronRight } from 'lucide-react';
import ProductCard from './ProductCard';

const ProductCarousel = ({ products, title, isWomen }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(4);
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const timerRef = useRef(null);

  useEffect(() => {
    const updateItemsPerView = () => {
      const width = window.innerWidth;
      if (width < 640) setItemsPerView(1);
      else if (width < 768) setItemsPerView(2);
      else if (width < 1024) setItemsPerView(3);
      else setItemsPerView(4);
    };

    updateItemsPerView();
    window.addEventListener('resize', updateItemsPerView);
    return () => window.removeEventListener('resize', updateItemsPerView);
  }, []);

  const maxIndex = Math.max(0, products.length - itemsPerView);
  const totalPages = Math.ceil(products.length / itemsPerView);

  const nextSlide = () => {
    setCurrentIndex((prev) => Math.min(prev + 1, maxIndex));
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => Math.max(prev - 1, 0));
  };

  const goToPage = (page) => {
    setCurrentIndex(page * itemsPerView);
  };

  useEffect(() => {
    if (!isAutoPlay || products.length <= itemsPerView) return;
    
    timerRef.current = setInterval(() => {
      setCurrentIndex((prev) => {
        if (prev + itemsPerView >= products.length) {
          return 0;
        }
        return prev + 1;
      });
    }, 5000);

    return () => clearInterval(timerRef.current);
  }, [isAutoPlay, products.length, itemsPerView]);

  if (products.length === 0) return null;

  return (
    <div className="relative">
      {title && (
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-display font-bold">{title}</h2>
          <div className="flex gap-2">
            <button
              onClick={prevSlide}
              disabled={currentIndex === 0}
              className={`p-2 rounded-full border transition ${
                currentIndex === 0 
                  ? 'border-gray-200 text-gray-300 cursor-not-allowed' 
                  : 'border-gray-300 hover:border-gold hover:text-gold'
              }`}
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={nextSlide}
              disabled={currentIndex >= maxIndex}
              className={`p-2 rounded-full border transition ${
                currentIndex >= maxIndex 
                  ? 'border-gray-200 text-gray-300 cursor-not-allowed' 
                  : 'border-gray-300 hover:border-gold hover:text-gold'
              }`}
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      <div className="overflow-hidden">
        <div 
          className="flex gap-6 transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)` }}
        >
          {products.map((product) => (
            <div 
              key={product.id} 
              className="flex-shrink-0"
              style={{ width: `calc((100% - ${(itemsPerView - 1) * 24}px) / ${itemsPerView})` }}
            >
              <ProductCard product={product} isWomen={isWomen} />
            </div>
          ))}
        </div>
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          {Array.from({ length: totalPages }).map((_, index) => (
            <button
              key={index}
              onClick={() => goToPage(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                currentIndex === index * itemsPerView 
                  ? 'w-8 bg-gold' 
                  : 'bg-gray-300 hover:bg-gray-400'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductCarousel;