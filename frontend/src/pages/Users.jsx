import { useState, useEffect, useCallback } from 'react'
import { Plus, Pencil, Trash2, Search, Eye, EyeOff } from 'lucide-react'
import api from '../services/api'
import { useAuth } from '../context/AuthContext'
import Modal from '../components/Modal'
import Pagination from '../components/Pagination'
import LoadingSpinner from '../components/LoadingSpinner'
import toast from 'react-hot-toast'

const initialForm = { username: '', email: '', nip: '', password: '', role: 'user' }

export default function Users() {
  const { isAdmin } = useAuth()
  const [data, setData] = useState([])
  const [meta, setMeta] = useState(null)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [modal, setModal] = useState({ open: false, type: 'add', item: null })
  const [form, setForm] = useState(initialForm)
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [showPass, setShowPass] = useState(false)
  const [deleteId, setDeleteId] = useState(null)

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const res = await api.get('/users', { params: { search, page, per_page: 10 } })
      setData(res.data.data.data)
      setMeta(res.data.data)
    } catch (err) {
      toast.error('Gagal memuat data user.')
    } finally {
      setLoading(false)
    }
  }, [search, page])

  useEffect(() => { fetchData() }, [fetchData])
  useEffect(() => { setPage(1) }, [search])

  const openAdd = () => {
    setForm(initialForm)
    setErrors({})
    setModal({ open: true, type: 'add', item: null })
  }

  const openEdit = (item) => {
    setForm({ ...item, password: '' })
    setErrors({})
    setModal({ open: true, type: 'edit', item })
  }

  const closeModal = () => setModal({ open: false, type: 'add', item: null })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrors({})
    setSubmitting(true)
    try {
      if (modal.type === 'add') {
        await api.post('/users', form)
        toast.success('User berhasil ditambahkan!')
      } else {
        const payload = { ...form }
        if (!payload.password) delete payload.password
        await api.put(`/users/${modal.item.id}`, payload)
        toast.success('User berhasil diperbarui!')
      }
      closeModal()
      fetchData()
    } catch (err) {
      if (err.response?.data?.errors) {
        setErrors(err.response.data.errors)
      } else {
        toast.error(err.response?.data?.message || 'Terjadi kesalahan.')
      }
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id) => {
    try {
      await api.delete(`/users/${id}`)
      toast.success('User berhasil dihapus!')
      setDeleteId(null)
      fetchData()
    } catch (err) {
      toast.error('Gagal menghapus user.')
    }
  }

  const f = (key, val) => setForm((p) => ({ ...p, [key]: val }))

  return (
    <div className="space-y-4">
      <div className="card">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
          <div>
            <h2 className="text-white font-semibold text-base">Daftar User</h2>
            <p className="text-muted text-xs mt-0.5">Kelola akun pengguna sistem</p>
          </div>
          {isAdmin() && (
            <button onClick={openAdd} className="btn-primary">
              <Plus size={16} /> Tambah User
            </button>
          )}
        </div>

        {/* Search */}
        <div className="relative mb-4 max-w-xs">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
          <input
            type="text"
            className="form-input pl-9 py-2 text-xs"
            placeholder="Cari username, email, NIP..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Table */}
        <div className="table-container">
          {loading ? (
            <LoadingSpinner />
          ) : data.length === 0 ? (
            <div className="py-12 text-center text-muted text-sm">Tidak ada data user.</div>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Username</th>
                  <th>Email</th>
                  <th>NIP</th>
                  <th>Role</th>
                  {isAdmin() && <th>Aksi</th>}
                </tr>
              </thead>
              <tbody>
                {data.map((item, idx) => (
                  <tr key={item.id}>
                    <td className="text-muted text-xs">{(meta?.from || 1) + idx}</td>
                    <td className="font-medium text-white">{item.username}</td>
                    <td>{item.email}</td>
                    <td>{item.nip || '-'}</td>
                    <td>
                      <span className={`badge ${item.role === 'admin' ? 'badge-primary' : 'badge-success'} capitalize`}>
                        {item.role}
                      </span>
                    </td>
                    {isAdmin() && (
                      <td>
                        <div className="flex items-center gap-1.5">
                          <button onClick={() => openEdit(item)} className="btn-secondary py-1 px-2 text-xs">
                            <Pencil size={13} /> Edit
                          </button>
                          <button onClick={() => setDeleteId(item.id)} className="btn-danger py-1 px-2 text-xs">
                            <Trash2 size={13} /> Hapus
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        <Pagination meta={meta} onPageChange={setPage} />
      </div>

      {/* Add/Edit Modal */}
      <Modal
        isOpen={modal.open}
        onClose={closeModal}
        title={modal.type === 'add' ? 'Tambah User Baru' : 'Edit User'}
      >
        <form onSubmit={handleSubmit}>
          <div className="modal-body space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="form-label">Username *</label>
                <input className="form-input" value={form.username} onChange={(e) => f('username', e.target.value)} required />
                {errors.username && <p className="form-error">{errors.username[0]}</p>}
              </div>
              <div>
                <label className="form-label">NIP</label>
                <input className="form-input" value={form.nip} onChange={(e) => f('nip', e.target.value)} />
              </div>
            </div>
            <div>
              <label className="form-label">Email *</label>
              <input type="email" className="form-input" value={form.email} onChange={(e) => f('email', e.target.value)} required />
              {errors.email && <p className="form-error">{errors.email[0]}</p>}
            </div>
            <div>
              <label className="form-label">{modal.type === 'edit' ? 'Password Baru (kosongkan jika tidak diubah)' : 'Password *'}</label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  className="form-input pr-10"
                  value={form.password}
                  onChange={(e) => f('password', e.target.value)}
                  required={modal.type === 'add'}
                  minLength={modal.type === 'add' ? 6 : undefined}
                />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-white">
                  {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
              {errors.password && <p className="form-error">{errors.password[0]}</p>}
            </div>
            <div>
              <label className="form-label">Role *</label>
              <select className="form-select" value={form.role} onChange={(e) => f('role', e.target.value)}>
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" onClick={closeModal} className="btn-secondary">Batal</button>
            <button type="submit" disabled={submitting} className="btn-primary">
              {submitting ? 'Menyimpan...' : 'Simpan'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirm */}
      <Modal isOpen={!!deleteId} onClose={() => setDeleteId(null)} title="Konfirmasi Hapus" size="sm">
        <div className="modal-body">
          <p className="text-gray-300 text-sm">Apakah Anda yakin ingin menghapus user ini? Tindakan ini tidak dapat dibatalkan.</p>
        </div>
        <div className="modal-footer">
          <button onClick={() => setDeleteId(null)} className="btn-secondary">Batal</button>
          <button onClick={() => handleDelete(deleteId)} className="btn-danger">Ya, Hapus</button>
        </div>
      </Modal>
    </div>
  )
}
