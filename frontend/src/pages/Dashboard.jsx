import { useEffect, useState } from 'react'
import { Users, UserCircle, Briefcase, Link2, TrendingUp } from 'lucide-react'
import api from '../services/api'
import { useAuth } from '../context/AuthContext'
import LoadingSpinner from '../components/LoadingSpinner'

export default function Dashboard() {
  const { user } = useAuth()
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [userRes, pegawaiRes, jabatanRes, jabpegRes] = await Promise.all([
          api.get('/users?per_page=1').catch(() => ({ data: { data: { total: 0 } } })),
          api.get('/pegawai?per_page=1'),
          api.get('/jabatan?per_page=1'),
          api.get('/jabatan-pegawai?per_page=1'),
        ])
        setStats({
          users: userRes.data.data.total ?? 0,
          pegawai: pegawaiRes.data.data.total ?? 0,
          jabatan: jabatanRes.data.data.total ?? 0,
          jabatanPegawai: jabpegRes.data.data.total ?? 0,
        })
      } catch (err) {
        setStats({ users: 0, pegawai: 0, jabatan: 0, jabatanPegawai: 0 })
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [])

  const statCards = [
    {
      label: 'Total User',
      value: stats?.users ?? 0,
      icon: Users,
      iconBg: 'bg-primary-500/20',
      iconColor: 'text-primary-400',
      show: user?.role === 'admin',
    },
    {
      label: 'Total Pegawai',
      value: stats?.pegawai ?? 0,
      icon: UserCircle,
      iconBg: 'bg-emerald-500/20',
      iconColor: 'text-emerald-400',
      show: true,
    },
    {
      label: 'Total Jabatan',
      value: stats?.jabatan ?? 0,
      icon: Briefcase,
      iconBg: 'bg-amber-500/20',
      iconColor: 'text-amber-400',
      show: true,
    },
    {
      label: 'Jabatan Aktif',
      value: stats?.jabatanPegawai ?? 0,
      icon: Link2,
      iconBg: 'bg-cyan-500/20',
      iconColor: 'text-cyan-400',
      show: true,
    },
  ]

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div className="card bg-gradient-to-r from-primary-600/20 via-primary-500/10 to-transparent border-primary-500/20">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-white font-semibold text-xl">
              Selamat Datang, <span className="text-primary-400 capitalize">{user?.username}</span>! 👋
            </h2>
            <p className="text-muted text-sm mt-1">
              Anda login sebagai <span className="text-white capitalize font-medium">{user?.role}</span>.
              Kelola data kepegawaian dengan mudah.
            </p>
          </div>
          <div className="w-16 h-16 bg-primary-500/20 border border-primary-500/30 rounded-2xl flex items-center justify-center">
            <TrendingUp size={28} className="text-primary-400" />
          </div>
        </div>
      </div>

      {/* Stats */}
      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {statCards.filter((c) => c.show).map((card, i) => (
            <div key={i} className="stat-card">
              <div className={`stat-icon ${card.iconBg}`}>
                <card.icon size={22} className={card.iconColor} />
              </div>
              <div>
                <p className="text-muted text-xs">{card.label}</p>
                <p className="text-white text-2xl font-bold">{card.value.toLocaleString('id-ID')}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Info Akun */}
      <div className="card">
        <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
          <Users size={18} className="text-primary-400" />
          Informasi Akun
        </h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-muted text-xs">Username</p>
            <p className="text-white font-medium">{user?.username}</p>
          </div>
          <div>
            <p className="text-muted text-xs">Email</p>
            <p className="text-white font-medium">{user?.email}</p>
          </div>
          <div>
            <p className="text-muted text-xs">NIP</p>
            <p className="text-white font-medium">{user?.nip || '-'}</p>
          </div>
          <div>
            <p className="text-muted text-xs">Role</p>
            <span className={`badge ${user?.role === 'admin' ? 'badge-primary' : 'badge-success'} capitalize`}>
              {user?.role}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
