import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function ProtectedRoute({ children }) {
  const { session, loading } = useAuth()

  if (loading) {
    return (
      <div className="w-full flex flex-col animate-pulse mt-2 md:mt-4">
        {/* Title skeleton */}
        <div className="h-9 w-48 bg-black/5 dark:bg-white/5 rounded-lg mb-3"></div>
        <div className="h-4 w-64 bg-black/5 dark:bg-white/5 rounded mb-8"></div>
        
        {/* Composer skeleton */}
        <div className="h-[140px] w-full bg-black/5 dark:bg-white/5 rounded-2xl border border-white/5 mb-8"></div>
        
        {/* Feed skeleton */}
        <div className="flex flex-col gap-4">
          <div className="h-40 w-full bg-black/5 dark:bg-white/5 rounded-2xl border border-white/5"></div>
          <div className="h-40 w-full bg-black/5 dark:bg-white/5 rounded-2xl border border-white/5"></div>
        </div>
      </div>
    )
  }

  if (!session) return <Navigate to="/login" replace />

  return children
}
