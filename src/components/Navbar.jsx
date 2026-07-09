import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../lib/ThemeContext'
import NotificationBell from './NotificationBell'
import { GraduationCap, Sun, Moon, User, LogOut } from 'lucide-react'

export default function Navbar() {
  const { user, signOut } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = async () => {
    await signOut()
    navigate('/login')
  }

  return (
    <nav className="sticky top-0 z-50 flex h-[72px] w-full shrink-0 items-center justify-between px-4 md:px-8 transition-colors bg-transparent pt-4">
      <Link to="/dashboard" className="flex items-center gap-2.5 transition-opacity hover:opacity-80 outline-none focus-visible:ring-2 focus-visible:ring-brand-500 rounded">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-ink-900 text-canvas">
          <GraduationCap size={18} />
        </div>
        <span className="font-display text-lg font-bold tracking-wide text-ink-900">CampusBoard</span>
      </Link>

      {user && (
        <div className="flex items-center gap-2 sm:gap-4">
          <button 
            onClick={toggleTheme}
            className="flex h-9 w-9 items-center justify-center rounded-full text-ink-700 transition-colors hover:bg-ink-900/5 dark:hover:bg-white/10 hover:text-ink-900 outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          <NotificationBell userId={user.id} />

          <Link 
            to="/profile" 
            className={`flex h-9 w-9 items-center justify-center rounded-full transition-colors hover:bg-ink-900/5 dark:hover:bg-white/10 outline-none focus-visible:ring-2 focus-visible:ring-brand-500 ${location.pathname === '/profile' ? 'text-brand-600 dark:text-brand-400 bg-brand-500/10' : 'text-ink-700 hover:text-ink-900'}`}
            title="Profile"
          >
            <User size={18} />
          </Link>

          <button 
            onClick={handleLogout}
            className="flex h-9 w-9 items-center justify-center rounded-full text-ink-700 transition-colors hover:bg-ember-500/10 hover:text-ember-600 dark:hover:text-ember-400 outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
            title="Log out"
          >
            <LogOut size={18} />
          </button>
        </div>
      )}
    </nav>
  )
}
