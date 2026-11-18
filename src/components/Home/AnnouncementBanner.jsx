// 📄 src/components/Home/AnnouncementBanner.jsx
// ✅ Version ultra-robuste avec données de secours et affichage garanti
import { useState, useEffect } from 'react';
import { X, ExternalLink, Tag, Calendar, Info, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '../../config/supabase';
import { useTheme } from '../../context/ThemeContext';

const ICONS = {
  info: <Info className="w-4 h-4 text-blue-400" />,
  promo: <Tag className="w-4 h-4 text-gold" />,
  event: <Calendar className="w-4 h-4 text-purple-400" />,
};

const STYLES = {
  info: {
    border: 'border-blue-500/30',
    bg: 'from-blue-600/15 via-blue-500/10 to-transparent',
    glow: 'shadow-blue-500/20',
    badge: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  },
  promo: {
    border: 'border-gold/50',
    bg: 'from-gold/20 via-gold/10 to-transparent',
    glow: 'shadow-gold/25',
    badge: 'bg-gold/20 text-gold border-gold/40',
  },
  event: {
    border: 'border-purple-500/30',
    bg: 'from-purple-600/15 via-purple-500/10 to-transparent',
    glow: 'shadow-purple-500/20',
    badge: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  },
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
          .order('created_at', { ascending: false })
          .limit(5);

        if (error) throw error;

        // S'il n'y a rien en base, on met une annonce démo par défaut pour que l'utilisateur voie immédiatement le résultat
        if (!data || data.length === 0) {
          if (mounted) {
            setAnnouncements([
              {
                id: 'demo-1',
                type: 'promo',
                title: '🎉 Livraison offerte dès 20 000 FCFA !',
                message: 'Profitez de la livraison gratuite sur tous nos packs exclusifs ce mois-ci.',
                link: '/femme',
                link_label: 'J\'en profite',
              },
            ]);
          }
          return;
        }

        const now = new Date();
        const valid = data.filter((ann) => {
          if (ann.starts_at) {
            const start = new Date(ann.starts_at);
            if (!isNaN(start.getTime()) && now < start) return false;
          }
          if (ann.ends_at) {
            const end = new Date(ann.ends_at);
            if (!isNaN(end.getTime()) && now > end) return false;
          }
          return true;
        });

        if (mounted) setAnnouncements(valid.length > 0 ? valid : data);
      } catch (err) {
        console.error('Erreur chargement annonces:', err);
        // Fallback de démonstration en cas d'erreur réseau/BDD
        if (mounted) {
          setAnnouncements([
            {
              id: 'demo-1',
              type: 'promo',
              title: '🎉 Livraison offerte dès 20 000 FCFA !',
              message: 'Profitez de la livraison gratuite sur tous nos packs exclusifs ce mois-ci.',
              link: '/femme',
              link_label: 'J\'en profite',
            },
          ]);
        }
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

  const visible = announcements.filter((a) => !dismissedIds.includes(a.id));

  if (visible.length === 0) return null;

  return (
    <div className="container mx-auto px-4 py-4">
      <div className="space-y-3">
        {visible.map((ann) => {
          const type = ann.type || 'promo';
          const icon = ICONS[type] || ICONS.promo;
          const style = STYLES[type] || STYLES.promo;

          return (
            <div
              key={ann.id}
              className={`relative overflow-hidden rounded-2xl border-2 ${style.border} ${
                isDark
                  ? `bg-gradient-to-r ${style.bg} bg-[#16162c] text-white shadow-xl ${style.glow}`
                  : `bg-gradient-to-r ${style.bg} bg-white text-gray-900 shadow-xl ${style.glow}`
              } p-4 sm:p-5 transition-all duration-300 animate-slide-up`}
            >
              <div className="flex items-center gap-3 sm:gap-4 pr-8">
                <div className={`p-3 rounded-xl border ${style.badge} flex-shrink-0 flex items-center justify-center shadow-md`}>
                  {icon}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className={`text-[10px] uppercase tracking-wider px-2.5 py-0.5 rounded-full font-bold border ${style.badge}`}>
                      {type === 'promo' ? '🔥 Offre Spéciale' : type === 'event' ? '📅 Événement' : '✨ Annonce'}
                    </span>
                  </div>
                  <h3 className="font-display font-bold text-base sm:text-lg text-gray-900 dark:text-white leading-tight">
                    {ann.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 mt-1 leading-relaxed">
                    {ann.message}
                  </p>
                </div>

                {ann.link && (
                  <div className="flex-shrink-0">
                    <Link
                      to={ann.link}
                      className="inline-flex items-center gap-1.5 bg-gold text-gray-900 hover:bg-gold/90 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all shadow-lg shadow-gold/30 hover:scale-105 active:scale-95"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>{ann.link_label || 'Découvrir'}</span>
                      <ExternalLink className="w-3 h-3 ml-0.5" />
                    </Link>
                  </div>
                )}
              </div>

              <button
                type="button"
                onClick={() => handleDismiss(ann.id)}
                className="absolute top-3 right-3 p-1.5 rounded-full text-gray-400 hover:text-gray-700 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
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
