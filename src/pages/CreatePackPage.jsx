// 📄 src/pages/CreatePackPage.jsx
// ✅ Images prioritaires (produit + variante), fallback emoji
// ✅ Charge les produits depuis Supabase
import { useState, useEffect, useMemo } from "react";
import {
  ArrowLeft,
  Package,
  Search,
  Check,
  Minus,
  Plus,
  Trash2,
  Gift,
  Wand2,
  Lightbulb,
  ShoppingBag,
  Filter,
  X,
  Palette,
  Image as ImageIcon,
  AlertCircle,
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useTheme } from "../context/ThemeContext";
import { supabase } from "../config/supabase";
import { allProducts } from "../data/products";

// ✅ Normalise un produit Supabase → format attendu
const normalizeProduct = (p) => ({
  ...p,
  priceRange: p.price_range || p.priceRange || "",
  tags: p.tags || [],
  items: p.items || [],
  variants: p.variants || [],
  image: p.image || "",
});

// ✅ Résout un chemin d'image (http, /absolu, images/, relatif)
const getImagePath = (image) => {
  if (!image) return null;
  if (image.startsWith("http://") || image.startsWith("https://")) return image;
  if (image.startsWith("/")) return image;
  if (image.startsWith("images/")) return `/${image}`;
  return `/images/${image}`;
};

// ✅ Image à afficher : variante > produit > null
const getDisplayImage = (product, variant = null) => {
  if (variant && variant.image) return getImagePath(variant.image);
  if (product.variants && product.variants.length > 0) {
    const v = product.variants.find((x) => x.image);
    if (v) return getImagePath(v.image);
  }
  if (product.image) return getImagePath(product.image);
  return null;
};

// ✅ Vignette réutilisable : image en priorité, fallback emoji
const ProductThumb = ({ imageUrl, alt, emoji, className = "" }) => {
  if (imageUrl) {
    return (
      <img
        src={imageUrl}
        alt={alt}
        loading="lazy"
        className={`w-full h-full object-cover ${className}`}
        onError={(e) => {
          e.currentTarget.style.display = "none";
          const parent = e.currentTarget.parentElement;
          if (parent) {
            parent.innerHTML = `<div class="w-full h-full flex items-center justify-center text-4xl">${emoji || "✨"}</div>`;
          }
        }}
      />
    );
  }
  return (
    <div className="w-full h-full flex items-center justify-center text-4xl">
      {emoji || "✨"}
    </div>
  );
};

const CreatePackPage = () => {
  const { addToCart } = useCart();
  const { isDark } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();

  const isWomen =
    location.state?.from === "femme" ||
    location.pathname.includes("femme") ||
    false;
  const returnPath =
    location.state?.returnPath || (isWomen ? "/femme" : "/homme");

  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [productsError, setProductsError] = useState(null);

  const [selectedItems, setSelectedItems] = useState([]);
  const [packName, setPackName] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [showVariantSelector, setShowVariantSelector] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);

  const themeBg = isWomen ? "bg-feminine-primary" : "bg-masculine-primary";
  const themeGradient = isWomen
    ? "from-feminine-primary to-feminine-secondary"
    : "from-masculine-primary to-masculine-secondary";
  const themeShadow = isWomen
    ? "shadow-lg shadow-feminine-primary/30"
    : "shadow-lg shadow-masculine-primary/30";
  const themeBgGradient = isWomen
    ? "bg-gradient-to-b from-feminine-light/30 to-white"
    : "bg-gradient-to-b from-masculine-light/30 to-white";

  // ✅ Chargement Supabase
  useEffect(() => {
    let isMounted = true;

    const loadProducts = async () => {
      setLoadingProducts(true);
      setProductsError(null);

      try {
        const orFilter = isWomen
          ? "id.ilike.w%,id.ilike.p%"
          : "id.ilike.m%,id.ilike.mp%";

        const { data, error } = await supabase
          .from("products")
          .select("*")
          .or(orFilter)
          .eq("category", "product")
          .order("name");

        if (error) throw error;

        if (isMounted) {
          if (data && data.length > 0) {
            setProducts(data.map(normalizeProduct));
          } else {
            const local = isWomen ? allProducts.women : allProducts.men;
            setProducts(local.filter((p) => p.category === "product"));
          }
        }
      } catch (err) {
        console.error("❌ Erreur chargement produits:", err);
        if (isMounted) {
          setProductsError(
            "Impossible de charger les produits. Mode hors ligne activé."
          );
          const local = isWomen ? allProducts.women : allProducts.men;
          setProducts(local.filter((p) => p.category === "product"));
        }
      } finally {
        if (isMounted) setLoadingProducts(false);
      }
    };

    loadProducts();
    return () => {
      isMounted = false;
    };
  }, [isWomen]);

  const availableProducts = useMemo(
    () => products.filter((p) => p.category === "product"),
    [products]
  );

  const categories = useMemo(() => {
    const allTags = availableProducts.flatMap((p) => p.tags || []);
    return ["all", ...new Set(allTags)];
  }, [availableProducts]);

  const suggestions = useMemo(() => {
    const grouped = {};
    availableProducts.forEach((p) => {
      (p.tags || []).forEach((tag) => {
        if (!grouped[tag]) grouped[tag] = [];
        grouped[tag].push(p);
      });
    });
    return {
      categories: Object.keys(grouped).slice(0, 6),
      popular: availableProducts.filter((p) => p.popularity).slice(0, 6),
    };
  }, [availableProducts]);

  const filteredProducts = useMemo(() => {
    let results = availableProducts;
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase().trim();
      results = results.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q) ||
          p.tags?.some((tag) => tag.toLowerCase().includes(q))
      );
    }
    if (selectedCategory !== "all") {
      results = results.filter((p) => p.tags?.includes(selectedCategory));
    }
    return results;
  }, [availableProducts, searchTerm, selectedCategory]);

  const getProductPrice = (product, variant = null) => {
    if (variant && variant.price != null) return variant.price;
    return product.price || parseInt(product.priceRange?.split("-")[0]) || 0;
  };

  const addItem = (product, variant = null) => {
    const price = getProductPrice(product, variant);
    const item = {
      ...product,
      price,
      selectedVariant: variant || null,
      variantId: variant ? variant.id : null,
    };

    const existing = selectedItems.find(
      (x) =>
        x.id === product.id &&
        x.variantId === (variant ? variant.id : null)
    );

    if (existing) {
      setSelectedItems((prev) =>
        prev.map((x) =>
          x.id === product.id &&
          x.variantId === (variant ? variant.id : null)
            ? { ...x, quantity: (x.quantity || 1) + 1 }
            : x
        )
      );
      return;
    }

    setSelectedItems([...selectedItems, { ...item, quantity: 1 }]);
    if (selectedItems.length === 0) setShowSuggestions(false);
  };

  const openVariantSelector = (product) => {
    if (product.variants && product.variants.length > 0) {
      setCurrentProduct(product);
      setSelectedVariant(product.variants[0]);
      setShowVariantSelector(true);
    } else {
      addItem(product);
    }
  };

  const confirmVariant = () => {
    if (currentProduct && selectedVariant) {
      addItem(currentProduct, selectedVariant);
      setShowVariantSelector(false);
      setCurrentProduct(null);
      setSelectedVariant(null);
    }
  };

  const removeItem = (itemId, variantId = null) => {
    setSelectedItems(
      selectedItems.filter(
        (x) => !(x.id === itemId && x.variantId === variantId)
      )
    );
    if (selectedItems.length === 1) setShowSuggestions(true);
  };

  const updateQuantity = (itemId, variantId, delta) => {
    setSelectedItems((prev) =>
      prev
        .map((x) => {
          if (x.id === itemId && x.variantId === variantId) {
            const q = (x.quantity || 1) + delta;
            if (q <= 0) return null;
            return { ...x, quantity: q };
          }
          return x;
        })
        .filter(Boolean)
    );
  };

  const totalPrice = selectedItems.reduce(
    (s, x) => s + (x.price || 0) * (x.quantity || 1),
    0
  );
  const totalItems = selectedItems.reduce(
    (s, x) => s + (x.quantity || 1),
    0
  );

  const clearSearch = () => setSearchTerm("");

  const createPack = () => {
    if (selectedItems.length < 3) {
      alert("Un pack doit contenir au moins 3 articles !");
      return;
    }

    const pack = {
      id: `custom-${Date.now()}`,
      name: packName || "Pack Personnalisé",
      category: "pack",
      price: totalPrice,
      description: `Pack composé de ${totalItems} articles`,
      items: selectedItems.flatMap((x) =>
        Array(x.quantity || 1).fill(
          x.selectedVariant
            ? `${x.name} (${x.selectedVariant.value})`
            : x.name
        )
      ),
      selectedItems: selectedItems.map((x) => ({
        id: x.id,
        name: x.name,
        price: x.price || 0,
        quantity: x.quantity || 1,
        emoji: x.emoji || "",
        image: x.image || "",
        variant: x.selectedVariant || null,
        variantId: x.variantId || null,
      })),
      emoji: "🎨",
      isCustom: true,
      popularity: "✨",
    };

    addToCart(pack);
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      navigate(returnPath);
    }, 2500);
  };

  // ✅ Sélecteur de variantes
  const renderVariantSelector = () => {
    if (!showVariantSelector || !currentProduct) return null;
    const variants = currentProduct.variants || [];
    const isColor = (n) => n === "couleur" || n === "color";

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
        <div
          className={`w-full max-w-md rounded-2xl ${
            isDark ? "bg-[#1a1a2e]" : "bg-white"
          } shadow-2xl border ${
            isDark ? "border-[#2d3748]" : "border-gray-200"
          } p-6`}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-bold text-gray-800 dark:text-white flex items-center gap-2">
              <Palette className="w-5 h-5 text-gold" />
              Choisis ta variante
            </h3>
            <button
              type="button"
              onClick={() => setShowVariantSelector(false)}
              className="p-1 hover:bg-gray-100 dark:hover:bg-[#2a2a4a] rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            {currentProduct.name}
          </p>

          <div className="space-y-3 max-h-64 overflow-y-auto">
            {variants.map((variant) => {
              const isSelected = selectedVariant?.id === variant.id;
              const isColorType = isColor(variant.name);
              const variantImage = getImagePath(variant.image);

              return (
                <button
                  key={variant.id}
                  type="button"
                  onClick={() => setSelectedVariant(variant)}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl border-2 transition-all ${
                    isSelected
                      ? "border-gold bg-gold/5"
                      : "border-gray-200 dark:border-[#2d3748] hover:border-gold/50"
                  }`}
                >
                  <div className="w-12 h-12 rounded-lg bg-gray-100 dark:bg-[#2a2a4a] flex items-center justify-center overflow-hidden flex-shrink-0">
                    {variantImage ? (
                      <img
                        src={variantImage}
                        alt={variant.value}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                          const parent = e.currentTarget.parentElement;
                          if (parent) {
                            parent.innerHTML = `<span class="text-lg">${currentProduct.emoji || "✨"}</span>`;
                          }
                        }}
                      />
                    ) : isColorType ? (
                      <div
                        className="w-8 h-8 rounded-full border-2 border-white shadow"
                        style={{
                          background:
                            variant.color || variant.value.toLowerCase(),
                        }}
                      />
                    ) : (
                      <ImageIcon className="w-5 h-5 text-gray-400" />
                    )}
                  </div>
                  <div className="flex-1 text-left">
                    <p className="font-medium text-sm text-gray-800 dark:text-white">
                      {variant.value}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {variant.price != null
                        ? `${variant.price.toLocaleString()} FCFA`
                        : "Prix standard"}
                      {variant.stock != null &&
                        variant.stock < 5 &&
                        variant.stock > 0 && (
                          <span className="ml-2 text-amber-500">
                            Stock: {variant.stock}
                          </span>
                        )}
                    </p>
                  </div>
                  {isSelected && (
                    <Check className="w-5 h-5 text-gold flex-shrink-0" />
                  )}
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-3 mt-4">
            <button
              type="button"
              onClick={confirmVariant}
              className="flex-1 bg-gold text-gray-900 py-2.5 rounded-xl font-semibold hover:bg-gold/80 transition-colors"
            >
              Sélectionner
            </button>
            <button
              type="button"
              onClick={() => setShowVariantSelector(false)}
              className="px-4 py-2.5 rounded-xl border border-gray-200 dark:border-[#2d3748] text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-[#2a2a4a] transition-colors"
            >
              Annuler
            </button>
          </div>
        </div>
      </div>
    );
  };

  // ✅ Loading
  if (loadingProducts) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center ${
          isDark ? "bg-[#0d0d1a]" : "bg-gray-50"
        }`}
      >
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
    <div
      className={`min-h-screen ${isDark ? "bg-[#0d0d1a]" : themeBgGradient}`}
    >
      {/* Bannière */}
      <div
        className={`relative overflow-hidden ${
          isDark ? "bg-[#1a1a2e]" : themeBg
        } py-4 md:py-6`}
      >
        <div className="absolute top-0 right-0 w-32 h-32 md:w-64 md:h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-32 h-32 md:w-64 md:h-64 bg-white/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

        <div className="container mx-auto px-4 relative">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-white/20 backdrop-blur-sm">
                <Wand2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-lg md:text-2xl font-display font-bold text-white">
                  Crée ton pack personnalisé
                </h1>
                <p className="text-xs md:text-sm text-white/80">
                  {isWomen ? "👩 Boutique Femme" : "👨 Boutique Homme"}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => navigate(returnPath)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition-colors text-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              Retour
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 max-w-7xl">
        {productsError && (
          <div className="mb-4 max-w-2xl mx-auto p-3 rounded-xl bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-500 flex-shrink-0" />
            <p className="text-xs text-amber-700 dark:text-amber-400">
              {productsError}
            </p>
          </div>
        )}

        {/* Progression */}
        <div className="max-w-2xl mx-auto mb-6">
          <div className="flex items-center gap-4">
            <div className="flex-1 h-2 rounded-full bg-gray-200 dark:bg-[#2a2a4a] overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-gold to-yellow-400 transition-all duration-500"
                style={{
                  width: `${Math.min(
                    (selectedItems.length / 3) * 100,
                    100
                  )}%`,
                }}
              />
            </div>
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400 whitespace-nowrap">
              {selectedItems.length < 3
                ? `${selectedItems.length}/3`
                : "✅ Complet"}
            </span>
          </div>

          <div className="text-center mt-2">
            {selectedItems.length === 0 && (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                💡 Sélectionne au moins 3 articles pour créer ton pack
              </p>
            )}
            {selectedItems.length > 0 && selectedItems.length < 3 && (
              <p className="text-sm text-blue-500 dark:text-blue-400">
                ⚡ Encore {3 - selectedItems.length} article
                {3 - selectedItems.length > 1 ? "s" : ""} pour valider
              </p>
            )}
            {selectedItems.length >= 3 && (
              <p className="text-sm text-green-500 dark:text-green-400 flex items-center justify-center gap-1.5">
                <Check className="w-4 h-4" />
                Pack prêt ! {packName && `"${packName}"`}
              </p>
            )}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Colonne gauche */}
          <div className="lg:col-span-2">
            <div
              className={`rounded-2xl ${
                isDark ? "bg-[#1a1a2e]" : "bg-white"
              } shadow-sm border ${
                isDark ? "border-[#2d3748]" : "border-gray-200"
              } p-4`}
            >
              {/* Suggestions */}
              {showSuggestions &&
                selectedItems.length === 0 &&
                !searchTerm &&
                availableProducts.length > 0 && (
                  <div className="mb-4 p-4 rounded-xl bg-gradient-to-r from-gold/10 to-amber-50 border border-gold/20">
                    <div className="flex items-center gap-2 mb-3">
                      <Lightbulb className="w-5 h-5 text-gold" />
                      <span className="font-semibold text-gray-700 dark:text-gray-300">
                        Besoin d'inspiration ?
                      </span>
                    </div>

                    {suggestions.categories.length > 0 && (
                      <div className="mb-3">
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1.5">
                          Catégories populaires :
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {suggestions.categories.map((cat) => (
                            <button
                              key={cat}
                              type="button"
                              onClick={() => setSelectedCategory(cat)}
                              className="px-3 py-1 rounded-full text-xs bg-white dark:bg-[#2a2a4a] border border-gray-200 dark:border-[#2d3748] hover:border-gold transition-colors"
                            >
                              {cat}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {suggestions.popular.length > 0 && (
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1.5">
                          Articles populaires :
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {suggestions.popular.map((p) => (
                            <button
                              key={p.id}
                              type="button"
                              onClick={() => openVariantSelector(p)}
                              className="px-3 py-1 rounded-full text-xs bg-gold/10 text-gold border border-gold/20 hover:bg-gold/20 transition-colors"
                            >
                              {p.emoji} {p.name}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

              {/* Recherche + filtres */}
              <div className="flex flex-col gap-3 mb-4">
                <div className="flex items-center gap-2">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Rechercher un produit..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className={`w-full pl-9 pr-10 py-2.5 rounded-xl border text-sm ${
                        isDark
                          ? "bg-[#2a2a4a] border-[#2d3748] text-white placeholder-gray-400"
                          : "bg-gray-50 border-gray-200 text-gray-800"
                      } focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none transition-all`}
                    />
                    {searchTerm && (
                      <button
                        type="button"
                        onClick={clearSearch}
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-200 dark:hover:bg-[#3a3a5a] rounded-full transition-colors"
                      >
                        <X className="w-4 h-4 text-gray-400" />
                      </button>
                    )}
                  </div>
                  <button
                    type="button"
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
                </div>

                {searchTerm && (
                  <p className="text-xs text-gray-400 dark:text-gray-500">
                    {filteredProducts.length} résultat
                    {filteredProducts.length > 1 ? "s" : ""} pour "{searchTerm}"
                  </p>
                )}

                {showFilters && categories.length > 1 && (
                  <div className="flex flex-wrap gap-1.5 p-2 rounded-xl bg-gray-50 dark:bg-[#1a1a2e]">
                    {categories.map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setSelectedCategory(cat)}
                        className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                          selectedCategory === cat
                            ? `${themeBg} text-white`
                            : `bg-gray-200 dark:bg-[#2a2a4a] text-gray-600 dark:text-gray-400`
                        }`}
                      >
                        {cat === "all" ? "Tous" : cat}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* ✅ Grille produits — un seul niveau de bouton, image en priorité */}
              <div className="max-h-[500px] overflow-y-auto">
                {filteredProducts.length === 0 ? (
                  <div className="text-center py-12">
                    <Search className="w-12 h-12 mx-auto text-gray-300 dark:text-gray-600 mb-3" />
                    <p className="text-gray-500 dark:text-gray-400">
                      {availableProducts.length === 0
                        ? "Aucun produit disponible"
                        : "Aucun produit trouvé"}
                    </p>
                    {searchTerm && (
                      <button
                        type="button"
                        onClick={clearSearch}
                        className="mt-3 text-sm text-gold font-medium hover:underline"
                      >
                        Voir tous les produits
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {filteredProducts.map((product) => {
                      const isSelected = selectedItems.some(
                        (x) => x.id === product.id
                      );
                      const hasVariants =
                        product.variants && product.variants.length > 0;
                      const price = getProductPrice(product);
                      const imageUrl = getDisplayImage(product);

                      return (
                        <button
                          key={product.id}
                          type="button"
                          onClick={() => openVariantSelector(product)}
                          className={`relative p-2 rounded-xl border-2 transition-all text-left ${
                            isSelected
                              ? `border-gold bg-gold/5 ${
                                  isDark ? "bg-gold/10" : ""
                                }`
                              : `border-gray-200 dark:border-[#2d3748] hover:border-gold/50 ${
                                  isDark
                                    ? "hover:bg-[#2a2a4a]"
                                    : "hover:bg-gray-50"
                                }`
                          }`}
                        >
                          {/* ✅ Image en priorité */}
                          <div className="relative w-full aspect-square rounded-lg overflow-hidden bg-gray-100 dark:bg-[#2a2a4a] mb-2">
                            <ProductThumb
                              imageUrl={imageUrl}
                              alt={product.name}
                              emoji={product.emoji}
                            />
                            {hasVariants && (
                              <div className="absolute top-1 right-1 bg-gold text-gray-900 text-[8px] font-bold px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
                                <Palette className="w-2.5 h-2.5" />
                                {product.variants.length}
                              </div>
                            )}
                          </div>

                          <p className="font-medium text-xs truncate">
                            {product.name}
                          </p>
                          <p className="text-[10px] text-gray-500 dark:text-gray-400">
                            {price.toLocaleString()} FCFA
                          </p>
                          {isSelected && (
                            <div className="mt-1 text-[10px] text-gold font-medium">
                              ✓ Sélectionné
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Colonne droite : Récap */}
          <div className="lg:col-span-1">
            <div
              className={`sticky top-24 rounded-2xl ${
                isDark ? "bg-[#1a1a2e]" : "bg-white"
              } shadow-sm border ${
                isDark ? "border-[#2d3748]" : "border-gray-200"
              } p-4`}
            >
              <h3 className="font-semibold text-gray-700 dark:text-gray-300 text-sm mb-3 flex items-center gap-2">
                <Gift className="w-4 h-4 text-gold" />
                Ton pack
                <span className="text-xs text-gray-400 dark:text-gray-500">
                  ({totalItems} articles)
                </span>
              </h3>

              <input
                type="text"
                placeholder="Nom de ton pack (optionnel)"
                value={packName}
                onChange={(e) => setPackName(e.target.value)}
                className={`w-full px-3 py-2 rounded-xl border text-sm mb-3 ${
                  isDark
                    ? "bg-[#2a2a4a] border-[#2d3748] text-white placeholder-gray-400"
                    : "bg-gray-50 border-gray-200 text-gray-800"
                } focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none transition-all`}
              />

              <div className="max-h-[300px] overflow-y-auto space-y-1.5">
                {selectedItems.length === 0 ? (
                  <div className="text-center py-8">
                    <Package className="w-10 h-10 mx-auto text-gray-300 dark:text-gray-600 mb-2" />
                    <p className="text-xs text-gray-400 dark:text-gray-500">
                      Aucun article
                    </p>
                  </div>
                ) : (
                  selectedItems.map((item) => {
                    const price = item.price || 0;
                    const quantity = item.quantity || 1;
                    const total = price * quantity;
                    const hasVariant = item.selectedVariant !== null;
                    const imageUrl = getDisplayImage(
                      item,
                      item.selectedVariant
                    );

                    return (
                      <div
                        key={`${item.id}-${item.variantId || "default"}`}
                        className={`flex items-center gap-2 p-2 rounded-xl ${
                          isDark ? "bg-[#1a1a2e]" : "bg-gray-50"
                        }`}
                      >
                        {/* ✅ Image en priorité */}
                        <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-100 dark:bg-[#2a2a4a] flex items-center justify-center flex-shrink-0">
                          <ProductThumb
                            imageUrl={imageUrl}
                            alt={item.name}
                            emoji={item.emoji}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-xs truncate">
                            {item.name}
                            {hasVariant && (
                              <span className="text-[8px] text-gold ml-1">
                                ({item.selectedVariant.value})
                              </span>
                            )}
                          </p>
                          <p className="text-[10px] text-gray-500 dark:text-gray-400">
                            {total.toLocaleString()} FCFA
                          </p>
                        </div>
                        <div className="flex items-center gap-0.5">
                          <button
                            type="button"
                            onClick={() =>
                              updateQuantity(item.id, item.variantId, -1)
                            }
                            className="w-5 h-5 rounded-full bg-gray-200 dark:bg-[#2a2a4a] flex items-center justify-center hover:bg-gray-300 transition-colors"
                          >
                            <Minus className="w-3 h-3 text-gray-600 dark:text-gray-400" />
                          </button>
                          <span className="w-5 text-center text-xs font-medium">
                            {quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              updateQuantity(item.id, item.variantId, 1)
                            }
                            className="w-5 h-5 rounded-full bg-gray-200 dark:bg-[#2a2a4a] flex items-center justify-center hover:bg-gray-300 transition-colors"
                          >
                            <Plus className="w-3 h-3 text-gray-600 dark:text-gray-400" />
                          </button>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeItem(item.id, item.variantId)}
                          className="p-1 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-full text-red-400 hover:text-red-600 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    );
                  })
                )}
              </div>

              <div
                className={`border-t ${
                  isDark ? "border-[#2d3748]" : "border-gray-200"
                } pt-3 mt-3`}
              >
                <div className="flex justify-between items-center mb-3">
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Total
                    </p>
                    <p className="text-xl font-display font-bold text-gray-900 dark:text-white">
                      {totalPrice.toLocaleString()} FCFA
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={createPack}
                    disabled={selectedItems.length < 3}
                    className={`px-5 py-2.5 rounded-xl font-semibold transition-all flex items-center gap-2 text-sm ${
                      selectedItems.length >= 3
                        ? `bg-gradient-to-r ${themeGradient} text-white hover:scale-105 ${themeShadow} active:scale-95`
                        : "bg-gray-200 dark:bg-[#2a2a4a] text-gray-400 dark:text-gray-500 cursor-not-allowed"
                    }`}
                  >
                    <ShoppingBag className="w-4 h-4" />
                    Créer
                  </button>
                </div>

                <p className="text-[10px] text-gray-400 dark:text-gray-500 text-center">
                  {selectedItems.length < 3
                    ? `💡 ${3 - selectedItems.length} article${
                        3 - selectedItems.length > 1 ? "s" : ""
                      } requis`
                    : "✅ Pack prêt"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {renderVariantSelector()}

      {showSuccess && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-green-500 text-white px-6 py-3 rounded-xl shadow-2xl animate-bounce-in flex items-center gap-3">
          <Check className="w-5 h-5" />
          Pack créé avec succès ! 🎉
        </div>
      )}
    </div>
  );
};

export default CreatePackPage;