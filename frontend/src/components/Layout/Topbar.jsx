import { useLocation } from 'react-router-dom'
import { Bell, Search } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

const titles = {
  '/dashboard': 'Dashboard',
  '/users': 'Manajemen User',
  '/pegawai': 'Data Pegawai',
  '/jabatan': 'Data Jabatan',
  '/jabatan-pegawai': 'Jabatan Pegawai',
}

export default function Topbar() {
  const location = useLocation()
  const { user } = useAuth()
  const title = titles[location.pathname] || 'SIMPEG'

  return (
    <header className="h-16 bg-sidebar border-b border-white/5 flex items-center justify-between px-6 flex-shrink-0">
      <div>
        <h1 className="text-white font-semibold text-lg">{title}</h1>
        <p className="text-muted text-xs">Sistem Informasi Kepegawaian</p>
      </div>
      <div className="flex items-center gap-3">
        <div className="relative hidden sm:block">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
          <input
            type="text"
            placeholder="Cari..."
            className="form-input pl-8 py-1.5 w-48 text-xs"
          />
        </div>
        <button className="relative w-9 h-9 bg-surface-light rounded-xl flex items-center justify-center hover:bg-white/10 transition-colors">
          <Bell size={16} className="text-muted" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary-500 rounded-full"></span>
        </button>
        <div className="w-9 h-9 bg-primary-500/20 border border-primary-500/30 rounded-xl flex items-center justify-center">
          <span className="text-primary-400 font-semibold text-sm uppercase">
            {user?.username?.[0] || 'U'}
          </span>
        </div>
      </div>
    </header>
  )
}
