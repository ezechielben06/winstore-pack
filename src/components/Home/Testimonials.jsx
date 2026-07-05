import { Star, Quote, Instagram, Facebook, MessageCircle } from 'lucide-react';

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
    social: 'facebook'
  },
  {
    id: 4,
    name: 'Marie C.',
    role: 'Cadre',
    comment: 'J\'ai créé mon propre pack et je suis ravie ! La personnalisation est top, et la livraison rapide. Merci Win\'Store !',
    rating: 5,
    emoji: '👑',
    social: 'instagram'
  },
];

const socialIcons = {
  instagram: <Instagram className="w-4 h-4" />,
  facebook: <Facebook className="w-4 h-4" />,
  whatsapp: <MessageCircle className="w-4 h-4" />
};

const Testimonials = () => {
  return (
    <section className="py-24 bg-gradient-to-b from-gray-50 to-white" id="avis">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-gold/10 text-gold px-4 py-2 rounded-full text-sm font-semibold mb-4">
            <Quote className="w-4 h-4" />
            Ce que disent nos clients
          </div>
          <h2 className="text-4xl md:text-5xl font-display font-bold">
            Ils ont <span className="text-gold">adoré</span> leurs packs
          </h2>
          <p className="text-gray-600 mt-3">
            Rejoins notre communauté sur <span className="text-pink-600 font-semibold">Instagram</span> et <span className="text-blue-600 font-semibold">Facebook</span>
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {testimonials.map((testimonial) => (
            <div 
              key={testimonial.id}
              className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-gray-100/50"
            >
              <div className="flex items-center gap-1 mb-3">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-gold text-gold" />
                ))}
              </div>
              
              <p className="text-gray-600 text-sm leading-relaxed mb-4">"{testimonial.comment}"</p>
              
              <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-feminine-primary to-gold flex items-center justify-center text-white text-xl">
                    {testimonial.emoji}
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-gray-800">{testimonial.name}</p>
                    <p className="text-xs text-gray-400">{testimonial.role}</p>
                  </div>
                </div>
                <div className="text-gray-400">
                  {testimonial.social === 'instagram' ? '📸' : '👍'}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Social buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 mt-12">
          <a
            href="https://instagram.com/winstorepacks"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white px-8 py-3.5 rounded-full font-semibold hover:scale-105 transition-all shadow-lg shadow-pink-500/30"
          >
            <Instagram className="w-5 h-5" />
            Suis-nous sur Instagram
          </a>
          <a
            href="https://facebook.com/winstorepacks"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-3.5 rounded-full font-semibold hover:scale-105 transition-all shadow-lg shadow-blue-600/30"
          >
            <Facebook className="w-5 h-5" />
            Suis-nous sur Facebook
          </a>
          <a
            href="https://wa.me/2290153096537"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 bg-gradient-to-r from-green-500 to-green-600 text-white px-8 py-3.5 rounded-full font-semibold hover:scale-105 transition-all shadow-lg shadow-green-500/30"
          >
            <MessageCircle className="w-5 h-5" />
            Contacte-nous sur WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;