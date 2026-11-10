// 📄 src/App.jsx
import { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { CartProvider } from "./context/CartContext";
import { ThemeProvider } from "./context/ThemeContext";
import { AuthProvider } from "./context/AuthContext";

import HomePage from "./pages/HomePage";
import WomenShop from "./pages/WomenShop";
import MenShop from "./pages/MenShop";
import CreatePackPage from "./pages/CreatePackPage";
import ProductDetailsPage from "./pages/ProductDetailsPage";
import AdminDashboard from "./pages/AdminDashboard";
import AdminLogin from "./pages/AdminLogin";
import AdminAnnouncements from "./pages/AdminAnnouncements"; // ✅ ajout

import PrivateRoute from "./components/Admin/PrivateRoute";
import ScrollToTop from "./components/Shared/ScrollToTop";
import Layout from "./components/Layout/Layout";
import WhatsAppFloat from "./components/Layout/WhatsAppFloat";

import { initializeProducts } from "./config/supabase";
import { allProducts } from "./data/products";

function App() {
  // ✅ Initialisation idempotente (ne fait rien si la table n'est pas vide)
  useEffect(() => {
    initializeProducts(allProducts);
  }, []);

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
            <ScrollToTop />

            <Layout>
              <Routes>
                {/* ===== PUBLIC ===== */}
                <Route path="/" element={<HomePage />} />
                <Route path="/femme" element={<WomenShop />} />
                <Route path="/homme" element={<MenShop />} />
                <Route path="/creer-pack" element={<CreatePackPage />} />
                <Route
                  path="/produit/:productId"
                  element={<ProductDetailsPage />}
                />

                {/* ===== AUTH ===== */}
                <Route path="/admin/login" element={<AdminLogin />} />

                {/* ===== ADMIN (protégé) ===== */}
                <Route
                  path="/admin"
                  element={
                    <PrivateRoute>
                      <AdminDashboard />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/admin/announcements"
                  element={
                    <PrivateRoute>
                      <AdminAnnouncements />
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