import { cn } from '../../lib/utils'

const VARIANTS = {
  brand: 'text-brand-600 dark:text-brand-400 bg-brand-500/10 border-brand-500/20',
  red: 'text-red-600 dark:text-red-400 bg-red-500/10 border-red-500/20',
  indigo: 'text-indigo-600 dark:text-indigo-400 bg-indigo-500/10 border-indigo-500/20',
  emerald: 'text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
  blue: 'text-blue-600 dark:text-blue-400 bg-blue-500/10 border-blue-500/20',
  default: 'text-ink-600 bg-ink-900/5 border-ink-900/10 dark:text-ink-400 dark:bg-white/5 dark:border-white/10',
}

export function Badge({ children, variant = 'default', className, icon: Icon }) {
  return (
    <span className={cn(
      "inline-flex w-fit items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border shadow-sm backdrop-blur-md",
      VARIANTS[variant],
      className
    )}>
      {Icon && <Icon size={10} />}
      {children}
    </span>
  )
}
