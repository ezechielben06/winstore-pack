// 📄 src/components/Logo/MenLogo.jsx
const MenLogo = ({ className = "w-30 h-30", text = true }) => {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <img 
        src="/images/logos/logo-men.jpeg" 
        alt="WIN'STORE Boutique Homme" 
        className="w-30 h-30 object-contain rounded-lg"
      />
      
      {text && (
        <div className="flex flex-col leading-tight">
          <span className="text-xl font-display font-bold text-masculine-primary">WIN'STORE</span>
          <span className="text-[10px] font-medium text-masculine-secondary tracking-widest uppercase">Boutique Homme</span>
        </div>
      )}
    </div>
  );
};

export default MenLogo;