import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Loader as Loader2 } from 'lucide-react';
import { useAuth } from '../../lib/AuthContext';

export default function LoginPage() {
  const navigate = useNavigate();
  const { signIn, session, loading: authLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!authLoading && session) {
      navigate('/admin/dashboard', { replace: true });
    }
  }, [session, authLoading, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email || !password) {
      setError('Veuillez remplir tous les champs.');
      return;
    }
    setLoading(true);
    const err = await signIn(email, password);
    if (err) {
      setError('Identifiants incorrects.');
    } else {
      navigate('/admin/dashboard');
    }
    setLoading(false);
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 font-sans"
      style={{ background: 'linear-gradient(135deg, #132073 0%, #0D1B5E 100%)' }}
    >
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl p-10 w-full max-w-md shadow-2xl"
      >
        <div className="flex justify-center mb-8">
          <img
            src="/logo-gramme.png"
            alt="Gramme"
            className="h-12 w-auto object-contain"
          />
        </div>

        <h2 className="text-center font-black uppercase text-[#132073] text-xl mb-2">
          BACK-OFFICE
        </h2>
        <p className="text-center text-[#85868C] text-sm mb-8">
          Déménagements Gramme
        </p>

        {error && (
          <p className="text-red-500 text-[13px] text-center mb-4">{error}</p>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-[#132073] font-bold text-[13px] mb-1">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-[#E5E3DF] rounded-lg py-3 px-4 text-base outline-none focus:ring-2 focus:ring-[#132073]/30 focus:border-[#132073] transition-all"
              placeholder="admin@demenagements-gramme.be"
            />
          </div>
          <div>
            <label className="block text-[#132073] font-bold text-[13px] mb-1">
              Mot de passe
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-[#E5E3DF] rounded-lg py-3 px-4 text-base outline-none focus:ring-2 focus:ring-[#132073]/30 focus:border-[#132073] transition-all"
              placeholder="Mot de passe"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full mt-6 bg-[#F0B800] text-[#132073] font-bold uppercase rounded-lg py-4 flex items-center justify-center gap-2 hover:bg-[#EAB000] transition-colors disabled:opacity-70 border-2 border-[#C89A00] shadow-md text-base tracking-wide"
        >
          {loading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <>
              SE CONNECTER
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>

        <p className="text-center text-[#85868C] text-xs mt-6">
          Accès réservé — Administration Gramme
        </p>
      </form>
    </div>
  );
}
