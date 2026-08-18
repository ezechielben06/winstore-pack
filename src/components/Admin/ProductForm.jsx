// 📄 src/components/Admin/ProductForm.jsx - Version avec upload d'images
import { useState, useEffect, useRef } from "react";
import {
  Save,
  X,
  Package,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Wand2,
  Plus,
  Trash2,
  Palette,
  Image as ImageIcon,
  Upload,
  Camera,
  Check,
  AlertCircle,
} from "lucide-react";
import { useTheme } from "../../context/ThemeContext";

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

  const [expandedSections, setExpandedSections] = useState({
    basic: true,
    variants: false,
    pricing: false,
    media: false,
    advanced: false,
  });

  // ✅ Refs pour les inputs
  const inputRefs = {
    name: useRef(null),
    description: useRef(null),
    emoji: useRef(null),
    price: useRef(null),
    priceRange: useRef(null),
    image: useRef(null),
    tags: useRef(null),
    color: useRef(null),
    items: useRef(null),
  };

  const [formData, setFormData] = useState({
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

  const [variantForm, setVariantForm] = useState({
    name: "",
    value: "",
    price: "",
    image: "",
    stock: "",
  });

  // ✅ États pour l'upload
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  // ✅ Référence pour l'input file
  const fileInputRef = useRef(null);

  // ✅ Gérer l'upload d'image
  const handleImageUpload = (file) => {
    if (!file) return;

    // Vérifier le type
    if (!file.type.startsWith("image/")) {
      setUploadError("Veuillez sélectionner une image");
      return;
    }

    // Vérifier la taille (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setUploadError("L'image ne doit pas dépasser 5MB");
      return;
    }

    setUploading(true);
    setUploadError(null);
    setUploadSuccess(false);

    // Créer une prévisualisation
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target.result);
    };
    reader.readAsDataURL(file);

    // Simuler l'upload (dans la réalité, on enverrait à un serveur)
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setUploadProgress(progress);
      if (progress >= 100) {
        clearInterval(interval);
        setUploading(false);
        setUploadSuccess(true);

        // ✅ Générer un nom de fichier unique
        const ext = file.name.split(".").pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${ext}`;
        
        // ✅ Mettre à jour le champ image avec le nom du fichier
        setFormData((prev) => ({ ...prev, image: fileName }));

        // ✅ Afficher un message de succès
        setTimeout(() => {
          setUploadSuccess(false);
        }, 3000);
      }
    }, 100);
  };

  // ✅ Gérer le téléchargement depuis l'appareil
  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleImageUpload(file);
    }
  };

  // ✅ Ouvrir la galerie/la caméra
  const openFilePicker = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const updateFromRefs = () => {
    const newData = { ...formData };
    Object.keys(inputRefs).forEach((key) => {
      if (inputRefs[key]?.current) {
        newData[key] = inputRefs[key].current.value;
      }
    });
    setFormData(newData);
    return newData;
  };

  const addVariant = () => {
    if (!variantForm.name || !variantForm.value) {
      alert("Veuillez remplir le nom et la valeur de la variante");
      return;
    }
    setFormData((prev) => ({
      ...prev,
      variants: [...prev.variants, { ...variantForm, id: Date.now() }],
    }));
    setVariantForm({ name: "", value: "", price: "", image: "", stock: "" });
  };

  const removeVariant = (id) => {
    setFormData((prev) => ({
      ...prev,
      variants: prev.variants.filter((v) => v.id !== id),
    }));
  };

  const generateNextId = (category, type) => {
    const existing = existingProducts || [];
    let prefix = "";
    if (type === "women" && category === "product") prefix = "w";
    else if (type === "women" && category === "pack") prefix = "p";
    else if (type === "men" && category === "product") prefix = "m";
    else if (type === "men" && category === "pack") prefix = "mp";

    const ids = existing
      .filter(
        (p) =>
          p.id?.startsWith(prefix) && /^\d+$/.test(p.id.replace(prefix, "")),
      )
      .map((p) => parseInt(p.id.replace(prefix, "")))
      .filter((n) => !isNaN(n));

    const maxNum = ids.length > 0 ? Math.max(...ids) : 0;
    return `${prefix}${maxNum + 1}`;
  };

  useEffect(() => {
    if (!isOpen) return;

    if (editingProduct) {
      let type = "women";
      if (editingProduct.id?.startsWith("m")) type = "men";

      const data = {
        id: editingProduct.id || "",
        name: editingProduct.name || "",
        category: editingProduct.category || "product",
        type: type,
        price: editingProduct.price || "",
        priceRange: editingProduct.priceRange || "",
        description: editingProduct.description || "",
        emoji: editingProduct.emoji || "✨",
        image: editingProduct.image || "",
        tags: editingProduct.tags ? editingProduct.tags.join(", ") : "",
        popularity: editingProduct.popularity || "",
        items: editingProduct.items ? editingProduct.items.join("\n") : "",
        color: editingProduct.color || "from-pink-400 to-rose-400",
        variants: editingProduct.variants || [],
      };
      setFormData(data);

      Object.keys(inputRefs).forEach((key) => {
        if (inputRefs[key]?.current && data[key] !== undefined) {
          inputRefs[key].current.value = data[key] || "";
        }
      });
    } else {
      const newId = generateNextId("product", "women");
      const data = {
        id: newId,
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
      };
      setFormData(data);

      Object.keys(inputRefs).forEach((key) => {
        if (inputRefs[key]?.current) {
          inputRefs[key].current.value = data[key] || "";
        }
      });
    }
  }, [isOpen, editingProduct]);

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const regenerateId = () => {
    const newId = generateNextId(formData.category, formData.type);
    setFormData((prev) => ({ ...prev, id: newId }));
  };

  const handleSubmit = () => {
    const currentData = updateFromRefs();

    if (!currentData.id) {
      alert("L'ID est requis");
      return;
    }

    if (!editingProduct) {
      const exists = (existingProducts || []).some(
        (p) => p.id === currentData.id,
      );
      if (exists) {
        alert(`L'ID "${currentData.id}" existe déjà.`);
        regenerateId();
        return;
      }
    }

    const newProduct = {
      id: currentData.id,
      name: currentData.name,
      category: currentData.category,
      description: currentData.description,
      emoji: currentData.emoji || "✨",
      image: currentData.image || "",
      tags: currentData.tags
        ? currentData.tags
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean)
        : [],
      popularity: currentData.popularity || "",
      color: currentData.color || "from-pink-400 to-rose-400",
      variants: currentData.variants || [],
    };

    if (currentData.price) {
      newProduct.price = parseFloat(currentData.price);
    }
    if (currentData.priceRange) {
      newProduct.priceRange = currentData.priceRange;
    }
    if (currentData.items) {
      newProduct.items = currentData.items.split("\n").filter((i) => i.trim());
    }

    onSave(newProduct);
  };

  if (!isOpen) return null;

  const prefixInfo = {
    women: {
      product: {
        prefix: "w",
        label: "Produit Femme",
        example: "w1, w2, w3...",
      },
      pack: { prefix: "p", label: "Pack Femme", example: "p1, p2, p3..." },
    },
    men: {
      product: {
        prefix: "m",
        label: "Produit Homme",
        example: "m1, m2, m3...",
      },
      pack: { prefix: "mp", label: "Pack Homme", example: "mp1, mp2, mp3..." },
    },
  };

  const currentPrefix =
    prefixInfo[formData.type]?.[formData.category] || prefixInfo.women.product;

  const Section = ({ title, icon, section, children }) => (
    <div
      className={`rounded-xl border ${darkMode ? "border-[#2d3748]" : "border-gray-200"} overflow-hidden`}
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

  const Input = ({
    label,
    name,
    type = "text",
    placeholder,
    required,
    rows,
  }) => {
    const ref = inputRefs[name];
    const Component = rows ? "textarea" : "input";

    return (
      <div>
        <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
          {label}
          {required && <span className="text-red-500 ml-0.5">*</span>}
        </label>
        <Component
          ref={ref}
          type={type}
          defaultValue={formData[name] || ""}
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
        className={`w-full max-w-lg max-h-[90vh] rounded-t-2xl sm:rounded-2xl ${darkMode ? "bg-[#1a1a2e]" : "bg-white"} shadow-2xl border ${darkMode ? "border-[#2d3748]" : "border-gray-200"} flex flex-col`}
      >
        {/* HEADER */}
        <div
          className={`sticky top-0 z-10 ${darkMode ? "bg-[#1a1a2e]" : "bg-white"} border-b ${darkMode ? "border-[#2d3748]" : "border-gray-200"} px-4 py-3 flex items-center justify-between flex-shrink-0`}
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
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-[#2a2a4a] rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* CORPS */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {/* Section: Informations de base */}
          <Section title="Informations" icon="📝" section="basic">
            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                Boutique
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    const newType = "women";
                    setFormData((prev) => ({ ...prev, type: newType }));
                    if (!editingProduct) {
                      const newId = generateNextId(formData.category, newType);
                      setFormData((prev) => ({ ...prev, id: newId }));
                    }
                  }}
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
                  onClick={() => {
                    const newType = "men";
                    setFormData((prev) => ({ ...prev, type: newType }));
                    if (!editingProduct) {
                      const newId = generateNextId(formData.category, newType);
                      setFormData((prev) => ({ ...prev, id: newId }));
                    }
                  }}
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

            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                Type
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setFormData((prev) => ({ ...prev, category: "product" }));
                    if (!editingProduct) {
                      const newId = generateNextId("product", formData.type);
                      setFormData((prev) => ({ ...prev, id: newId }));
                    }
                  }}
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
                  onClick={() => {
                    setFormData((prev) => ({ ...prev, category: "pack" }));
                    if (!editingProduct) {
                      const newId = generateNextId("pack", formData.type);
                      setFormData((prev) => ({ ...prev, id: newId }));
                    }
                  }}
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

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300">
                  ID <span className="text-gold">(auto-généré)</span>
                </label>
                <button
                  type="button"
                  onClick={regenerateId}
                  className="flex items-center gap-1 text-[10px] text-gold hover:underline"
                  disabled={!!editingProduct}
                >
                  <Wand2 className="w-3 h-3" />
                  Régénérer
                </button>
              </div>
              <input
                type="text"
                value={formData.id}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, id: e.target.value }))
                }
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

          {/* ✅ Section: Image avec upload */}
          <Section title="Image du produit" icon="🖼️" section="media">
            {/* Input caché pour le fichier */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              // capture="environment"
              className="hidden"
              onChange={handleFileSelect}
            />

            {/* Zone de téléchargement */}
            <div
              className={`relative border-2 border-dashed rounded-xl p-4 text-center transition-all ${
                darkMode
                  ? "border-[#2d3748] hover:border-gold/50"
                  : "border-gray-300 hover:border-gold/50"
              } ${uploading ? "opacity-50 pointer-events-none" : ""}`}
            >
              {/* Aperçu de l'image */}
              {imagePreview || formData.image ? (
                <div className="relative">
                  <img
                    src={imagePreview || `/images/${formData.image}`}
                    alt="Aperçu"
                    className="w-full max-h-48 object-contain rounded-lg mx-auto"
                    onError={(e) => {
                      e.target.style.display = "none";
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setImagePreview(null);
                      setFormData((prev) => ({ ...prev, image: "" }));
                    }}
                    className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="py-6">
                  <Camera className="w-12 h-12 mx-auto text-gray-400 mb-3" />
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Appuyez pour prendre une photo
                  </p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                    ou choisir une image existante
                  </p>
                </div>
              )}

              {/* Bouton d'upload */}
              <button
                type="button"
                onClick={openFilePicker}
                disabled={uploading}
                className={`mt-3 w-full py-2 rounded-xl font-medium transition-all flex items-center justify-center gap-2 ${
                  darkMode
                    ? "bg-[#2a2a4a] text-white hover:bg-[#3a3a5a]"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                } ${uploading ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                {uploading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-gold border-t-transparent rounded-full animate-spin" />
                    Téléchargement...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4" />
                    {imagePreview || formData.image
                      ? "Changer l'image"
                      : "Ajouter une image"}
                  </>
                )}
              </button>

              {/* Barre de progression */}
              {uploading && (
                <div className="mt-3">
                  <div className="w-full h-1.5 bg-gray-200 dark:bg-[#2a2a4a] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gold rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-400 mt-1">
                    {uploadProgress}%
                  </p>
                </div>
              )}

              {/* Succès */}
              {uploadSuccess && (
                <div className="mt-3 flex items-center justify-center gap-2 text-green-500 text-sm">
                  <Check className="w-4 h-4" />
                  Image téléchargée !
                </div>
              )}

              {/* Erreur */}
              {uploadError && (
                <div className="mt-3 flex items-center justify-center gap-2 text-red-500 text-sm">
                  <AlertCircle className="w-4 h-4" />
                  {uploadError}
                </div>
              )}
            </div>

            {/* Nom de l'image */}
            {formData.image && (
              <div className="flex items-center gap-2 text-xs text-gray-400 bg-gray-100 dark:bg-[#2a2a4a] px-3 py-1.5 rounded-lg">
                <ImageIcon className="w-3.5 h-3.5" />
                <span className="truncate">{formData.image}</span>
              </div>
            )}

            <Input
              label="Tags (séparés par des virgules)"
              name="tags"
              placeholder="Soin, Visage"
            />
          </Section>

          {/* Section: Variantes */}
          <Section
            title="Variantes (Couleurs, Tailles...)"
            icon="🎨"
            section="variants"
          >
            <div className="space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] font-medium text-gray-600 dark:text-gray-400 mb-0.5">
                    Type
                  </label>
                  <select
                    value={variantForm.name}
                    onChange={(e) =>
                      setVariantForm((prev) => ({
                        ...prev,
                        name: e.target.value,
                      }))
                    }
                    className={`w-full px-2 py-1.5 rounded-lg border text-xs ${
                      darkMode
                        ? "bg-[#2a2a4a] border-[#2d3748] text-white"
                        : "bg-gray-50 border-gray-200 text-gray-800"
                    } focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none transition-all`}
                  >
                    <option value="">Type...</option>
                    <option value="couleur">🎨 Couleur</option>
                    <option value="taille">📏 Taille</option>
                    <option value="motif">✨ Motif</option>
                    <option value="matiere">🧵 Matière</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-medium text-gray-600 dark:text-gray-400 mb-0.5">
                    Valeur
                  </label>
                  <input
                    type="text"
                    value={variantForm.value}
                    onChange={(e) =>
                      setVariantForm((prev) => ({
                        ...prev,
                        value: e.target.value,
                      }))
                    }
                    placeholder="Rose bonbon"
                    className={`w-full px-2 py-1.5 rounded-lg border text-xs ${
                      darkMode
                        ? "bg-[#2a2a4a] border-[#2d3748] text-white"
                        : "bg-gray-50 border-gray-200 text-gray-800"
                    } focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none transition-all`}
                  />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-[10px] font-medium text-gray-600 dark:text-gray-400 mb-0.5">
                    Prix (optionnel)
                  </label>
                  <input
                    type="number"
                    value={variantForm.price}
                    onChange={(e) =>
                      setVariantForm((prev) => ({
                        ...prev,
                        price: e.target.value,
                      }))
                    }
                    placeholder="5000"
                    className={`w-full px-2 py-1.5 rounded-lg border text-xs ${
                      darkMode
                        ? "bg-[#2a2a4a] border-[#2d3748] text-white"
                        : "bg-gray-50 border-gray-200 text-gray-800"
                    } focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none transition-all`}
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-medium text-gray-600 dark:text-gray-400 mb-0.5">
                    Stock
                  </label>
                  <input
                    type="number"
                    value={variantForm.stock}
                    onChange={(e) =>
                      setVariantForm((prev) => ({
                        ...prev,
                        stock: e.target.value,
                      }))
                    }
                    placeholder="10"
                    className={`w-full px-2 py-1.5 rounded-lg border text-xs ${
                      darkMode
                        ? "bg-[#2a2a4a] border-[#2d3748] text-white"
                        : "bg-gray-50 border-gray-200 text-gray-800"
                    } focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none transition-all`}
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-medium text-gray-600 dark:text-gray-400 mb-0.5">
                    Image de la variante
                  </label>
                  <input
                    type="text"
                    value={variantForm.image}
                    onChange={(e) =>
                      setVariantForm((prev) => ({
                        ...prev,
                        image: e.target.value,
                      }))
                    }
                    placeholder="rose.jpg"
                    className={`w-full px-2 py-1.5 rounded-lg border text-xs ${
                      darkMode
                        ? "bg-[#2a2a4a] border-[#2d3748] text-white"
                        : "bg-gray-50 border-gray-200 text-gray-800"
                    } focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none transition-all`}
                  />
                </div>
              </div>
              <button
                type="button"
                onClick={addVariant}
                className="w-full py-2 rounded-xl border-2 border-dashed border-gold/50 text-gold text-sm font-medium hover:bg-gold/5 transition-colors flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Ajouter une variante
              </button>
            </div>

            {formData.variants.length > 0 && (
              <div className="space-y-1.5 max-h-48 overflow-y-auto">
                {formData.variants.map((variant) => (
                  <div
                    key={variant.id}
                    className={`flex items-center gap-2 p-2 rounded-lg ${darkMode ? "bg-[#141425]" : "bg-gray-50"} border ${darkMode ? "border-[#2d3748]" : "border-gray-200"}`}
                  >
                    <div className="w-10 h-10 rounded-lg bg-gray-200 dark:bg-[#2a2a4a] flex items-center justify-center flex-shrink-0 overflow-hidden">
                      {variant.image ? (
                        <img
                          src={`/images/${variant.image}`}
                          alt={variant.value}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.style.display = "none";
                            e.target.parentElement.innerHTML = `<span class="text-lg">📷</span>`;
                          }}
                        />
                      ) : (
                        <ImageIcon className="w-4 h-4 text-gray-400" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-gray-800 dark:text-white truncate">
                        {variant.value}
                      </p>
                      <p className="text-[9px] text-gray-400 dark:text-gray-500 flex items-center gap-1.5">
                        <span>{variant.name}</span>
                        {variant.price && <span>• {variant.price} FCFA</span>}
                        {variant.stock && <span>• Stock: {variant.stock}</span>}
                        {variant.image && <span className="text-gold">🖼️</span>}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeVariant(variant.id)}
                      className="p-1 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg text-red-500 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </Section>

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

          <Section title="Options avancées" icon="⚙️" section="advanced">
            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                Popularité
              </label>
              <select
                name="popularity"
                value={formData.popularity}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    popularity: e.target.value,
                  }))
                }
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
                  Articles du pack
                </label>
                <Input
                  name="items"
                  placeholder="Parfum léger 🍭&#10;Petit carnet 📓&#10;Stylo unique 🧑‍🎨"
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
          className={`sticky bottom-0 z-20 ${darkMode ? "bg-[#1a1a2e]" : "bg-white"} border-t ${darkMode ? "border-[#2d3748]" : "border-gray-200"} px-4 py-3 flex-shrink-0`}
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