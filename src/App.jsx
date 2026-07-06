// 📄 src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { ThemeProvider } from './context/ThemeContext';
import HomePage from './pages/HomePage';
import WomenShop from './pages/WomenShop';
import MenShop from './pages/MenShop';
import CreatePackPage from './pages/CreatePackPage';
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
              {/* ✅ Page d'accueil */}
              <Route path="/" element={<HomePage />} />
              
              {/* ✅ Boutiques */}
              <Route path="/femme" element={<WomenShop />} />
              <Route path="/homme" element={<MenShop />} />
              
              {/* ✅ Création de pack */}
              <Route path="/creer-pack" element={<CreatePackPage />} />
            </Routes>
          </Layout>
          <WhatsAppFloat />
        </Router>
      </CartProvider>
    </ThemeProvider>
  );
}

export default App;