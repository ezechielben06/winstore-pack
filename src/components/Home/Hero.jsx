// 📄 src/components/Home/HeroCarousel.jsx - Mobile optimisé
import { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, ArrowRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';

const slides = [
  {
    id: 1,
    image: '/car1.webp',
    title: 'Révèle ta Confiance',
    subtitle: 'Des packs pour les ambitieux',
    cta: 'Découvrir',
    link: '/femme',
    badge: '✨ Nouvelle collection'
  },
  {
    id: 2,
    image: '/car2.jpg',
    title: 'Campus Girl Pack',
    subtitle: 'Organisation & style',
    cta: 'Voir les packs',
    link: '/femme',
    badge: '🎓 Rentrée 2026'
  },
  {
    id: 3,
    image: '/car3.png',
    title: 'Glow Queen Pack',
    subtitle: 'Prends soin de toi',
    cta: 'Commander',
    link: '/femme',
    badge: '✨ Glow & Élégance'
  },
  {
    id: 4,
    image: '/car4.jpg',
    title: 'Pack Sportif Homme',
    subtitle: 'Style & performance',
    cta: 'Découvrir',
    link: '/homme',
    badge: '💪 Nouveauté'
  }
];

const HeroCarousel = () => {
  const { isDark } = useTheme();
  const [current, setCurrent] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [progress, setProgress] = useState(0);
  
  const timerRef = useRef(null);
  const autoPlayRef = useRef(isAutoPlay);
  const startTimeRef = useRef(Date.now());

  useEffect(() => {
    autoPlayRef.current = isAutoPlay;
  }, [isAutoPlay]);

  const nextSlide = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrent((prev) => (prev + 1) % slides.length);
    setProgress(0);
    startTimeRef.current = Date.now();
    setTimeout(() => setIsTransitioning(false), 500);
  };

  const prevSlide = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
    setProgress(0);
    startTimeRef.current = Date.now();
    setTimeout(() => setIsTransitioning(false), 500);
  };

  const goToSlide = (index) => {
    if (isTransitioning || index === current) return;
    setIsTransitioning(true);
    setCurrent(index);
    setProgress(0);
    startTimeRef.current = Date.now();
    setIsAutoPlay(false);
    setTimeout(() => {
      setIsTransitioning(false);
      setTimeout(() => setIsAutoPlay(true), 5000);
    }, 500);
  };

  // Progression
  useEffect(() => {
    let animationFrame;
    const interval = 10000;

    const updateProgress = () => {
      if (!autoPlayRef.current) {
        animationFrame = requestAnimationFrame(updateProgress);
        return;
      }

      const elapsed = Date.now() - startTimeRef.current;
      const newProgress = Math.min((elapsed / interval) * 100, 100);
      setProgress(newProgress);

      if (newProgress >= 100) {
        if (!isTransitioning) {
          setCurrent((prev) => (prev + 1) % slides.length);
          setProgress(0);
          startTimeRef.current = Date.now();
        }
      }

      animationFrame = requestAnimationFrame(updateProgress);
    };

    animationFrame = requestAnimationFrame(updateProgress);

    return () => {
      if (animationFrame) cancelAnimationFrame(animationFrame);
    };
  }, [isTransitioning]);

  // Auto-play
  useEffect(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    if (isAutoPlay) {
      timerRef.current = setInterval(() => {
        setCurrent((prev) => (prev + 1) % slides.length);
      }, 10000);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [isAutoPlay]);

  const handleMouseEnter = () => setIsAutoPlay(false);
  const handleMouseLeave = () => {
    setIsAutoPlay(true);
    startTimeRef.current = Date.now();
    setProgress(0);
  };

  const slide = slides[current];

  return (
    <section 
      className="relative min-h-[65vh] xs:min-h-[70vh] sm:min-h-[75vh] md:min-h-[80vh] flex items-center overflow-hidden"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Image de fond */}
      <div 
        className="absolute inset-0 z-0 transition-all duration-700 ease-out"
        style={{
          backgroundImage: `url(${slide.image})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      />
      
      {/* Overlay */}
      <div 
        className="absolute inset-0 z-10 transition-all duration-700"
        style={{
          background: isDark 
            ? 'linear-gradient(180deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.5) 50%, rgba(0,0,0,0.7) 100%)'
            : 'linear-gradient(180deg, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0.6) 100%)',
        }}
      />

      {/* Barre de progression */}
      <div className="absolute bottom-0 left-0 right-0 z-30 h-1 bg-white/10">
        <div 
          className="h-full bg-gradient-to-r from-gold to-yellow-400 transition-all duration-100 ease-linear"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Flèches - Masquées sur mobile */}
      <button
        onClick={prevSlide}
        className="hidden sm:flex absolute left-2 md:left-4 z-30 transition-all backdrop-blur-sm hover:scale-110 p-1.5 md:p-3 rounded-full bg-black/30 hover:bg-black/50 text-white/80 hover:text-white border border-white/10"
        aria-label="Image précédente"
      >
        <ChevronLeft className="w-4 h-4 md:w-6 md:h-6" />
      </button>
      
      <button
        onClick={nextSlide}
        className="hidden sm:flex absolute right-2 md:right-4 z-30 transition-all backdrop-blur-sm hover:scale-110 p-1.5 md:p-3 rounded-full bg-black/30 hover:bg-black/50 text-white/80 hover:text-white border border-white/10"
        aria-label="Image suivante"
      >
        <ChevronRight className="w-4 h-4 md:w-6 md:h-6" />
      </button>

      {/* Indicateurs */}
      <div className="absolute bottom-4 md:bottom-8 left-1/2 -translate-x-1/2 z-30 flex items-center gap-1.5 md:gap-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`relative h-1 md:h-2 rounded-full overflow-hidden transition-all duration-300 ${
              index === current 
                ? 'w-5 md:w-10 bg-white/30' 
                : 'w-1.5 md:w-2.5 bg-white/30 hover:bg-white/50'
            }`}
            aria-label={`Aller à l'image ${index + 1}`}
          >
            {index === current && (
              <div 
                className="absolute inset-0 bg-gold rounded-full transition-all duration-100 ease-linear"
                style={{ width: `${progress}%` }}
              />
            )}
          </button>
        ))}
      </div>

      {/* Contenu - Optimisé mobile */}
      <div className="container mx-auto px-4 relative z-20">
        <div className="max-w-3xl">
          {/* Badge */}
          <div className={`inline-flex items-center gap-1 md:gap-2 px-2.5 md:px-4 py-1 md:py-2 rounded-full text-[10px] md:text-sm mb-2 md:mb-4 border animate-fade-in ${
            isDark
              ? 'bg-black/40 backdrop-blur-sm text-white border-white/10'
              : 'bg-white/20 backdrop-blur-sm text-white border-white/20'
          }`}>
            <Sparkles className="w-2.5 h-2.5 md:w-4 md:h-4 text-gold" />
            <span className="truncate max-w-[120px] xs:max-w-[200px] md:max-w-none">{slide.badge}</span>
          </div>

          {/* Titre */}
          <h1 
            key={current}
            className="text-2xl xs:text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-display font-black leading-[1.1] text-white animate-slide-up"
            style={{ textShadow: '0 2px 20px rgba(0,0,0,0.5)' }}
          >
            {slide.title}
          </h1>
          
          {/* Sous-titre */}
          <p 
            key={`sub-${current}`}
            className="mt-1.5 md:mt-4 text-xs xs:text-sm sm:text-base md:text-xl text-white/80 md:text-white/90 max-w-2xl animate-slide-up [animation-delay:100ms]"
            style={{ textShadow: '0 2px 15px rgba(0,0,0,0.4)' }}
          >
            {slide.subtitle}
          </p>

          {/* CTA */}
          <div 
            key={`cta-${current}`}
            className="mt-4 md:mt-8 animate-slide-up [animation-delay:200ms]"
          >
            <Link
              to={slide.link}
              className="inline-flex items-center gap-1.5 md:gap-3 bg-gold text-gray-900 px-4 md:px-8 py-2 md:py-4 rounded-full font-semibold text-xs sm:text-sm md:text-base hover:scale-105 transition-all duration-300 shadow-xl shadow-gold/30 hover:shadow-2xl group"
            >
              {slide.cta}
              <ArrowRight className="w-3 h-3 md:w-5 md:h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Indicateur de progression - Masqué sur mobile */}
          <div className="hidden sm:flex mt-4 md:mt-8 items-center gap-2 text-white/50 text-xs md:text-sm">
            <span className="font-semibold text-white" style={{ textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>
              {String(current + 1).padStart(2, '0')}
            </span>
            <span className="w-6 md:w-12 h-px bg-white/30" />
            <span style={{ textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>
              {String(slides.length).padStart(2, '0')}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroCarousel;