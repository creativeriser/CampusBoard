import { useState, useRef } from 'react'
import { supabase } from '../supabaseClient'
import { Camera, Loader2, User } from 'lucide-react'
import { toast } from 'sonner'

export default function AvatarUpload({ userId, currentUrl, onUploaded }) {
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef(null)

  const handleFileChange = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    setUploading(true)

    const filePath = `${userId}/${Date.now()}-${file.name}`

    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(filePath, file, { upsert: true })

    if (uploadError) {
      toast.error(uploadError.message)
      setUploading(false)
      return
    }

    const { data } = supabase.storage.from('avatars').getPublicUrl(filePath)

    const { error: updateError } = await supabase
      .from('profiles')
      .update({ avatar_url: data.publicUrl })
      .eq('id', userId)

    setUploading(false)

    if (updateError) {
      toast.error(updateError.message)
      return
    }

    onUploaded(data.publicUrl)
    toast.success('Avatar updated successfully')
  }

  return (
    <div className="flex flex-col items-center justify-center py-6">
      <div 
        className="group relative h-28 w-28 overflow-hidden rounded-full border-2 border-white/20 bg-surface/50 shadow-sm cursor-pointer transition-all hover:border-brand-500/50"
        onClick={() => !uploading && fileInputRef.current?.click()}
      >
        {currentUrl ? (
          <img src={currentUrl} alt="avatar" className="h-full w-full object-cover transition-opacity group-hover:opacity-50" />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-ink-900/5 dark:bg-white/5 text-ink-400 transition-opacity group-hover:opacity-50">
            <User size={40} />
          </div>
        )}

        {/* Hover Overlay */}
        <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100">
          {uploading ? (
            <Loader2 className="h-6 w-6 animate-spin text-white" />
          ) : (
            <Camera className="h-6 w-6 text-white" />
          )}
        </div>
      </div>

      <input 
        type="file" 
        accept="image/*" 
        onChange={handleFileChange} 
        disabled={uploading} 
        ref={fileInputRef}
        className="hidden" 
      />
      
      <p className="mt-3 text-xs text-ink-400 font-medium">Click to upload photo</p>
    </div>
  )
}
