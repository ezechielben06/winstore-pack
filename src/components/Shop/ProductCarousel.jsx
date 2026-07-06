// 📄 src/components/Shop/ProductCarousel.jsx - Version avec pagination et images
import { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import ProductCard from './ProductCard';

const ProductCarousel = ({ products, title, isWomen }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(2);
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const timerRef = useRef(null);

  // ✅ Mise à jour du nombre d'éléments par vue
  useEffect(() => {
    const updateItemsPerView = () => {
      const width = window.innerWidth;
      if (width < 480) setItemsPerView(1);
      else if (width < 640) setItemsPerView(2);
      else if (width < 768) setItemsPerView(2);
      else if (width < 1024) setItemsPerView(3);
      else setItemsPerView(4);
    };

    updateItemsPerView();
    window.addEventListener('resize', updateItemsPerView);
    return () => window.removeEventListener('resize', updateItemsPerView);
  }, []);

  const totalPages = Math.max(1, Math.ceil(products.length / itemsPerView));
  const maxPage = totalPages - 1;

  // ✅ Navigation
  const goToPage = (page) => {
    setCurrentPage(Math.min(Math.max(0, page), maxPage));
    // Réinitialiser l'auto-play
    setIsAutoPlay(false);
    setTimeout(() => setIsAutoPlay(true), 5000);
  };

  const nextPage = () => {
    if (currentPage < maxPage) {
      goToPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 0) {
      goToPage(currentPage - 1);
    }
  };

  const firstPage = () => goToPage(0);
  const lastPage = () => goToPage(maxPage);

  // ✅ Auto-play
  useEffect(() => {
    if (!isAutoPlay || products.length <= itemsPerView) return;
    
    timerRef.current = setInterval(() => {
      setCurrentPage((prev) => (prev + 1) % totalPages);
    }, 6000);

    return () => clearInterval(timerRef.current);
  }, [isAutoPlay, products.length, itemsPerView, totalPages]);

  const handleMouseEnter = () => setIsAutoPlay(false);
  const handleMouseLeave = () => {
    setIsAutoPlay(true);
  };

  if (products.length === 0) return null;

  // ✅ Produits visibles sur la page actuelle
  const startIndex = currentPage * itemsPerView;
  const visibleProducts = products.slice(startIndex, startIndex + itemsPerView);

  return (
    <div 
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* ✅ En-tête avec titre et navigation */}
      <div className="flex items-center justify-between mb-3 md:mb-4">
        {title && (
          <h3 className="text-base md:text-xl font-display font-bold text-gray-800 dark:text-white">
            {title}
          </h3>
        )}
        
        {/* ✅ Contrôles de pagination - Desktop */}
        <div className="hidden md:flex items-center gap-1">
          <button
            onClick={firstPage}
            disabled={currentPage === 0}
            className={`p-1.5 rounded-md transition ${
              currentPage === 0 
                ? 'text-gray-300 dark:text-gray-600 cursor-not-allowed' 
                : 'text-gray-500 hover:text-gold hover:bg-gray-100 dark:hover:bg-[#2a2a4a]'
            }`}
            aria-label="Première page"
          >
            <ChevronsLeft className="w-4 h-4" />
          </button>
          <button
            onClick={prevPage}
            disabled={currentPage === 0}
            className={`p-1.5 rounded-md transition ${
              currentPage === 0 
                ? 'text-gray-300 dark:text-gray-600 cursor-not-allowed' 
                : 'text-gray-500 hover:text-gold hover:bg-gray-100 dark:hover:bg-[#2a2a4a]'
            }`}
            aria-label="Page précédente"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          
          {/* ✅ Indicateur de page */}
          <span className="text-xs font-medium text-gray-500 dark:text-gray-400 px-2">
            {currentPage + 1} / {totalPages}
          </span>
          
          <button
            onClick={nextPage}
            disabled={currentPage >= maxPage}
            className={`p-1.5 rounded-md transition ${
              currentPage >= maxPage 
                ? 'text-gray-300 dark:text-gray-600 cursor-not-allowed' 
                : 'text-gray-500 hover:text-gold hover:bg-gray-100 dark:hover:bg-[#2a2a4a]'
            }`}
            aria-label="Page suivante"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
          <button
            onClick={lastPage}
            disabled={currentPage >= maxPage}
            className={`p-1.5 rounded-md transition ${
              currentPage >= maxPage 
                ? 'text-gray-300 dark:text-gray-600 cursor-not-allowed' 
                : 'text-gray-500 hover:text-gold hover:bg-gray-100 dark:hover:bg-[#2a2a4a]'
            }`}
            aria-label="Dernière page"
          >
            <ChevronsRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ✅ Carousel */}
      <div className="overflow-hidden">
        <div className="flex gap-2 sm:gap-3 md:gap-4">
          {visibleProducts.map((product) => (
            <div 
              key={product.id} 
              className="flex-1 min-w-0"
            >
              <ProductCard product={product} isWomen={isWomen} />
            </div>
          ))}
          
          {/* ✅ Remplir les espaces vides avec des placeholders */}
          {Array.from({ length: itemsPerView - visibleProducts.length }).map((_, index) => (
            <div 
              key={`empty-${index}`} 
              className="flex-1 min-w-0 opacity-0 pointer-events-none"
            />
          ))}
        </div>
      </div>

      {/* ✅ Indicateurs de page - Mobile */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-3 md:mt-4">
          {/* Boutons mobile */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={prevPage}
              disabled={currentPage === 0}
              className={`p-2 rounded-full border transition ${
                currentPage === 0 
                  ? 'border-gray-200 text-gray-300 dark:border-gray-700 dark:text-gray-600 cursor-not-allowed' 
                  : 'border-gray-300 dark:border-gray-600 hover:border-gold hover:text-gold'
              }`}
              aria-label="Page précédente"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400 px-2">
              {currentPage + 1} / {totalPages}
            </span>
            
            <button
              onClick={nextPage}
              disabled={currentPage >= maxPage}
              className={`p-2 rounded-full border transition ${
                currentPage >= maxPage 
                  ? 'border-gray-200 text-gray-300 dark:border-gray-700 dark:text-gray-600 cursor-not-allowed' 
                  : 'border-gray-300 dark:border-gray-600 hover:border-gold hover:text-gold'
              }`}
              aria-label="Page suivante"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* ✅ Dots indicateurs */}
          <div className="flex items-center gap-1.5 mx-auto md:mx-0">
            {Array.from({ length: Math.min(totalPages, 8) }).map((_, index) => {
              // Afficher les dots avec des ellipses si trop de pages
              const showDot = totalPages <= 8 || 
                index === 0 || 
                index === totalPages - 1 ||
                Math.abs(index - currentPage) <= 1;

              if (!showDot) {
                if (index === 2 && totalPages > 8) {
                  return <span key="ellipsis" className="text-gray-400 dark:text-gray-600 text-xs">…</span>;
                }
                return null;
              }

              return (
                <button
                  key={index}
                  onClick={() => goToPage(index)}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    currentPage === index 
                      ? 'w-6 bg-gold' 
                      : 'w-1.5 bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500'
                  }`}
                  aria-label={`Aller à la page ${index + 1}`}
                />
              );
            })}
          </div>
          
          {/* ✅ Compteur d'articles */}
          <span className="text-[10px] text-gray-400 dark:text-gray-500 hidden sm:block">
            {products.length} articles
          </span>
        </div>
      )}

      {/* ✅ Barre de progression */}
      {isAutoPlay && totalPages > 1 && (
        <div className="w-full h-0.5 bg-gray-200 dark:bg-gray-700 rounded-full mt-2 overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-gold to-yellow-400 rounded-full transition-all duration-1000 ease-linear"
            style={{ 
              width: `${((currentPage + 1) / totalPages) * 100}%` 
            }}
          />
        </div>
      )}
    </div>
  );
};

export default ProductCarousel;