
import { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, ArrowRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

const slides = [
  {
    id: 1,
    image: '/car1.webp',
    title: 'Révèle ta Confiance',
    subtitle: 'Des packs pensés pour les filles et les garçons ambitieux',
    cta: 'Découvrir',
    link: '/femme',
    color: 'from-pink-500/20 to-purple-500/0',
    badge: '✨ Nouvelle collection'
  },
  {
    id: 2,
    image: '/car2.jpg',
    title: 'Campus Girl Pack',
    subtitle: 'Organisation, style et confiance pour réussir',
    cta: 'Voir les packs',
    link: '/femme',
    color: 'from-blue-500/20 to-indigo-500/0',
    badge: '🎓 Rentrée 2026'
  },
  {
    id: 3,
    image: '/car3.png',
    title: 'Glow Queen Pack',
    subtitle: 'Prends soin de toi comme une reine',
    cta: 'Commander',
    link: '/femme',
    color: 'from-pink-400/20 to-rose-500/0',
    badge: '✨ Glow & Élégance'
  },
  {
    id: 4,
    image: '/car4.jpg',
    title: 'Pack Sportif Homme',
    subtitle: 'Pour l\'homme actif qui veut allier style et performance',
    cta: 'Découvrir',
    link: '/homme',
    color: 'from-blue-600/20 to-cyan-500/0',
    badge: '💪 Nouveauté'
  }
];

const Hero = () => {
  const [current, setCurrent] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);
  
  // ✅ Utiliser useRef pour garder une référence du timer
  const timerRef = useRef(null);
  const autoPlayRef = useRef(isAutoPlay);

  // ✅ Mettre à jour la référence quand isAutoPlay change
  useEffect(() => {
    autoPlayRef.current = isAutoPlay;
  }, [isAutoPlay]);

  // ✅ Fonction nextSlide stable
  const nextSlide = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrent((prev) => (prev + 1) % slides.length);
    setTimeout(() => setIsTransitioning(false), 800);
  };

  const prevSlide = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
    setTimeout(() => setIsTransitioning(false), 800);
  };

  const goToSlide = (index) => {
    if (isTransitioning || index === current) return;
    setIsTransitioning(true);
    setCurrent(index);
    // ✅ Réinitialiser l'auto-play quand l'utilisateur clique
    setIsAutoPlay(false);
    setTimeout(() => {
      setIsTransitioning(false);
      // ✅ Réactiver l'auto-play après 5 secondes d'inactivité
      setTimeout(() => setIsAutoPlay(true), 5000);
    }, 800);
  };

  // ✅ useEffect pour l'auto-play avec des dépendances correctes
  useEffect(() => {
    // ✅ Nettoyer le timer précédent
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    // ✅ Démarrer le nouveau timer seulement si l'auto-play est activé
    if (isAutoPlay) {
      timerRef.current = setInterval(() => {
        // ✅ Utiliser une fonction pour éviter les problèmes de closure
        setCurrent((prev) => (prev + 1) % slides.length);
      }, 10000);
    }

    // ✅ Nettoyer le timer au démontage ou quand isAutoPlay change
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [isAutoPlay]); // ✅ Seulement dépendre de isAutoPlay

  // ✅ Pause auto-play quand la souris est sur le carousel
  const handleMouseEnter = () => {
    setIsAutoPlay(false);
  };

  const handleMouseLeave = () => {
    setIsAutoPlay(true);
  };

  const slide = slides[current];

  return (
    <section 
      className="relative min-h-[85vh] flex items-center overflow-hidden"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Image de fond avec transition */}
      <div 
        className="absolute inset-0 z-0 transition-all duration-1000 ease-out"
        style={{
          backgroundImage: `url(${slide.image})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      />
      
      {/* Overlay dégradé */}
      <div className={`absolute inset-0 z-10 bg-gradient-to-r ${slide.color} to-transparent`} />
      <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/50 to-transparent" />

      {/* Flèches de navigation */}
      <button
        onClick={prevSlide}
        className="absolute left-4 z-30 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 p-3 rounded-full transition-all backdrop-blur-sm hover:scale-110"
        aria-label="Image précédente"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      
      <button
        onClick={nextSlide}
        className="absolute right-4 z-30 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 p-3 rounded-full transition-all backdrop-blur-sm hover:scale-110"
        aria-label="Image suivante"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Indicateurs */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex items-center gap-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`transition-all duration-500 ${
              index === current 
                ? 'w-10 h-2.5 bg-gold rounded-full' 
                : 'w-2.5 h-2.5 bg-white/40 rounded-full hover:bg-white/70'
            }`}
            aria-label={`Aller à l'image ${index + 1}`}
          />
        ))}
      </div>

      {/* Contenu */}
      <div className="container mx-auto px-4 relative z-20">
        <div className="max-w-3xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm text-white mb-6 border border-white/20 animate-fade-in">
            <Sparkles className="w-4 h-4 text-gold" />
            {slide.badge}
          </div>

          {/* Titre avec animation */}
          <h1 
            key={current}
            className="text-5xl md:text-7xl lg:text-8xl font-display font-black leading-[1.1] text-white animate-slide-up"
          >
            {slide.title}
          </h1>
          
          {/* Sous-titre */}
          <p 
            key={`sub-${current}`}
            className="mt-4 text-xl md:text-2xl text-white/90 max-w-2xl animate-slide-up [animation-delay:100ms]"
          >
            {slide.subtitle}
          </p>

          {/* CTA */}
          <div 
            key={`cta-${current}`}
            className="mt-10 animate-slide-up [animation-delay:200ms]"
          >
            <Link
              to={slide.link}
              className="inline-flex items-center gap-3 bg-gold text-gray-900 px-10 py-4 rounded-full font-semibold hover:scale-105 transition-all duration-300 shadow-xl shadow-gold/30 hover:shadow-2xl group"
            >
              {slide.cta}
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Indicateur de progression */}
          <div className="mt-8 flex items-center gap-2 text-white/50 text-sm">
            <span className="font-semibold text-white">{String(current + 1).padStart(2, '0')}</span>
            <span className="w-12 h-px bg-white/20" />
            <span>{String(slides.length).padStart(2, '0')}</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;