import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../supabaseClient'
import { Input, Textarea } from '../components/ui/Input'
import { Button } from '../components/ui/Button'
import { Loader2, Save } from 'lucide-react'
import { toast } from 'sonner'
import { motion } from 'framer-motion'
import AvatarUpload from '../components/AvatarUpload'
import RoleBadge from '../components/RoleBadge'

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
        .insert({ id: user.id, full_name: user.user_metadata?.full_name || 'Campus Member', role: 'member' })
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
    <>
        <div className="mb-8">
          <div className="flex items-center gap-3">
            <h1 className="font-sans text-2xl md:text-3xl font-bold text-ink-900 tracking-tight">
              My Profile
            </h1>
          </div>
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
            className="glass-panel rounded-2xl p-5 md:p-6 relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-b from-white/40 to-transparent dark:from-white/5 dark:to-transparent pointer-events-none" />
            
            <div className="relative z-10">
              <AvatarUpload
                userId={user.id}
                currentUrl={profile?.avatar_url}
                onUploaded={(url) => setProfile((prev) => ({ ...prev, avatar_url: url }))}
              />

              <form onSubmit={handleSave} className="mt-10 flex flex-col relative z-10">
                <div className="flex flex-col md:flex-row md:items-center py-4 rounded-lg -mx-4 px-4">
                  <div className="w-48 mb-2 md:mb-0 shrink-0">
                    <label className="text-sm font-medium text-ink-700">Account Role</label>
                    <p className="text-[10px] text-ink-600 mt-0.5">Assigned by admin</p>
                  </div>
                  <div className="flex-1 w-full flex items-center">
                    <RoleBadge role={profile?.role} />
                  </div>
                </div>

                <div className="h-[1px] w-full bg-border/50" />

                <div className="flex flex-col md:flex-row md:items-center py-4">
                  <div className="w-48 mb-2 md:mb-0 shrink-0">
                    <label className="text-sm font-medium text-ink-700">Email Address</label>
                    <p className="text-[10px] text-ink-600 mt-0.5">Cannot be changed</p>
                  </div>
                  <input 
                    type="text" 
                    value={user.email} 
                    disabled 
                    className="flex-1 w-full bg-transparent text-sm font-medium text-ink-600 outline-none cursor-not-allowed"
                  />
                </div>

                <div className="h-[1px] w-full bg-border/50" />

                <div className="flex flex-col md:flex-row md:items-center py-4 focus-within:bg-black/[0.03] dark:focus-within:bg-white/[0.03] hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-colors rounded-lg -mx-4 px-4">
                  <div className="w-48 mb-2 md:mb-0 shrink-0">
                    <label className="text-sm font-medium text-ink-700">Full Name</label>
                  </div>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="E.g. Jane Doe"
                    className="flex-1 w-full bg-transparent text-sm font-medium text-ink-900 placeholder:text-ink-400 outline-none"
                  />
                </div>

                <div className="h-[1px] w-full bg-border/50" />

                <div className="flex flex-col md:flex-row py-4 focus-within:bg-black/[0.03] dark:focus-within:bg-white/[0.03] hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-colors rounded-lg -mx-4 px-4">
                  <div className="w-48 mb-2 md:mb-0 shrink-0 pt-1">
                    <label className="text-sm font-medium text-ink-700">Bio</label>
                    <p className="text-[10px] text-ink-600 mt-0.5">Visible on your posts</p>
                  </div>
                  <textarea
                    rows={3}
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Tell us a little about yourself..."
                    className="flex-1 w-full bg-transparent text-sm text-ink-900 placeholder:text-ink-400 outline-none resize-none pt-1"
                  />
                </div>
                
                <div className="h-[1px] w-full bg-border/50 mb-6" />

                <div className="flex justify-end">
                  <Button type="submit" variant="brand" disabled={saving || loading} className="rounded-full px-6">
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
    </>
  )
}