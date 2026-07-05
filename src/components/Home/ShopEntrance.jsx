import { Link } from 'react-router-dom';
import { Sparkles, Crown, Zap, ArrowRight, Heart, Star } from 'lucide-react';

const ShopEntrance = () => {
  const shops = [
    {
      id: 'femme',
      title: 'Boutique Femme',
      subtitle: 'Glow, confiance et élégance',
      description: 'Des packs et produits pensés pour révéler ta beauté naturelle et ta confiance. Routine soin, maquillage, accessoires… tout pour briller.',
      color: 'from-feminine-primary to-feminine-secondary',
      bg: 'bg-feminine-light',
      icon: <Sparkles className="w-10 h-10" />,
      link: '/femme',
      emojis: '💄✨🌸💎',
      stats: '120+ produits',
      gradient: 'from-pink-500 to-rose-500'
    },
    {
      id: 'homme',
      title: 'Boutique Homme',
      subtitle: 'Style, assurance et charisme',
      description: 'Des packs sélectionnés pour l\'homme moderne. Soin, accessoires, bien-être… tout pour affirmer ton style et ta personnalité.',
      color: 'from-masculine-primary to-masculine-secondary',
      bg: 'bg-masculine-light',
      icon: <Crown className="w-10 h-10" />,
      link: '/homme',
      emojis: '👔💪🔥⌚',
      stats: '80+ produits',
      gradient: 'from-blue-600 to-indigo-600'
    },
  ];

  return (
    <section className="py-24 bg-gradient-to-b from-white via-gray-50 to-white">
      <div className="container mx-auto px-4">
        {/* En-tête */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-gold/10 text-gold px-4 py-2 rounded-full text-sm font-semibold mb-4">
            <Star className="w-4 h-4 fill-gold" />
            Choisis ton univers
          </div>
          <h2 className="text-4xl md:text-5xl font-display font-bold">
            Deux ambiances, une <span className="text-gold">promesse</span>
          </h2>
          <p className="text-gray-600 mt-3 text-lg max-w-2xl mx-auto">
            Que tu sois plutôt glamour ou élégant, trouve le pack qui te correspond
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {shops.map((shop) => (
            <Link
              key={shop.id}
              to={shop.link}
              className="group relative overflow-hidden rounded-3xl bg-white shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
            >
              {/* Background gradient */}
              <div className={`absolute inset-0 bg-gradient-to-br ${shop.gradient} opacity-5 group-hover:opacity-10 transition-opacity`} />
              
              {/* Content */}
              <div className="relative p-8 md:p-12">
                {/* Icône */}
                <div className={`inline-flex items-center justify-center w-24 h-24 rounded-2xl bg-gradient-to-br ${shop.gradient} text-white shadow-lg mb-6 group-hover:scale-110 transition-transform duration-500`}>
                  {shop.icon}
                </div>

                <h3 className="text-3xl font-display font-bold mb-1">{shop.title}</h3>
                <p className="text-lg font-medium text-gray-600 mb-3">{shop.subtitle}</p>
                
                <p className="text-gray-500 leading-relaxed mb-6">{shop.description}</p>
                
                <div className="flex items-center gap-4 mb-6">
                  <div className="text-3xl">{shop.emojis}</div>
                  <span className="text-sm text-gray-400">|</span>
                  <span className="text-sm font-medium text-gray-500">{shop.stats}</span>
                </div>

                <div className="inline-flex items-center gap-2 text-sm font-semibold text-white px-8 py-3.5 rounded-full bg-gradient-to-r from-gray-800 to-gray-900 group-hover:from-gray-700 group-hover:to-gray-800 transition-all duration-300 shadow-lg">
                  Explorer la boutique
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>

                {/* Badge décoratif */}
                <div className="absolute -top-6 -right-6 w-32 h-32 rounded-full bg-gradient-to-br from-gold/10 to-transparent blur-2xl" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ShopEntrance;