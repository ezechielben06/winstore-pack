// 📄 src/components/Home/Hero.jsx
// ✅ Optimisé : 6s par slide, préchargement des images et transition en fondu croisé ultra-fluide
import { useState, useEffect, useRef, useTransition } from "react";
import {
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";

const SLIDE_DURATION = 6000; // ✅ Réduit à 6 secondes par slide

const slides = [
  {
    id: 1,
    image: "/h1.jpeg",
    title: "Win'S PACKS",
    subtitle: "Tout en un pour votre quotidien",
    cta: "Découvrir",
    link: "/femme",
    badge: "✨ Nouvelle collection",
  },
  {
    id: 2,
    image: "/h2.jpeg",
    title: "Win'S PACKS",
    subtitle: "Tout en un pour votre quotidien",
    cta: "Voir les packs",
    link: "/femme",
    badge: "📦 Packs disponibles",
  },
  {
    id: 3,
    image: "/h3.jpeg",
    title: "Win'S PACKS",
    subtitle: "Des packs pour révéler votre confiance",
    cta: "Commander",
    link: "/femme",
    badge: "✨ Glow & Élégance",
  },
  {
    id: 4,
    image: "/h4.jpeg",
    title: "Win'S PACKS",
    subtitle: "Tout en un pour votre quotidien",
    cta: "Découvrir",
    link: "/homme",
    badge: "💪 Nouveauté",
  },
];

const Hero = () => {
  const { isDark } = useTheme();
  const [current, setCurrent] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [, startTransition] = useTransition();

  // ✅ Préchargement des images au montage pour éliminer tout flash/temps de chargement
  useEffect(() => {
    slides.forEach((s) => {
      const img = new Image();
      img.src = s.image;
    });
  }, []);

  const rafRef = useRef(null);
  const startTimeRef = useRef(Date.now());
  const isPausedRef = useRef(isPaused);

  useEffect(() => {
    isPausedRef.current = isPaused;
  }, [isPaused]);

  const resetTimer = () => {
    startTimeRef.current = Date.now();
    setProgress(0);
  };

  const goToSlide = (index) => {
    if (index === current) return;
    startTransition(() => {
      setCurrent(index);
    });
    resetTimer();
  };

  const nextSlide = () => {
    startTransition(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    });
    resetTimer();
  };

  const prevSlide = () => {
    startTransition(() => {
      setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
    });
    resetTimer();
  };

  // ✅ Boucle d'animation fluide avec requestAnimationFrame
  useEffect(() => {
    const tick = () => {
      if (isPausedRef.current) {
        startTimeRef.current = Date.now() - progress * (SLIDE_DURATION / 100);
      } else {
        const elapsed = Date.now() - startTimeRef.current;
        const newProgress = Math.min((elapsed / SLIDE_DURATION) * 100, 100);
        setProgress(newProgress);

        if (newProgress >= 100) {
          startTransition(() => {
            setCurrent((prev) => (prev + 1) % slides.length);
          });
          startTimeRef.current = Date.now();
          setProgress(0);
        }
      }
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [progress]);

  useEffect(() => {
    startTimeRef.current = Date.now();
    setProgress(0);
  }, [current]);

  return (
    <section
      className="relative min-h-[70vh] xs:min-h-[75vh] sm:min-h-[80vh] flex items-center overflow-hidden bg-gray-900"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Images de fond en fondu croisé (crossfade) pour une fluidité absolue sans scintillement */}
      {slides.map((s, index) => (
        <div
          key={s.id}
          className={`absolute inset-0 z-0 transition-opacity duration-1000 ease-in-out ${
            index === current ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
          }`}
          style={{
            backgroundImage: `url(${s.image})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            willChange: "opacity",
          }}
        />
      ))}

      {/* Overlay sombre */}
      <div
        className="absolute inset-0 z-10 transition-all duration-700 pointer-events-none"
        style={{
          background: isDark
            ? "linear-gradient(180deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.5) 50%, rgba(0,0,0,0.7) 100%)"
            : "linear-gradient(180deg, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0.6) 100%)",
        }}
      />

      {/* Barre de progression en bas d'écran */}
      <div className="absolute bottom-0 left-0 right-0 z-30 h-1 bg-white/10">
        <div
          className="h-full bg-gradient-to-r from-gold to-yellow-400 transition-all duration-75 ease-linear"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Flèches de navigation (desktop) */}
      <button
        type="button"
        onClick={prevSlide}
        className="hidden sm:flex absolute left-2 md:left-4 z-30 backdrop-blur-sm hover:scale-110 p-1.5 md:p-3 rounded-full bg-black/30 hover:bg-black/50 text-white/80 hover:text-white border border-white/10 transition-all"
        aria-label="Image précédente"
      >
        <ChevronLeft className="w-4 h-4 md:w-6 md:h-6" />
      </button>

      <button
        type="button"
        onClick={nextSlide}
        className="hidden sm:flex absolute right-2 md:right-4 z-30 backdrop-blur-sm hover:scale-110 p-1.5 md:p-3 rounded-full bg-black/30 hover:bg-black/50 text-white/80 hover:text-white border border-white/10 transition-all"
        aria-label="Image suivante"
      >
        <ChevronRight className="w-4 h-4 md:w-6 md:h-6" />
      </button>

      {/* Indicateurs / puces */}
      <div className="absolute bottom-4 md:bottom-8 left-1/2 -translate-x-1/2 z-30 flex items-center gap-1.5 md:gap-3">
        {slides.map((_, index) => (
          <button
            key={index}
            type="button"
            onClick={() => goToSlide(index)}
            className={`relative h-1 md:h-2 rounded-full overflow-hidden transition-all duration-300 ${
              index === current
                ? "w-5 md:w-10 bg-white/30"
                : "w-1.5 md:w-2.5 bg-white/30 hover:bg-white/50"
            }`}
            aria-label={`Aller à l'image ${index + 1}`}
          >
            {index === current && (
              <div
                className="absolute inset-0 bg-gold rounded-full transition-all duration-75 ease-linear"
                style={{ width: `${progress}%` }}
              />
            )}
          </button>
        ))}
      </div>

      {/* Contenu textuel avec clés stables */}
      <div className="container mx-auto px-4 relative z-20">
        <div className="max-w-3xl">
          {/* Badge */}
          <div
            className={`inline-flex items-center gap-1 md:gap-2 px-2.5 md:px-4 py-1 md:py-2 rounded-full text-[10px] md:text-sm mb-2 md:mb-4 border animate-fade-in ${
              isDark
                ? "bg-black/40 backdrop-blur-sm text-white border-white/10"
                : "bg-white/20 backdrop-blur-sm text-white border-white/20"
            }`}
          >
            <Sparkles className="v-2.5 h-2.5 md:w-4 md:h-4 text-gold" />
            <span className="truncate max-w-[120px] xs:max-w-[200px] md:max-w-none">
              {slides[current].badge}
            </span>
          </div>

          {/* Titre */}
          <h1
            key={`title-${current}`}
            className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-display font-black leading-[1.1] text-white animate-slide-up"
            style={{ textShadow: "0 2px 20px rgba(0,0,0,0.5)" }}
          >
            {slides[current].title}
          </h1>

          {/* Sous-titre */}
          <p
            key={`sub-${current}`}
            className="mt-1.5 md:mt-4 text-xs xs:text-sm sm:text-base md:text-xl text-white/80 md:text-white/90 max-w-2xl animate-slide-up [animation-delay:100ms]"
            style={{ textShadow: "0 2px 15px rgba(0,0,0,0.4)" }}
          >
            {slides[current].subtitle}
          </p>

          {/* CTA */}
          <div
            key={`cta-${current}`}
            className="mt-4 md:mt-8 animate-slide-up [animation-delay:200ms]"
          >
            <Link
              to={slides[current].link}
              className="inline-flex items-center gap-1.5 md:gap-3 bg-gold text-gray-900 px-4 md:px-8 py-2 md:py-4 rounded-full font-semibold text-xs sm:text-sm md:text-base hover:scale-105 transition-all duration-300 shadow-xl shadow-gold/30 hover:shadow-2xl group"
            >
              {slides[current].cta}
              <ArrowRight className="w-3 h-3 md:w-5 md:h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
