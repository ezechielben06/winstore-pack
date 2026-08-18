// 📄 src/components/Home/Testimonials.jsx - Version améliorée
import { Star, Quote, Instagram, MessageCircle, Music, Sparkles } from 'lucide-react';
import { SOCIAL_LINKS } from '../../config/constants';

const testimonials = [
  {
    id: 1,
    name: 'Sarah K.',
    role: 'Étudiante',
    comment: 'Le Campus Girl Pack m\'a changé la vie ! Organisation, style et confiance, tout est réuni. Je le recommande à toutes mes amies.',
    rating: 5,
    emoji: '🎓',
    social: 'instagram'
  },
  {
    id: 2,
    name: 'Laura M.',
    role: 'Influenceuse',
    comment: 'Glow Queen Pack est mon coup de cœur ! Ma peau n\'a jamais été aussi lumineuse. Les produits sont de qualité et le packaging est magnifique.',
    rating: 5,
    emoji: '✨',
    social: 'instagram'
  },
  {
    id: 3,
    name: 'Kevin D.',
    role: 'Sportif',
    comment: 'Le Pack Sportif Homme est parfait pour mon quotidien. Fraîcheur, soin et style, tout ce qu\'il faut pour un homme actif.',
    rating: 5,
    emoji: '💪',
    social: 'tiktok'
  },
  {
    id: 4,
    name: 'Marie C.',
    role: 'Cadre',
    comment: 'J\'ai créé mon propre pack et je suis ravie ! La personnalisation est top, et la livraison rapide. Merci Win\'S Packs !',
    rating: 5,
    emoji: '👑',
    social: 'whatsapp'
  },
  {
    id: 5,
    name: 'Amélie D.',
    role: 'Beauté & Soin',
    comment: 'Les produits Win\'S Packs sont d\'une qualité exceptionnelle. Je recommande vivement !',
    rating: 5,
    emoji: '🌸',
    social: 'instagram'
  },
  {
    id: 6,
    name: 'Thomas L.',
    role: 'Sportif',
    comment: 'Le Pack Premium Homme m\'a permis de découvrir des produits que je n\'aurais jamais testés. Une vraie révélation !',
    rating: 5,
    emoji: '🔥',
    social: 'tiktok'
  },
];

const socialIcons = {
  instagram: <Instagram className="w-3.5 h-3.5" />,
  tiktok: <Music className="w-3.5 h-3.5" />,
  whatsapp: <MessageCircle className="w-3.5 h-3.5" />
};

const socialLabels = {
  instagram: 'Instagram',
  tiktok: 'TikTok',
  whatsapp: 'WhatsApp'
};

const socialColors = {
  instagram: 'bg-gradient-to-r from-pink-500 to-purple-500',
  tiktok: 'bg-gradient-to-r from-black to-gray-800',
  whatsapp: 'bg-gradient-to-r from-green-500 to-green-600'
};

const socialBg = {
  instagram: 'bg-pink-50 text-pink-500',
  tiktok: 'bg-gray-100 text-gray-800',
  whatsapp: 'bg-green-50 text-green-500'
};

const Testimonials = () => {
  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-gray-50 to-white" id="avis">
      <div className="container mx-auto px-4">
        {/* En-tête */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-gold/10 text-gold px-4 py-2 rounded-full text-sm font-semibold mb-4">
            <Quote className="w-4 h-4" />
            Ce que disent nos clients
          </div>
          <h2 className="text-3xl md:text-4xl font-display font-bold">
            Ils ont <span className="text-gold">adoré</span> leurs packs
          </h2>
          <p className="text-gray-600 mt-3 text-sm">
            Rejoins notre communauté sur{' '}
            <span className="text-pink-600 font-semibold">Instagram</span>,{' '}
            <span className="text-gray-900 font-semibold">TikTok</span> et{' '}
            <span className="text-green-600 font-semibold">WhatsApp</span>
          </p>
        </div>

        {/* Grille de témoignages */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-6xl mx-auto">
          {testimonials.map((testimonial) => (
            <div 
              key={testimonial.id}
              className="bg-white p-5 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-gray-100/50 group"
            >
              {/* Étoiles */}
              <div className="flex items-center gap-0.5 mb-2">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-gold text-gold" />
                ))}
                <span className="ml-1 text-xs text-gray-400">5.0</span>
              </div>
              
              {/* Commentaire */}
              <p className="text-gray-600 text-sm leading-relaxed mb-3 line-clamp-3">"{testimonial.comment}"</p>
              
              {/* Footer du témoignage */}
              <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-feminine-primary to-gold flex items-center justify-center text-white text-lg flex-shrink-0">
                    {testimonial.emoji}
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-gray-800">{testimonial.name}</p>
                    <p className="text-[10px] text-gray-400">{testimonial.role}</p>
                  </div>
                </div>
                <div className={`flex items-center gap-1 text-[10px] font-medium px-2 py-1 rounded-full ${socialBg[testimonial.social]}`}>
                  {socialIcons[testimonial.social]}
                  {socialLabels[testimonial.social]}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ✅ Liens réseaux sociaux */}
        <div className="flex flex-wrap items-center justify-center gap-3 mt-10">
          <a
            href={SOCIAL_LINKS.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white px-5 py-2.5 rounded-full font-semibold hover:scale-105 transition-all shadow-lg shadow-pink-500/30 text-sm"
          >
            <Instagram className="w-4 h-4" />
            Instagram
          </a>
          <a
            href={SOCIAL_LINKS.tiktok}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-black to-gray-800 text-white px-5 py-2.5 rounded-full font-semibold hover:scale-105 transition-all shadow-lg shadow-black/30 text-sm"
          >
            <Music className="w-4 h-4" />
            TikTok
          </a>
          <a
            href="https://wa.me/2290153096537"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-green-500 to-green-600 text-white px-5 py-2.5 rounded-full font-semibold hover:scale-105 transition-all shadow-lg shadow-green-500/30 text-sm"
          >
            <MessageCircle className="w-4 h-4" />
            WhatsApp
          </a>
        </div>

        {/* ✅ Badge de confiance */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-gray-500">
          <div className="flex items-center gap-1.5">
            <span className="text-lg">⭐</span>
            4.9/5 sur 120+ avis
          </div>
          <div className="w-px h-4 bg-gray-300" />
          <div className="flex items-center gap-1.5">
            <span className="text-lg">👥</span>
            +1000 clients satisfaits
          </div>
          <div className="w-px h-4 bg-gray-300" />
          <div className="flex items-center gap-1.5">
            <span className="text-lg">🚚</span>
            Livraison disponible
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;