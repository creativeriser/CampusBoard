import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../lib/ThemeContext'
import NotificationBell from './NotificationBell'
import AccountSwitcher from './AccountSwitcher'
import { GraduationCap, Sun, Moon } from 'lucide-react'

export default function Navbar() {
  const { user } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const navigate = useNavigate()
  const location = useLocation()

  return (
    <nav className="sticky top-0 z-50 flex h-[72px] w-full shrink-0 items-center justify-between px-4 md:px-8 transition-colors bg-transparent pt-4">
      <Link to="/dashboard" className="flex items-center gap-2.5 transition-opacity hover:opacity-80 outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-surface rounded">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-ink-900 text-canvas">
          <GraduationCap size={18} />
        </div>
        <span className="font-display text-lg font-bold tracking-wide text-ink-900">CampusBoard</span>
      </Link>

      {user && (
        <div className="flex items-center gap-2 sm:gap-4">
          <button 
            onClick={toggleTheme}
            className="flex h-9 w-9 items-center justify-center rounded-full text-ink-700 transition-colors hover:bg-ink-900/5 dark:hover:bg-white/10 hover:text-ink-900 outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-surface"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          <NotificationBell userId={user.id} />
          
          <AccountSwitcher />
        </div>
      )}
    </nav>
  )
}
