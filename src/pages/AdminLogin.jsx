// 📄 src/pages/AdminLogin.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Shield, Eye, EyeOff, Mail, Settings } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const AdminLogin = () => {
  const { login } = useAuth();
  const { isDark } = useTheme();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const result = await login(email.trim(), password);

    if (result.success) {
      navigate('/admin');
    } else {
      setError(
        result.error === 'Invalid login credentials'
          ? 'Email ou mot de passe incorrect'
          : result.error
      );
      setPassword('');
      setIsLoading(false);
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 ${
      isDark ? 'bg-[#0d0d1a]' : 'bg-gray-50'
    }`}>
      <div className={`w-full max-w-md rounded-2xl ${
        isDark ? 'bg-[#1a1a2e]' : 'bg-white'
      } shadow-2xl border ${isDark ? 'border-[#2d3748]' : 'border-gray-200'} p-8`}>

        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gold/10 mb-4">
            <Shield className="w-8 h-8 text-gold" />
          </div>
          <h1 className="text-2xl font-display font-bold text-gray-800 dark:text-white">
            Administration
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Connectez-vous avec votre compte admin
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@wins-pack.com"
                autoComplete="username"
                className={`w-full pl-10 pr-4 py-3 rounded-xl border text-sm ${
                  isDark
                    ? 'bg-[#2a2a4a] border-[#2d3748] text-white placeholder-gray-400'
                    : 'bg-gray-50 border-gray-200 text-gray-800'
                } focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none transition-all`}
                required
              />
            </div>
          </div>

          {/* Mot de passe */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Mot de passe
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
                className={`w-full pl-10 pr-12 py-3 rounded-xl border text-sm ${
                  isDark
                    ? 'bg-[#2a2a4a] border-[#2d3748] text-white placeholder-gray-400'
                    : 'bg-gray-50 border-gray-200 text-gray-800'
                } focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none transition-all ${
                  error ? 'border-red-500 ring-2 ring-red-500/20' : ''
                }`}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {error && (
              <p className="mt-2 text-sm text-red-500 flex items-center gap-1">
                ⚠️ {error}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full bg-gold text-gray-900 py-3 rounded-xl font-semibold hover:bg-gold/80 transition-all flex items-center justify-center gap-2 text-sm ${
              isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:scale-[1.02] active:scale-95'
            }`}
          >
            {isLoading ? (
              <>
                <span className="w-4 h-4 border-2 border-gray-900/30 border-t-gray-900 rounded-full animate-spin" />
                Connexion...
              </>
            ) : (
              <>
                <Settings className="w-4 h-4" />
                Se connecter
              </>
            )}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-gray-400 dark:text-gray-500">
          🔒 Accès réservé aux administrateurs
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;