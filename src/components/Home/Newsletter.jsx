// 📄 src/components/Home/Newsletter.jsx - Version améliorée
import { useState } from 'react';
import { Mail, Send, Heart, Gift } from 'lucide-react';

const Newsletter = () => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email) {
      setIsSubmitted(true);
      setTimeout(() => {
        setIsSubmitted(false);
        setEmail('');
      }, 3000);
    }
  };

  return (
    <section className="py-16 md:py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-feminine-light via-white to-masculine-light" />
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNEOERBRDYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyek0zNiAyNHYySDI0di0yaDEyeiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          {/* Carte de remerciement */}
          <div className="mb-8 p-6 md:p-8 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gold/20">
            <div className="flex items-center justify-center gap-2 mb-3">
              <Heart className="w-6 h-6 text-feminine-primary fill-feminine-primary" />
              <span className="text-2xl">💖</span>
            </div>
            <h3 className="text-xl md:text-2xl font-display font-bold text-gray-800">
              Merci infiniment pour votre soutien
            </h3>
            <p className="text-gray-600 mt-2 text-sm md:text-base">
              et pour faire partie de l'aventure <span className="font-bold text-gold">Win'S Packs</span>
            </p>
            <div className="mt-4 flex items-center justify-center gap-2 text-sm text-gray-500">
              <span className="w-8 h-px bg-gray-300" />
              <span>Votre satisfaction est notre priorité</span>
              <span className="w-8 h-px bg-gray-300" />
            </div>
          </div>

          <div className="inline-flex items-center gap-2 bg-gold/10 text-gold px-4 py-2 rounded-full text-sm font-semibold mb-4">
            <Mail className="w-4 h-4" />
            Newsletter
          </div>
          
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
            Reçois nos <span className="text-gold">offres exclusives</span>
          </h2>
          
          <p className="text-gray-600 mb-8 text-sm md:text-base">
            Inscris-toi pour recevoir nos nouvelles collections, promotions et conseils en avant-première.
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Ton adresse email"
              required
              className="flex-1 px-4 py-3 rounded-full border border-gray-200 focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none transition-all bg-white/80 backdrop-blur-sm text-sm"
            />
            <button
              type="submit"
              className={`bg-gradient-to-r from-feminine-primary to-gold text-white px-6 py-3 rounded-full font-semibold hover:scale-105 transition-transform shadow-lg shadow-feminine-primary/30 flex items-center justify-center gap-2 text-sm ${
                isSubmitted ? 'opacity-70 pointer-events-none' : ''
              }`}
            >
              {isSubmitted ? (
                <>
                  <span className="animate-bounce">✅</span>
                  Merci !
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  S'inscrire
                </>
              )}
            </button>
          </form>

          <p className="text-xs text-gray-400 mt-4 flex items-center justify-center gap-1">
            <Gift className="w-3 h-3" />
            Pas de spam, désinscription à tout moment
          </p>

          {/* Carte de remerciement bonus */}
          <div className="mt-8 p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-gray-200/50 max-w-sm mx-auto">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center text-2xl">
                🙏
              </div>
              <div className="text-left">
                <p className="text-sm font-semibold text-gray-800">Win'S Packs</p>
                <p className="text-xs text-gray-500">Merci pour votre confiance</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;