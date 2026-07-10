import { Outlet } from 'react-router-dom'
import Navbar from '../components/Navbar'
import AppBackground from '../components/ui/AppBackground'

export default function AuthLayout() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-surface transition-colors duration-300 relative">
      <AppBackground />
      <Navbar />
      <main className="relative z-10 flex-1 w-full max-w-3xl mx-auto px-4 py-8 md:px-8">
        <Outlet />
      </main>
    </div>
  )
}
