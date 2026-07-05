// 📄 src/components/Logo/MainLogo.jsx
const MainLogo = ({ className = "w-12 h-12", text = true }) => {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <img 
        src="/images/logos/logo-main.jpeg" 
        alt="WIN'STORE PACKS" 
        className="w-30 h-30 object-contain rounded-lg"
      />
      
      {text && (
        <div className="flex flex-col leading-tight">
          <span className="text-xl font-display font-bold text-gray-800">WIN'STORE</span>
          <span className="text-[10px] font-medium text-gold tracking-widest uppercase">PACKS</span>
        </div>
      )}
    </div>
  );
};

export default MainLogo;