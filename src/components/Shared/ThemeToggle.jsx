// 📄 src/components/Shared/ThemeToggle.jsx - Version finale
import { Moon, Sun, Sparkles } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useState, useEffect } from 'react';

const ThemeToggle = ({ className = '' }) => {
  const { isDark, toggleTheme } = useTheme();
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const [ripples, setRipples] = useState([]);

  const handleClick = (e) => {
    setIsClicked(true);
    
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const newRipple = {
      id: Date.now(),
      x,
      y,
    };
    setRipples([...ripples, newRipple]);
    
    setTimeout(() => {
      setRipples(prev => prev.filter(r => r.id !== newRipple.id));
    }, 600);
    
    toggleTheme();
    
    setTimeout(() => {
      setIsClicked(false);
    }, 300);
  };

  const [particles, setParticles] = useState([]);
  
  useEffect(() => {
    const newParticles = Array.from({ length: isDark ? 8 : 12 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 2 + Math.random() * 4,
      duration: 0.5 + Math.random() * 0.5,
      delay: Math.random() * 0.3,
    }));
    setParticles(newParticles);
  }, [isDark]);

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={handleClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`relative w-12 h-6 sm:w-14 sm:h-7 md:w-16 md:h-8 rounded-full transition-all duration-500 flex items-center p-0.5 sm:p-1 ${
          isDark 
            ? 'bg-gradient-to-r from-indigo-700 via-purple-700 to-indigo-900 shadow-lg shadow-indigo-500/40' 
            : 'bg-gradient-to-r from-yellow-400 via-orange-400 to-amber-400 shadow-lg shadow-yellow-500/40'
        } ${isHovered ? 'scale-105 shadow-xl' : ''} ${isClicked ? 'scale-95' : ''}`}
        aria-label="Changer le thème"
      >
        {/* Background glow effect */}
        <div 
          className={`absolute inset-0 rounded-full transition-opacity duration-700 ${
            isDark 
              ? 'bg-purple-500/20 blur-xl opacity-50' 
              : 'bg-yellow-400/20 blur-xl opacity-50'
          } ${isHovered ? 'opacity-100' : 'opacity-50'}`}
        />

        {/* Particules animées */}
        {particles.map((particle) => (
          <div
            key={particle.id}
            className={`absolute rounded-full pointer-events-none ${
              isDark 
                ? 'bg-purple-300/60' 
                : 'bg-yellow-200/60'
            }`}
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              animation: `particleFloat ${particle.duration}s ease-in-out ${particle.delay}s infinite`,
              opacity: isHovered ? 0.8 : 0.3,
            }}
          />
        ))}

        {/* Cercle qui se déplace */}
        <div
          className={`relative z-10 w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 rounded-full bg-white shadow-lg transform transition-all duration-500 flex items-center justify-center ${
            isDark 
              ? 'translate-x-6 sm:translate-x-7 md:translate-x-8 rotate-180' 
              : 'translate-x-0 rotate-0'
          } ${isHovered ? 'scale-110' : ''} ${isClicked ? 'scale-90' : ''}`}
        >
          {isDark ? (
            <Moon className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-indigo-600 transition-all duration-500" />
          ) : (
            <Sun className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-yellow-500 transition-all duration-500" />
          )}
        </div>

        {/* Icônes en arrière-plan */}
        <Sun className={`hidden sm:block w-3 h-3 md:w-4 md:h-4 text-white/70 absolute left-1.5 transition-all duration-500 ${
          isDark ? 'opacity-30 scale-75' : 'opacity-100 scale-100'
        }`} />
        <Moon className={`hidden sm:block w-3 h-3 md:w-4 md:h-4 text-white/70 absolute right-1.5 transition-all duration-500 ${
          isDark ? 'opacity-100 scale-100' : 'opacity-30 scale-75'
        }`} />

        {/* Effet de brillance */}
        <div 
          className={`absolute inset-0 rounded-full bg-gradient-to-r from-white/0 via-white/20 to-white/0 transition-all duration-700 ${
            isHovered ? 'opacity-100 scale-110' : 'opacity-0 scale-100'
          }`}
          style={{
            transform: isHovered ? 'translateX(10px)' : 'translateX(-10px)',
          }}
        />

        {/* Étincelles */}
        {isHovered && (
          <>
            <Sparkles className="absolute -top-3 -left-1 w-3 h-3 text-yellow-300 animate-ping" />
            <Sparkles className="absolute -bottom-2 -right-1 w-2 h-2 text-purple-300 animate-ping delay-150" />
          </>
        )}

        {/* Ripples */}
        {ripples.map((ripple) => (
          <span
            key={ripple.id}
            className="absolute rounded-full pointer-events-none"
            style={{
              left: ripple.x - 20,
              top: ripple.y - 20,
              width: '40px',
              height: '40px',
              background: isDark 
                ? 'rgba(255,255,255,0.3)' 
                : 'rgba(255,200,0,0.3)',
              animation: 'rippleEffect 0.6s ease-out forwards',
            }}
          />
        ))}

        {/* Tooltip */}
        <span className={`absolute -bottom-8 left-1/2 -translate-x-1/2 text-[8px] sm:text-[10px] font-medium whitespace-nowrap transition-all duration-300 ${
          isHovered 
            ? 'opacity-100 translate-y-0' 
            : 'opacity-0 translate-y-1'
        } text-gray-500 dark:text-gray-400`}>
          {isDark ? '🌙 Mode sombre' : '☀️ Mode clair'}
        </span>
      </button>
    </div>
  );
};

// ✅ Ajout des animations dans le CSS global (index.css)
// Voir ci-dessous pour les styles à ajouter
export default ThemeToggle;