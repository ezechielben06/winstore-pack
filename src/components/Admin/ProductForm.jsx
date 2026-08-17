// 📄 src/components/Admin/ProductForm.jsx - Version avec images par variante
import { useState, useEffect } from 'react';
import { 
  Save, X, Package, Sparkles, ChevronDown, ChevronUp, 
  Wand2, Plus, Trash2, Palette, Image as ImageIcon,
  Upload, Camera
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const ProductForm = ({ 
  isOpen, 
  onClose, 
  onSave, 
  editingProduct,
  isDark: themeIsDark,
  existingProducts = []
}) => {
  const { isDark } = useTheme();
  const darkMode = themeIsDark !== undefined ? themeIsDark : isDark;
  
  const [expandedSections, setExpandedSections] = useState({
    basic: true,
    variants: true, // ✅ Par défaut ouvert
    pricing: false,
    media: false,
    advanced: false
  });

  const [formData, setFormData] = useState({
    id: '',
    name: '',
    category: 'product',
    type: 'women',
    price: '',
    priceRange: '',
    description: '',
    emoji: '✨',
    image: '',
    tags: '',
    popularity: '',
    items: '',
    color: 'from-pink-400 to-rose-400',
    variants: []
  });

  // ✅ Formulaire d'ajout de variante avec image
  const [variantForm, setVariantForm] = useState({
    name: '',
    value: '',
    price: '',
    image: '',
    stock: ''
  });

  // ✅ Ajouter une variante
  const addVariant = () => {
    if (!variantForm.name || !variantForm.value) {
      alert('Veuillez remplir le nom et la valeur de la variante');
      return;
    }
    setFormData(prev => ({
      ...prev,
      variants: [...prev.variants, { ...variantForm, id: Date.now() }]
    }));
    setVariantForm({ name: '', value: '', price: '', image: '', stock: '' });
  };

  // ✅ Supprimer une variante
  const removeVariant = (id) => {
    setFormData(prev => ({
      ...prev,
      variants: prev.variants.filter(v => v.id !== id)
    }));
  };

  const generateNextId = (category, type) => {
    const existing = existingProducts || [];
    let prefix = '';
    if (type === 'women' && category === 'product') prefix = 'w';
    else if (type === 'women' && category === 'pack') prefix = 'p';
    else if (type === 'men' && category === 'product') prefix = 'm';
    else if (type === 'men' && category === 'pack') prefix = 'mp';
    
    const ids = existing
      .filter(p => p.id?.startsWith(prefix) && /^\d+$/.test(p.id.replace(prefix, '')))
      .map(p => parseInt(p.id.replace(prefix, '')))
      .filter(n => !isNaN(n));
    
    const maxNum = ids.length > 0 ? Math.max(...ids) : 0;
    return `${prefix}${maxNum + 1}`;
  };

  useEffect(() => {
    if (editingProduct) {
      let type = 'women';
      if (editingProduct.id?.startsWith('m')) type = 'men';
      
      setFormData({
        id: editingProduct.id || '',
        name: editingProduct.name || '',
        category: editingProduct.category || 'product',
        type: type,
        price: editingProduct.price || '',
        priceRange: editingProduct.priceRange || '',
        description: editingProduct.description || '',
        emoji: editingProduct.emoji || '✨',
        image: editingProduct.image || '',
        tags: editingProduct.tags ? editingProduct.tags.join(', ') : '',
        popularity: editingProduct.popularity || '',
        items: editingProduct.items ? editingProduct.items.join('\n') : '',
        color: editingProduct.color || 'from-pink-400 to-rose-400',
        variants: editingProduct.variants || []
      });
    } else {
      const newId = generateNextId('product', 'women');
      setFormData(prev => ({
        ...prev,
        id: newId,
        category: 'product',
        type: 'women',
        variants: []
      }));
    }
  }, [editingProduct, existingProducts]);

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const regenerateId = () => {
    const newId = generateNextId(formData.category, formData.type);
    setFormData(prev => ({ ...prev, id: newId }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.id) {
      alert('L\'ID est requis');
      return;
    }

    if (!editingProduct) {
      const exists = (existingProducts || []).some(p => p.id === formData.id);
      if (exists) {
        alert(`L'ID "${formData.id}" existe déjà.`);
        regenerateId();
        return;
      }
    }

    const newProduct = {
      id: formData.id,
      name: formData.name,
      category: formData.category,
      description: formData.description,
      emoji: formData.emoji || '✨',
      image: formData.image || '',
      tags: formData.tags ? formData.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
      popularity: formData.popularity || '',
      color: formData.color || 'from-pink-400 to-rose-400',
      variants: formData.variants || []
    };

    if (formData.price) {
      newProduct.price = parseFloat(formData.price);
    }
    if (formData.priceRange) {
      newProduct.priceRange = formData.priceRange;
    }
    if (formData.items) {
      newProduct.items = formData.items.split('\n').filter(i => i.trim());
    }

    onSave(newProduct);
  };

  if (!isOpen) return null;

  const prefixInfo = {
    women: {
      product: { prefix: 'w', label: 'Produit Femme', example: 'w1, w2, w3...' },
      pack: { prefix: 'p', label: 'Pack Femme', example: 'p1, p2, p3...' }
    },
    men: {
      product: { prefix: 'm', label: 'Produit Homme', example: 'm1, m2, m3...' },
      pack: { prefix: 'mp', label: 'Pack Homme', example: 'mp1, mp2, mp3...' }
    }
  };

  const currentPrefix = prefixInfo[formData.type]?.[formData.category] || prefixInfo.women.product;

  const Section = ({ title, icon, section, children }) => (
    <div className={`rounded-xl border ${darkMode ? 'border-[#2d3748]' : 'border-gray-200'} overflow-hidden`}>
      <button
        type="button"
        onClick={() => toggleSection(section)}
        className="w-full flex items-center justify-between p-3 text-left hover:bg-gray-50 dark:hover:bg-[#141425] transition-colors"
      >
        <div className="flex items-center gap-2">
          <span className="text-gray-400">{icon}</span>
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{title}</span>
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

  const Input = ({ label, name, type = 'text', placeholder, required, rows }) => {
    const Component = rows ? 'textarea' : 'input';
    return (
      <div>
        <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
          {label}
          {required && <span className="text-red-500 ml-0.5">*</span>}
        </label>
        <Component
          name={name}
          type={type}
          value={formData[name] || ''}
          onChange={handleChange}
          placeholder={placeholder}
          rows={rows}
          className={`w-full px-3 py-2 rounded-xl border text-sm ${
            darkMode 
              ? 'bg-[#2a2a4a] border-[#2d3748] text-white placeholder-gray-400' 
              : 'bg-gray-50 border-gray-200 text-gray-800 placeholder-gray-400'
          } focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none transition-all`}
          required={required}
        />
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center p-0 sm:p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className={`w-full max-w-lg max-h-[90vh] rounded-t-2xl sm:rounded-2xl ${darkMode ? 'bg-[#1a1a2e]' : 'bg-white'} shadow-2xl border ${darkMode ? 'border-[#2d3748]' : 'border-gray-200'} overflow-hidden`}>
        {/* Header */}
        <div className={`sticky top-0 z-10 ${darkMode ? 'bg-[#1a1a2e]' : 'bg-white'} border-b ${darkMode ? 'border-[#2d3748]' : 'border-gray-200'} px-4 py-3 flex items-center justify-between`}>
          <div className="flex items-center gap-2">
            {formData.category === 'pack' ? (
              <Package className="w-5 h-5 text-gold" />
            ) : (
              <Sparkles className="w-5 h-5 text-blue-500" />
            )}
            <h2 className="text-base font-display font-bold text-gray-800 dark:text-white">
              {editingProduct ? 'Modifier' : 'Ajouter'}
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

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 space-y-3 overflow-y-auto max-h-[calc(90vh-70px)]">
          {/* Section: Informations de base */}
          <Section title="Informations" icon="📝" section="basic">
            {/* Boutique */}
            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Boutique</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    const newType = 'women';
                    setFormData(prev => ({ ...prev, type: newType }));
                    if (!editingProduct) {
                      const newId = generateNextId(formData.category, newType);
                      setFormData(prev => ({ ...prev, id: newId }));
                    }
                  }}
                  className={`py-2 rounded-xl text-sm font-medium transition-all ${
                    formData.type === 'women'
                      ? 'bg-feminine-primary text-white'
                      : darkMode ? 'bg-[#2a2a4a] text-gray-400' : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  👩 Femme
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const newType = 'men';
                    setFormData(prev => ({ ...prev, type: newType }));
                    if (!editingProduct) {
                      const newId = generateNextId(formData.category, newType);
                      setFormData(prev => ({ ...prev, id: newId }));
                    }
                  }}
                  className={`py-2 rounded-xl text-sm font-medium transition-all ${
                    formData.type === 'men'
                      ? 'bg-masculine-primary text-white'
                      : darkMode ? 'bg-[#2a2a4a] text-gray-400' : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  👨 Homme
                </button>
              </div>
            </div>

            {/* Type */}
            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Type</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setFormData(prev => ({ ...prev, category: 'product' }));
                    if (!editingProduct) {
                      const newId = generateNextId('product', formData.type);
                      setFormData(prev => ({ ...prev, id: newId }));
                    }
                  }}
                  className={`py-2 rounded-xl text-sm font-medium transition-all ${
                    formData.category === 'product'
                      ? 'bg-blue-500 text-white'
                      : darkMode ? 'bg-[#2a2a4a] text-gray-400' : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  🛍️ Produit
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setFormData(prev => ({ ...prev, category: 'pack' }));
                    if (!editingProduct) {
                      const newId = generateNextId('pack', formData.type);
                      setFormData(prev => ({ ...prev, id: newId }));
                    }
                  }}
                  className={`py-2 rounded-xl text-sm font-medium transition-all ${
                    formData.category === 'pack'
                      ? 'bg-gold text-gray-900'
                      : darkMode ? 'bg-[#2a2a4a] text-gray-400' : 'bg-gray-100 text-gray-600'
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
                name="id"
                value={formData.id}
                onChange={handleChange}
                className={`w-full px-3 py-2 rounded-xl border text-sm font-mono ${
                  editingProduct
                    ? darkMode ? 'bg-[#2a2a4a] border-[#2d3748] text-gray-400 cursor-not-allowed' : 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed'
                    : darkMode ? 'bg-[#2a2a4a] border-[#2d3748] text-white' : 'bg-gray-50 border-gray-200 text-gray-800'
                } focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none transition-all`}
                disabled={!!editingProduct}
                required
              />
            </div>

            <Input label="Nom" name="name" placeholder="Nom du produit" required />
            <Input label="Description" name="description" placeholder="Description" rows="2" />
            <Input label="Emoji" name="emoji" placeholder="✨" />
          </Section>

          {/* ✅ Section: Variantes avec images */}
          <Section title="Variantes (Couleurs, Tailles...)" icon="🎨" section="variants">
            {/* Formulaire d'ajout */}
            <div className="space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] font-medium text-gray-600 dark:text-gray-400 mb-0.5">Type</label>
                  <select
                    value={variantForm.name}
                    onChange={(e) => setVariantForm(prev => ({ ...prev, name: e.target.value }))}
                    className={`w-full px-2 py-1.5 rounded-lg border text-xs ${
                      darkMode ? 'bg-[#2a2a4a] border-[#2d3748] text-white' : 'bg-gray-50 border-gray-200 text-gray-800'
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
                  <label className="block text-[10px] font-medium text-gray-600 dark:text-gray-400 mb-0.5">Valeur</label>
                  <input
                    type="text"
                    value={variantForm.value}
                    onChange={(e) => setVariantForm(prev => ({ ...prev, value: e.target.value }))}
                    placeholder="Rose bonbon"
                    className={`w-full px-2 py-1.5 rounded-lg border text-xs ${
                      darkMode ? 'bg-[#2a2a4a] border-[#2d3748] text-white' : 'bg-gray-50 border-gray-200 text-gray-800'
                    } focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none transition-all`}
                  />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-[10px] font-medium text-gray-600 dark:text-gray-400 mb-0.5">Prix (optionnel)</label>
                  <input
                    type="number"
                    value={variantForm.price}
                    onChange={(e) => setVariantForm(prev => ({ ...prev, price: e.target.value }))}
                    placeholder="5000"
                    className={`w-full px-2 py-1.5 rounded-lg border text-xs ${
                      darkMode ? 'bg-[#2a2a4a] border-[#2d3748] text-white' : 'bg-gray-50 border-gray-200 text-gray-800'
                    } focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none transition-all`}
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-medium text-gray-600 dark:text-gray-400 mb-0.5">Stock</label>
                  <input
                    type="number"
                    value={variantForm.stock}
                    onChange={(e) => setVariantForm(prev => ({ ...prev, stock: e.target.value }))}
                    placeholder="10"
                    className={`w-full px-2 py-1.5 rounded-lg border text-xs ${
                      darkMode ? 'bg-[#2a2a4a] border-[#2d3748] text-white' : 'bg-gray-50 border-gray-200 text-gray-800'
                    } focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none transition-all`}
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-medium text-gray-600 dark:text-gray-400 mb-0.5">Image de la variante</label>
                  <input
                    type="text"
                    value={variantForm.image}
                    onChange={(e) => setVariantForm(prev => ({ ...prev, image: e.target.value }))}
                    placeholder="rose.jpg"
                    className={`w-full px-2 py-1.5 rounded-lg border text-xs ${
                      darkMode ? 'bg-[#2a2a4a] border-[#2d3748] text-white' : 'bg-gray-50 border-gray-200 text-gray-800'
                    } focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none transition-all`}
                  />
                  <p className="text-[8px] text-gray-400 mt-0.5">📁 public/images/</p>
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

            {/* ✅ Liste des variantes avec aperçu des images */}
            {formData.variants.length > 0 && (
              <div className="space-y-1.5 max-h-48 overflow-y-auto">
                {formData.variants.map((variant) => (
                  <div key={variant.id} className={`flex items-center gap-2 p-2 rounded-lg ${darkMode ? 'bg-[#141425]' : 'bg-gray-50'} border ${darkMode ? 'border-[#2d3748]' : 'border-gray-200'}`}>
                    {/* ✅ Mini aperçu de l'image de la variante */}
                    <div className="w-10 h-10 rounded-lg bg-gray-200 dark:bg-[#2a2a4a] flex items-center justify-center flex-shrink-0 overflow-hidden">
                      {variant.image ? (
                        <img 
                          src={`/images/${variant.image}`} 
                          alt={variant.value}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.parentElement.innerHTML = `<span class="text-lg">📷</span>`;
                          }}
                        />
                      ) : (
                        <ImageIcon className="w-4 h-4 text-gray-400" />
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <p className="text-xs font-medium text-gray-800 dark:text-white truncate">
                          {variant.value}
                        </p>
                        {variant.image && (
                          <span className="text-[8px] text-gold">🖼️</span>
                        )}
                      </div>
                      <p className="text-[9px] text-gray-400 dark:text-gray-500 flex items-center gap-1.5">
                        <span>{variant.name}</span>
                        {variant.price && <span>• {variant.price} FCFA</span>}
                        {variant.stock && <span>• Stock: {variant.stock}</span>}
                      </p>
                    </div>
                    
                    {/* ✅ Champs d'édition rapide de l'image */}
                    <div className="flex items-center gap-1">
                      <input
                        type="text"
                        value={variant.image || ''}
                        onChange={(e) => {
                          setFormData(prev => ({
                            ...prev,
                            variants: prev.variants.map(v => 
                              v.id === variant.id ? { ...v, image: e.target.value } : v
                            )
                          }));
                        }}
                        placeholder="image.jpg"
                        className={`w-16 px-1.5 py-1 rounded-lg border text-[9px] ${
                          darkMode ? 'bg-[#2a2a4a] border-[#2d3748] text-white' : 'bg-white border-gray-200 text-gray-800'
                        } focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none transition-all`}
                      />
                      <button
                        type="button"
                        onClick={() => removeVariant(variant.id)}
                        className="p-1 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg text-red-500 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Section>

          {/* Section: Prix */}
          <Section title="Prix" icon="💰" section="pricing">
            <div className="grid grid-cols-2 gap-3">
              <Input label="Prix fixe" name="price" type="number" placeholder="5000" />
              <Input label="Fourchette" name="priceRange" placeholder="1000-3000" />
            </div>
          </Section>

          {/* Section: Média */}
          <Section title="Image & Tags" icon="🖼️" section="media">
            <Input label="Image principale" name="image" placeholder="racle-langue.jpeg" />
            <p className="text-[10px] text-gray-400">📁 Place l'image dans <span className="font-mono">public/images/</span></p>
            <Input label="Tags (séparés par des virgules)" name="tags" placeholder="Soin, Visage" />
          </Section>

          {/* Section: Avancé */}
          <Section title="Options avancées" icon="⚙️" section="advanced">
            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Popularité</label>
              <select
                name="popularity"
                value={formData.popularity}
                onChange={handleChange}
                className={`w-full px-3 py-2 rounded-xl border text-sm ${
                  darkMode ? 'bg-[#2a2a4a] border-[#2d3748] text-white' : 'bg-gray-50 border-gray-200 text-gray-800'
                } focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none transition-all`}
              >
                <option value="">Aucune</option>
                <option value="🔥">🔥 Populaire</option>
                <option value="⭐">⭐ Très populaire</option>
                <option value="🌟">🌟 Le plus vendu</option>
                <option value="✨">✨ Nouveauté</option>
              </select>
            </div>

            {formData.category === 'pack' && (
              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Articles du pack</label>
                <textarea
                  name="items"
                  value={formData.items}
                  onChange={handleChange}
                  rows="4"
                  placeholder="Parfum léger 🍭&#10;Petit carnet 📓&#10;Stylo unique 🧑‍🎨"
                  className={`w-full px-3 py-2 rounded-xl border text-sm ${
                    darkMode ? 'bg-[#2a2a4a] border-[#2d3748] text-white placeholder-gray-400' : 'bg-gray-50 border-gray-200 text-gray-800 placeholder-gray-400'
                  } focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none transition-all`}
                />
              </div>
            )}

            <Input label="Couleur du gradient" name="color" placeholder="from-pink-400 to-rose-400" />
          </Section>

          {/* Boutons */}
          <div className="flex items-center gap-3 pt-3 border-t border-gray-200 dark:border-[#2d3748]">
            <button
              type="submit"
              className="flex-1 bg-gold text-gray-900 py-3 rounded-xl font-semibold hover:bg-gold/80 transition-all flex items-center justify-center gap-2 text-sm active:scale-95"
            >
              <Save className="w-4 h-4" />
              {editingProduct ? 'Modifier' : 'Ajouter'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-3 rounded-xl border border-gray-200 dark:border-[#2d3748] text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-[#2a2a4a] transition-colors text-sm active:scale-95"
            >
              Annuler
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductForm;