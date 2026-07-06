// 📄 src/components/Layout/Layout.jsx
import { useState } from 'react';
import Header from './Header';
import Footer from './Footer';
import CartDrawer from '../Cart/CartDrawer';
import MobileBottomNav from './MobileBottomNav';

const Layout = ({ children }) => {
  const [isCartOpen, setIsCartOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-[#0d0d1a]">
      <Header onCartClick={() => setIsCartOpen(true)} />
      <main className="flex-1 pb-20 md:pb-0">
        {children}
      </main>
      <Footer />
      <MobileBottomNav onCartClick={() => setIsCartOpen(true)} />
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </div>
  );
};

export default Layout;