import { useState, useEffect, useCallback } from 'react'
import { Plus, Pencil, Trash2, Search } from 'lucide-react'
import api from '../services/api'
import { useAuth } from '../context/AuthContext'
import Modal from '../components/Modal'
import Pagination from '../components/Pagination'
import LoadingSpinner from '../components/LoadingSpinner'
import toast from 'react-hot-toast'

const initialForm = { pegawai_id: '', jabatan_id: '', tanggal_mulai: '' }

function formatRupiah(val) {
  if (!val && val !== 0) return '-'
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(val)
}

export default function JabatanPegawai() {
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
  const [deleteId, setDeleteId] = useState(null)
  const [pegawaiList, setPegawaiList] = useState([])
  const [jabatanList, setJabatanList] = useState([])

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const res = await api.get('/jabatan-pegawai', { params: { search, page, per_page: 10 } })
      setData(res.data.data.data)
      setMeta(res.data.data)
    } catch {
      toast.error('Gagal memuat data jabatan pegawai.')
    } finally {
      setLoading(false)
    }
  }, [search, page])

  const fetchDropdowns = useCallback(async () => {
    try {
      const [p, j] = await Promise.all([api.get('/pegawai/all'), api.get('/jabatan/all')])
      setPegawaiList(p.data.data)
      setJabatanList(j.data.data)
    } catch {}
  }, [])

  useEffect(() => { fetchData() }, [fetchData])
  useEffect(() => { fetchDropdowns() }, [fetchDropdowns])
  useEffect(() => { setPage(1) }, [search])

  const openAdd = () => {
    setForm(initialForm)
    setErrors({})
    setModal({ open: true, type: 'add', item: null })
  }
  const openEdit = (item) => {
    setForm({
      pegawai_id: item.pegawai_id,
      jabatan_id: item.jabatan_id,
      tanggal_mulai: item.tanggal_mulai ? item.tanggal_mulai.split('T')[0] : '',
    })
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
        await api.post('/jabatan-pegawai', form)
        toast.success('Jabatan pegawai berhasil ditetapkan!')
      } else {
        await api.put(`/jabatan-pegawai/${modal.item.id}`, form)
        toast.success('Data jabatan pegawai berhasil diperbarui!')
      }
      closeModal()
      fetchData()
    } catch (err) {
      if (err.response?.data?.errors) setErrors(err.response.data.errors)
      else toast.error(err.response?.data?.message || 'Terjadi kesalahan.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id) => {
    try {
      await api.delete(`/jabatan-pegawai/${id}`)
      toast.success('Data berhasil dihapus!')
      setDeleteId(null)
      fetchData()
    } catch { toast.error('Gagal menghapus data.') }
  }

  const f = (key, val) => setForm((p) => ({ ...p, [key]: val }))

  return (
    <div className="space-y-4">
      <div className="card">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
          <div>
            <h2 className="text-white font-semibold text-base">Jabatan Pegawai</h2>
            <p className="text-muted text-xs mt-0.5">Relasi pegawai dengan jabatan aktif</p>
          </div>
          {isAdmin() && (
            <button onClick={openAdd} className="btn-primary">
              <Plus size={16} /> Assign Jabatan
            </button>
          )}
        </div>

        {/* Search */}
        <div className="relative mb-4 max-w-xs">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
          <input type="text" className="form-input pl-9 py-2 text-xs" placeholder="Cari NIP atau nama pegawai..."
            value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>

        {/* Table */}
        <div className="table-container">
          {loading ? <LoadingSpinner /> : data.length === 0 ? (
            <div className="py-12 text-center text-muted text-sm">Belum ada jabatan yang ditetapkan.</div>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>#</th><th>NIP</th><th>Nama Pegawai</th>
                  <th>Jabatan</th><th>Gaji</th><th>Tanggal Mulai</th><th>Status</th>
                  {isAdmin() && <th>Aksi</th>}
                </tr>
              </thead>
              <tbody>
                {data.map((item, idx) => (
                  <tr key={item.id}>
                    <td className="text-muted text-xs">{(meta?.from || 1) + idx}</td>
                    <td className="font-mono text-xs text-primary-400">{item.pegawai?.nip}</td>
                    <td className="font-medium text-white">{item.pegawai?.nama_lengkap}</td>
                    <td>
                      <span className="badge badge-primary">{item.jabatan?.nama_jabatan}</span>
                    </td>
                    <td className="text-emerald-400 font-semibold text-xs">
                      {formatRupiah(item.jabatan?.gaji_jabatan)}
                    </td>
                    <td className="text-xs text-muted">
                      {item.tanggal_mulai
                        ? new Date(item.tanggal_mulai).toLocaleDateString('id-ID', { day:'2-digit', month:'short', year:'numeric' })
                        : '-'}
                    </td>
                    <td>
                      <span className={`badge ${item.is_aktif ? 'badge-success' : 'badge-danger'}`}>
                        {item.is_aktif ? 'Aktif' : 'Non-aktif'}
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
      <Modal isOpen={modal.open} onClose={closeModal}
        title={modal.type === 'add' ? 'Assign Jabatan ke Pegawai' : 'Edit Jabatan Pegawai'} size="md">
        <form onSubmit={handleSubmit}>
          <div className="modal-body space-y-4">
            {modal.type === 'add' && (
              <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl px-4 py-3 text-xs text-amber-300">
                ⚠️ Jika pegawai sudah memiliki jabatan aktif, jabatan lama akan otomatis dinonaktifkan.
              </div>
            )}
            <div>
              <label className="form-label">Pegawai *</label>
              <select className="form-select" value={form.pegawai_id} onChange={(e) => f('pegawai_id', e.target.value)} required>
                <option value="">-- Pilih Pegawai --</option>
                {pegawaiList.map((p) => (
                  <option key={p.id} value={p.id}>{p.nip} — {p.nama_lengkap}</option>
                ))}
              </select>
              {errors.pegawai_id && <p className="form-error">{errors.pegawai_id[0]}</p>}
            </div>
            <div>
              <label className="form-label">Jabatan *</label>
              <select className="form-select" value={form.jabatan_id} onChange={(e) => f('jabatan_id', e.target.value)} required>
                <option value="">-- Pilih Jabatan --</option>
                {jabatanList.map((j) => (
                  <option key={j.id} value={j.id}>{j.nama_jabatan} — {formatRupiah(j.gaji_jabatan)}</option>
                ))}
              </select>
              {errors.jabatan_id && <p className="form-error">{errors.jabatan_id[0]}</p>}
            </div>
            <div>
              <label className="form-label">Tanggal Mulai</label>
              <input type="date" className="form-input" value={form.tanggal_mulai}
                onChange={(e) => f('tanggal_mulai', e.target.value)} />
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
          <p className="text-gray-300 text-sm">Apakah Anda yakin ingin menghapus data jabatan pegawai ini?</p>
        </div>
        <div className="modal-footer">
          <button onClick={() => setDeleteId(null)} className="btn-secondary">Batal</button>
          <button onClick={() => handleDelete(deleteId)} className="btn-danger">Ya, Hapus</button>
        </div>
      </Modal>
    </div>
  )
}
