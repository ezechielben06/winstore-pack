import { Mail, Send } from 'lucide-react';
import { useState } from 'react';

const Newsletter = () => {
  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Logique d'inscription
    alert('Merci pour votre inscription ! 🎉');
    setEmail('');
  };

  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-feminine-light via-white to-masculine-light" />
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNEOERBRDYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyek0zNiAyNHYySDI0di0yaDEyeiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-gold/10 text-gold px-4 py-2 rounded-full text-sm font-semibold mb-4">
            <Mail className="w-4 h-4" />
            Newsletter
          </div>
          
          <h2 className="text-4xl font-display font-bold mb-4">
            Reçois nos <span className="text-gold">offres exclusives</span>
          </h2>
          
          <p className="text-gray-600 mb-8">
            Inscris-toi pour recevoir nos nouvelles collections, promotions et conseils en avant-première.
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Ton adresse email"
              required
              className="flex-1 px-6 py-4 rounded-full border border-gray-200 focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none transition-all bg-white/80 backdrop-blur-sm"
            />
            <button
              type="submit"
              className="bg-gradient-to-r from-feminine-primary to-gold text-white px-8 py-4 rounded-full font-semibold hover:scale-105 transition-transform shadow-lg shadow-feminine-primary/30 flex items-center justify-center gap-2"
            >
              <span>S'inscrire</span>
              <Send className="w-4 h-4" />
            </button>
          </form>

          <p className="text-xs text-gray-400 mt-4">
            ✨ Pas de spam, désinscription à tout moment
          </p>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;