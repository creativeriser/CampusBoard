import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { GraduationCap, ArrowRight, Sun, Moon, Loader2 } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { TypewriterText } from '../components/ui/TypewriterText';
import { useTheme } from '../lib/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../supabaseClient';

export default function Signup() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const { signUp } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const { data, error: signUpError } = await signUp(email, password);

    if (signUpError) {
      toast.error(signUpError.message || "Failed to create account");
      setIsLoading(false);
      return;
    }

    if (data.user) {
      const { error: profileError } = await supabase.from('profiles').insert({
        id: data.user.id,
        full_name: fullName,
      });
      if (profileError) {
        console.warn('Profile row not created at signup (will be created on first Profile visit):', profileError.message);
      }
    }

    setIsLoading(false);

    if (!data.session) {
      toast.success('Account created. Please check your email to confirm, then log in.');
      return;
    }

    navigate('/dashboard');
  };

  return (
    <div className="flex min-h-screen w-full flex-col bg-surface transition-colors duration-300 relative overflow-hidden">
      
      {/* Global Unified Background Elements */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 flex items-center justify-center lg:justify-end lg:pr-[12%]">
          <div className="h-[500px] w-[500px] rounded-full bg-brand-500/15 dark:bg-brand-500/20 blur-[120px]" />
        </div>
        
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSA0MCAwIEwgMCAwIDAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgwLCAwLCAwLCAwLjAyKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] dark:hidden" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSA0MCAwIEwgMCAwIDAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsIDI1NSwgMjU1LCAwLjA0KSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] hidden dark:block" />
      </div>

      {/* Auth Navbar */}
      <header className="relative z-10 flex h-[72px] shrink-0 items-center justify-between px-4 md:px-8 sticky top-0 transition-colors">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-ink-900 text-canvas">
            <GraduationCap size={18} />
          </div>
          <span className="font-display text-lg font-bold tracking-wide text-ink-900">CampusBoard</span>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={toggleTheme}
            className="flex h-9 w-9 items-center justify-center rounded-full text-ink-700 transition-colors hover:bg-ink-900/5 dark:hover:bg-white/10 hover:text-ink-900"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="relative z-10 flex h-[calc(100vh-72px)] w-full">
        <div className="flex h-full w-full flex-col px-6 md:px-16 lg:w-1/2 xl:px-24">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mx-auto my-auto w-full max-w-[360px] pb-16"
          >
            <motion.div layout="position" className="mb-5">
              <h1 className="font-display text-2xl font-semibold text-ink-900">
                Create an account
              </h1>
            </motion.div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <Input
                label="Full Name"
                id="fullName"
                type="text"
                placeholder="John Doe"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                autoComplete="name"
                disabled={isLoading}
                required
              />

              <Input
                label="Email"
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                disabled={isLoading}
                required
              />
              
              <Input
                label="Password"
                id="password"
                type="password"
                placeholder="Min 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password"
                disabled={isLoading}
                required
                minLength="6"
              />

              <Button type="submit" className="mt-1 w-full justify-center" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 size={16} className="mr-2 animate-spin" />
                    Creating account...
                  </>
                ) : (
                  <>
                    Create account <ArrowRight size={16} className="ml-1" />
                  </>
                )}
              </Button>
            </form>

            <p className="mt-5 text-center text-sm text-ink-600">
              Already have an account?{' '}
              <Link to="/login" className="font-medium text-brand-600 hover:text-brand-700 hover:underline outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 rounded disabled:opacity-50 disabled:pointer-events-none">
                Sign in
              </Link>
            </p>
          </motion.div>
        </div>

        {/* Right Column */}
        <div className="hidden w-1/2 flex-col items-center justify-center lg:flex pb-16">
          <div className="flex flex-col items-center justify-center text-center px-8 min-h-[140px]">
            <h2 className="font-display text-4xl font-medium tracking-wide text-ink-900 dark:text-white drop-shadow-sm mb-3">
              Your Campus.
            </h2>
            <div className="font-display text-4xl font-medium tracking-wide text-brand-600 dark:text-brand-400 h-[48px] flex items-center justify-center">
              <TypewriterText />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}