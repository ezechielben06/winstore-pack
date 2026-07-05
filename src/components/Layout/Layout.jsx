import Header from './Header';
import Footer from './Footer';
import CartDrawer from '../Cart/CartDrawer';
import { useState } from 'react';

const Layout = ({ children }) => {
  const [isCartOpen, setIsCartOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col">
      <Header onCartClick={() => setIsCartOpen(true)} />
      <main className="flex-1">{children}</main>
      <Footer />
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </div>
  );
};

export default Layout;