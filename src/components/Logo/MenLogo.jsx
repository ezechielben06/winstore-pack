// 📄 src/components/Logo/MenLogo.jsx
const MenLogo = ({ className = "", text = true, size = 'header' }) => {
  // Tailles optimisées pour chaque usage
  const sizes = {
    header: { 
      container: 'w-8 h-8 md:w-10 md:h-10', 
      text: 'text-sm md:text-base', 
      sub: 'text-[8px] md:text-[9px]',
      tag: 'text-[6px] md:text-[7px]',
      gap: 'gap-1.5 md:gap-2',
      image: 'rounded-lg'
    },
    mobile: { 
      container: 'w-10 h-10', 
      text: 'text-base', 
      sub: 'text-[8px]',
      tag: 'text-[6px]',
      gap: 'gap-2',
      image: 'rounded-lg'
    },
    banner: { 
      container: 'w-14 h-14 md:w-16 md:h-16', 
      text: 'text-xl md:text-2xl', 
      sub: 'text-[10px] md:text-xs',
      tag: 'text-[8px] md:text-[9px]',
      gap: 'gap-2 md:gap-3',
      image: 'rounded-xl'
    },
    footer: { 
      container: 'w-9 h-9', 
      text: 'text-sm', 
      sub: 'text-[7px]',
      tag: 'text-[6px]',
      gap: 'gap-1.5',
      image: 'rounded-lg'
    },
  };

  const s = sizes[size] || sizes.header;

  return (
    <div className={`flex items-center ${s.gap} ${className}`}>
      {/* Logo Image */}
      <div className={`relative ${s.container} overflow-hidden shadow-md border-2 border-masculine-primary/20 flex-shrink-0 ${s.image}`}>
        <img 
          src="/images/logos/logo-men.jpeg" 
          alt="WIN'S PACK - Boutique Homme" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-tr from-masculine-primary/10 via-transparent to-transparent" />
        <div className="absolute -bottom-1 -right-1 w-2 h-2 rounded-full bg-masculine-primary/20 blur-sm" />
      </div>
      
      {/* Texte */}
      {text && (
        <div className="flex flex-col leading-tight">
          <span className={`${s.text} font-display font-bold tracking-tight text-masculine-primary dark:text-masculine-primary`}>
            WIN'S
          </span>
          <div className="flex items-center gap-1">
            <span className={`${s.sub} font-bold text-masculine-primary/80 tracking-[0.15em] uppercase`}>
              PACK
            </span>
            <span className={`${s.sub} text-masculine-primary/40 font-light hidden xs:inline`}>|</span>
            <span className={`${s.tag} text-masculine-primary/60 font-light tracking-wider hidden xs:inline`}>
              Homme
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default MenLogo;