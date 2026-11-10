// 📄 src/components/Admin/ProductForm.jsx
// ✅ Version contrôlée (plus de refs fragiles)
import { useState, useEffect } from "react";
import {
  Save,
  X,
  Package,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Wand2,
  Check,
} from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import ImageUploader from "./ImageUploader";
import VariantManager from "./VariantManager";

// ✅ Génère l'ID suivant selon la convention w/p/m/mp
const generateNextId = (category, type, existingProducts = []) => {
  let prefix = "";
  if (type === "women" && category === "product") prefix = "w";
  else if (type === "women" && category === "pack") prefix = "p";
  else if (type === "men" && category === "product") prefix = "m";
  else if (type === "men" && category === "pack") prefix = "mp";

  const ids = (existingProducts || [])
    .filter((p) => {
      const id = p.id || "";
      if (!id.startsWith(prefix)) return false;
      // Exclut les IDs de packs "mp" du préfixe "m"
      if (prefix === "m" && id.startsWith("mp")) return false;
      const rest = id.slice(prefix.length);
      return /^\d+$/.test(rest);
    })
    .map((p) => parseInt(p.id.slice(prefix.length), 10))
    .filter((n) => !isNaN(n));

  const max = ids.length > 0 ? Math.max(...ids) : 0;
  return `${prefix}${max + 1}`;
};

// ✅ Forme vide (réutilisable pour reset)
const emptyForm = () => ({
  id: "",
  name: "",
  category: "product",
  type: "women",
  price: "",
  priceRange: "",
  description: "",
  emoji: "✨",
  image: "",
  tags: "",
  popularity: "",
  items: "",
  color: "from-pink-400 to-rose-400",
  variants: [],
});

const ProductForm = ({
  isOpen,
  onClose,
  onSave,
  editingProduct,
  isDark: themeIsDark,
  existingProducts = [],
}) => {
  const { isDark } = useTheme();
  const darkMode = themeIsDark !== undefined ? themeIsDark : isDark;

  const [formData, setFormData] = useState(emptyForm());
  const [expandedSections, setExpandedSections] = useState({
    basic: true,
    pricing: false,
    media: false,
    variants: true,
    advanced: false,
  });
  const [error, setError] = useState("");

  // ✅ Initialisation à l'ouverture
  useEffect(() => {
    if (!isOpen) return;
    setError("");

    if (editingProduct) {
      const type = (editingProduct.id || "").startsWith("m") ? "men" : "women";
      setFormData({
        id: editingProduct.id || "",
        name: editingProduct.name || "",
        category: editingProduct.category || "product",
        type,
        price:
          editingProduct.price != null ? String(editingProduct.price) : "",
        priceRange: editingProduct.priceRange || "",
        description: editingProduct.description || "",
        emoji: editingProduct.emoji || "✨",
        image: editingProduct.image || "",
        tags: Array.isArray(editingProduct.tags)
          ? editingProduct.tags.join(", ")
          : "",
        popularity: editingProduct.popularity || "",
        items: Array.isArray(editingProduct.items)
          ? editingProduct.items.join("\n")
          : "",
        color: editingProduct.color || "from-pink-400 to-rose-400",
        variants: editingProduct.variants || [],
      });
    } else {
      const newId = generateNextId("product", "women", existingProducts);
      setFormData({ ...emptyForm(), id: newId });
    }
  }, [isOpen, editingProduct, existingProducts]);

  // ✅ Mise à jour d'un champ
  const updateField = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  // ✅ Changement de boutique (women/men)
  const handleChangeType = (newType) => {
    setFormData((prev) => {
      const next = { ...prev, type: newType };
      if (!editingProduct) {
        next.id = generateNextId(prev.category, newType, existingProducts);
      }
      return next;
    });
  };

  // ✅ Changement de type (product/pack)
  const handleChangeCategory = (newCategory) => {
    setFormData((prev) => {
      const next = { ...prev, category: newCategory };
      if (!editingProduct) {
        next.id = generateNextId(newCategory, prev.type, existingProducts);
      }
      return next;
    });
  };

  // ✅ Régénérer l'ID
  const handleRegenerateId = () => {
    const newId = generateNextId(
      formData.category,
      formData.type,
      existingProducts
    );
    setFormData((prev) => ({ ...prev, id: newId }));
  };

  // ✅ Toggle section
  const toggleSection = (section) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  // ✅ Soumission
  const handleSubmit = () => {
    setError("");

    if (!formData.id?.trim()) {
      setError("L'ID est requis");
      return;
    }
    if (!formData.name?.trim()) {
      setError("Le nom est requis");
      return;
    }

    if (!editingProduct) {
      const exists = (existingProducts || []).some(
        (p) => p.id === formData.id.trim()
      );
      if (exists) {
        setError(`L'ID "${formData.id}" existe déjà.`);
        return;
      }
    }

    // ✅ Construction du produit à sauvegarder
    const newProduct = {
      id: formData.id.trim(),
      name: formData.name.trim(),
      category: formData.category,
      description: formData.description.trim() || "",
      emoji: formData.emoji || "✨",
      image: formData.image || "",
      tags: formData.tags
        ? formData.tags
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean)
        : [],
      popularity: formData.popularity || "",
      color: formData.color || "from-pink-400 to-rose-400",
      variants: formData.variants || [],
    };

    if (formData.price !== "" && formData.price != null) {
      const priceNum = parseFloat(formData.price);
      if (!isNaN(priceNum)) newProduct.price = priceNum;
    }

    if (formData.priceRange.trim()) {
      newProduct.priceRange = formData.priceRange.trim();
    }

    if (formData.items.trim()) {
      newProduct.items = formData.items
        .split("\n")
        .map((i) => i.trim())
        .filter(Boolean);
    }

    onSave(newProduct);
  };

  if (!isOpen) return null;

  // ✅ Info préfixe
  const prefixInfo = {
    women: {
      product: { prefix: "w", label: "Produit Femme" },
      pack: { prefix: "p", label: "Pack Femme" },
    },
    men: {
      product: { prefix: "m", label: "Produit Homme" },
      pack: { prefix: "mp", label: "Pack Homme" },
    },
  };
  const currentPrefix =
    prefixInfo[formData.type]?.[formData.category] ||
    prefixInfo.women.product;

  // ✅ Composant Section
  const Section = ({ title, icon, section, children }) => (
    <div
      className={`rounded-xl border ${
        darkMode ? "border-[#2d3748]" : "border-gray-200"
      } overflow-hidden`}
    >
      <button
        type="button"
        onClick={() => toggleSection(section)}
        className="w-full flex items-center justify-between p-3 text-left hover:bg-gray-50 dark:hover:bg-[#141425] transition-colors"
      >
        <div className="flex items-center gap-2">
          <span className="text-gray-400">{icon}</span>
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {title}
          </span>
        </div>
        {expandedSections[section] ? (
          <ChevronUp className="w-4 h-4 text-gray-400" />
        ) : (
          <ChevronDown className="w-4 h-4 text-gray-400" />
        )}
      </button>
      {expandedSections[section] && (
        <div className="p-3 pt-0 space-y-3 border-t border-gray-100 dark:border-[#2d3748]">
          {children}
        </div>
      )}
    </div>
  );

  // ✅ Input contrôlé
  const Input = ({
    label,
    name,
    type = "text",
    placeholder,
    required,
    rows,
  }) => {
    const Component = rows ? "textarea" : "input";
    return (
      <div>
        <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
          {label}
          {required && <span className="text-red-500 ml-0.5">*</span>}
        </label>
        <Component
          type={type}
          value={formData[name] ?? ""}
          onChange={(e) => updateField(name, e.target.value)}
          placeholder={placeholder}
          rows={rows}
          className={`w-full px-3 py-2 rounded-xl border text-sm ${
            darkMode
              ? "bg-[#2a2a4a] border-[#2d3748] text-white placeholder-gray-400"
              : "bg-gray-50 border-gray-200 text-gray-800 placeholder-gray-400"
          } focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none transition-all`}
          required={required}
        />
      </div>
    );
  };

  return (
    <div className="fixed inset-0 pb-[70px] z-50 flex items-end justify-center p-0 sm:p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div
        className={`w-full max-w-lg max-h-[90vh] rounded-t-2xl sm:rounded-2xl ${
          darkMode ? "bg-[#1a1a2e]" : "bg-white"
        } shadow-2xl border ${
          darkMode ? "border-[#2d3748]" : "border-gray-200"
        } flex flex-col`}
      >
        {/* HEADER */}
        <div
          className={`sticky top-0 z-10 ${
            darkMode ? "bg-[#1a1a2e]" : "bg-white"
          } border-b ${
            darkMode ? "border-[#2d3748]" : "border-gray-200"
          } px-4 py-3 flex items-center justify-between flex-shrink-0`}
        >
          <div className="flex items-center gap-2">
            {formData.category === "pack" ? (
              <Package className="w-5 h-5 text-gold" />
            ) : (
              <Sparkles className="w-5 h-5 text-blue-500" />
            )}
            <h2 className="text-base font-display font-bold text-gray-800 dark:text-white">
              {editingProduct ? "Modifier" : "Ajouter"}
            </h2>
            {!editingProduct && (
              <span className="text-[10px] font-medium text-gold bg-gold/10 px-2 py-0.5 rounded-full">
                {currentPrefix.label}
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-[#2a2a4a] rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* CORPS */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {/* Erreur */}
          {error && (
            <div className="p-3 rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20">
              <p className="text-xs text-red-600 dark:text-red-400">⚠️ {error}</p>
            </div>
          )}

          {/* Section: Informations de base */}
          <Section title="Informations" icon="📝" section="basic">
            {/* Boutique */}
            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                Boutique
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleChangeType("women")}
                  className={`py-2 rounded-xl text-sm font-medium transition-all ${
                    formData.type === "women"
                      ? "bg-feminine-primary text-white"
                      : darkMode
                      ? "bg-[#2a2a4a] text-gray-400"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  👩 Femme
                </button>
                <button
                  type="button"
                  onClick={() => handleChangeType("men")}
                  className={`py-2 rounded-xl text-sm font-medium transition-all ${
                    formData.type === "men"
                      ? "bg-masculine-primary text-white"
                      : darkMode
                      ? "bg-[#2a2a4a] text-gray-400"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  👨 Homme
                </button>
              </div>
            </div>

            {/* Type */}
            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                Type
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleChangeCategory("product")}
                  className={`py-2 rounded-xl text-sm font-medium transition-all ${
                    formData.category === "product"
                      ? "bg-blue-500 text-white"
                      : darkMode
                      ? "bg-[#2a2a4a] text-gray-400"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  🛍️ Produit
                </button>
                <button
                  type="button"
                  onClick={() => handleChangeCategory("pack")}
                  className={`py-2 rounded-xl text-sm font-medium transition-all ${
                    formData.category === "pack"
                      ? "bg-gold text-gray-900"
                      : darkMode
                      ? "bg-[#2a2a4a] text-gray-400"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  📦 Pack
                </button>
              </div>
            </div>

            {/* ID */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300">
                  ID <span className="text-gold">(auto-généré)</span>
                </label>
                <button
                  type="button"
                  onClick={handleRegenerateId}
                  className="flex items-center gap-1 text-[10px] text-gold hover:underline disabled:opacity-50"
                  disabled={!!editingProduct}
                >
                  <Wand2 className="w-3 h-3" />
                  Régénérer
                </button>
              </div>
              <input
                type="text"
                value={formData.id}
                onChange={(e) => updateField("id", e.target.value)}
                className={`w-full px-3 py-2 rounded-xl border text-sm font-mono ${
                  editingProduct
                    ? darkMode
                      ? "bg-[#2a2a4a] border-[#2d3748] text-gray-400 cursor-not-allowed"
                      : "bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed"
                    : darkMode
                    ? "bg-[#2a2a4a] border-[#2d3748] text-white"
                    : "bg-gray-50 border-gray-200 text-gray-800"
                } focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none transition-all`}
                disabled={!!editingProduct}
                required
              />
            </div>

            <Input
              label="Nom"
              name="name"
              placeholder="Nom du produit"
              required
            />
            <Input
              label="Description"
              name="description"
              placeholder="Description"
              rows="2"
            />
            <Input label="Emoji" name="emoji" placeholder="✨" />
          </Section>

          {/* Section: Variantes */}
          <Section title="Variantes" icon="🎨" section="variants">
            <div className="mb-2 flex items-center gap-2">
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {formData.variants?.length || 0} variante(s)
              </span>
            </div>
            <VariantManager
              variants={formData.variants || []}
              onVariantsChange={(variants) => updateField("variants", variants)}
              isDark={darkMode}
            />
          </Section>

          {/* Section: Image */}
          <Section title="Image du produit" icon="🖼️" section="media">
            <ImageUploader
              onImageUpload={(url) => updateField("image", url)}
              currentImage={formData.image}
            />

            {formData.image && formData.image.includes("supabase.co") && (
              <div className="flex items-center gap-2 text-xs text-green-500 bg-green-50 dark:bg-green-500/10 px-3 py-1.5 rounded-lg border border-green-200 dark:border-green-500/20">
                <Check className="w-3.5 h-3.5" />
                <span className="truncate">Image sur Supabase Storage</span>
              </div>
            )}

            <Input
              label="Tags (séparés par des virgules)"
              name="tags"
              placeholder="Soin, Visage"
            />
          </Section>

          {/* Section: Prix */}
          <Section title="Prix" icon="💰" section="pricing">
            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Prix fixe"
                name="price"
                type="number"
                placeholder="5000"
              />
              <Input
                label="Fourchette"
                name="priceRange"
                placeholder="1000-3000"
              />
            </div>
          </Section>

          {/* Section: Options avancées */}
          <Section title="Options avancées" icon="⚙️" section="advanced">
            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                Popularité
              </label>
              <select
                value={formData.popularity}
                onChange={(e) => updateField("popularity", e.target.value)}
                className={`w-full px-3 py-2 rounded-xl border text-sm ${
                  darkMode
                    ? "bg-[#2a2a4a] border-[#2d3748] text-white"
                    : "bg-gray-50 border-gray-200 text-gray-800"
                } focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none transition-all`}
              >
                <option value="">Aucune</option>
                <option value="🔥">🔥 Populaire</option>
                <option value="⭐">⭐ Très populaire</option>
                <option value="🌟">🌟 Le plus vendu</option>
                <option value="✨">✨ Nouveauté</option>
              </select>
            </div>

            {formData.category === "pack" && (
              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Articles du pack (1 par ligne)
                </label>
                <Input
                  name="items"
                  placeholder={"Parfum léger 🍭\nPetit carnet 📓\nStylo unique 🧑‍🎨"}
                  rows="4"
                />
              </div>
            )}

            <Input
              label="Couleur du gradient"
              name="color"
              placeholder="from-pink-400 to-rose-400"
            />
          </Section>

          <div className="h-4" />
        </div>

        {/* FOOTER */}
        <div
          className={`sticky bottom-0 z-20 ${
            darkMode ? "bg-[#1a1a2e]" : "bg-white"
          } border-t ${
            darkMode ? "border-[#2d3748]" : "border-gray-200"
          } px-4 py-3 flex-shrink-0`}
        >
          <div className="flex items-center gap-3 max-w-lg mx-auto">
            <button
              type="button"
              onClick={handleSubmit}
              className="flex-1 bg-gold text-gray-900 py-3.5 rounded-xl font-semibold hover:bg-gold/80 transition-all flex items-center justify-center gap-2 text-sm active:scale-95"
            >
              <Save className="w-4 h-4" />
              {editingProduct ? "Modifier" : "Ajouter"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-3.5 rounded-xl border border-gray-200 dark:border-[#2d3748] text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-[#2a2a4a] transition-colors text-sm active:scale-95"
            >
              Annuler
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductForm;