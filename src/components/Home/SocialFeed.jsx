// 📄 src/components/Home/SocialFeed.jsx - Version améliorée
import { Instagram, MessageCircle, Music, Send, Heart, Share2 } from 'lucide-react';
import { Link } from 'react-router-dom';

// ✅ Liens réseaux sociaux
const SOCIAL_LINKS = {
  instagram: 'https://instagram.com/wins_packs',
  tiktok: 'https://tiktok.com/@wins_packs',
  whatsapp: 'https://wa.me/2290153096537',
};

const SocialFeed = () => {
  // Posts simulés avec les images du client
  const posts = [
    {
      id: 1,
      platform: 'instagram',
      image: 'car1.jpg',
      caption: '✨ Merci infiniment pour votre soutien ! Rejoignez notre groupe WhatsApp pour suivre l\'aventure Win\'S Packs.',
      likes: 234,
      comments: 45,
      time: '2h',
      user: 'wins_packs'
    },
    {
      id: 2,
      platform: 'instagram',
      image: 'car3.jpeg',
      caption: '💖 Votre satisfaction est notre priorité. Merci pour votre confiance ! #WinSPacks',
      likes: 189,
      comments: 32,
      time: '5h',
      user: 'wins_packs'
    },
    {
      id: 3,
      platform: 'tiktok',
      image: 'car1.webp',
      caption: '🎵 Découvrez nos packs exclusifs ! Tout en un pour votre quotidien. #WinSPacks #Packs',
      likes: 156,
      comments: 28,
      time: '8h',
      user: 'wins_packs'
    },
    {
      id: 4,
      platform: 'whatsapp',
      image: 'car2.jpeg',
      caption: '📱 Rejoignez notre groupe WhatsApp pour ne rien rater des nouveautés !',
      likes: 201,
      comments: 38,
      time: '12h',
      user: 'Win\'S Packs'
    },
  ];

  const getPlatformIcon = (platform) => {
    const icons = {
      instagram: <Instagram className="w-4 h-4" />,
      tiktok: <Music className="w-4 h-4" />,
      whatsapp: <MessageCircle className="w-4 h-4" />,
    };
    return icons[platform] || <Share2 className="w-4 h-4" />;
  };

  const getPlatformColor = (platform) => {
    const colors = {
      instagram: 'from-pink-500 to-purple-500',
      tiktok: 'from-black to-gray-800',
      whatsapp: 'from-green-500 to-green-600',
    };
    return colors[platform] || 'from-gray-500 to-gray-600';
  };

  const getPlatformBg = (platform) => {
    const colors = {
      instagram: 'bg-pink-500/10 text-pink-500',
      tiktok: 'bg-gray-900/10 text-gray-900',
      whatsapp: 'bg-green-500/10 text-green-500',
    };
    return colors[platform] || 'bg-gray-100 text-gray-500';
  };

  return (
    <section className="py-16 md:py-24 bg-white" id="social">
      <div className="container mx-auto px-4">
        {/* En-tête */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-pink-500/10 to-purple-500/10 text-feminine-primary px-4 py-2 rounded-full text-sm font-semibold mb-4">
            <Instagram className="w-4 h-4" />
            <Music className="w-4 h-4" />
            <MessageCircle className="w-4 h-4" />
            Nos réseaux sociaux
          </div>
          <h2 className="text-3xl md:text-4xl font-display font-bold">
            Suis-nous sur les <span className="text-gold">réseaux</span>
          </h2>
          <p className="text-gray-600 mt-3 max-w-2xl mx-auto">
            Rejoins notre communauté et découvre nos inspirations quotidiennes
          </p>
        </div>

        {/* Grille de posts */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-6xl mx-auto">
          {posts.map((post) => (
            <div
              key={post.id}
              className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-gray-100 group"
            >
              {/* Image */}
              <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center relative overflow-hidden">
                <img 
                  src={post.image} 
                  alt={post.caption}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.parentElement.innerHTML = `
                      <div class="text-6xl opacity-30">
                        ${post.platform === 'instagram' ? '📸' : 
                          post.platform === 'tiktok' ? '🎵' : '💬'}
                      </div>
                    `;
                  }}
                />
                <div className={`absolute top-3 left-3 px-2 py-1 rounded-full text-[10px] font-semibold flex items-center gap-1 bg-white/90 backdrop-blur-sm ${getPlatformBg(post.platform)}`}>
                  {getPlatformIcon(post.platform)}
                  {post.platform}
                </div>
              </div>

              {/* Contenu */}
              <div className="p-3">
                <div className="flex items-center gap-2 mb-1.5">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-[10px] bg-gradient-to-r ${getPlatformColor(post.platform)}`}>
                    {post.user[0].toUpperCase()}
                  </div>
                  <span className="text-xs font-medium text-gray-700">@{post.user}</span>
                  <span className="text-[10px] text-gray-400 ml-auto">{post.time}</span>
                </div>

                <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">
                  {post.caption}
                </p>

                {/* Interactions */}
                <div className="flex items-center gap-3 mt-2 pt-2 border-t border-gray-100">
                  <button className="flex items-center gap-1 text-gray-500 hover:text-red-500 transition-colors text-[10px]">
                    <Heart className="w-3.5 h-3.5" />
                    <span>{post.likes}</span>
                  </button>
                  <button className="flex items-center gap-1 text-gray-500 hover:text-blue-500 transition-colors text-[10px]">
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>{post.comments}</span>
                  </button>
                  <button className="flex items-center gap-1 text-gray-500 hover:text-green-500 transition-colors text-[10px] ml-auto">
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ✅ Liens réseaux sociaux */}
        <div className="mt-10 text-center">
          <div className="flex flex-wrap items-center justify-center gap-3">
            <a
              href={SOCIAL_LINKS.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white px-6 py-3 rounded-full font-semibold hover:scale-105 transition-all shadow-lg shadow-pink-500/30 text-sm"
            >
              <Instagram className="w-5 h-5" />
              Instagram
            </a>
            <a
              href={SOCIAL_LINKS.tiktok}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-black to-gray-800 text-white px-6 py-3 rounded-full font-semibold hover:scale-105 transition-all shadow-lg shadow-black/30 text-sm"
            >
              <Music className="w-5 h-5" />
              TikTok
            </a>
            <a
              href={SOCIAL_LINKS.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-full font-semibold hover:scale-105 transition-all shadow-lg shadow-green-500/30 text-sm"
            >
              <MessageCircle className="w-5 h-5" />
              WhatsApp
            </a>
          </div>

          {/* QR Code / Groupe WhatsApp */}
          <div className="mt-8 p-6 bg-gradient-to-r from-green-50 to-green-100/30 dark:from-green-900/10 dark:to-transparent rounded-2xl border border-green-200 dark:border-green-800/20 max-w-lg mx-auto">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-xl bg-white shadow-md flex items-center justify-center text-3xl">
                📱
              </div>
              <div className="text-left">
                <p className="font-semibold text-gray-800 dark:text-white text-sm">
                  Rejoins notre groupe WhatsApp
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Scanne le QR code ou clique sur le lien
                </p>
                <a
                  href={SOCIAL_LINKS.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-1 text-xs text-green-600 dark:text-green-400 font-medium hover:underline"
                >
                  👉 Rejoindre le groupe
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SocialFeed;