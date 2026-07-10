export function formatDate(dateString) {
  if (!dateString) return ''
  // Supabase often returns timestamps without the 'Z' (UTC marker).
  // If we don't append 'Z', JS parses it as local browser time.
  const normalizedString = dateString.endsWith('Z') || dateString.includes('+') 
    ? dateString 
    : `${dateString}Z`
    
  const date = new Date(normalizedString)
  return date.toLocaleString(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  })
}
