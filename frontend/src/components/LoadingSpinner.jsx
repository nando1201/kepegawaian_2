import { Loader2 } from 'lucide-react'

export default function LoadingSpinner({ text = 'Memuat data...' }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-3">
      <Loader2 size={32} className="text-primary-500 animate-spin" />
      <p className="text-muted text-sm">{text}</p>
    </div>
  )
}
