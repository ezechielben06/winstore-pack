import { Instagram, Facebook, Heart, MessageCircle, Send, Bookmark } from 'lucide-react';

const SocialFeed = () => {
  // Publications simulées (à remplacer par l'API Instagram/Facebook)
  const posts = [
    {
      id: 1,
      platform: 'instagram',
      image: '📸',
      caption: '✨ Nouveau pack Confidence disponible ! Révèle ta meilleure version 💪 #WinStorePacks',
      likes: 234,
      comments: 45,
      time: '2h',
      user: 'winstorepacks'
    },
    {
      id: 2,
      platform: 'instagram',
      image: '💄',
      caption: '🌸 Le Glow Queen Pack fait des merveilles ! Routine soin complète pour une peau lumineuse ✨',
      likes: 189,
      comments: 32,
      time: '5h',
      user: 'winstorepacks'
    },
    {
      id: 3,
      platform: 'facebook',
      image: '🎓',
      caption: '🎓 Campus Girl Pack - La rentrée stylée ! Organisation, confiance et élégance pour réussir ton année.',
      likes: 156,
      comments: 28,
      time: '8h',
      user: 'WinStore Packs'
    },
    {
      id: 4,
      platform: 'instagram',
      image: '👔',
      caption: '🔥 Nouveauté ! Pack Sportif Homme - Pour l\'homme actif qui veut allier style et performance 💪',
      likes: 201,
      comments: 38,
      time: '12h',
      user: 'winstorepacks'
    },
  ];

  return (
    <section className="py-24 bg-white" id="social">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-pink-500/10 to-purple-500/10 text-feminine-primary px-4 py-2 rounded-full text-sm font-semibold mb-4">
            <Instagram className="w-4 h-4" />
            <Facebook className="w-4 h-4" />
            Nos dernières publications
          </div>
          <h2 className="text-4xl md:text-5xl font-display font-bold">
            Suis-nous sur les <span className="text-gold">réseaux</span>
          </h2>
          <p className="text-gray-600 mt-3">
            Rejoins notre communauté et découvre nos inspirations quotidiennes
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {posts.map((post) => (
            <div
              key={post.id}
              className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-gray-100"
            >
              {/* Image */}
              <div className="aspect-square bg-gradient-to-br from-feminine-light to-pink-100 flex items-center justify-center text-6xl relative">
                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                  {post.platform === 'instagram' ? '📸' : '👍'} {post.platform}
                </div>
                <span className="opacity-50">{post.image}</span>
              </div>

              {/* Content */}
              <div className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-feminine-primary to-gold flex items-center justify-center text-white text-xs">
                    {post.user[0]}
                  </div>
                  <span className="text-sm font-medium text-gray-700">@{post.user}</span>
                  <span className="text-xs text-gray-400 ml-auto">{post.time}</span>
                </div>

                <p className="text-sm text-gray-600 line-clamp-2">{post.caption}</p>

                {/* Interactions */}
                <div className="flex items-center gap-4 mt-3 pt-3 border-t border-gray-100">
                  <button className="flex items-center gap-1 text-gray-500 hover:text-red-500 transition-colors text-sm">
                    <Heart className="w-4 h-4" />
                    <span>{post.likes}</span>
                  </button>
                  <button className="flex items-center gap-1 text-gray-500 hover:text-blue-500 transition-colors text-sm">
                    <MessageCircle className="w-4 h-4" />
                    <span>{post.comments}</span>
                  </button>
                  <button className="flex items-center gap-1 text-gray-500 hover:text-green-500 transition-colors text-sm">
                    <Send className="w-4 h-4" />
                  </button>
                  <button className="flex items-center gap-1 text-gray-500 hover:text-gold transition-colors text-sm ml-auto">
                    <Bookmark className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Voir plus */}
        <div className="text-center mt-10">
          <a
            href="https://instagram.com/winstorepacks"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-gray-900 text-white px-8 py-3 rounded-full font-semibold hover:bg-gray-800 transition-colors hover:scale-105"
          >
            <Instagram className="w-5 h-5" />
            Voir plus sur Instagram
          </a>
        </div>
      </div>
    </section>
  );
};

export default SocialFeed;