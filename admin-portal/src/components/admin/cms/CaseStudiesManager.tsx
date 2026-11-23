import { useState, useEffect, useCallback, useRef } from 'react'
import { Plus, Pencil, Trash2, ExternalLink, Eye, EyeOff, FolderOpen, Upload, ImageIcon, X, Loader2 } from 'lucide-react'
import { Button } from '../ui/Button'
import { Input, Textarea } from '../ui/Input'
import { Modal, ConfirmDialog } from '../ui/Modal'
import { Badge } from '../ui/Badge'
import { Tabs } from '../ui/Tabs'
import { EmptyState, Skeleton } from '../ui/EmptyState'
import { getCaseStudies, upsertCaseStudy, deleteCaseStudy, uploadToCloudinary, uploadMedia } from '../../../lib/cms'
import type { CaseStudy } from '../../../types/admin'
import { useToast } from '../../../hooks/useToast'

export function CaseStudiesManager() {
  const { showToast } = useToast()
  const [studies, setStudies] = useState<CaseStudy[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Modal form state
  const [modalOpen, setModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<Partial<CaseStudy> | null>(null)
  const [saving, setSaving] = useState(false)
  const [formLang, setFormLang] = useState<'vi' | 'en'>('vi')
  const [uploadingImage, setUploadingImage] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Delete dialog state
  const [deletingItem, setDeletingItem] = useState<CaseStudy | null>(null)
  const [deleting, setDeleting] = useState(false)

  // Fetch list
  const fetchList = useCallback(async () => {
    setLoading(true)
    setError(null)
    const { data, error: err } = await getCaseStudies()
    if (err) setError(err)
    else setStudies(data || [])
    setLoading(false)
  }, [])

  useEffect(() => {
    fetchList()
  }, [fetchList])

  // Open modal for create
  const handleOpenCreate = () => {
    setEditingItem({
      title_vi: '',
      title_en: '',
      industry_vi: '',
      industry_en: '',
      demo_url: '',
      image_url: '',
      problem_vi: '',
      problem_en: '',
      solution_vi: '',
      solution_en: '',
      result_vi: '',
      result_en: '',
      sort_order: studies.length + 1,
      is_active: true,
    })
    setFormLang('vi')
    setModalOpen(true)
  }

  // Open modal for edit
  const handleOpenEdit = (item: CaseStudy) => {
    setEditingItem({ ...item })
    setFormLang('vi')
    setModalOpen(true)
  }

  // Handle image upload from file picker
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      showToast('Vui lòng chọn file hình ảnh (JPG, PNG, WebP...)', 'error')
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      showToast('Dung lượng ảnh tối đa là 5MB', 'error')
      return
    }

    setUploadingImage(true)
    // Ưu tiên tải lên Cloudinary với Signed Upload
    let { url, error: err } = await uploadToCloudinary(file, 'phuctoanit/case-studies')
    if (err) {
      console.warn('Cloudinary upload error, attempting fallback to Supabase Storage:', err)
      const fallback = await uploadMedia(file, 'case-studies')
      if (fallback.url) {
        url = fallback.url
        err = null
      }
    }
    setUploadingImage(false)

    if (err) {
      showToast('Không thể upload ảnh: ' + err, 'error')
    } else if (url) {
      setEditingItem((prev) => (prev ? { ...prev, image_url: url } : null))
      showToast('Tải ảnh dự án lên Cloudinary thành công!', 'success')
    }

    // Reset file input value so same file can be re-selected if needed
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  // Remove current image
  const handleRemoveImage = () => {
    setEditingItem((prev) => (prev ? { ...prev, image_url: '' } : null))
  }

  // Save (create or update)
  const handleSave = async () => {
    if (!editingItem) return
    if (!editingItem.industry_vi && !editingItem.title_vi) {
      showToast('Vui lòng nhập tên hoặc ngành nghề của dự án.', 'error')
      return
    }

    setSaving(true)
    const payload: Partial<CaseStudy> = {
      ...editingItem,
      industry_vi: editingItem.industry_vi || editingItem.title_vi || 'Dự án',
      industry_en: editingItem.industry_en || editingItem.title_en || 'Project',
      sort_order: Number(editingItem.sort_order) || 0,
      is_active: editingItem.is_active ?? true,
    }

    const { error: err } = await upsertCaseStudy(payload)
    setSaving(false)

    if (err) {
      showToast('Lỗi khi lưu dự án: ' + err, 'error')
      return
    }

    showToast(editingItem.id ? 'Cập nhật dự án thành công!' : 'Thêm dự án mới thành công!', 'success')
    setModalOpen(false)
    setEditingItem(null)
    fetchList()
  }

  // Toggle active status
  const handleToggleActive = async (item: CaseStudy) => {
    const { error: err } = await upsertCaseStudy({ id: item.id, is_active: !item.is_active })
    if (err) {
      showToast('Lỗi khi đổi trạng thái: ' + err, 'error')
    } else {
      showToast(`Đã ${!item.is_active ? 'hiển thị' : 'tạm ẩn'} dự án!`, 'success')
      fetchList()
    }
  }

  // Delete
  const handleConfirmDelete = async () => {
    if (!deletingItem) return
    setDeleting(true)
    const { success, error: err } = await deleteCaseStudy(deletingItem.id)
    setDeleting(false)

    if (!success) {
      showToast('Lỗi khi xóa dự án: ' + err, 'error')
    } else {
      showToast('Đã xóa dự án thành công!', 'success')
      setDeletingItem(null)
      fetchList()
    }
  }

  return (
    <div className="space-y-4">
      {/* Top action bar */}
      <div className="flex items-center justify-between gap-4 flex-wrap pb-3 border-b border-[#EDEDED]">
        <div>
          <div className="text-sm font-semibold text-[#1F1F1F]">Danh sách dự án ({studies.length})</div>
          <div className="text-xs text-[#6A6A6A]">Quản lý các case study giải pháp B2B hiển thị trên trang chủ</div>
        </div>
        <Button variant="primary" size="sm" icon={<Plus size={14} />} onClick={handleOpenCreate}>
          Thêm dự án mới
        </Button>
      </div>

      {/* Error state */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700 flex items-center justify-between">
          <span>Lỗi tải danh sách dự án: {error}</span>
          <Button size="sm" variant="secondary" onClick={fetchList}>Thử lại</Button>
        </div>
      )}

      {/* Loading state */}
      {loading && (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-28 rounded-xl" />
          ))}
        </div>
      )}

      {/* Empty state */}
      {!loading && !error && studies.length === 0 && (
        <EmptyState
          icon={<FolderOpen size={32} className="text-[#A8A8A8]" />}
          title="Chưa có dự án nào"
          description="Bấm 'Thêm dự án mới' để tạo case study đầu tiên cho website của bạn."
          action={
            <Button variant="primary" size="sm" icon={<Plus size={14} />} onClick={handleOpenCreate}>
              Thêm dự án đầu tiên
            </Button>
          }
        />
      )}

      {/* Studies List */}
      {!loading && !error && studies.length > 0 && (
        <div className="space-y-3">
          {studies.map((item) => {
            const displayTitle = item.title_vi || item.industry_vi || 'Dự án chưa đặt tên'
            return (
              <div
                key={item.id}
                className={`bg-white rounded-xl border p-4 transition-all hover:shadow-sm ${
                  item.is_active ? 'border-[#EDEDED]' : 'border-gray-200 bg-gray-50/50 opacity-75'
                }`}
              >
                <div className="flex items-start gap-4">
                  {/* Thumbnail Preview */}
                  <div className="w-24 h-18 rounded-lg overflow-hidden bg-gray-100 border border-[#EDEDED] flex-shrink-0 flex items-center justify-center relative">
                    {item.image_url ? (
                      <img
                        src={item.image_url}
                        alt={displayTitle}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          ;(e.target as HTMLElement).style.display = 'none'
                        }}
                      />
                    ) : (
                      <ImageIcon size={22} className="text-gray-400" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <Badge variant="default">{item.industry_vi}</Badge>
                      {item.is_active ? (
                        <Badge variant="success">Đang hiển thị</Badge>
                      ) : (
                        <Badge variant="muted">Tạm ẩn</Badge>
                      )}
                      <span className="text-xs text-[#A8A8A8]">Thứ tự: {item.sort_order}</span>
                    </div>

                    <h3 className="text-sm font-semibold text-[#1F1F1F] mb-1">{displayTitle}</h3>

                    {item.problem_vi && (
                      <p className="text-xs text-[#6A6A6A] line-clamp-1 mb-1">
                        <strong>Bài toán:</strong> {item.problem_vi}
                      </p>
                    )}

                    {item.result_vi && (
                      <p className="text-xs text-green-700 line-clamp-1 mb-1">
                        <strong>Hiệu quả:</strong> {item.result_vi}
                      </p>
                    )}

                    {item.demo_url && (
                      <a
                        href={item.demo_url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-xs text-[#FA520F] hover:underline mt-1 font-medium"
                      >
                        <ExternalLink size={12} />
                        {item.demo_url}
                      </a>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <button
                      onClick={() => handleToggleActive(item)}
                      className="p-1.5 rounded-lg text-[#6A6A6A] hover:bg-[#F5F5F5] hover:text-[#1F1F1F] transition-colors"
                      title={item.is_active ? 'Tạm ẩn dự án' : 'Hiển thị dự án'}
                    >
                      {item.is_active ? <Eye size={15} /> : <EyeOff size={15} />}
                    </button>
                    <button
                      onClick={() => handleOpenEdit(item)}
                      className="p-1.5 rounded-lg text-[#6A6A6A] hover:bg-[#FFF0E8] hover:text-[#FA520F] transition-colors"
                      title="Chỉnh sửa dự án"
                    >
                      <Pencil size={15} />
                    </button>
                    <button
                      onClick={() => setDeletingItem(item)}
                      className="p-1.5 rounded-lg text-[#6A6A6A] hover:bg-red-50 hover:text-red-600 transition-colors"
                      title="Xóa dự án"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Edit/Create Modal */}
      {editingItem && (
        <Modal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          title={editingItem.id ? 'Chỉnh sửa dự án' : 'Thêm dự án mới'}
          description="Thông tin chi tiết về case study giải pháp kỹ thuật B2B"
          size="lg"
        >
          <div className="space-y-4 pt-1">
            <Tabs
              tabs={[{ id: 'vi', label: '🇻🇳 Tiếng Việt' }, { id: 'en', label: '🇬🇧 English' }]}
              activeTab={formLang}
              onChange={(id) => setFormLang(id as 'vi' | 'en')}
              variant="pill"
            />

            {/* Image Upload Section */}
            <div>
              <label className="block text-xs font-medium text-[#4A4A4A] mb-1.5">
                Hình ảnh minh họa dự án
              </label>

              {editingItem.image_url ? (
                <div className="relative rounded-xl border border-[#EDEDED] overflow-hidden bg-gray-50 flex items-center justify-between p-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={editingItem.image_url}
                      alt="Project Preview"
                      className="w-16 h-12 object-cover rounded-lg border border-gray-200"
                    />
                    <div className="text-xs text-[#6A6A6A] truncate max-w-xs">
                      <span className="font-medium text-[#1F1F1F] block">Ảnh đã chọn</span>
                      <span className="text-[11px] text-[#A8A8A8] truncate block">{editingItem.image_url}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploadingImage}
                    >
                      Đổi ảnh
                    </Button>
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="p-1.5 rounded-lg hover:bg-red-50 text-red-500 hover:text-red-600 transition-colors"
                      title="Xóa ảnh"
                    >
                      <X size={16} />
                    </button>
                  </div>
                </div>
              ) : (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed border-[#EDEDED] hover:border-[#FA520F]/50 rounded-xl p-5 text-center cursor-pointer transition-colors bg-gray-50/50 hover:bg-[#FFF0E8]/10 ${
                    uploadingImage ? 'pointer-events-none opacity-60' : ''
                  }`}
                >
                  {uploadingImage ? (
                    <div className="flex flex-col items-center justify-center gap-2 py-2">
                      <Loader2 size={24} className="text-[#FA520F] animate-spin" />
                      <span className="text-xs text-[#FA520F] font-medium">Đang tải và tối ưu ảnh trên Cloudinary...</span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center gap-1.5">
                      <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center text-[#FA520F]">
                        <Upload size={18} />
                      </div>
                      <div className="text-xs font-semibold text-[#1F1F1F]">
                        Bấm để chọn ảnh từ máy tính
                      </div>
                      <div className="text-[11px] text-[#A8A8A8]">
                        PNG, JPG, WebP tối đa 5MB (Lưu trữ và tối ưu tốc độ trên Cloudinary CDN)
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Hidden file input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />

              {/* Or manual URL input */}
              <div className="mt-2">
                <input
                  type="text"
                  placeholder="Hoặc dán URL ảnh trực tiếp (https://... hoặc assets/images/...)"
                  value={editingItem.image_url ?? ''}
                  onChange={(e) => setEditingItem((prev) => ({ ...prev, image_url: e.target.value }))}
                  className="w-full text-xs px-3 py-1.5 rounded-lg border border-[#EDEDED] text-[#4A4A4A] focus:border-[#FA520F] focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input
                label={`Tiêu đề dự án (${formLang.toUpperCase()}) *`}
                placeholder="VD: Nhíp Bạc – Website Đặt Lịch & Nhận Diện..."
                value={formLang === 'vi' ? editingItem.title_vi ?? '' : editingItem.title_en ?? ''}
                onChange={(e) =>
                  setEditingItem((prev) => ({
                    ...prev,
                    [formLang === 'vi' ? 'title_vi' : 'title_en']: e.target.value,
                  }))
                }
              />
              <Input
                label={`Ngành nghề / Phân loại (${formLang.toUpperCase()}) *`}
                placeholder="VD: Bán lẻ & F&B, Logistics..."
                value={formLang === 'vi' ? editingItem.industry_vi ?? '' : editingItem.industry_en ?? ''}
                onChange={(e) =>
                  setEditingItem((prev) => ({
                    ...prev,
                    [formLang === 'vi' ? 'industry_vi' : 'industry_en']: e.target.value,
                  }))
                }
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input
                label="Đường dẫn Demo thực tế (URL)"
                placeholder="https://domain.com"
                value={editingItem.demo_url ?? ''}
                onChange={(e) => setEditingItem((prev) => ({ ...prev, demo_url: e.target.value }))}
              />
              <Input
                label="Thứ tự hiển thị"
                type="number"
                placeholder="1, 2, 3..."
                value={editingItem.sort_order ?? 1}
                onChange={(e) => setEditingItem((prev) => ({ ...prev, sort_order: Number(e.target.value) }))}
              />
            </div>

            <Textarea
              label={`Bài toán / Thách thức khách hàng gặp phải (${formLang.toUpperCase()})`}
              placeholder="Khách hàng gặp khó khăn gì trong quản lý, vận hành hay doanh thu..."
              rows={3}
              value={formLang === 'vi' ? editingItem.problem_vi ?? '' : editingItem.problem_en ?? ''}
              onChange={(e) =>
                setEditingItem((prev) => ({
                  ...prev,
                  [formLang === 'vi' ? 'problem_vi' : 'problem_en']: e.target.value,
                }))
              }
            />

            <Textarea
              label={`Giải pháp kỹ thuật triển khai (${formLang.toUpperCase()})`}
              placeholder="Kiến trúc công nghệ, các tính năng chính đã xây dựng..."
              rows={3}
              value={formLang === 'vi' ? editingItem.solution_vi ?? '' : editingItem.solution_en ?? ''}
              onChange={(e) =>
                setEditingItem((prev) => ({
                  ...prev,
                  [formLang === 'vi' ? 'solution_vi' : 'solution_en']: e.target.value,
                }))
              }
            />

            <Textarea
              label={`Kết quả & Giá trị kinh doanh thực tế (${formLang.toUpperCase()})`}
              placeholder="VD: Tăng 25% tỷ lệ đặt hẹn, giảm 90% thất thoát kho..."
              rows={2}
              value={formLang === 'vi' ? editingItem.result_vi ?? '' : editingItem.result_en ?? ''}
              onChange={(e) =>
                setEditingItem((prev) => ({
                  ...prev,
                  [formLang === 'vi' ? 'result_vi' : 'result_en']: e.target.value,
                }))
              }
            />

            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="studyActive"
                checked={editingItem.is_active ?? true}
                onChange={(e) => setEditingItem((prev) => ({ ...prev, is_active: e.target.checked }))}
                className="w-4 h-4 text-[#FA520F] rounded border-[#EDEDED] focus:ring-[#FA520F]"
              />
              <label htmlFor="studyActive" className="text-xs font-medium text-[#1F1F1F]">
                Cho phép hiển thị công khai trên website
              </label>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#EDEDED]">
              <Button variant="secondary" onClick={() => setModalOpen(false)} disabled={saving || uploadingImage}>
                Huỷ
              </Button>
              <Button variant="primary" onClick={handleSave} loading={saving} disabled={uploadingImage}>
                Lưu dự án
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={Boolean(deletingItem)}
        onClose={() => setDeletingItem(null)}
        onConfirm={handleConfirmDelete}
        title="Xóa dự án này?"
        description={`Bạn có chắc chắn muốn xóa dự án "${deletingItem?.title_vi || deletingItem?.industry_vi}"? Thao tác này không thể hoàn tác.`}
        confirmLabel="Xóa dự án"
        cancelLabel="Giữ lại"
        variant="danger"
        loading={deleting}
      />
    </div>
  )
}
