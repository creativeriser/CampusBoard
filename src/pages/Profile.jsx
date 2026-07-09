import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../supabaseClient'
import { Input, Textarea } from '../components/ui/Input'
import { Button } from '../components/ui/Button'
import { Loader2, Save } from 'lucide-react'
import { toast } from 'sonner'
import { motion } from 'framer-motion'
import Navbar from '../components/Navbar'
import AvatarUpload from '../components/AvatarUpload'

export default function Profile() {
  const { user } = useAuth()
  const [profile, setProfile] = useState(null)
  const [fullName, setFullName] = useState('')
  const [bio, setBio] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const fetchProfile = async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle()

      if (error) {
        setLoading(false)
        return
      }

      if (data) {
        setProfile(data)
        setFullName(data.full_name || '')
        setBio(data.bio || '')
        setLoading(false)
        return
      }

      const { data: created, error: createError } = await supabase
        .from('profiles')
        .insert({ id: user.id, full_name: '' })
        .select()
        .single()

      if (!createError && created) {
        setProfile(created)
        setFullName(created.full_name || '')
        setBio(created.bio || '')
      }

      setLoading(false)
    }

    fetchProfile()
  }, [user.id])

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)

    const { error } = await supabase
      .from('profiles')
      .update({ full_name: fullName, bio, updated_at: new Date().toISOString() })
      .eq('id', user.id)

    setSaving(false)
    
    if (error) {
      toast.error(error.message || 'Failed to update profile')
    } else {
      toast.success('Profile updated successfully')
    }
  }

  return (
    <div className="flex min-h-screen w-full flex-col bg-surface transition-colors duration-300 relative">
      
      {/* Global Unified Background Elements */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 flex items-center justify-center lg:justify-end lg:pr-[12%]">
          <div className="h-[500px] w-[500px] rounded-full bg-brand-500/15 dark:bg-brand-500/20 blur-[120px]" />
        </div>
        
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSA0MCAwIEwgMCAwIDAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgwLCAwLCAwLCAwLjAyKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] dark:hidden" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSA0MCAwIEwgMCAwIDAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsIDI1NSwgMjU1LCAwLjA0KSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] hidden dark:block" />
      </div>

      <Navbar />

      <main className="relative z-10 flex-1 w-full max-w-2xl mx-auto px-4 py-8 md:px-8">
        <div className="mb-8">
          <h1 className="font-display text-2xl md:text-3xl font-semibold text-ink-900 tracking-tight">
            My Profile
          </h1>
          <p className="text-ink-600 mt-1">Manage your personal information and preferences.</p>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-12 text-ink-600">
            <Loader2 className="h-8 w-8 animate-spin mb-4 text-brand-500" />
            <p>Loading profile...</p>
          </div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl border border-white/10 dark:border-white/5 bg-white/40 dark:bg-black/20 backdrop-blur-xl shadow-sm p-6 md:p-8 relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-b from-white/40 to-transparent dark:from-white/5 dark:to-transparent pointer-events-none" />
            
            <div className="relative z-10">
              <AvatarUpload
                userId={user.id}
                currentUrl={profile?.avatar_url}
                onUploaded={(url) => setProfile((prev) => ({ ...prev, avatar_url: url }))}
              />

              <form onSubmit={handleSave} className="mt-6 flex flex-col gap-5">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-ink-900">Email Address</label>
                  <Input 
                    type="text" 
                    value={user.email} 
                    disabled 
                    className="opacity-70 cursor-not-allowed"
                  />
                  <p className="text-[11px] text-ink-500">Your email address cannot be changed.</p>
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-ink-900">Full Name</label>
                  <Input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="E.g. Jane Doe"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-ink-900">Bio</label>
                  <Textarea
                    rows={4}
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Tell us a little about yourself..."
                    className="resize-none"
                  />
                </div>

                <div className="mt-4 flex justify-end">
                  <Button type="submit" disabled={saving || loading}>
                    {saving ? (
                      <>Saving <Loader2 size={16} className="ml-2 animate-spin" /></>
                    ) : (
                      <>Save Changes <Save size={16} className="ml-2" /></>
                    )}
                  </Button>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </main>
    </div>
  )
}