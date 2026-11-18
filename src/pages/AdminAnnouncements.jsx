// 📄 src/pages/AdminAnnouncements.jsx
// ✅ Formulaire d'annonces 100% Mobile First, ergonomique et tactile
import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import {
  Plus,
  Trash2,
  Edit,
  X,
  Save,
  Tag,
  Info,
  Calendar,
  ArrowLeft,
  AlertCircle,
  Check,
  Eye,
} from "lucide-react";
import { supabase } from "../config/supabase";
import { useTheme } from "../context/ThemeContext";

const emptyForm = () => ({
  title: "",
  message: "",
  type: "promo",
  link: "/femme",
  link_label: "J'en profite",
  is_active: true,
  starts_at: "",
  ends_at: "",
});

const toLocalDatetimeValue = (iso) => {
  if (!iso) return "";
  try {
    const d = new Date(iso);
    if (isNaN(d.getTime())) return "";
    const tzOffset = d.getTimezoneOffset() * 60000;
    return new Date(d.getTime() - tzOffset).toISOString().slice(0, 16);
  } catch {
    return "";
  }
};

const toISOStringSafe = (local) => {
  if (!local) return null;
  const d = new Date(local);
  return isNaN(d.getTime()) ? null : d.toISOString();
};

const getTypeIcon = (type) => {
  if (type === "promo") return <Tag className="w-4 h-4 text-gold" />;
  if (type === "event") return <Calendar className="w-4 h-4 text-purple-400" />;
  return <Info className="w-4 h-4 text-blue-400" />;
};

const getTypeColor = (type) => {
  if (type === "promo") return "bg-gold/20 text-gold border-gold/30";
  if (type === "event") return "bg-purple-500/20 text-purple-400 border-purple-500/30";
  return "bg-blue-500/20 text-blue-400 border-blue-500/30";
};

const AdminAnnouncements = () => {
  const { isDark } = useTheme();

  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm());
  const [saving, setSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: err } = await supabase
        .from("announcements")
        .select("*")
        .order("created_at", { ascending: false });

      if (err) throw err;
      setAnnouncements(data || []);
    } catch (err) {
      console.error("Erreur chargement annonces:", err);
      setError(err.message || "Erreur de chargement");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const openCreate = () => {
    setForm(emptyForm());
    setEditingId(null);
    setShowForm(true);
    setError(null);
  };

  const openEdit = (ann) => {
    setForm({
      title: ann.title || "",
      message: ann.message || "",
      type: ann.type || "promo",
      link: ann.link || "",
      link_label: ann.link_label || "",
      is_active: ann.is_active !== false,
      starts_at: toLocalDatetimeValue(ann.starts_at),
      ends_at: toLocalDatetimeValue(ann.ends_at),
    });
    setEditingId(ann.id);
    setShowForm(true);
    setError(null);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingId(null);
    setForm(emptyForm());
  };

  const handleSave = async () => {
    setError(null);

    if (!form.title.trim() || !form.message.trim()) {
      setError("Le titre et le message sont obligatoires.");
      return;
    }

    if (form.starts_at && form.ends_at) {
      const start = new Date(form.starts_at);
      const end = new Date(form.ends_at);
      if (end < start) {
        setError("La date de fin doit être postérieure à la date de début.");
        return;
      }
    }

    const payload = {
      title: form.title.trim(),
      message: form.message.trim(),
      type: form.type,
      link: form.link.trim(),
      link_label: form.link_label.trim(),
      is_active: form.is_active,
      starts_at: toISOStringSafe(form.starts_at),
      ends_at: toISOStringSafe(form.ends_at),
    };

    setSaving(true);
    try {
      if (editingId) {
        const { error: err } = await supabase
          .from("announcements")
          .update(payload)
          .eq("id", editingId);
        if (err) throw err;
      } else {
        const { error: err } = await supabase
          .from("announcements")
          .insert([payload]);
        if (err) throw err;
      }

      closeForm();
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2500);
      await load();
    } catch (err) {
      console.error("Erreur sauvegarde:", err);
      setError(err.message || "Erreur lors de la sauvegarde.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Supprimer cette annonce ?")) return;
    try {
      const { error: err } = await supabase
        .from("announcements")
        .delete()
        .eq("id", id);
      if (err) throw err;
      await load();
    } catch (err) {
      console.error("Erreur suppression:", err);
    }
  };

  const toggleActive = async (ann) => {
    try {
      const { error: err } = await supabase
        .from("announcements")
        .update({ is_active: !ann.is_active })
        .eq("id", ann.id);
      if (err) throw err;
      await load();
    } catch (err) {
      console.error("Erreur toggle:", err);
    }
  };

  // 📱 Classes optimisées mobile (inputs confortables, pas de zoom sur iOS avec text-base)
  const inputClass = `w-full px-4 py-3 rounded-xl border text-base sm:text-sm ${
    isDark
      ? "bg-[#2a2a4a] border-[#2d3748] text-white placeholder-gray-400"
      : "bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400"
  } focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none transition-all`;

  return (
    <div className={`min-h-screen pb-24 px-3 sm:px-6 pt-4 ${isDark ? "bg-[#0d0d1a]" : "bg-gray-50"}`}>
      <div className="max-w-2xl mx-auto">
        {/* Header mobile first */}
        <div className="flex items-center justify-between gap-3 mb-5">
          <div className="flex items-center gap-2.5 min-w-0">
            <Link
              to="/admin"
              className={`p-2.5 rounded-xl transition-colors flex-shrink-0 ${
                isDark
                  ? "bg-[#1a1a2e] text-gray-300"
                  : "bg-white text-gray-700 shadow-sm"
              }`}
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="min-w-0">
              <h1 className="text-lg sm:text-xl font-display font-bold text-gray-900 dark:text-white truncate">
                Annonces
              </h1>
              <p className="text-[11px] sm:text-xs text-gray-500 dark:text-gray-400 truncate">
                Gestion des bannières accueil
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={openCreate}
            className="flex items-center gap-1.5 bg-gold text-gray-900 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm shadow-lg shadow-gold/20 active:scale-95 transition-transform flex-shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Créer</span>
          </button>
        </div>

        {error && !showForm && (
          <div className="mb-4 p-3.5 rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 flex items-center gap-2.5">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
            <p className="text-xs text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}

        {/* Liste Mobile First */}
        {loading ? (
          <div className="text-center py-16">
            <div className="w-8 h-8 border-4 border-gold border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="mt-3 text-xs text-gray-500">Chargement...</p>
          </div>
        ) : announcements.length === 0 ? (
          <div className={`rounded-2xl p-8 text-center border ${isDark ? "bg-[#16162c] border-[#2d3748]" : "bg-white border-gray-200"}`}>
            <Tag className="w-10 h-10 mx-auto text-gold mb-3 opacity-80" />
            <p className="text-sm font-bold text-gray-800 dark:text-white mb-1">Aucune annonce</p>
            <p className="text-xs text-gray-400 mb-4">Créez votre première bannière promotionnelle.</p>
            <button
              type="button"
              onClick={openCreate}
              className="bg-gold text-gray-900 px-4 py-2 rounded-xl text-xs font-bold shadow"
            >
              + Nouvelle annonce
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {announcements.map((ann) => {
              const type = ann.type || 'promo';
              const badgeStyle = getTypeColor(type);

              return (
                <div
                  key={ann.id}
                  className={`rounded-2xl p-4 border ${
                    isDark ? "bg-[#16162c] border-[#2d3748]" : "bg-white border-gray-200 shadow-sm"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`p-2.5 rounded-xl border flex-shrink-0 ${badgeStyle}`}>
                      {getTypeIcon(type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap mb-1">
                        <span className={`text-[9px] uppercase font-bold px-2 py-0.5 rounded-full border ${badgeStyle}`}>
                          {type}
                        </span>
                        <span className={`text-[9px] px-2 py-0.5 rounded-full font-medium ${ann.is_active ? 'bg-green-500/20 text-green-500' : 'bg-gray-500/20 text-gray-400'}`}>
                          {ann.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                      <h3 className="font-display font-bold text-sm text-gray-900 dark:text-white truncate">
                        {ann.title}
                      </h3>
                      <p className="text-xs text-gray-600 dark:text-gray-300 mt-1 line-clamp-2">
                        {ann.message}
                      </p>
                    </div>
                  </div>

                  {/* Actions mobiles en bas de carte */}
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100 dark:border-[#2d3748]/50 text-xs">
                    <span className="text-[10px] text-gray-400 truncate max-w-[180px]">
                      {ann.link ? `🔗 ${ann.link}` : 'Pas de lien'}
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => toggleActive(ann)}
                        className={`px-2.5 py-1 rounded-lg font-medium ${ann.is_active ? 'bg-green-500/10 text-green-500' : 'bg-gray-500/10 text-gray-400'}`}
                      >
                        {ann.is_active ? 'Actif' : 'Inactif'}
                      </button>
                      <button
                        type="button"
                        onClick={() => openEdit(ann)}
                        className="p-1.5 rounded-lg bg-blue-500/10 text-blue-500"
                        title="Modifier"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(ann.id)}
                        className="p-1.5 rounded-lg bg-red-500/10 text-red-500"
                        title="Supprimer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ===== MODAL PLEIN ÉCRAN MOBILE FIRST ===== */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div
            className={`w-full max-w-lg rounded-t-3xl sm:rounded-3xl ${
              isDark ? "bg-[#16162c] border-t sm:border border-[#2d3748]" : "bg-white"
            } shadow-2xl overflow-hidden max-h-[90vh] sm:max-h-[85vh] flex flex-col animate-slide-up`}
          >
            {/* Modal Header */}
            <div className={`p-4 sm:p-5 border-b ${isDark ? "border-[#2d3748]" : "border-gray-100"} flex items-center justify-between flex-shrink-0`}>
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-gold/20 text-gold">
                  <Tag className="w-4 h-4" />
                </div>
                <h2 className="font-display font-bold text-base sm:text-lg text-gray-900 dark:text-white">
                  {editingId ? "Modifier l'annonce" : "Nouvelle annonce"}
                </h2>
              </div>
              <button
                type="button"
                onClick={closeForm}
                className="p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-full text-gray-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body Scrollable */}
            <div className="p-4 sm:p-6 overflow-y-auto space-y-4 flex-1">
              {error && (
                <div className="p-3 rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                  <p className="text-xs text-red-600 dark:text-red-400">{error}</p>
                </div>
              )}

              {/* Aperçu en direct */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-1.5 flex items-center gap-1">
                  <Eye className="w-3.5 h-3.5 text-gold" />
                  <span>Aperçu en direct</span>
                </label>
                <div className={`relative rounded-xl border ${getTypeColor(form.type)} p-3.5 ${isDark ? 'bg-[#1a1a35]' : 'bg-gray-50'}`}>
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-lg bg-white/20 flex-shrink-0">
                      {getTypeIcon(form.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-display font-bold text-xs sm:text-sm text-gray-900 dark:text-white truncate">
                        {form.title || "Titre de l'annonce..."}
                      </h4>
                      <p className="text-[11px] text-gray-600 dark:text-gray-300 mt-0.5 line-clamp-1">
                        {form.message || "Message..."}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Type d'annonce (Grid 3 boutons tactiles) */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-1.5">
                  Type
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'promo', label: '🔥 Promo' },
                    { id: 'info', label: '✨ Info' },
                    { id: 'event', label: '📅 Événement' },
                  ].map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setForm({ ...form, type: t.id })}
                      className={`py-2.5 px-2 rounded-xl border text-center font-bold text-xs transition-all ${
                        form.type === t.id
                          ? 'border-gold bg-gold/20 text-gray-900 dark:text-white shadow-sm'
                          : isDark
                          ? 'border-[#2d3748] bg-[#2a2a4a]/40 text-gray-400'
                          : 'border-gray-200 bg-gray-50 text-gray-600'
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Titre */}
              <div>
                <label className="block text-xs font-medium mb-1 text-gray-700 dark:text-gray-300">
                  Titre <span className="text-red-500">*</span>
                </label>
                <input
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="Ex: -20% sur tous les packs !"
                  className={inputClass}
                  maxLength={100}
                />
              </div>

              {/* Message */}
              <div>
                <label className="block text-xs font-medium mb-1 text-gray-700 dark:text-gray-300">
                  Message <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  placeholder="Description..."
                  rows={3}
                  className={inputClass}
                  maxLength={300}
                />
              </div>

              {/* Lien & Bouton */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium mb-1 text-gray-700 dark:text-gray-300">
                    Lien (ex: /femme)
                  </label>
                  <input
                    value={form.link}
                    onChange={(e) => setForm({ ...form, link: e.target.value })}
                    placeholder="/femme"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1 text-gray-700 dark:text-gray-300">
                    Texte du bouton
                  </label>
                  <input
                    value={form.link_label}
                    onChange={(e) => setForm({ ...form, link_label: e.target.value })}
                    placeholder="J'en profite"
                    className={inputClass}
                  />
                </div>
              </div>

              {/* Dates */}
              <div className="p-3.5 rounded-xl border border-gray-200 dark:border-[#2d3748] bg-gray-50/50 dark:bg-[#1a1a35]/50 space-y-3">
                <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
                  Dates de diffusion (optionnel)
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-medium mb-1 text-gray-600 dark:text-gray-300">Début</label>
                    <input
                      type="datetime-local"
                      value={form.starts_at}
                      onChange={(e) => setForm({ ...form, starts_at: e.target.value })}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium mb-1 text-gray-600 dark:text-gray-300">Fin</label>
                    <input
                      type="datetime-local"
                      value={form.ends_at}
                      onChange={(e) => setForm({ ...form, ends_at: e.target.value })}
                      className={inputClass}
                    />
                  </div>
                </div>
              </div>

              {/* Actif */}
              <div className="flex items-center justify-between p-3 rounded-xl border border-gray-200 dark:border-[#2d3748]">
                <span className="text-sm font-medium text-gray-800 dark:text-white">Annonce active</span>
                <input
                  type="checkbox"
                  checked={form.is_active}
                  onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
                  className="w-5 h-5 accent-gold cursor-pointer"
                />
              </div>
            </div>

            {/* Modal Footer (Sticky bas pour pouce) */}
            <div className={`p-4 border-t ${isDark ? "border-[#2d3748]" : "border-gray-100"} flex items-center gap-3 flex-shrink-0`}>
              <button
                type="button"
                onClick={closeForm}
                className="w-1/3 py-3 rounded-xl border border-gray-200 dark:border-[#2d3748] text-gray-600 dark:text-gray-300 text-xs font-bold"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={saving}
                className="w-2/3 bg-gold text-gray-900 py-3 rounded-xl font-bold text-xs shadow-lg shadow-gold/20 flex items-center justify-center gap-2 active:scale-95 transition-transform"
              >
                {saving ? (
                  <span>Enregistrement...</span>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>{editingId ? "Mettre à jour" : "Publier"}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {showSuccess && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-green-500 text-white px-6 py-3 rounded-2xl shadow-2xl animate-bounce-in font-bold text-xs flex items-center gap-2">
          <Check className="w-4 h-4" />
          <span>Enregistré avec succès !</span>
        </div>
      )}
    </div>
  );
};

export default AdminAnnouncements;
