import { useState, useEffect, useCallback } from 'react'
import { Plus, Pencil, Trash2, Search } from 'lucide-react'
import api from '../services/api'
import { useAuth } from '../context/AuthContext'
import Modal from '../components/Modal'
import Pagination from '../components/Pagination'
import LoadingSpinner from '../components/LoadingSpinner'
import toast from 'react-hot-toast'

const initialForm = {
  nip: '', nama_lengkap: '', nama_jalan: '', rt: '', rw: '',
  kelurahan: '', kota: '', provinsi: '', kode_pos: '',
  email: '', tanggal_lahir: '', no_hp: '', jenis_kelamin: '',
}

export default function Pegawai() {
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
      const res = await api.get('/pegawai', { params: { search, page, per_page: 10 } })
      setData(res.data.data.data)
      setMeta(res.data.data)
    } catch {
      toast.error('Gagal memuat data pegawai.')
    } finally {
      setLoading(false)
    }
  }, [search, page])

  useEffect(() => { fetchData() }, [fetchData])
  useEffect(() => { setPage(1) }, [search])

  const openAdd = () => { setForm(initialForm); setErrors({}); setModal({ open: true, type: 'add', item: null }) }
  const openEdit = (item) => {
    setForm({
      ...item,
      tanggal_lahir: item.tanggal_lahir ? item.tanggal_lahir.split('T')[0] : '',
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
        await api.post('/pegawai', form)
        toast.success('Data pegawai berhasil ditambahkan!')
      } else {
        await api.put(`/pegawai/${modal.item.id}`, form)
        toast.success('Data pegawai berhasil diperbarui!')
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
      await api.delete(`/pegawai/${id}`)
      toast.success('Data pegawai berhasil dihapus!')
      setDeleteId(null)
      fetchData()
    } catch { toast.error('Gagal menghapus data pegawai.') }
  }

  const f = (key, val) => setForm((p) => ({ ...p, [key]: val }))

  return (
    <div className="space-y-4">
      <div className="card">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
          <div>
            <h2 className="text-white font-semibold text-base">Data Pegawai</h2>
            <p className="text-muted text-xs mt-0.5">Kelola data seluruh pegawai</p>
          </div>
          {isAdmin() && (
            <button onClick={openAdd} className="btn-primary">
              <Plus size={16} /> Tambah Pegawai
            </button>
          )}
        </div>

        {/* Search */}
        <div className="relative mb-4 max-w-xs">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
          <input type="text" className="form-input pl-9 py-2 text-xs" placeholder="Cari NIP, nama, email..."
            value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>

        {/* Table */}
        <div className="table-container">
          {loading ? <LoadingSpinner /> : data.length === 0 ? (
            <div className="py-12 text-center text-muted text-sm">Tidak ada data pegawai.</div>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>#</th><th>NIP</th><th>Nama Lengkap</th><th>Jabatan</th>
                  <th>Email</th><th>No. HP</th><th>Jenis Kelamin</th>
                  {isAdmin() && <th>Aksi</th>}
                </tr>
              </thead>
              <tbody>
                {data.map((item, idx) => (
                  <tr key={item.id}>
                    <td className="text-muted text-xs">{(meta?.from || 1) + idx}</td>
                    <td className="font-mono text-xs text-primary-400">{item.nip}</td>
                    <td className="font-medium text-white">{item.nama_lengkap}</td>
                    <td>
                      {item.jabatan_aktif?.jabatan
                        ? <span className="badge badge-primary">{item.jabatan_aktif.jabatan.nama_jabatan}</span>
                        : <span className="text-muted text-xs">-</span>}
                    </td>
                    <td className="text-xs">{item.email || '-'}</td>
                    <td className="text-xs">{item.no_hp || '-'}</td>
                    <td>
                      <span className={`badge ${item.jenis_kelamin === 'L' ? 'badge-primary' : 'badge-warning'}`}>
                        {item.jenis_kelamin === 'L' ? 'Laki-laki' : item.jenis_kelamin === 'P' ? 'Perempuan' : '-'}
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
        title={modal.type === 'add' ? 'Tambah Data Pegawai' : 'Edit Data Pegawai'} size="xl">
        <form onSubmit={handleSubmit}>
          <div className="modal-body space-y-5">
            {/* Data Pokok */}
            <div>
              <h4 className="text-primary-400 text-xs font-semibold uppercase tracking-wider mb-3">Data Pokok</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="form-label">NIP *</label>
                  <input className="form-input" value={form.nip} onChange={(e) => f('nip', e.target.value)} required />
                  {errors.nip && <p className="form-error">{errors.nip[0]}</p>}
                </div>
                <div>
                  <label className="form-label">Nama Lengkap *</label>
                  <input className="form-input" value={form.nama_lengkap} onChange={(e) => f('nama_lengkap', e.target.value)} required />
                  {errors.nama_lengkap && <p className="form-error">{errors.nama_lengkap[0]}</p>}
                </div>
                <div>
                  <label className="form-label">Email</label>
                  <input type="email" className="form-input" value={form.email} onChange={(e) => f('email', e.target.value)} />
                </div>
                <div>
                  <label className="form-label">No. HP</label>
                  <input className="form-input" value={form.no_hp} onChange={(e) => f('no_hp', e.target.value)} />
                </div>
                <div>
                  <label className="form-label">Tanggal Lahir</label>
                  <input type="date" className="form-input" value={form.tanggal_lahir} onChange={(e) => f('tanggal_lahir', e.target.value)} />
                </div>
                <div>
                  <label className="form-label">Jenis Kelamin</label>
                  <select className="form-select" value={form.jenis_kelamin} onChange={(e) => f('jenis_kelamin', e.target.value)}>
                    <option value="">-- Pilih --</option>
                    <option value="L">Laki-laki</option>
                    <option value="P">Perempuan</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Alamat */}
            <div>
              <h4 className="text-primary-400 text-xs font-semibold uppercase tracking-wider mb-3">Alamat</h4>
              <div className="grid grid-cols-1 gap-3">
                <div>
                  <label className="form-label">Nama Jalan</label>
                  <input className="form-input" value={form.nama_jalan} onChange={(e) => f('nama_jalan', e.target.value)} placeholder="Jl. Contoh No. 1" />
                </div>
                <div className="grid grid-cols-4 gap-3">
                  <div>
                    <label className="form-label">RT</label>
                    <input className="form-input" value={form.rt} onChange={(e) => f('rt', e.target.value)} placeholder="001" maxLength={5} />
                  </div>
                  <div>
                    <label className="form-label">RW</label>
                    <input className="form-input" value={form.rw} onChange={(e) => f('rw', e.target.value)} placeholder="002" maxLength={5} />
                  </div>
                  <div>
                    <label className="form-label">Kode Pos</label>
                    <input className="form-input" value={form.kode_pos} onChange={(e) => f('kode_pos', e.target.value)} placeholder="12345" maxLength={10} />
                  </div>
                  <div>
                    <label className="form-label">Kelurahan</label>
                    <input className="form-input" value={form.kelurahan} onChange={(e) => f('kelurahan', e.target.value)} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="form-label">Kota</label>
                    <input className="form-input" value={form.kota} onChange={(e) => f('kota', e.target.value)} />
                  </div>
                  <div>
                    <label className="form-label">Provinsi</label>
                    <input className="form-input" value={form.provinsi} onChange={(e) => f('provinsi', e.target.value)} />
                  </div>
                </div>
              </div>
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
          <p className="text-gray-300 text-sm">Apakah Anda yakin ingin menghapus data pegawai ini?</p>
        </div>
        <div className="modal-footer">
          <button onClick={() => setDeleteId(null)} className="btn-secondary">Batal</button>
          <button onClick={() => handleDelete(deleteId)} className="btn-danger">Ya, Hapus</button>
        </div>
      </Modal>
    </div>
  )
}
