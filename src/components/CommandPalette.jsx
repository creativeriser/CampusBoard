import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Search, User, Sun, Moon, ArrowRight, LogOut, Loader2 } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../lib/ThemeContext'
import { supabase } from '../supabaseClient'

export default function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [isSearching, setIsSearching] = useState(false)
  
  const { user, switchAccount, savedAccounts, signOut } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const navigate = useNavigate()

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setIsOpen((open) => !open)
      }
      if (e.key === 'Escape') {
        setIsOpen(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  useEffect(() => {
    if (!isOpen) {
      setQuery('')
      setResults([])
    }
  }, [isOpen])

  // Search logic
  useEffect(() => {
    const searchNotices = async () => {
      if (!query.trim()) {
        setResults([])
        return
      }
      setIsSearching(true)
      const { data, error } = await supabase
        .from('notices')
        .select('id, title')
        .ilike('title', `%${query}%`)
        .limit(5)
      
      if (!error && data) {
        setResults(data)
      }
      setIsSearching(false)
    }
    
    const timeout = setTimeout(searchNotices, 300)
    return () => clearTimeout(timeout)
  }, [query])

  if (!isOpen || !user) return null

  const handleAction = async (action) => {
    setIsOpen(false)
    
    if (action.type === 'navigate') {
      navigate(action.path)
    } else if (action.type === 'theme') {
      toggleTheme()
    } else if (action.type === 'switch_account') {
      await switchAccount(action.id)
    } else if (action.type === 'signout') {
      await signOut()
      navigate('/login')
    }
  }

  // Generate static actions
  const staticActions = [
    { id: 'profile', title: 'Go to Profile', icon: <User size={16} />, type: 'navigate', path: '/profile' },
    { id: 'dashboard', title: 'Go to Dashboard', icon: <ArrowRight size={16} />, type: 'navigate', path: '/dashboard' },
    { id: 'theme', title: `Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`, icon: theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />, type: 'theme' },
    { id: 'signout', title: 'Sign Out', icon: <LogOut size={16} />, type: 'signout' }
  ]

  const otherAccounts = savedAccounts.filter(acc => acc.id !== user?.id)

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] px-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm"
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.15 }}
            className="relative z-[101] w-full max-w-lg overflow-hidden rounded-2xl glass-dropdown"
          >
            <div className="flex items-center gap-3 border-b border-border/50 dark:border-white/5 px-4 py-3">
              <Search size={18} className="text-ink-400" />
              <input
                type="text"
                autoFocus
                placeholder="Search notices or type a command..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="flex-1 bg-transparent text-lg font-medium text-ink-900 placeholder:text-ink-400 outline-none"
              />
              <div className="flex items-center gap-1 rounded bg-ink-900/5 dark:bg-white/10 px-2 py-1 text-[10px] font-bold text-ink-500">
                ESC
              </div>
            </div>

            <div className="max-h-[60vh] overflow-y-auto p-2">
              {/* Search Results */}
              {query.trim() !== '' && (
                <div className="mb-4">
                  <h3 className="px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-ink-500">
                    Notices
                  </h3>
                  {isSearching ? (
                    <div className="flex items-center gap-2 px-3 py-2 text-sm text-ink-500">
                      <Loader2 size={14} className="animate-spin" /> Searching...
                    </div>
                  ) : results.length > 0 ? (
                    results.map(res => (
                      <button
                        key={res.id}
                        onClick={() => handleAction({ type: 'navigate', path: '/dashboard' })}
                        className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-ink-700 list-item-hover hover:text-ink-900"
                      >
                        <ArrowRight size={16} className="text-ink-400" />
                        {res.title}
                      </button>
                    ))
                  ) : (
                    <div className="flex flex-col items-center justify-center py-6 px-3 text-center">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-ink-900/5 dark:bg-white/5 text-ink-400 mb-2">
                        <Search size={20} />
                      </div>
                      <span className="text-sm font-medium text-ink-900">No notices found</span>
                      <span className="text-xs text-ink-500">Try a different search term</span>
                    </div>
                  )}
                </div>
              )}

              {/* Quick Actions */}
              {query.trim() === '' && (
                <div className="mb-4">
                  <h3 className="px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-ink-500">
                    Quick Actions
                  </h3>
                  {staticActions.map(action => (
                    <button
                      key={action.id}
                      onClick={() => handleAction(action)}
                      className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-ink-700 list-item-hover hover:text-ink-900"
                    >
                      <div className="text-ink-400">{action.icon}</div>
                      {action.title}
                    </button>
                  ))}
                </div>
              )}

              {/* Account Switching */}
              {query.trim() === '' && otherAccounts.length > 0 && (
                <div>
                  <h3 className="px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-ink-500">
                    Switch Account
                  </h3>
                  {otherAccounts.map(acc => (
                    <button
                      key={acc.id}
                      onClick={() => handleAction({ type: 'switch_account', id: acc.id })}
                      className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-ink-700 list-item-hover hover:text-ink-900"
                    >
                      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-ink-900/5 dark:bg-white/10 text-[10px] font-bold text-ink-700 overflow-hidden">
                        {acc.avatar_url ? (
                          <img src={acc.avatar_url} alt="Avatar" className="h-full w-full object-cover" />
                        ) : (
                          <span className="uppercase">{acc.full_name?.charAt(0)}</span>
                        )}
                      </div>
                      <span className="truncate">{acc.full_name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
