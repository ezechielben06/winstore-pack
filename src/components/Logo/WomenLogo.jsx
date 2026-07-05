// 📄 src/components/Logo/WomenLogo.jsx
const WomenLogo = ({ className = "w-12 h-12", text = true }) => {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <img 
        src="/images/logos/logo-women.jpeg" 
        alt="WIN'STORE Boutique Femme" 
        className="w-30 h-30 contain rounded-lg"
      />
      
      {text && (
        <div className="flex flex-col leading-tight">
          <span className="text-xl font-display font-bold text-feminine-primary">WIN'STORE</span>
          <span className="text-[10px] font-medium text-feminine-secondary tracking-widest uppercase">Boutique Femme</span>
        </div>
      )}
    </div>
  );
};

export default WomenLogo;