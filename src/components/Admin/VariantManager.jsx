// 📄 src/components/Admin/VariantManager.jsx
import { useState } from "react";
import {
  Plus,
  Trash2,
  Edit,
  Image as ImageIcon,
  X,
  Check,
} from "lucide-react";
import { supabase } from "../../config/supabase";

const VariantManager = ({ variants = [], onVariantsChange, isDark }) => {
  const [showForm, setShowForm] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [uploading, setUploading] = useState(false);

  const [formData, setFormData] = useState({
    name: "couleur",
    value: "",
    price: "",
    image: "",
    stock: "",
    color: "#E91E8C",
  });

  const variantTypes = [
    { value: "couleur", label: "🎨 Couleur" },
    { value: "taille", label: "📏 Taille" },
    { value: "motif", label: "✨ Motif" },
    { value: "matiere", label: "🧵 Matière" },
    { value: "parfum", label: "🌸 Parfum" },
  ];

  // ✅ Ajout / mise à jour d'une variante
  const handleAddVariant = () => {
    if (!formData.value.trim()) {
      alert("Veuillez remplir la valeur de la variante");
      return;
    }

    const newVariant = {
      id: Date.now(),
      name: formData.name,
      value: formData.value.trim(),
      price:
        formData.price !== "" && formData.price != null
          ? parseFloat(formData.price)
          : null,
      image: formData.image || "",
      stock:
        formData.stock !== "" && formData.stock != null
          ? parseInt(formData.stock, 10)
          : null,
      color: formData.color || "#E91E8C",
    };

    if (editingIndex !== null) {
      const updated = [...variants];
      updated[editingIndex] = newVariant;
      onVariantsChange(updated);
      setEditingIndex(null);
    } else {
      onVariantsChange([...variants, newVariant]);
    }

    resetForm();
    setShowForm(false);
  };

  // ✅ Édition d'une variante existante
  const handleEditVariant = (index) => {
    const variant = variants[index];
    setFormData({
      name: variant.name || "couleur",
      value: variant.value || "",
      price: variant.price != null ? String(variant.price) : "",
      image: variant.image || "",
      stock: variant.stock != null ? String(variant.stock) : "",
      color: variant.color || "#E91E8C",
    });
    setEditingIndex(index);
    setShowForm(true);
  };

  // ✅ Suppression
  const handleRemoveVariant = (index) => {
    if (window.confirm("Supprimer cette variante ?")) {
      const updated = variants.filter((_, i) => i !== index);
      onVariantsChange(updated);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "couleur",
      value: "",
      price: "",
      image: "",
      stock: "",
      color: "#E91E8C",
    });
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingIndex(null);
    resetForm();
  };

  // ✅ Upload image vers Supabase Storage
  const handleImageUpload = async (file) => {
    if (!file) return;

    // Vérifs basiques
    const validTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
      "image/gif",
    ];
    if (!validTypes.includes(file.type)) {
      alert("Format non supporté. Utilisez JPG, PNG, WEBP ou GIF");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      alert("L'image ne doit pas dépasser 10MB");
      return;
    }

    setUploading(true);
    try {
      const ext = file.name.split(".").pop().toLowerCase();
      const fileName = `variant-${Date.now()}-${Math.random()
        .toString(36)
        .substring(2, 8)}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from("products")
        .upload(fileName, file, {
          cacheControl: "31536000",
          upsert: false,
        });

      if (uploadError) throw uploadError;

      const {
        data: { publicUrl },
      } = supabase.storage.from("products").getPublicUrl(fileName);

      setFormData((prev) => ({ ...prev, image: publicUrl }));
    } catch (error) {
      console.error("Erreur upload:", error);
      alert("Erreur lors de l'upload : " + (error.message || "inconnue"));
    } finally {
      setUploading(false);
    }
  };

  const openFilePicker = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = (e) => {
      const file = e.target.files?.[0];
      if (file) handleImageUpload(file);
    };
    input.click();
  };

  // ✅ Preview de la couleur si type = "couleur"
  const isColorType = formData.name === "couleur";

  return (
    <div className="space-y-3">
      {/* Liste des variantes existantes */}
      {variants.length > 0 && (
        <div className="space-y-2">
          {variants.map((variant, index) => (
            <div
              key={variant.id ?? index}
              className={`flex items-center gap-3 p-3 rounded-xl border ${
                isDark
                  ? "border-[#2d3748] bg-[#1a1a2e]"
                  : "border-gray-200 bg-gray-50"
              }`}
            >
              {/* Vignette */}
              <div className="w-12 h-12 rounded-lg bg-gray-200 dark:bg-[#2a2a4a] flex items-center justify-center overflow-hidden flex-shrink-0">
                {variant.image ? (
                  <img
                    src={variant.image}
                    alt={variant.value}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                ) : variant.name === "couleur" ? (
                  <div
                    className="w-8 h-8 rounded-full border-2 border-white shadow"
                    style={{ background: variant.color || "#E91E8C" }}
                  />
                ) : (
                  <ImageIcon className="w-5 h-5 text-gray-400" />
                )}
              </div>

              {/* Infos */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-sm truncate">
                    {variant.value}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-gray-200 dark:bg-[#2a2a4a] text-gray-500">
                    {variant.name}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                  {/* ✅ variant.price != null : 0 est valide */}
                  {variant.price != null && (
                    <span>{variant.price.toLocaleString()} FCFA</span>
                  )}
                  {/* ✅ variant.stock != null : null n'est pas un stock */}
                  {variant.stock != null && (
                    <span>Stock: {variant.stock}</span>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => handleEditVariant(index)}
                  className="p-1.5 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-lg text-blue-500 transition-colors"
                  title="Modifier"
                >
                  <Edit className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => handleRemoveVariant(index)}
                  className="p-1.5 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg text-red-500 transition-colors"
                  title="Supprimer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Bouton Ajouter / Formulaire */}
      {!showForm ? (
        <button
          type="button"
          onClick={() => setShowForm(true)}
          className="w-full py-3 rounded-xl border-2 border-dashed border-gold/50 text-gold hover:bg-gold/5 transition-colors flex items-center justify-center gap-2 text-sm"
        >
          <Plus className="w-4 h-4" />
          Ajouter une variante
        </button>
      ) : (
        <div
          className={`p-4 rounded-xl border-2 ${
            isDark
              ? "border-[#2d3748] bg-[#1a1a2e]"
              : "border-gray-200 bg-gray-50"
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-medium text-sm text-gray-700 dark:text-gray-300">
              {editingIndex !== null
                ? "Modifier la variante"
                : "Nouvelle variante"}
            </h4>
            <button
              type="button"
              onClick={handleCloseForm}
              className="p-1 hover:bg-gray-200 dark:hover:bg-[#2a2a4a] rounded-full transition-colors"
            >
              <X className="w-4 h-4 text-gray-400" />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {/* Type */}
            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                Type
              </label>
              <select
                value={formData.name}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                }
                className={`w-full px-3 py-2 rounded-lg border text-sm ${
                  isDark
                    ? "bg-[#2a2a4a] border-[#2d3748] text-white"
                    : "bg-white border-gray-200 text-gray-800"
                } focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none transition-all`}
              >
                {variantTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Valeur */}
            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                Valeur <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.value}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, value: e.target.value }))
                }
                placeholder="Ex: Rouge, M, ..."
                className={`w-full px-3 py-2 rounded-lg border text-sm ${
                  isDark
                    ? "bg-[#2a2a4a] border-[#2d3748] text-white placeholder-gray-400"
                    : "bg-white border-gray-200 text-gray-800 placeholder-gray-400"
                } focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none transition-all`}
              />
            </div>

            {/* Prix */}
            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                Prix (optionnel)
              </label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, price: e.target.value }))
                }
                placeholder="5000"
                className={`w-full px-3 py-2 rounded-lg border text-sm ${
                  isDark
                    ? "bg-[#2a2a4a] border-[#2d3748] text-white placeholder-gray-400"
                    : "bg-white border-gray-200 text-gray-800 placeholder-gray-400"
                } focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none transition-all`}
              />
            </div>

            {/* Stock */}
            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                Stock (optionnel)
              </label>
              <input
                type="number"
                value={formData.stock}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, stock: e.target.value }))
                }
                placeholder="10"
                className={`w-full px-3 py-2 rounded-lg border text-sm ${
                  isDark
                    ? "bg-[#2a2a4a] border-[#2d3748] text-white placeholder-gray-400"
                    : "bg-white border-gray-200 text-gray-800 placeholder-gray-400"
                } focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none transition-all`}
              />
            </div>

            {/* Couleur (si type = couleur) */}
            {isColorType && (
              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Couleur
                </label>
                <input
                  type="color"
                  value={formData.color}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      color: e.target.value,
                    }))
                  }
                  className="w-full h-10 rounded-lg border border-gray-200 dark:border-[#2d3748] cursor-pointer"
                />
              </div>
            )}

            {/* Image */}
            <div className="col-span-2">
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                Image de la variante (optionnel)
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="text"
                  value={formData.image}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, image: e.target.value }))
                  }
                  placeholder="URL de l'image ou upload ci-contre"
                  className={`flex-1 px-3 py-2 rounded-lg border text-sm ${
                    isDark
                      ? "bg-[#2a2a4a] border-[#2d3748] text-white placeholder-gray-400"
                      : "bg-white border-gray-200 text-gray-800 placeholder-gray-400"
                  } focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none transition-all`}
                />
                <button
                  type="button"
                  onClick={openFilePicker}
                  disabled={uploading}
                  className="px-4 py-2 rounded-lg bg-gold text-gray-900 hover:bg-gold/80 transition-colors text-sm whitespace-nowrap disabled:opacity-50"
                >
                  {uploading ? "Upload..." : "📤 Upload"}
                </button>
              </div>
              {formData.image && (
                <div className="mt-2 flex items-center gap-2 text-xs text-green-500">
                  <Check className="w-3.5 h-3.5" />
                  Image chargée
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3 mt-3">
            <button
              type="button"
              onClick={handleAddVariant}
              className="flex-1 bg-gold text-gray-900 py-2 rounded-lg font-medium hover:bg-gold/80 transition-colors text-sm"
            >
              {editingIndex !== null ? "Mettre à jour" : "Ajouter"}
            </button>
            <button
              type="button"
              onClick={handleCloseForm}
              className="px-4 py-2 rounded-lg border border-gray-200 dark:border-[#2d3748] text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-[#2a2a4a] transition-colors text-sm"
            >
              Annuler
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default VariantManager;