// 📄 src/App.jsx - Version corrigée avec flags future
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { ThemeProvider } from './context/ThemeContext';
import HomePage from './pages/HomePage';
import WomenShop from './pages/WomenShop';
import MenShop from './pages/MenShop';
import Layout from './components/Layout/Layout';
import WhatsAppFloat from './components/Layout/WhatsAppFloat';

function App() {
  return (
    <ThemeProvider>
      <CartProvider>
        <Router
          future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true,
          }}
        >
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
    </ThemeProvider>
  );
}

export default App;