// 📄 src/components/Home/ShopEntrance.jsx - Version améliorée
import { Link } from 'react-router-dom';
import { Sparkles, Crown, Zap, Gift } from 'lucide-react';

const ShopEntrance = () => {
  const shops = [
    {
      id: 'femme',
      title: 'Boutique Femme',
      description: 'Glow, confiance et élégance',
      color: 'from-feminine-primary to-feminine-secondary',
      bg: 'bg-feminine-light',
      icon: <Sparkles className="w-8 h-8" />,
      link: '/femme',
      emojis: '💄✨🌸💎',
      image: '/car1.png'
    },
    {
      id: 'homme',
      title: 'Boutique Homme',
      description: 'Style, assurance et charisme',
      color: 'from-masculine-primary to-masculine-secondary',
      bg: 'bg-masculine-light',
      icon: <Crown className="w-8 h-8" />,
      link: '/homme',
      emojis: '👔💪🔥⌚',
      image: '/car4.jpg'
    },
  ];

  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-gold/10 text-gold px-4 py-2 rounded-full text-sm font-semibold mb-4">
            <Gift className="w-4 h-4" />
            Choisis ton univers
          </div>
          <h2 className="text-3xl md:text-4xl font-display font-bold">
            Deux ambiances, une <span className="text-gold">promesse</span>
          </h2>
          <p className="text-gray-600 mt-3 max-w-2xl mx-auto">
            Que tu sois plutôt glamour ou élégant, trouve le pack qui te correspond
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {shops.map((shop) => (
            <Link
              key={shop.id}
              to={shop.link}
              className="group relative overflow-hidden rounded-2xl bg-white shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
            >
              {/* Image de fond */}
              <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                style={{ backgroundImage: `url(${shop.image})` }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
              
              {/* Contenu */}
              <div className="relative p-6 md:p-8 text-center min-h-[280px] flex flex-col items-center justify-end">
                <div className="bg-white/20 backdrop-blur-sm p-3 rounded-full mb-4 group-hover:scale-110 transition-transform">
                  <div className="text-white">
                    {shop.icon}
                  </div>
                </div>

                <h3 className="text-2xl font-display font-bold text-white mb-1">
                  {shop.title}
                </h3>
                <p className="text-white/80 text-sm mb-3">{shop.description}</p>
                
                <div className="text-2xl mb-4">{shop.emojis}</div>

                <div className="inline-flex items-center gap-2 text-sm font-semibold text-white px-6 py-2.5 rounded-full bg-gradient-to-r from-gold/80 to-gold/60 hover:from-gold hover:to-gold backdrop-blur-sm transition-all">
                  Explorer
                  <Zap className="w-4 h-4" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ShopEntrance;