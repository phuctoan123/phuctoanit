import { useState, useEffect, useCallback, useRef } from 'react'
import { Plus, Pencil, Trash2, ExternalLink, Upload, BookOpen } from 'lucide-react'
import { Button } from '../ui/Button'
import { Input, Textarea } from '../ui/Input'
import { Modal, ConfirmDialog } from '../ui/Modal'
import { Badge } from '../ui/Badge'
import { Tabs } from '../ui/Tabs'
import { Skeleton } from '../ui/EmptyState'
import { getPosts, upsertPost, deletePost, uploadToCloudinary, uploadMedia } from '../../../lib/cms'
import type { Post } from '../../../types/admin'
import { useToast } from '../../../hooks/useToast'

const CATEGORY_OPTIONS = [
  { value: 'tu-van-giai-phap', label: 'Tư vấn & Tối ưu giải pháp' },
  { value: 'ha-tang-bao-mat', label: 'Hạ tầng & Bảo mật' },
  { value: 'case-study', label: 'Case Study Thực tế' },
  { value: 'chuyen-doi-so', label: 'Chuyển đổi số' },
]

const SERVICE_OPTIONS = [
  { value: 'email-server', label: 'Email Server Doanh Nghiệp' },
  { value: 'web-development', label: 'Thiết Kế Website Chuẩn Chuyển Đổi' },
  { value: 'consulting-demo', label: 'Demo & Tư Vấn Giải Pháp (POC)' },
  { value: 'hosting-domain', label: 'Cloud Hosting & Tên Miền' },
  { value: 'custom-software', label: 'Phát Triển Phần Mềm Riêng' },
]

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[đĐ]/g, 'd')
    .replace(/([^0-9a-z-\s])/g, '')
    .replace(/(\s+)/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function PostsManager() {
  const { showToast } = useToast()
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Modal form state
  const [modalOpen, setModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<Partial<Post> | null>(null)
  const [saving, setSaving] = useState(false)
  const [formLang, setFormLang] = useState<'vi' | 'en'>('vi')
  const [uploadingImage, setUploadingImage] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Delete dialog state
  const [deletingItem, setDeletingItem] = useState<Post | null>(null)
  const [deleting, setDeleting] = useState(false)

  // Fetch list
  const fetchList = useCallback(async () => {
    setLoading(true)
    setError(null)
    const { data, error: err } = await getPosts()
    if (err) {
      setError(err)
    } else {
      setPosts(data || [])
    }
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
      slug: '',
      category: 'tu-van-giai-phap',
      thumbnail: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&h=675&q=80',
      read_time_vi: '5 phút đọc',
      read_time_en: '5 min read',
      published_at: new Date().toISOString().split('T')[0],
      excerpt_vi: '',
      excerpt_en: '',
      content_vi: '',
      content_en: '',
      related_service: 'web-development',
      author_name: 'Nguyễn Phúc Toàn',
      author_role_vi: 'Sales Engineer & Solution Consultant',
      status: 'published',
      is_featured: true,
      key_takeaways_vi: ['', '', ''],
      key_takeaways_en: ['', '', ''],
    })
    setFormLang('vi')
    setModalOpen(true)
  }

  // Open modal for edit
  const handleOpenEdit = (item: Post) => {
    setEditingItem({
      ...item,
      key_takeaways_vi: Array.isArray(item.key_takeaways_vi) && item.key_takeaways_vi.length ? item.key_takeaways_vi : ['', '', ''],
      key_takeaways_en: Array.isArray(item.key_takeaways_en) && item.key_takeaways_en.length ? item.key_takeaways_en : ['', '', ''],
    })
    setFormLang('vi')
    setModalOpen(true)
  }

  // Handle Save
  const handleSave = async () => {
    if (!editingItem) return
    if (!editingItem.title_vi?.trim()) {
      showToast('Vui lòng nhập tiêu đề tiếng Việt', 'error')
      return
    }

    setSaving(true)
    const payload = {
      ...editingItem,
      slug: editingItem.slug || slugify(editingItem.title_vi || 'post'),
      updated_at: new Date().toISOString(),
    }

    const { error: err } = await upsertPost(payload)
    setSaving(false)

    if (err) {
      showToast('Lỗi khi lưu bài viết: ' + err, 'error')
      return
    }

    showToast('Đã lưu bài viết thành công!', 'success')
    setModalOpen(false)
    setEditingItem(null)
    fetchList()
  }

  // Handle Delete
  const handleDelete = async () => {
    if (!deletingItem) return
    setDeleting(true)
    const { success, error: err } = await deletePost(deletingItem.id)
    setDeleting(false)

    if (!success || err) {
      showToast('Lỗi khi xóa bài viết: ' + (err || ''), 'error')
      return
    }

    showToast('Đã xóa bài viết thành công!', 'info')
    setDeletingItem(null)
    fetchList()
  }

  // Image Upload handler
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploadingImage(true)
    try {
      const { url: cloudUrl, error: cloudErr } = await uploadToCloudinary(file)
      if (cloudUrl) {
        setEditingItem((prev) => prev ? { ...prev, thumbnail: cloudUrl } : prev)
        showToast('Tải ảnh lên Cloudinary thành công!', 'success')
      } else {
        const { url: supUrl, error: supErr } = await uploadMedia(file, 'posts')
        if (supUrl) {
          setEditingItem((prev) => prev ? { ...prev, thumbnail: supUrl } : prev)
          showToast('Đã lưu ảnh vào Supabase Storage!', 'success')
        } else {
          showToast('Lỗi tải ảnh: ' + (cloudErr || supErr || ''), 'error')
        }
      }
    } catch {
      showToast('Không thể kết nối dịch vụ lưu trữ', 'error')
    } finally {
      setUploadingImage(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  return (
    <div className="space-y-4">
      {/* Top action bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-[#EDEDED]">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-semibold text-[#1F1F1F]">Danh sách bài viết / Insights</h2>
            <Badge variant="muted">{posts.length} bài</Badge>
          </div>
          <p className="text-xs text-[#6A6A6A] mt-0.5">
            Quản lý các bài viết tư vấn giải pháp, kiến trúc công nghệ và case study thực chiến
          </p>
        </div>
        <Button variant="primary" size="sm" onClick={handleOpenCreate}>
          <Plus className="w-4 h-4 mr-1.5" />
          Thêm bài viết mới
        </Button>
      </div>

      {/* Loading state */}
      {loading && (
        <div className="space-y-3">
          <Skeleton className="h-16 w-full rounded-lg" />
          <Skeleton className="h-16 w-full rounded-lg" />
        </div>
      )}

      {/* Error state */}
      {!loading && error && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-800 flex items-center justify-between">
          <div>
            <p className="font-medium">Chưa có bảng Supabase posts hoặc đang dùng dữ liệu tĩnh.</p>
            <p className="text-xs text-amber-700 mt-0.5">Website công khai đang tải từ posts-data.js với 3 bài viết mẫu đầy đủ.</p>
          </div>
          <Button variant="secondary" size="sm" onClick={fetchList}>Thử lại</Button>
        </div>
      )}

      {/* Empty state */}
      {!loading && !error && posts.length === 0 && (
        <div className="text-center py-10 bg-[#FAFAFA] rounded-xl border border-dashed border-[#EDEDED] p-6">
          <BookOpen className="w-10 h-10 text-[#A8A8A8] mx-auto mb-2" />
          <h3 className="text-sm font-semibold text-[#1F1F1F]">Chưa có bài viết nào trên hệ thống</h3>
          <p className="text-xs text-[#6A6A6A] mt-1 mb-4">Bấm 'Thêm bài viết mới' để tạo bài viết đầu tiên cho chuyên mục Góc Tư Vấn &amp; Giải Pháp.</p>
          <Button variant="primary" size="sm" onClick={handleOpenCreate}>
            <Plus className="w-4 h-4 mr-1.5" />
            Thêm bài viết mới
          </Button>
        </div>
      )}

      {/* Posts List */}
      {!loading && posts.length > 0 && (
        <div className="divide-y divide-[#EDEDED] border border-[#EDEDED] rounded-xl overflow-hidden bg-white">
          {posts.map((post) => (
            <div key={post.id} className="p-4 flex flex-col md:flex-row items-start md:items-center gap-4 hover:bg-[#FAFAFA] transition-colors">
              <div className="w-24 h-16 rounded-lg overflow-hidden bg-[#EDEDED] flex-shrink-0 border border-[#E0E0E0]">
                {post.thumbnail ? (
                  <img src={post.thumbnail} alt={post.title_vi} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-xs text-[#A8A8A8]">Chưa có ảnh</div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant="muted">{post.category}</Badge>
                  <span className="text-xs text-[#A8A8A8]">{post.published_at}</span>
                  <Badge variant={post.status === 'published' ? 'default' : 'warning'}>
                    {post.status === 'published' ? 'Đã xuất bản' : 'Bản nháp'}
                  </Badge>
                </div>
                <h3 className="text-sm font-semibold text-[#1F1F1F] truncate">{post.title_vi}</h3>
                <p className="text-xs text-[#6A6A6A] line-clamp-1 mt-0.5">{post.excerpt_vi}</p>
              </div>
              <div className="flex items-center gap-2 self-end md:self-center">
                <a
                  href={`/blog-detail.html?slug=${post.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 text-[#6A6A6A] hover:text-[#FA520F] transition-colors rounded hover:bg-[#F0F0F0]"
                  title="Xem trên website"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
                <Button variant="ghost" size="sm" onClick={() => handleOpenEdit(post)}>
                  <Pencil className="w-3.5 h-3.5 mr-1" />
                  Sửa
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setDeletingItem(post)} className="text-red-600 hover:bg-red-50">
                  <Trash2 className="w-3.5 h-3.5 mr-1" />
                  Xóa
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Editor */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingItem?.id ? 'Chỉnh sửa bài viết' : 'Thêm bài viết mới'}
        description="Điền thông tin chuyên mục, nội dung chi tiết và cấu hình CTA liên kết dịch vụ"
        size="lg"
      >
        {editingItem && (
          <div className="space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-[#EDEDED]">
              <Tabs
                tabs={[
                  { id: 'vi', label: '🇻🇳 Tiếng Việt' },
                  { id: 'en', label: '🇬🇧 English' },
                ]}
                activeTab={formLang}
                onChange={(id) => setFormLang(id as 'vi' | 'en')}
                variant="pill"
              />
              <div className="flex items-center gap-2">
                <label className="text-xs text-[#6A6A6A]">Trạng thái:</label>
                <select
                  value={editingItem.status || 'published'}
                  onChange={(e) => setEditingItem({ ...editingItem, status: e.target.value as any })}
                  className="text-xs border border-[#EDEDED] rounded-lg px-2.5 py-1.5 outline-none focus:border-[#FA520F]"
                >
                  <option value="published">Xuất bản</option>
                  <option value="draft">Bản nháp</option>
                </select>
              </div>
            </div>

            {/* Language-dependent fields */}
            {formLang === 'vi' ? (
              <div className="space-y-3">
                <Input
                  label="Tiêu đề bài viết (VI)"
                  value={editingItem.title_vi || ''}
                  onChange={(e) => {
                    const title = e.target.value
                    setEditingItem((prev) => ({
                      ...prev,
                      title_vi: title,
                      slug: prev?.id ? prev.slug : slugify(title),
                    }))
                  }}
                  placeholder="VD: Tại sao Email công ty hay rơi vào hòm thư Spam?..."
                  required
                />
                <Textarea
                  label="Tóm tắt ngắn (Excerpt VI - 2-3 dòng)"
                  value={editingItem.excerpt_vi || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, excerpt_vi: e.target.value })}
                  placeholder="Mô tả tóm tắt giá trị bài viết..."
                  rows={2}
                />
                <Textarea
                  label="Nội dung chi tiết (HTML / Rich Text)"
                  value={editingItem.content_vi || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, content_vi: e.target.value })}
                  placeholder="<p>Nội dung bài viết...</p>"
                  rows={8}
                />
              </div>
            ) : (
              <div className="space-y-3">
                <Input
                  label="Article Title (EN)"
                  value={editingItem.title_en || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, title_en: e.target.value })}
                  placeholder="e.g. Why Corporate Emails Land in Spam: Complete Guide..."
                />
                <Textarea
                  label="Article Excerpt (EN - 2-3 sentences)"
                  value={editingItem.excerpt_en || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, excerpt_en: e.target.value })}
                  placeholder="Short compelling summary..."
                  rows={2}
                />
                <Textarea
                  label="Full Content (HTML / Rich Text)"
                  value={editingItem.content_en || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, content_en: e.target.value })}
                  placeholder="<p>Full article body...</p>"
                  rows={8}
                />
              </div>
            )}

            {/* Shared Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-[#EDEDED]">
              <div>
                <label className="text-xs font-medium text-[#4A4A4A] block mb-1">Danh mục trụ cột</label>
                <select
                  value={editingItem.category || 'tu-van-giai-phap'}
                  onChange={(e) => setEditingItem({ ...editingItem, category: e.target.value as any })}
                  className="w-full text-sm border border-[#EDEDED] rounded-lg px-3 py-2 outline-none focus:border-[#FA520F]"
                >
                  {CATEGORY_OPTIONS.map((c) => (
                    <option key={c.value} value={c.value}>{c.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-medium text-[#4A4A4A] block mb-1">Dịch vụ liên kết (Contextual CTA)</label>
                <select
                  value={editingItem.related_service || 'web-development'}
                  onChange={(e) => setEditingItem({ ...editingItem, related_service: e.target.value })}
                  className="w-full text-sm border border-[#EDEDED] rounded-lg px-3 py-2 outline-none focus:border-[#FA520F]"
                >
                  {SERVICE_OPTIONS.map((s) => (
                    <option key={s.value} value={s.value}>{s.label}</option>
                  ))}
                </select>
              </div>

              <Input
                label="URL Slug (SEO Friendly)"
                value={editingItem.slug || ''}
                onChange={(e) => setEditingItem({ ...editingItem, slug: e.target.value })}
                placeholder="tai-sao-email-vao-spam"
              />

              <Input
                label="Thời gian đọc ước tính"
                value={editingItem.read_time_vi || '5 phút đọc'}
                onChange={(e) => setEditingItem({ ...editingItem, read_time_vi: e.target.value })}
                placeholder="VD: 6 phút đọc"
              />
            </div>

            {/* Thumbnail upload */}
            <div className="pt-2">
              <label className="text-xs font-medium text-[#4A4A4A] block mb-1">Ảnh bìa (Thumbnail 16:9)</label>
              <div className="flex items-center gap-3">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                  accept="image/*"
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  loading={uploadingImage}
                >
                  <Upload className="w-3.5 h-3.5 mr-1.5" />
                  Tải ảnh lên (Cloudinary)
                </Button>
                <span className="text-xs text-[#A8A8A8] truncate flex-1">{editingItem.thumbnail}</span>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex justify-end gap-2 pt-4 border-t border-[#EDEDED]">
              <Button variant="secondary" onClick={() => setModalOpen(false)}>Hủy</Button>
              <Button variant="primary" onClick={handleSave} loading={saving}>Lưu bài viết</Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        open={!!deletingItem}
        onClose={() => setDeletingItem(null)}
        onConfirm={handleDelete}
        title="Xóa bài viết?"
        description={`Bạn có chắc chắn muốn xóa bài viết "${deletingItem?.title_vi}"? Hành động này không thể hoàn tác.`}
        confirmLabel="Xác nhận xóa"
        variant="danger"
        loading={deleting}
      />
    </div>
  )
}
