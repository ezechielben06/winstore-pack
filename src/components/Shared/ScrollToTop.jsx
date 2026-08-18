// 📄 src/components/Shared/ScrollToTop.jsx - Nouveau fichier
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // ✅ Scroll en haut de page à chaque changement de route
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth' // ← Animation fluide
    });
  }, [pathname]);

  return null;
};

export default ScrollToTop;