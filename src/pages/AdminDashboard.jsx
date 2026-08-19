// 📄 src/pages/AdminDashboard.jsx - Version corrigée
import { useState, useEffect } from "react";
import {
  Plus,
  Edit,
  Trash2,
  Download,
  Search,
  Package,
  Settings,
  Filter,
  Grid,
  List,
  RefreshCw,
} from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { allProducts } from "../data/products";
import ProductForm from "../components/Admin/ProductForm";
import { downloadProductsFile } from "../utils/productExporter";
import { supabase } from "../config/supabase";

const AdminDashboard = () => {
  const { isDark } = useTheme();
  const [products, setProducts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState("grid");
  const [syncStatus, setSyncStatus] = useState("idle");
  const [isOnline, setIsOnline] = useState(true);

  // ✅ Charger les produits depuis Supabase
  useEffect(() => {
    const loadProducts = async () => {
      setIsLoading(true);

      try {
        const { data, error } = await supabase
          .from("products")
          .select("*")
          .order("name");

        if (error) throw error;

        if (data && data.length > 0) {
          const uniqueMap = new Map();
          data.forEach((p) => {
            if (!uniqueMap.has(p.id)) {
              uniqueMap.set(p.id, p);
            }
          });
          const uniqueData = Array.from(uniqueMap.values());

          const formatted = uniqueData.map((p) => ({
            ...p,
            priceRange: p.price_range || p.priceRange || "",
            tags: p.tags || [],
            items: p.items || [],
            variants: p.variants || [],
            image: p.image || "",
          }));
          setProducts(formatted);
          setIsOnline(true);
          console.log(`✅ ${formatted.length} produits chargés depuis Supabase`);
        } else {
          console.warn("⚠️ Supabase vide, utilisation des données locales");
          const all = [...allProducts.women, ...allProducts.men];
          setProducts(all);
          setIsOnline(false);
        }
      } catch (error) {
        console.error("❌ Erreur de chargement:", error);
        const all = [...allProducts.women, ...allProducts.men];
        setProducts(all);
        setIsOnline(false);
      }

      setIsLoading(false);
    };

    loadProducts();
  }, []);

  // ✅ Ajouter un produit
  const handleAddProduct = async (newProduct) => {
    try {
      setSyncStatus("syncing");

      console.log('📦 Nouveau produit:', newProduct);
      console.log('📸 Image:', newProduct.image);

      const updated = [...products, newProduct];
      setProducts(updated);

      const { error } = await supabase.from("products").insert([
        {
          id: newProduct.id,
          name: newProduct.name,
          category: newProduct.category,
          description: newProduct.description || "",
          emoji: newProduct.emoji || "✨",
          image: newProduct.image || "",
          tags: newProduct.tags || [],
          price: newProduct.price || null,
          price_range: newProduct.priceRange || null,
          items: newProduct.items || [],
          variants: newProduct.variants || [],
          popularity: newProduct.popularity || "",
          color: newProduct.color || "from-pink-400 to-rose-400",
        },
      ]);

      if (error) {
        console.error('❌ Erreur Supabase:', error);
        throw error;
      }

      setSyncStatus("success");
      setIsOnline(true);
      setTimeout(() => setSyncStatus("idle"), 3000);
    } catch (error) {
      console.error("❌ Erreur de sauvegarde:", error);
      setSyncStatus("error");
      setIsOnline(false);
      setTimeout(() => setSyncStatus("idle"), 3000);
    }

    setIsModalOpen(false);
    setEditingProduct(null);
  };

  // ✅ Modifier un produit
  const handleEditProduct = async (updatedProduct) => {
    try {
      setSyncStatus("syncing");

      console.log('📝 Produit mis à jour:', updatedProduct.id);
      console.log('📸 Image:', updatedProduct.image);

      const updated = products.map((p) =>
        p.id === updatedProduct.id ? updatedProduct : p
      );
      setProducts(updated);

      const { error } = await supabase
        .from("products")
        .update({
          name: updatedProduct.name,
          category: updatedProduct.category,
          description: updatedProduct.description || "",
          emoji: updatedProduct.emoji || "✨",
          image: updatedProduct.image || "",
          tags: updatedProduct.tags || [],
          price: updatedProduct.price || null,
          price_range: updatedProduct.priceRange || null,
          items: updatedProduct.items || [],
          variants: updatedProduct.variants || [],
          popularity: updatedProduct.popularity || "",
          color: updatedProduct.color || "from-pink-400 to-rose-400",
          updated_at: new Date().toISOString(),
        })
        .eq("id", updatedProduct.id);

      if (error) {
        console.error('❌ Erreur Supabase:', error);
        throw error;
      }

      setSyncStatus("success");
      setIsOnline(true);
      setTimeout(() => setSyncStatus("idle"), 3000);
    } catch (error) {
      console.error("❌ Erreur de modification:", error);
      setSyncStatus("error");
      setIsOnline(false);
      setTimeout(() => setSyncStatus("idle"), 3000);
    }

    setIsModalOpen(false);
    setEditingProduct(null);
  };

  // ✅ Supprimer un produit
  const handleDeleteProduct = async (id) => {
    if (!window.confirm("Supprimer ce produit ?")) return;

    try {
      setSyncStatus("syncing");

      setProducts(products.filter((p) => p.id !== id));

      const { error } = await supabase
        .from("products")
        .delete()
        .eq("id", id);

      if (error) throw error;

      setSyncStatus("success");
      setIsOnline(true);
      setTimeout(() => setSyncStatus("idle"), 3000);
    } catch (error) {
      console.error("❌ Erreur de suppression:", error);
      setSyncStatus("error");
      setIsOnline(false);
      setTimeout(() => setSyncStatus("idle"), 3000);
    }
  };

  // ✅ Synchroniser depuis Supabase
  const handleSync = async () => {
    setSyncStatus("syncing");

    try {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("name");

      if (error) throw error;

      if (data && data.length > 0) {
        const uniqueMap = new Map();
        data.forEach((p) => {
          if (!uniqueMap.has(p.id)) {
            uniqueMap.set(p.id, p);
          }
        });
        const uniqueData = Array.from(uniqueMap.values());

        const formatted = uniqueData.map((p) => ({
          ...p,
          priceRange: p.price_range || p.priceRange || "",
          tags: p.tags || [],
          items: p.items || [],
          variants: p.variants || [],
          image: p.image || "",
        }));
        setProducts(formatted);
        setIsOnline(true);
        setSyncStatus("success");
        console.log(`✅ ${formatted.length} produits synchronisés`);
      } else {
        setSyncStatus("error");
      }
    } catch (error) {
      console.error("❌ Erreur de synchronisation:", error);
      setSyncStatus("error");
    }

    setTimeout(() => setSyncStatus("idle"), 3000);
  };

  // ✅ Exporter les données
  const handleExport = () => {
    downloadProductsFile(products);
  };

  const openAddModal = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  const openEditModal = (product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const filteredProducts = products.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCategory =
      selectedCategory === "all" || p.category === selectedCategory;
    return matchSearch && matchCategory;
  });

  const getCategoryBadge = (category) => {
    if (category === "pack") {
      return { label: "📦 Pack", className: "bg-gold/20 text-gold" };
    }
    return {
      label: "🛍️ Produit",
      className:
        "bg-blue-100 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400",
    };
  };

  const getPriceDisplay = (product) => {
    if (product.price) return `${product.price.toLocaleString()} FCFA`;
    if (product.priceRange) return product.priceRange;
    return "-";
  };

  // ✅ Fonction corrigée - Évite l'erreur "undefined"
  const getProductImage = (product) => {
    // ✅ Vérifier que product existe
    if (!product) return null;
    
    // ✅ Vérifier que l'image existe et n'est pas vide
    if (!product.image || product.image === '') return null;
    
    // ✅ Si c'est une URL complète (Supabase, Cloudinary, etc.)
    if (product.image.startsWith('http://') || product.image.startsWith('https://')) {
      return product.image;
    }
    
    // ✅ Si c'est une image locale
    if (product.image.startsWith('/')) return product.image;
    if (product.image.startsWith('images/')) return `/${product.image}`;
    return `/images/${product.image}`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-gold border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">
            Chargement des produits...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen pb-20 ${isDark ? "bg-[#0d0d1a]" : "bg-gray-50"}`}>
      {/* HEADER */}
      <div
        className={`sticky top-0 z-20 ${
          isDark ? "bg-[#1a1a2e]" : "bg-white"
        } border-b ${isDark ? "border-[#2d3748]" : "border-gray-200"} shadow-sm`}
      >
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-gold/10">
                <Settings className="w-5 h-5 text-gold" />
              </div>
              <div>
                <h1 className="text-base font-display font-bold text-gray-800 dark:text-white">
                  Administration
                </h1>
                <div className="flex items-center gap-2">
                  <p className="text-[10px] text-gray-500 dark:text-gray-400">
                    {products.length} produits
                  </p>
                  <span
                    className={`text-[8px] px-1.5 py-0.5 rounded-full flex items-center gap-0.5 ${
                      syncStatus === "syncing"
                        ? "bg-yellow-500/20 text-yellow-500 animate-pulse"
                        : syncStatus === "success"
                        ? "bg-green-500/20 text-green-500"
                        : syncStatus === "error"
                        ? "bg-red-500/20 text-red-500"
                        : isOnline
                        ? "bg-green-500/20 text-green-500"
                        : "bg-red-500/20 text-red-500"
                    }`}
                  >
                    {syncStatus === "syncing"
                      ? "🔄 Sync..."
                      : syncStatus === "success"
                      ? "✅ Sauvegardé"
                      : syncStatus === "error"
                      ? "❌ Erreur"
                      : isOnline
                      ? "🟢 En ligne"
                      : "🔴 Hors ligne"}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                onClick={handleSync}
                className="p-2 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 hover:bg-blue-500/20 transition-colors"
                title="Synchroniser"
              >
                <RefreshCw
                  className={`w-4 h-4 ${
                    syncStatus === "syncing" ? "animate-spin" : ""
                  }`}
                />
              </button>
              <button
                onClick={handleExport}
                className="p-2 rounded-xl bg-green-500/10 text-green-600 dark:text-green-400 hover:bg-green-500/20 transition-colors"
                title="Exporter"
              >
                <Download className="w-4 h-4" />
              </button>
              <button
                onClick={openAddModal}
                className="p-2 rounded-xl bg-gold text-gray-900 hover:bg-gold/80 transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* RECHERCHE */}
      <div
        className="px-4 py-3 sticky top-[61px] z-10 bg-gray-50/95 dark:bg-[#0d0d1a]/95 backdrop-blur-sm border-b border-gray-100 dark:border-[#2d3748]"
      >
        <div className="flex items-center gap-2">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher un produit..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full pl-9 pr-3 py-2.5 rounded-xl border text-sm ${
                isDark
                  ? "bg-[#2a2a4a] border-[#2d3748] text-white placeholder-gray-400"
                  : "bg-white border-gray-200 text-gray-800"
              } focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none transition-all`}
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`p-2.5 rounded-xl border transition-all ${
              showFilters
                ? `border-gold text-gold ${
                    isDark ? "bg-gold/10" : "bg-gold/5"
                  }`
                : `border-gray-200 dark:border-[#2d3748] text-gray-400`
            }`}
          >
            <Filter className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}
            className="p-2.5 rounded-xl border border-gray-200 dark:border-[#2d3748] text-gray-400 hover:text-gold transition-colors"
          >
            {viewMode === "grid" ? (
              <List className="w-4 h-4" />
            ) : (
              <Grid className="w-4 h-4" />
            )}
          </button>
        </div>

        {showFilters && (
          <div className="mt-3 flex flex-wrap gap-1.5 animate-fade-in">
            <button
              onClick={() => setSelectedCategory("all")}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                selectedCategory === "all"
                  ? "bg-gold text-gray-900"
                  : `bg-gray-100 dark:bg-[#2a2a4a] text-gray-600 dark:text-gray-400`
              }`}
            >
              Tous
            </button>
            <button
              onClick={() => setSelectedCategory("product")}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                selectedCategory === "product"
                  ? "bg-blue-500 text-white"
                  : `bg-gray-100 dark:bg-[#2a2a4a] text-gray-600 dark:text-gray-400`
              }`}
            >
              Produits
            </button>
            <button
              onClick={() => setSelectedCategory("pack")}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                selectedCategory === "pack"
                  ? "bg-gold text-gray-900"
                  : `bg-gray-100 dark:bg-[#2a2a4a] text-gray-600 dark:text-gray-400`
              }`}
            >
              Packs
            </button>
            <span className="text-[10px] text-gray-400 dark:text-gray-500 self-center ml-1">
              {filteredProducts.length} résultat
              {filteredProducts.length > 1 ? "s" : ""}
            </span>
          </div>
        )}
      </div>

      {/* LISTE DES PRODUITS */}
      <div className="px-4 py-3">
        {filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <Package className="w-12 h-12 mx-auto text-gray-300 dark:text-gray-600 mb-3" />
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              {searchTerm ? "Aucun produit trouvé" : "Aucun produit"}
            </p>
            {!searchTerm && (
              <button
                onClick={openAddModal}
                className="mt-3 text-sm text-gold font-medium hover:underline"
              >
                Ajouter un produit
              </button>
            )}
          </div>
        ) : viewMode === "grid" ? (
          <div className="grid grid-cols-2 gap-2.5">
            {filteredProducts.map((product) => {
              const badge = getCategoryBadge(product.category);
              const imageUrl = getProductImage(product);
              return (
                <div
                  key={product.id}
                  className={`rounded-xl overflow-hidden border ${
                    isDark
                      ? "border-[#2d3748] bg-[#1a1a2e]"
                      : "border-gray-200 bg-white"
                  }`}
                >
                  <div className="aspect-square flex items-center justify-center bg-gray-50 dark:bg-[#141425] relative">
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt={product.name}
                        className="w-full h-full object-contain"
                        onError={(e) => {
                          console.warn('⚠️ Erreur chargement image:', imageUrl);
                          e.target.style.display = "none";
                        }}
                      />
                    ) : (
                      <span className="text-5xl">{product.emoji || "✨"}</span>
                    )}
                  </div>
                  <div className="p-2.5">
                    <div className="flex items-start justify-between gap-1">
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-xs truncate text-gray-800 dark:text-white">
                          {product.name}
                        </p>
                        <span
                          className={`text-[9px] px-1.5 py-0.5 rounded-full ${badge.className}`}
                        >
                          {badge.label}
                        </span>
                      </div>
                      <div className="flex items-center gap-0.5 flex-shrink-0">
                        <button
                          onClick={() => openEditModal(product)}
                          className="p-1.5 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-lg text-blue-500 transition-colors"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(product.id)}
                          className="p-1.5 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg text-red-500 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                    <p className="text-[10px] font-medium text-gray-700 dark:text-gray-300 mt-0.5">
                      {getPriceDisplay(product)}
                    </p>
                    {product.tags && product.tags.length > 0 && (
                      <div className="flex flex-wrap gap-0.5 mt-1">
                        {product.tags.slice(0, 2).map((tag, i) => (
                          <span
                            key={i}
                            className="text-[7px] px-1.5 py-0.5 bg-gray-100 dark:bg-[#2a2a4a] rounded-full text-gray-500 dark:text-gray-400"
                          >
                            {tag}
                          </span>
                        ))}
                        {product.tags.length > 2 && (
                          <span className="text-[7px] text-gray-400">
                            +{product.tags.length - 2}
                          </span>
                        )}
                      </div>
                    )}
                    <p className="text-[9px] text-gray-400 dark:text-gray-500 mt-1">
                      {product.id}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="space-y-2">
            {filteredProducts.map((product) => {
              const badge = getCategoryBadge(product.category);
              const imageUrl = getProductImage(product);
              return (
                <div
                  key={product.id}
                  className={`flex items-center gap-3 p-3 rounded-xl border ${
                    isDark
                      ? "border-[#2d3748] bg-[#1a1a2e]"
                      : "border-gray-200 bg-white"
                  }`}
                >
                  <div className="w-12 h-12 rounded-lg bg-gray-100 dark:bg-[#141425] flex items-center justify-center flex-shrink-0 overflow-hidden">
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt={product.name}
                        className="w-full h-full object-contain"
                        onError={(e) => {
                          console.warn('⚠️ Erreur chargement image:', imageUrl);
                          e.target.style.display = "none";
                        }}
                      />
                    ) : (
                      <span className="text-2xl">{product.emoji || "✨"}</span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm truncate text-gray-800 dark:text-white">
                      {product.name}
                    </p>
                    <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                      <span
                        className={`text-[9px] px-1.5 py-0.5 rounded-full ${badge.className}`}
                      >
                        {badge.label}
                      </span>
                      <span className="text-[10px] font-medium text-gray-700 dark:text-gray-300">
                        {getPriceDisplay(product)}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <button
                      onClick={() => openEditModal(product)}
                      className="p-1.5 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-lg text-blue-500 transition-colors"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteProduct(product.id)}
                      className="p-1.5 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg text-red-500 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* BOUTON AJOUTER */}
      <button
        onClick={openAddModal}
        className="fixed bottom-6 right-6 z-30 w-14 h-14 rounded-full bg-gold text-gray-900 shadow-xl shadow-gold/30 flex items-center justify-center hover:scale-110 transition-all active:scale-95"
      >
        <Plus className="w-6 h-6" />
      </button>

      {/* MODAL */}
      <ProductForm
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingProduct(null);
        }}
        onSave={editingProduct ? handleEditProduct : handleAddProduct}
        editingProduct={editingProduct}
        isDark={isDark}
        existingProducts={products}
      />
    </div>
  );
};

export default AdminDashboard;