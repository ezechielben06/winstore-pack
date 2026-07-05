import { ArrowRight, Sparkles, Crown, Gift, Palette } from 'lucide-react';
import { Link } from 'react-router-dom';

const Categories = () => {
  const categories = [
    {
      name: 'Campus Girl Pack',
      emoji: '🎓',
      description: 'Organisation & style pour réussir',
      color: 'from-blue-400 to-blue-600',
      bg: 'bg-blue-50',
      items: '3 packs disponibles',
      link: '/femme'
    },
    {
      name: 'Glow Queen Pack',
      emoji: '✨',
      description: 'Beauté & confiance rayonnante',
      color: 'from-pink-400 to-rose-500',
      bg: 'bg-pink-50',
      items: '3 packs disponibles',
      link: '/femme'
    },
    {
      name: 'Confidence Pack',
      emoji: '💪',
      description: 'Affirmation & mindset gagnant',
      color: 'from-purple-400 to-indigo-500',
      bg: 'bg-purple-50',
      items: '3 packs disponibles',
      link: '/femme'
    },
    {
      name: 'Create Your Own Pack',
      emoji: '🎨',
      description: 'Compose ton pack sur mesure',
      color: 'from-amber-400 to-orange-500',
      bg: 'bg-amber-50',
      items: 'Personnalise ton pack',
      link: '/femme'
    },
    {
      name: 'Pack Sportif Homme',
      emoji: '🏃',
      description: 'Performance & style',
      color: 'from-cyan-400 to-blue-500',
      bg: 'bg-cyan-50',
      items: '2 packs disponibles',
      link: '/homme'
    },
    {
      name: 'Pack Premium Homme',
      emoji: '👑',
      description: 'L\'excellence au quotidien',
      color: 'from-indigo-400 to-purple-500',
      bg: 'bg-indigo-50',
      items: 'Pack exclusif',
      link: '/homme'
    },
  ];

  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-feminine-primary/10 text-feminine-primary px-4 py-2 rounded-full text-sm font-semibold mb-4">
            <Gift className="w-4 h-4" />
            Nos packs signature
          </div>
          <h2 className="text-4xl md:text-5xl font-display font-bold">
            Des packs pour <span className="text-gold">révéler</span> ta personnalité
          </h2>
          <p className="text-gray-600 mt-3 text-lg max-w-2xl mx-auto">
            Chaque pack a été pensé avec soin pour t'accompagner dans ton quotidien
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {categories.map((cat) => (
            <Link
              key={cat.name}
              to={cat.link}
              className="group p-6 rounded-2xl bg-white border border-gray-100 hover:border-gold/30 hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
            >
              <div className="flex items-start gap-4">
                <div className={`inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br ${cat.color} text-3xl group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                  {cat.emoji}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800 group-hover:text-gold transition-colors">{cat.name}</h3>
                  <p className="text-sm text-gray-500 mt-1">{cat.description}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-xs font-medium text-gray-400">{cat.items}</span>
                    <ArrowRight className="w-3 h-3 text-gold opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Categories;