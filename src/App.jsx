import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import HomePage from './pages/HomePage';
import WomenShop from './pages/WomenShop';
import MenShop from './pages/MenShop';
import Layout from './components/Layout/Layout';
import WhatsAppFloat from './components/Layout/WhatsAppFloat';

function App() {
  return (
    <CartProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/femme" element={<WomenShop />} />
            <Route path="/homme" element={<MenShop />} />
          </Routes>
        </Layout>
        <WhatsAppFloat />
      </Router>
    </CartProvider>
  );
}

export default App;