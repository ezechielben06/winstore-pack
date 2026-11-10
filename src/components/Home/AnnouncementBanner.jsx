// 📄 src/components/Home/AnnouncementBanner.jsx
import { useState, useEffect } from 'react';
import { X, ExternalLink, Tag, Calendar, Info } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '../../config/supabase';
import { useTheme } from '../../context/ThemeContext';

const ICONS = {
  info: <Info className="w-4 h-4" />,
  promo: <Tag className="w-4 h-4" />,
  event: <Calendar className="w-4 h-4" />,
};

const COLORS = {
  info: 'from-blue-500 to-blue-600',
  promo: 'from-gold to-yellow-500',
  event: 'from-purple-500 to-pink-500',
};

const AnnouncementBanner = () => {
  const { isDark } = useTheme();
  const [announcements, setAnnouncements] = useState([]);
  const [dismissedIds, setDismissedIds] = useState(() => {
    try {
      const saved = localStorage.getItem('dismissed_announcements');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      try {
        const { data, error } = await supabase
          .from('announcements')
          .select('*')
          .eq('is_active', true)
          .or(`starts_at.is.null,starts_at.lte.${new Date().toISOString()}`)
          .or(`ends_at.is.null,ends_at.gte.${new Date().toISOString()}`)
          .order('created_at', { ascending: false })
          .limit(3);

        if (error) throw error;
        if (mounted) setAnnouncements(data || []);
      } catch (err) {
        console.error('Erreur annonces:', err);
      }
    };

    load();
    return () => { mounted = false; };
  }, []);

  const handleDismiss = (id) => {
    const next = [...dismissedIds, id];
    setDismissedIds(next);
    try {
      localStorage.setItem('dismissed_announcements', JSON.stringify(next));
    } catch {}
  };

  // Filtre les annonces déjà fermées
  const visible = announcements.filter((a) => !dismissedIds.includes(a.id));

  if (visible.length === 0) return null;

  return (
    <div className="container mx-auto px-4 pt-3">
      <div className="space-y-2">
        {visible.map((ann) => {
          const type = ann.type || 'info';
          const icon = ICONS[type] || ICONS.info;
          const color = COLORS[type] || COLORS.info;

          return (
            <div
              key={ann.id}
              className={`relative overflow-hidden rounded-xl bg-gradient-to-r ${color} text-white shadow-lg`}
            >
              <div className="flex items-center gap-3 px-4 py-3 pr-10">
                <div className="p-1.5 bg-white/20 rounded-lg flex-shrink-0">
                  {icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm">{ann.title}</p>
                  <p className="text-xs text-white/90 line-clamp-2">
                    {ann.message}
                  </p>
                </div>
                {ann.link && (
                  <Link
                    to={ann.link}
                    className="hidden sm:inline-flex items-center gap-1 bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex-shrink-0"
                  >
                    {ann.link_label || 'Voir'}
                    <ExternalLink className="w-3 h-3" />
                  </Link>
                )}
              </div>

              <button
                type="button"
                onClick={() => handleDismiss(ann.id)}
                className="absolute top-2 right-2 p-1 hover:bg-white/20 rounded-full transition-colors"
                aria-label="Fermer l'annonce"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AnnouncementBanner;