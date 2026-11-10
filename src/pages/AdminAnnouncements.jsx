// 📄 src/pages/AdminAnnouncements.jsx
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
} from "lucide-react";
import { supabase } from "../config/supabase";
import { useTheme } from "../context/ThemeContext";

// ✅ Forme vide (factory pour éviter les références partagées)
const emptyForm = () => ({
  title: "",
  message: "",
  type: "info",
  link: "",
  link_label: "",
  is_active: true,
  starts_at: "",
  ends_at: "",
});

// ✅ Convertit une date ISO → format "YYYY-MM-DDTHH:mm" pour <input type="datetime-local">
const toLocalDatetimeValue = (iso) => {
  if (!iso) return "";
  try {
    const d = new Date(iso);
    if (isNaN(d.getTime())) return "";
    // Corrige le décalage UTC → heure locale
    const tzOffset = d.getTimezoneOffset() * 60000;
    return new Date(d.getTime() - tzOffset).toISOString().slice(0, 16);
  } catch {
    return "";
  }
};

// ✅ Convertit "YYYY-MM-DDTHH:mm" → ISO (UTC)
const toISOStringSafe = (local) => {
  if (!local) return null;
  const d = new Date(local);
  return isNaN(d.getTime()) ? null : d.toISOString();
};

// ✅ Icône selon le type
const getTypeIcon = (type) => {
  if (type === "promo") return <Tag className="w-4 h-4" />;
  if (type === "event") return <Calendar className="w-4 h-4" />;
  return <Info className="w-4 h-4" />;
};

// ✅ Couleurs selon le type
const getTypeColor = (type) => {
  if (type === "promo") return "bg-gold/20 text-gold";
  if (type === "event") return "bg-purple-500/20 text-purple-500";
  return "bg-blue-500/20 text-blue-500";
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

  // ✅ Chargement
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

  // ✅ Ouvrir le formulaire (création)
  const openCreate = () => {
    setForm(emptyForm());
    setEditingId(null);
    setShowForm(true);
    setError(null);
  };

  // ✅ Ouvrir le formulaire (édition)
  const openEdit = (ann) => {
    setForm({
      title: ann.title || "",
      message: ann.message || "",
      type: ann.type || "info",
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

  // ✅ Sauvegarde (création ou mise à jour)
  const handleSave = async () => {
    setError(null);

    if (!form.title.trim() || !form.message.trim()) {
      setError("Titre et message sont requis");
      return;
    }

    // ✅ Validation dates : ends_at doit être après starts_at
    if (form.starts_at && form.ends_at) {
      const start = new Date(form.starts_at);
      const end = new Date(form.ends_at);
      if (end < start) {
        setError("La date de fin doit être après la date de début");
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
      setTimeout(() => setShowSuccess(false), 2000);
      await load();
    } catch (err) {
      console.error("Erreur sauvegarde:", err);
      setError(err.message || "Erreur lors de la sauvegarde");
    } finally {
      setSaving(false);
    }
  };

  // ✅ Suppression
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
      alert("Erreur: " + (err.message || "inconnue"));
    }
  };

  // ✅ Activer / Désactiver
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

  const inputClass = `w-full px-3 py-2 rounded-xl border text-sm ${
    isDark
      ? "bg-[#2a2a4a] border-[#2d3748] text-white placeholder-gray-400"
      : "bg-gray-50 border-gray-200 text-gray-800 placeholder-gray-400"
  } focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none transition-all`;

  return (
    <div
      className={`min-h-screen p-4 ${isDark ? "bg-[#0d0d1a]" : "bg-gray-50"}`}
    >
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between gap-2 mb-6">
          <div className="flex items-center gap-3 min-w-0">
            <Link
              to="/admin"
              className={`p-2 rounded-xl transition-colors flex-shrink-0 ${
                isDark
                  ? "bg-[#2a2a4a] hover:bg-[#3a3a5a]"
                  : "bg-gray-100 hover:bg-gray-200"
              }`}
              title="Retour au tableau de bord"
            >
              <ArrowLeft className="w-4 h-4 text-gray-600 dark:text-gray-300" />
            </Link>
            <h1 className="text-xl font-display font-bold text-gray-800 dark:text-white truncate">
              Annonces & Promotions
            </h1>
          </div>
          <button
            type="button"
            onClick={openCreate}
            className="flex items-center gap-2 bg-gold text-gray-900 px-4 py-2 rounded-xl font-semibold hover:bg-gold/80 text-sm flex-shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Nouvelle annonce</span>
            <span className="sm:hidden">Créer</span>
          </button>
        </div>

        {/* Erreur globale */}
        {error && !showForm && (
          <div className="mb-4 p-3 rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
            <p className="text-xs text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}

        {/* Liste */}
        {loading ? (
          <div className="text-center py-12">
            <div className="w-8 h-8 border-4 border-gold border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">
              Chargement...
            </p>
          </div>
        ) : announcements.length === 0 ? (
          <div
            className={`rounded-2xl p-12 text-center border ${
              isDark
                ? "bg-[#1a1a2e] border-[#2d3748]"
                : "bg-white border-gray-200"
            }`}
          >
            <Tag className="w-12 h-12 mx-auto text-gray-300 mb-3" />
            <p className="text-gray-500 dark:text-gray-400 mb-2">
              Aucune annonce pour le moment
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mb-4">
              Crée ta première annonce pour l'afficher sur la page d'accueil
            </p>
            <button
              type="button"
              onClick={openCreate}
              className="text-sm text-gold font-medium hover:underline"
            >
              + Créer une annonce
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {announcements.map((ann) => (
              <div
                key={ann.id}
                className={`rounded-xl p-4 border ${
                  isDark
                    ? "bg-[#1a1a2e] border-[#2d3748]"
                    : "bg-white border-gray-200"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`p-2 rounded-lg flex-shrink-0 ${getTypeColor(
                      ann.type
                    )}`}
                  >
                    {getTypeIcon(ann.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-semibold text-sm text-gray-800 dark:text-white">
                        {ann.title}
                      </p>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full ${
                          ann.is_active
                            ? "bg-green-500/20 text-green-600 dark:text-green-400"
                            : "bg-gray-200 dark:bg-gray-700 text-gray-500"
                        }`}
                      >
                        {ann.is_active ? "Active" : "Inactive"}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
                      {ann.message}
                    </p>
                    <div className="flex flex-wrap items-center gap-2 mt-1">
                      {ann.starts_at && (
                        <p className="text-[10px] text-gray-400">
                          Débute le{" "}
                          {new Date(ann.starts_at).toLocaleDateString("fr-FR")}
                        </p>
                      )}
                      {ann.ends_at && (
                        <p className="text-[10px] text-gray-400">
                          Expire le{" "}
                          {new Date(ann.ends_at).toLocaleDateString("fr-FR")}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <button
                      type="button"
                      onClick={() => toggleActive(ann)}
                      className="p-1.5 hover:bg-gray-100 dark:hover:bg-[#2a2a4a] rounded-lg text-xs"
                      title={ann.is_active ? "Désactiver" : "Activer"}
                    >
                      {ann.is_active ? "⏸️" : "▶️"}
                    </button>
                    <button
                      type="button"
                      onClick={() => openEdit(ann)}
                      className="p-1.5 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-lg text-blue-500 transition-colors"
                      title="Modifier"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(ann.id)}
                      className="p-1.5 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg text-red-500 transition-colors"
                      title="Supprimer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ===== Modal formulaire ===== */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div
            className={`w-full max-w-lg rounded-2xl ${
              isDark ? "bg-[#1a1a2e]" : "bg-white"
            } shadow-2xl p-6 max-h-[90vh] overflow-y-auto`}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display font-bold text-gray-800 dark:text-white">
                {editingId ? "Modifier l'annonce" : "Nouvelle annonce"}
              </h2>
              <button
                type="button"
                onClick={closeForm}
                className="p-1 hover:bg-gray-100 dark:hover:bg-[#2a2a4a] rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Erreur dans le formulaire */}
            {error && (
              <div className="mb-3 p-3 rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                <p className="text-xs text-red-600 dark:text-red-400">
                  {error}
                </p>
              </div>
            )}

            <div className="space-y-3">
              {/* Titre */}
              <div>
                <label className="block text-xs font-medium mb-1 text-gray-700 dark:text-gray-300">
                  Titre <span className="text-red-500">*</span>
                </label>
                <input
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="Ex: -20% sur tous les packs"
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
                  onChange={(e) =>
                    setForm({ ...form, message: e.target.value })
                  }
                  placeholder="Description de l'annonce..."
                  rows={3}
                  className={inputClass}
                  maxLength={500}
                />
                <p className="text-[10px] text-gray-400 mt-1 text-right">
                  {form.message.length}/500
                </p>
              </div>

              {/* Type + Actif */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium mb-1 text-gray-700 dark:text-gray-300">
                    Type
                  </label>
                  <select
                    value={form.type}
                    onChange={(e) =>
                      setForm({ ...form, type: e.target.value })
                    }
                    className={inputClass}
                  >
                    <option value="info">ℹ️ Info</option>
                    <option value="promo">🏷️ Promo</option>
                    <option value="event">📅 Événement</option>
                  </select>
                </div>
                <div className="flex items-end">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={form.is_active}
                      onChange={(e) =>
                        setForm({ ...form, is_active: e.target.checked })
                      }
                      className="w-4 h-4 accent-gold"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      Active
                    </span>
                  </label>
                </div>
              </div>

              {/* Lien */}
              <div>
                <label className="block text-xs font-medium mb-1 text-gray-700 dark:text-gray-300">
                  Lien (optionnel)
                </label>
                <input
                  value={form.link}
                  onChange={(e) => setForm({ ...form, link: e.target.value })}
                  placeholder="/femme"
                  className={inputClass}
                />
                <p className="text-[10px] text-gray-400 mt-1">
                  Ex: /femme, /homme, /produit/w1, https://...
                </p>
              </div>

              {/* Texte du lien */}
              <div>
                <label className="block text-xs font-medium mb-1 text-gray-700 dark:text-gray-300">
                  Texte du bouton
                </label>
                <input
                  value={form.link_label}
                  onChange={(e) =>
                    setForm({ ...form, link_label: e.target.value })
                  }
                  placeholder="Voir la promo"
                  className={inputClass}
                  maxLength={30}
                />
              </div>

              {/* Dates */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium mb-1 text-gray-700 dark:text-gray-300">
                    Début (optionnel)
                  </label>
                  <input
                    type="datetime-local"
                    value={form.starts_at}
                    onChange={(e) =>
                      setForm({ ...form, starts_at: e.target.value })
                    }
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1 text-gray-700 dark:text-gray-300">
                    Fin (optionnel)
                  </label>
                  <input
                    type="datetime-local"
                    value={form.ends_at}
                    onChange={(e) =>
                      setForm({ ...form, ends_at: e.target.value })
                    }
                    className={inputClass}
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={saving}
                  className="flex-1 bg-gold text-gray-900 py-2.5 rounded-xl font-semibold hover:bg-gold/80 flex items-center justify-center gap-2 text-sm disabled:opacity-70"
                >
                  {saving ? (
                    <>
                      <span className="w-4 h-4 border-2 border-gray-900/30 border-t-gray-900 rounded-full animate-spin" />
                      Enregistrement...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      Enregistrer
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={closeForm}
                  className="px-4 py-2.5 rounded-xl border border-gray-200 dark:border-[#2d3748] text-gray-600 dark:text-gray-400 text-sm hover:bg-gray-50 dark:hover:bg-[#2a2a4a] transition-colors"
                >
                  Annuler
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Toast succès */}
      {showSuccess && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-green-500 text-white px-6 py-3 rounded-xl shadow-2xl animate-bounce-in flex items-center gap-2">
          <Check className="w-5 h-5" />
          Annonce enregistrée !
        </div>
      )}
    </div>
  );
};

export default AdminAnnouncements;