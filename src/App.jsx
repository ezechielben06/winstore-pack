// 📄 src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import HomePage from './pages/HomePage';
import WomenShop from './pages/WomenShop';
import MenShop from './pages/MenShop';
import CreatePackPage from './pages/CreatePackPage';
import ProductDetailsPage from './pages/ProductDetailsPage';
import AdminDashboard from './pages/AdminDashboard';
import AdminLogin from './pages/AdminLogin';
import PrivateRoute from './components/Admin/PrivateRoute';
import ScrollToTop from './components/Shared/ScrollToTop'; // ✅ IMPORTER
import Layout from './components/Layout/Layout';
import WhatsAppFloat from './components/Layout/WhatsAppFloat';

function App() {
  return (
    <ThemeProvider>
      <CartProvider>
        <AuthProvider>
          <Router
            future={{
              v7_startTransition: true,
              v7_relativeSplatPath: true,
            }}
          >
            {/* ✅ AJOUTER ICI - avant Layout */}
            <ScrollToTop />
            
            <Layout>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/femme" element={<WomenShop />} />
                <Route path="/homme" element={<MenShop />} />
                <Route path="/creer-pack" element={<CreatePackPage />} />
                <Route path="/produit/:productId" element={<ProductDetailsPage />} />
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route 
                  path="/admin" 
                  element={
                    <PrivateRoute>
                      <AdminDashboard />
                    </PrivateRoute>
                  } 
                />
              </Routes>
            </Layout>
            <WhatsAppFloat />
          </Router>
        </AuthProvider>
      </CartProvider>
    </ThemeProvider>
  );
}

export default App;