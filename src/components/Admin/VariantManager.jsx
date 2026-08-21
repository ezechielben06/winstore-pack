// 📄 src/components/Admin/VariantManager.jsx
import { useState } from 'react';
import { Plus, Trash2, Edit, Image as ImageIcon, X, Check } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { supabase } from '../../config/supabase';

const VariantManager = ({ variants = [], onVariantsChange, isDark }) => {
  const [showForm, setShowForm] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [formData, setFormData] = useState({
    name: 'couleur',
    value: '',
    price: '',
    image: '',
    stock: '',
    color: '#E91E8C'
  });

  const [uploading, setUploading] = useState(false);

  const variantTypes = [
    { value: 'couleur', label: '🎨 Couleur' },
    { value: 'taille', label: '📏 Taille' },
    { value: 'motif', label: '✨ Motif' },
    { value: 'matiere', label: '🧵 Matière' },
    { value: 'parfum', label: '🌸 Parfum' },
  ];

  const handleAddVariant = () => {
    if (!formData.value) {
      alert('Veuillez remplir la valeur de la variante');
      return;
    }

    const newVariant = {
      id: Date.now(),
      name: formData.name,
      value: formData.value,
      price: formData.price ? parseFloat(formData.price) : null,
      image: formData.image || '',
      stock: formData.stock ? parseInt(formData.stock) : null,
      color: formData.color || '#E91E8C'
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

  const handleEditVariant = (index) => {
    const variant = variants[index];
    setFormData({
      name: variant.name || 'couleur',
      value: variant.value || '',
      price: variant.price || '',
      image: variant.image || '',
      stock: variant.stock || '',
      color: variant.color || '#E91E8C'
    });
    setEditingIndex(index);
    setShowForm(true);
  };

  const handleRemoveVariant = (index) => {
    if (window.confirm('Supprimer cette variante ?')) {
      const updated = variants.filter((_, i) => i !== index);
      onVariantsChange(updated);
    }
  };

  const resetForm = () => {
    setFormData({
      name: 'couleur',
      value: '',
      price: '',
      image: '',
      stock: '',
      color: '#E91E8C'
    });
  };

  const handleImageUpload = async (file) => {
    if (!file) return;

    setUploading(true);
    try {
      const ext = file.name.split('.').pop().toLowerCase();
      const fileName = `variant-${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from('products')
        .upload(fileName, file, {
          cacheControl: '31536000',
          upsert: false,
        });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('products')
        .getPublicUrl(fileName);

      setFormData(prev => ({ ...prev, image: publicUrl }));
    } catch (error) {
      console.error('Erreur upload:', error);
      alert('Erreur lors de l\'upload');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-3">
      {/* Liste des variantes */}
      {variants.length > 0 && (
        <div className="space-y-2">
          {variants.map((variant, index) => (
            <div
              key={variant.id || index}
              className={`flex items-center gap-3 p-3 rounded-xl border ${
                isDark ? 'border-[#2d3748] bg-[#1a1a2e]' : 'border-gray-200 bg-gray-50'
              }`}
            >
              {/* Image */}
              <div className="w-12 h-12 rounded-lg bg-gray-200 dark:bg-[#2a2a4a] flex items-center justify-center overflow-hidden flex-shrink-0">
                {variant.image ? (
                  <img src={variant.image} alt={variant.value} className="w-full h-full object-cover" />
                ) : variant.name === 'couleur' ? (
                  <div 
                    className="w-8 h-8 rounded-full border-2 border-white shadow"
                    style={{ background: variant.color || '#E91E8C' }}
                  />
                ) : (
                  <ImageIcon className="w-5 h-5 text-gray-400" />
                )}
              </div>

              {/* Infos */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-sm truncate">{variant.value}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-gray-200 dark:bg-[#2a2a4a] text-gray-500">
                    {variant.name}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                  {variant.price && <span>{variant.price.toLocaleString()} FCFA</span>}
                  {variant.stock !== undefined && variant.stock !== null && (
                    <span>Stock: {variant.stock}</span>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleEditVariant(index)}
                  className="p-1.5 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-lg text-blue-500 transition-colors"
                >
                  <Edit className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleRemoveVariant(index)}
                  className="p-1.5 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg text-red-500 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Bouton Ajouter */}
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
        <div className={`p-4 rounded-xl border-2 ${isDark ? 'border-[#2d3748] bg-[#1a1a2e]' : 'border-gray-200 bg-gray-50'}`}>
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-medium text-sm text-gray-700 dark:text-gray-300">
              {editingIndex !== null ? 'Modifier la variante' : 'Nouvelle variante'}
            </h4>
            <button
              type="button"
              onClick={() => {
                setShowForm(false);
                setEditingIndex(null);
                resetForm();
              }}
              className="p-1 hover:bg-gray-200 dark:hover:bg-[#2a2a4a] rounded-full transition-colors"
            >
              <X className="w-4 h-4 text-gray-400" />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {/* Type */}
            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Type</label>
              <select
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className={`w-full px-3 py-2 rounded-lg border text-sm ${
                  isDark 
                    ? 'bg-[#2a2a4a] border-[#2d3748] text-white' 
                    : 'bg-white border-gray-200 text-gray-800'
                } focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none transition-all`}
              >
                {variantTypes.map(type => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </select>
            </div>

            {/* Valeur */}
            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Valeur</label>
              <input
                type="text"
                value={formData.value}
                onChange={(e) => setFormData(prev => ({ ...prev, value: e.target.value }))}
                placeholder="Ex: Rouge, M, ..."
                className={`w-full px-3 py-2 rounded-lg border text-sm ${
                  isDark 
                    ? 'bg-[#2a2a4a] border-[#2d3748] text-white placeholder-gray-400' 
                    : 'bg-white border-gray-200 text-gray-800 placeholder-gray-400'
                } focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none transition-all`}
              />
            </div>

            {/* Prix */}
            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Prix (optionnel)</label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                placeholder="5000"
                className={`w-full px-3 py-2 rounded-lg border text-sm ${
                  isDark 
                    ? 'bg-[#2a2a4a] border-[#2d3748] text-white placeholder-gray-400' 
                    : 'bg-white border-gray-200 text-gray-800 placeholder-gray-400'
                } focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none transition-all`}
              />
            </div>

            {/* Stock */}
            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Stock</label>
              <input
                type="number"
                value={formData.stock}
                onChange={(e) => setFormData(prev => ({ ...prev, stock: e.target.value }))}
                placeholder="10"
                className={`w-full px-3 py-2 rounded-lg border text-sm ${
                  isDark 
                    ? 'bg-[#2a2a4a] border-[#2d3748] text-white placeholder-gray-400' 
                    : 'bg-white border-gray-200 text-gray-800 placeholder-gray-400'
                } focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none transition-all`}
              />
            </div>

            {/* Couleur (si type couleur) */}
            {formData.name === 'couleur' && (
              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Couleur</label>
                <input
                  type="color"
                  value={formData.color}
                  onChange={(e) => setFormData(prev => ({ ...prev, color: e.target.value }))}
                  className="w-full h-10 rounded-lg border border-gray-200 dark:border-[#2d3748] cursor-pointer"
                />
              </div>
            )}

            {/* Image */}
            <div className="col-span-2">
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Image de la variante</label>
              <div className="flex items-center gap-3">
                <input
                  type="text"
                  value={formData.image}
                  onChange={(e) => setFormData(prev => ({ ...prev, image: e.target.value }))}
                  placeholder="URL de l'image"
                  className={`flex-1 px-3 py-2 rounded-lg border text-sm ${
                    isDark 
                      ? 'bg-[#2a2a4a] border-[#2d3748] text-white placeholder-gray-400' 
                      : 'bg-white border-gray-200 text-gray-800 placeholder-gray-400'
                  } focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none transition-all`}
                />
                <button
                  type="button"
                  onClick={() => {
                    const input = document.createElement('input');
                    input.type = 'file';
                    input.accept = 'image/*';
                    input.onchange = (e) => {
                      const file = e.target.files[0];
                      if (file) handleImageUpload(file);
                    };
                    input.click();
                  }}
                  disabled={uploading}
                  className="px-4 py-2 rounded-lg bg-gold text-gray-900 hover:bg-gold/80 transition-colors text-sm whitespace-nowrap"
                >
                  {uploading ? '...' : '📤 Upload'}
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
              {editingIndex !== null ? 'Mettre à jour' : 'Ajouter'}
            </button>
            <button
              type="button"
              onClick={() => {
                setShowForm(false);
                setEditingIndex(null);
                resetForm();
              }}
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