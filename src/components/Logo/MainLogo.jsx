// 📄 src/components/Logo/MainLogo.jsx
const MainLogo = ({ className = "", text = true, size = 'md' }) => {
  // Tailles optimisées pour chaque usage
  const sizes = {
    // Header - très compact
    header: { 
      container: 'w-8 h-8 md:w-10 md:h-10', 
      text: 'text-sm md:text-base', 
      sub: 'text-[8px] md:text-[9px]',
      gap: 'gap-1.5 md:gap-2',
      image: 'rounded-lg'
    },
    // Menu mobile
    mobile: { 
      container: 'w-10 h-10', 
      text: 'text-base', 
      sub: 'text-[8px]',
      gap: 'gap-2',
      image: 'rounded-lg'
    },
    // Bannière / Hero
    banner: { 
      container: 'w-16 h-16 md:w-20 md:h-20', 
      text: 'text-2xl md:text-3xl', 
      sub: 'text-xs md:text-sm',
      gap: 'gap-3 md:gap-4',
      image: 'rounded-xl'
    },
    // Footer
    footer: { 
      container: 'w-10 h-10', 
      text: 'text-base', 
      sub: 'text-[8px]',
      gap: 'gap-2',
      image: 'rounded-lg'
    },
    // Grande taille
    large: { 
      container: 'w-24 h-24', 
      text: 'text-3xl', 
      sub: 'text-sm',
      gap: 'gap-4',
      image: 'rounded-2xl'
    },
  };

  const s = sizes[size] || sizes.header;

  return (
    <div className={`flex items-center ${s.gap} ${className}`}>
      {/* Logo Image */}
      <div className={`relative ${s.container} overflow-hidden shadow-md border-2 border-gold/20 flex-shrink-0 ${s.image}`}>
        <img 
          src="/images/logos/logo-main.jpeg" 
          alt="WIN'S PACK" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-tr from-gold/10 via-transparent to-transparent" />
      </div>
      
      {/* Texte */}
      {text && (
        <div className="flex flex-col leading-tight">
          <span className={`${s.text} font-display font-bold tracking-tight text-gray-800 dark:text-white`}>
            WIN'S
          </span>
          <div className="flex items-center gap-1">
            <span className={`${s.sub} font-bold text-gold tracking-[0.15em] uppercase`}>
              PACK
            </span>
            <span className={`${s.sub} text-gray-400 dark:text-gray-500 font-light hidden xs:inline`}>|</span>
            <span className={`${s.sub} text-gray-400 dark:text-gray-500 font-light tracking-wider hidden xs:inline`}>
              Confiance
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default MainLogo;