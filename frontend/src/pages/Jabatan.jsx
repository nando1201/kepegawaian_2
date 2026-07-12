import { useState, useEffect, useCallback } from 'react'
import { Plus, Pencil, Trash2, Search } from 'lucide-react'
import api from '../services/api'
import { useAuth } from '../context/AuthContext'
import Modal from '../components/Modal'
import Pagination from '../components/Pagination'
import LoadingSpinner from '../components/LoadingSpinner'
import toast from 'react-hot-toast'

const initialForm = { kode_jabatan: '', nama_jabatan: '', gaji_jabatan: '' }

function formatRupiah(val) {
  if (!val && val !== 0) return '-'
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(val)
}

export default function Jabatan() {
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

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const res = await api.get('/jabatan', { params: { search, page, per_page: 10 } })
      setData(res.data.data.data)
      setMeta(res.data.data)
    } catch {
      toast.error('Gagal memuat data jabatan.')
    } finally {
      setLoading(false)
    }
  }, [search, page])

  useEffect(() => { fetchData() }, [fetchData])
  useEffect(() => { setPage(1) }, [search])

  const openAdd = () => { setForm(initialForm); setErrors({}); setModal({ open: true, type: 'add', item: null }) }
  const openEdit = (item) => {
    setForm({ kode_jabatan: item.kode_jabatan, nama_jabatan: item.nama_jabatan, gaji_jabatan: item.gaji_jabatan })
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
        await api.post('/jabatan', form)
        toast.success('Data jabatan berhasil ditambahkan!')
      } else {
        await api.put(`/jabatan/${modal.item.id}`, form)
        toast.success('Data jabatan berhasil diperbarui!')
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
      await api.delete(`/jabatan/${id}`)
      toast.success('Data jabatan berhasil dihapus!')
      setDeleteId(null)
      fetchData()
    } catch { toast.error('Gagal menghapus data jabatan.') }
  }

  const f = (key, val) => setForm((p) => ({ ...p, [key]: val }))

  return (
    <div className="space-y-4">
      <div className="card">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
          <div>
            <h2 className="text-white font-semibold text-base">Data Jabatan</h2>
            <p className="text-muted text-xs mt-0.5">Kelola data jabatan dan informasi gaji</p>
          </div>
          {isAdmin() && (
            <button onClick={openAdd} className="btn-primary">
              <Plus size={16} /> Tambah Jabatan
            </button>
          )}
        </div>

        {/* Search */}
        <div className="relative mb-4 max-w-xs">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
          <input type="text" className="form-input pl-9 py-2 text-xs" placeholder="Cari kode atau nama jabatan..."
            value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>

        {/* Table */}
        <div className="table-container">
          {loading ? <LoadingSpinner /> : data.length === 0 ? (
            <div className="py-12 text-center text-muted text-sm">Tidak ada data jabatan.</div>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>#</th><th>Kode Jabatan</th><th>Nama Jabatan</th><th>Gaji Jabatan</th>
                  {isAdmin() && <th>Aksi</th>}
                </tr>
              </thead>
              <tbody>
                {data.map((item, idx) => (
                  <tr key={item.id}>
                    <td className="text-muted text-xs">{(meta?.from || 1) + idx}</td>
                    <td className="font-mono text-xs text-primary-400 font-semibold">{item.kode_jabatan}</td>
                    <td className="font-medium text-white">{item.nama_jabatan}</td>
                    <td className="text-emerald-400 font-semibold">{formatRupiah(item.gaji_jabatan)}</td>
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
        title={modal.type === 'add' ? 'Tambah Data Jabatan' : 'Edit Data Jabatan'} size="md">
        <form onSubmit={handleSubmit}>
          <div className="modal-body space-y-4">
            <div>
              <label className="form-label">Kode Jabatan *</label>
              <input className="form-input font-mono" value={form.kode_jabatan}
                onChange={(e) => f('kode_jabatan', e.target.value.toUpperCase())} required
                placeholder="contoh: JBT001" />
              {errors.kode_jabatan && <p className="form-error">{errors.kode_jabatan[0]}</p>}
            </div>
            <div>
              <label className="form-label">Nama Jabatan *</label>
              <input className="form-input" value={form.nama_jabatan}
                onChange={(e) => f('nama_jabatan', e.target.value)} required
                placeholder="contoh: Kepala Bagian" />
              {errors.nama_jabatan && <p className="form-error">{errors.nama_jabatan[0]}</p>}
            </div>
            <div>
              <label className="form-label">Gaji Jabatan (Rp) *</label>
              <input type="number" className="form-input" value={form.gaji_jabatan}
                onChange={(e) => f('gaji_jabatan', e.target.value)} required min={0}
                placeholder="contoh: 5000000" />
              {errors.gaji_jabatan && <p className="form-error">{errors.gaji_jabatan[0]}</p>}
              {form.gaji_jabatan && (
                <p className="text-emerald-400 text-xs mt-1">{formatRupiah(form.gaji_jabatan)}</p>
              )}
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
          <p className="text-gray-300 text-sm">Apakah Anda yakin ingin menghapus data jabatan ini?</p>
        </div>
        <div className="modal-footer">
          <button onClick={() => setDeleteId(null)} className="btn-secondary">Batal</button>
          <button onClick={() => handleDelete(deleteId)} className="btn-danger">Ya, Hapus</button>
        </div>
      </Modal>
    </div>
  )
}
