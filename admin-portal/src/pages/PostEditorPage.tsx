import { useState, useEffect, useRef, useMemo } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import {
  ArrowLeft,
  Save,
  Send,
  Eye,
  Code,
  Upload,
  Sparkles,
  AlertCircle,
  Lightbulb,
  FileCode,
  Table,
  Bold,
  Italic,
  List,
  Copy,
  ExternalLink,
  Loader2,
} from 'lucide-react'
import { Button } from '../components/admin/ui/Button'
import { Badge } from '../components/admin/ui/Badge'
import { Tabs } from '../components/admin/ui/Tabs'
import { getPostById, upsertPost, uploadToCloudinary, uploadMedia } from '../lib/cms'
import type { Post } from '../types/admin'
import { useToast } from '../hooks/useToast'
import { copyToClipboard } from '../lib/utils'

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

function calculateReadTime(text: string): string {
  const words = text.replace(/<[^>]*>/g, ' ').trim().split(/\s+/).length
  const minutes = Math.max(1, Math.ceil(words / 200))
  return `${minutes} phút đọc`
}

const CATEGORY_OPTIONS = [
  { value: 'tu-van-giai-phap', label: 'Tư vấn & Tối ưu chi phí', icon: 'fa-lightbulb' },
  { value: 'ha-tang-bao-mat', label: 'Hạ tầng & Bảo mật', icon: 'fa-shield-halved' },
  { value: 'case-study', label: 'Case Study Thực tế', icon: 'fa-chart-line' },
  { value: 'chuyen-doi-so', label: 'Chuyển đổi số & Tự động hóa', icon: 'fa-robot' },
]

const SERVICE_OPTIONS = [
  {
    value: 'email-server',
    label: 'Email Server Doanh Nghiệp',
    ctaDesc: 'Gặp sự cố Email vào Spam? Đăng ký kiểm tra kỹ thuật & uy tín IP miễn phí.',
  },
  {
    value: 'web-development',
    label: 'Thiết Kế Website Chuẩn Chuyển Đổi',
    ctaDesc: 'Sở hữu Website riêng tiết kiệm 25% phí hoa hồng app mỗi tháng.',
  },
  {
    value: 'consulting-demo',
    label: 'Demo & Tư Vấn Giải Pháp (POC)',
    ctaDesc: 'Đặt lịch trao đổi 1-1 và dựng bản chạy thử POC trong 7 ngày.',
  },
  {
    value: 'hosting-domain',
    label: 'Cloud Hosting & Tên Miền',
    ctaDesc: 'Nâng cấp hạ tầng Cloud Server chịu tải cao và sao lưu tự động.',
  },
  {
    value: 'custom-software',
    label: 'Phát Triển Phần Mềm Doanh Nghiệp',
    ctaDesc: 'May đo phần mềm ERP/CRM giải quyết bài toán đặc thù vận hành.',
  },
]

export function PostEditorPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { showToast } = useToast()

  const isEdit = Boolean(id && id !== 'new')
  const [loading, setLoading] = useState(isEdit)
  const [saving, setSaving] = useState(false)
  const [langTab, setLangTab] = useState<'vi' | 'en'>('vi')
  const [editorMode, setEditorMode] = useState<'write' | 'preview'>('write')
  const [autoSlug, setAutoSlug] = useState(!isEdit)
  const [uploadingImage, setUploadingImage] = useState(false)

  const fileInputRef = useRef<HTMLInputElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Form State
  const [formData, setFormData] = useState<Partial<Post>>({
    title_vi: '',
    title_en: '',
    slug: '',
    excerpt_vi: '',
    excerpt_en: '',
    category: 'tu-van-giai-phap',
    thumbnail: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&h=675&q=80',
    thumbnail_alt: '',
    read_time_vi: '5 phút đọc',
    read_time_en: '5 min read',
    published_at: new Date().toISOString().split('T')[0],
    key_takeaways_vi: ['', '', ''],
    key_takeaways_en: ['', '', ''],
    content_vi: '',
    content_en: '',
    related_service: 'web-development',
    author_name: 'Nguyễn Phúc Toàn',
    author_role_vi: 'Sales Engineer & Solution Consultant',
    is_featured: false,
    status: 'published',
  })

  // Load existing post if in edit mode
  useEffect(() => {
    if (!isEdit || !id) return

    async function loadPost() {
      setLoading(true)
      const { data, error } = await getPostById(id!)
      if (error || !data) {
        showToast('Không tìm thấy bài viết: ' + (error || ''), 'error')
        navigate('/admin/posts')
      } else {
        setFormData({
          ...data,
          is_featured: data.is_featured ?? data.featured ?? false,
          key_takeaways_vi: Array.isArray(data.key_takeaways_vi) && data.key_takeaways_vi.length >= 3
            ? data.key_takeaways_vi
            : [data.key_takeaways_vi?.[0] || '', data.key_takeaways_vi?.[1] || '', data.key_takeaways_vi?.[2] || ''],
          key_takeaways_en: Array.isArray(data.key_takeaways_en) && data.key_takeaways_en.length >= 3
            ? data.key_takeaways_en
            : [data.key_takeaways_en?.[0] || '', data.key_takeaways_en?.[1] || '', data.key_takeaways_en?.[2] || ''],
        })
      }
      setLoading(false)
    }

    loadPost()
  }, [id, isEdit, navigate, showToast])

  // Handle title change & auto slug
  const handleTitleChange = (val: string) => {
    setFormData((prev) => {
      const next = { ...prev, title_vi: val }
      if (autoSlug) {
        next.slug = slugify(val)
      }
      return next
    })
  }

  // Handle Key Takeaways change
  const handleTakeawayChange = (index: number, val: string, lang: 'vi' | 'en') => {
    setFormData((prev) => {
      const field = lang === 'vi' ? 'key_takeaways_vi' : 'key_takeaways_en'
      const current = [...(prev[field] || ['', '', ''])]
      current[index] = val
      return { ...prev, [field]: current }
    })
  }

  // Markdown / HTML snippet insertion
  const insertSnippet = (snippet: string) => {
    const textarea = textareaRef.current
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const currentVal = (langTab === 'vi' ? formData.content_vi : formData.content_en) || ''

    const newVal = currentVal.substring(0, start) + snippet + currentVal.substring(end)
    const field = langTab === 'vi' ? 'content_vi' : 'content_en'

    setFormData((prev) => ({
      ...prev,
      [field]: newVal,
      read_time_vi: langTab === 'vi' ? calculateReadTime(newVal) : prev.read_time_vi,
    }))

    setTimeout(() => {
      textarea.focus()
      textarea.setSelectionRange(start + snippet.length, start + snippet.length)
    }, 10)
  }

  // Image Upload handler
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploadingImage(true)
    try {
      const { url: cloudUrl, error: cloudErr } = await uploadToCloudinary(file)
      if (cloudUrl) {
        setFormData((prev) => ({ ...prev, thumbnail: cloudUrl }))
        showToast('Tải ảnh đại diện lên Cloudinary thành công!', 'success')
      } else {
        const { url: supUrl, error: supErr } = await uploadMedia(file, 'posts')
        if (supUrl) {
          setFormData((prev) => ({ ...prev, thumbnail: supUrl }))
          showToast('Đã lưu ảnh vào Supabase Storage!', 'success')
        } else {
          showToast('Lỗi tải ảnh: ' + (cloudErr || supErr || ''), 'error')
        }
      }
    } catch {
      showToast('Không thể kết nối máy chủ lưu trữ ảnh', 'error')
    } finally {
      setUploadingImage(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  // Save handler
  const handleSave = async (overrideStatus?: 'draft' | 'published') => {
    if (!formData.title_vi?.trim()) {
      showToast('Vui lòng nhập Tiêu đề bài viết tiếng Việt (H1)', 'error')
      return
    }

    const currentSlug = formData.slug?.trim() || slugify(formData.title_vi)
    if (!currentSlug) {
      showToast('Vui lòng cung cấp URL slug hợp lệ', 'error')
      return
    }

    setSaving(true)

    const payload: Partial<Post> = {
      ...formData,
      slug: currentSlug,
      status: overrideStatus || formData.status || 'published',
      updated_at: new Date().toISOString(),
    }

    if (!isEdit && !payload.created_at) {
      payload.created_at = new Date().toISOString()
    }

    const { error } = await upsertPost(payload)
    setSaving(false)

    if (error) {
      showToast('Lỗi khi lưu bài viết: ' + error, 'error')
      return
    }

    const actionText = payload.status === 'published' ? 'xuất bản' : 'lưu nháp'
    showToast(`Đã ${actionText} bài viết thành công!`, 'success')

    // Navigate to posts list
    navigate('/admin/posts')
  }

  const selectedService = useMemo(() => {
    return SERVICE_OPTIONS.find((s) => s.value === formData.related_service)
  }, [formData.related_service])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 text-[#FA520F] animate-spin" />
        <span className="ml-3 text-sm text-[#6A6A6A]">Đang tải dữ liệu bài viết...</span>
      </div>
    )
  }

  return (
    <div className="space-y-5 pb-12">
      {/* Breadcrumb & Navigation */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <nav className="flex items-center gap-2 text-xs text-[#6A6A6A]">
          <Link to="/admin" className="hover:text-[#FA520F] transition-colors">Admin</Link>
          <span>/</span>
          <Link to="/admin/posts" className="hover:text-[#FA520F] transition-colors">Bài viết &amp; Tin tức</Link>
          <span>/</span>
          <span className="text-[#1F1F1F] font-medium">
            {isEdit ? 'Chỉnh sửa bài viết' : 'Tạo bài viết mới'}
          </span>
        </nav>

        {isEdit && formData.slug && (
          <a
            href={`/blog-detail.html?slug=${formData.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs text-[#4F46E5] hover:text-[#3730A3] font-medium"
          >
            <span>Xem trên website thực tế</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        )}
      </div>

      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-[#EDEDED] shadow-sm">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/admin/posts')}
            className="text-[#6A6A6A] hover:text-[#1F1F1F]"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Quay lại
          </Button>
          <div className="h-4 w-px bg-[#E5E7EB]" />
          <div>
            <h1 className="text-base font-bold text-[#1F1F1F]">
              {isEdit ? 'Chỉnh sửa bài viết' : 'Soạn thảo bài viết mới'}
            </h1>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-xs text-[#6A6A6A]">Trạng thái hiện tại:</span>
              <Badge variant={formData.status === 'published' ? 'default' : 'warning'}>
                {formData.status === 'published' ? 'Đã xuất bản' : 'Bản nháp'}
              </Badge>
              {formData.is_featured && (
                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                  <Sparkles className="w-2.5 h-2.5 text-amber-500" />
                  Ghim trang chủ
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => handleSave('draft')}
            loading={saving}
          >
            <Save className="w-3.5 h-3.5 mr-1.5" />
            Lưu nháp
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => handleSave('published')}
            loading={saving}
          >
            <Send className="w-3.5 h-3.5 mr-1.5" />
            {isEdit ? 'Cập nhật & Xuất bản' : 'Xuất bản bài viết'}
          </Button>
        </div>
      </div>

      {/* Main 2-Column Responsive Layout (70% Left - 30% Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* ── LEFT COLUMN (70%): Main Content ─────────────────────────────── */}
        <div className="lg:col-span-8 space-y-5">
          
          {/* Language Switcher Tabs */}
          <div className="bg-white rounded-xl border border-[#EDEDED] p-4 shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-[#6A6A6A] uppercase tracking-wider">Ngôn ngữ soạn thảo:</span>
              <Tabs
                tabs={[
                  { id: 'vi', label: '🇻🇳 Tiếng Việt (Chính)' },
                  { id: 'en', label: '🇬🇧 Tiếng Anh (Tùy chọn)' },
                ]}
                activeTab={langTab}
                onChange={(id) => setLangTab(id as 'vi' | 'en')}
                variant="pill"
              />
            </div>
            <span className="text-xs text-[#A8A8A8] hidden sm:inline">
              Đồng bộ song ngữ VI | EN ngoài frontend
            </span>
          </div>

          {/* Title & Excerpt */}
          <div className="bg-white rounded-xl border border-[#EDEDED] p-5 shadow-sm space-y-4">
            <div>
              <label className="text-xs font-bold text-[#4A4A4A] block mb-1.5">
                TIÊU ĐỀ BÀI VIẾT (H1) <span className="text-red-500">*</span>
              </label>
              {langTab === 'vi' ? (
                <input
                  type="text"
                  value={formData.title_vi || ''}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="VD: Tại sao Email công ty hay rơi vào hòm thư Spam? Hướng dẫn cấu hình SPF, DKIM..."
                  className="w-full text-lg sm:text-xl font-bold px-4 py-3 border border-[#EDEDED] rounded-xl outline-none focus:border-[#FA520F] transition-colors"
                />
              ) : (
                <input
                  type="text"
                  value={formData.title_en || ''}
                  onChange={(e) => setFormData({ ...formData, title_en: e.target.value })}
                  placeholder="e.g. Why Corporate Emails Land in Spam: Complete Guide to Configuring SPF, DKIM..."
                  className="w-full text-lg sm:text-xl font-bold px-4 py-3 border border-[#EDEDED] rounded-xl outline-none focus:border-[#FA520F] transition-colors"
                />
              )}
            </div>

            <div>
              <label className="text-xs font-bold text-[#4A4A4A] block mb-1.5">
                MÔ TẢ NGẮN (EXCERPT - 2 ĐẾN 3 DÒNG)
              </label>
              {langTab === 'vi' ? (
                <textarea
                  rows={3}
                  value={formData.excerpt_vi || ''}
                  onChange={(e) => setFormData({ ...formData, excerpt_vi: e.target.value })}
                  placeholder="Tóm tắt ngắn gọn vấn đề thực tế và giá trị bài viết đem lại (hiển thị trên thẻ bài viết và meta SEO)..."
                  className="w-full text-sm px-4 py-2.5 border border-[#EDEDED] rounded-xl outline-none focus:border-[#FA520F] transition-colors"
                />
              ) : (
                <textarea
                  rows={3}
                  value={formData.excerpt_en || ''}
                  onChange={(e) => setFormData({ ...formData, excerpt_en: e.target.value })}
                  placeholder="Concise 2-3 sentence overview for social snippets and meta description..."
                  className="w-full text-sm px-4 py-2.5 border border-[#EDEDED] rounded-xl outline-none focus:border-[#FA520F] transition-colors"
                />
              )}
            </div>
          </div>

          {/* Key Takeaways Box (Điểm cốt lõi cho Lãnh đạo) */}
          <div className="bg-gradient-to-br from-indigo-50/70 to-blue-50/70 rounded-xl border border-indigo-100 p-5 shadow-sm space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-indigo-600 text-white flex items-center justify-center">
                <Sparkles className="w-3.5 h-3.5" />
              </div>
              <h3 className="text-sm font-bold text-indigo-950">
                TÓM TẮT NHANH (KEY TAKEAWAYS - 3 GẠCH ĐẦU DÒNG)
              </h3>
            </div>
            <p className="text-xs text-indigo-800/80">
              Khung giá trị cốt lõi ghim ở đầu bài viết giúp các giám đốc và chủ doanh nghiệp bận rộn nắm bắt ngay giải pháp.
            </p>

            <div className="space-y-2.5 pt-1">
              {[0, 1, 2].map((idx) => {
                const val = langTab === 'vi'
                  ? (formData.key_takeaways_vi?.[idx] || '')
                  : (formData.key_takeaways_en?.[idx] || '')

                return (
                  <div key={idx} className="flex items-center gap-2.5 bg-white/90 p-2 rounded-lg border border-indigo-100">
                    <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold flex items-center justify-center flex-shrink-0">
                      {idx + 1}
                    </span>
                    <input
                      type="text"
                      value={val}
                      onChange={(e) => handleTakeawayChange(idx, e.target.value, langTab)}
                      placeholder={
                        idx === 0
                          ? 'Ý chính 1 (Bối cảnh / Quy định kỹ thuật mới)...'
                          : idx === 1
                          ? 'Ý chính 2 (Cơ chế hoạt động / Bản chất giải pháp)...'
                          : 'Ý chính 3 (Hiệu quả kinh doanh & ROI cụ thể)...'
                      }
                      className="w-full text-sm bg-transparent outline-none text-[#1F1F1F]"
                    />
                  </div>
                )
              })}
            </div>
          </div>

          {/* Rich Content Editor with Write / Preview Tabs */}
          <div className="bg-white rounded-xl border border-[#EDEDED] overflow-hidden shadow-sm">
            {/* Editor Top Bar & Snippet Toolbar */}
            <div className="p-3 border-b border-[#EDEDED] bg-[#FAFAFA] flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setEditorMode('write')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors ${
                    editorMode === 'write'
                      ? 'bg-white text-[#FA520F] shadow-xs border border-[#E5E7EB]'
                      : 'text-[#6A6A6A] hover:bg-[#F0F0F0]'
                  }`}
                >
                  <Code className="w-3.5 h-3.5" />
                  Soạn thảo HTML / Text
                </button>
                <button
                  type="button"
                  onClick={() => setEditorMode('preview')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors ${
                    editorMode === 'preview'
                      ? 'bg-white text-[#4F46E5] shadow-xs border border-[#E5E7EB]'
                      : 'text-[#6A6A6A] hover:bg-[#F0F0F0]'
                  }`}
                >
                  <Eye className="w-3.5 h-3.5" />
                  Xem trước bài viết
                </button>
              </div>

              {/* Snippet Toolbar (visible in write mode) */}
              {editorMode === 'write' && (
                <div className="flex items-center gap-1 flex-wrap">
                  <button
                    type="button"
                    title="Tiêu đề H2 (Tự động vào Mục lục TOC)"
                    onClick={() => insertSnippet('\n<h2>Tiêu đề mục lớn H2</h2>\n<p>Nội dung chi tiết...</p>\n')}
                    className="p-1.5 rounded hover:bg-[#EAEAEA] text-[#4A4A4A] text-xs font-bold"
                  >
                    H2
                  </button>
                  <button
                    type="button"
                    title="Tiêu đề H3"
                    onClick={() => insertSnippet('\n<h3>Tiêu đề phụ H3</h3>\n<p>Nội dung chi tiết...</p>\n')}
                    className="p-1.5 rounded hover:bg-[#EAEAEA] text-[#4A4A4A] text-xs font-bold"
                  >
                    H3
                  </button>
                  <div className="h-4 w-px bg-[#E0E0E0] mx-0.5" />
                  <button
                    type="button"
                    title="In đậm"
                    onClick={() => insertSnippet('<strong>chữ in đậm</strong>')}
                    className="p-1.5 rounded hover:bg-[#EAEAEA] text-[#4A4A4A]"
                  >
                    <Bold className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    title="In nghiêng"
                    onClick={() => insertSnippet('<em>chữ in nghiêng</em>')}
                    className="p-1.5 rounded hover:bg-[#EAEAEA] text-[#4A4A4A]"
                  >
                    <Italic className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    title="Danh sách gạch đầu dòng"
                    onClick={() => insertSnippet('\n<ul>\n  <li>Ý 1</li>\n  <li>Ý 2</li>\n</ul>\n')}
                    className="p-1.5 rounded hover:bg-[#EAEAEA] text-[#4A4A4A]"
                  >
                    <List className="w-3.5 h-3.5" />
                  </button>
                  <div className="h-4 w-px bg-[#E0E0E0] mx-0.5" />
                  <button
                    type="button"
                    title="Hộp ghi chú Lời khuyên (Callout Tip)"
                    onClick={() => insertSnippet('\n<div class="callout callout-tip">\n  <div class="callout-icon"><i class="fa-solid fa-lightbulb"></i></div>\n  <div class="callout-body"><strong>Lời khuyên từ Sales Engineer:</strong> Nội dung tư vấn...</div>\n</div>\n')}
                    className="p-1.5 rounded hover:bg-emerald-100 text-emerald-700 text-xs font-medium flex items-center gap-1"
                  >
                    <Lightbulb className="w-3.5 h-3.5" /> Tip
                  </button>
                  <button
                    type="button"
                    title="Hộp ghi chú Cảnh báo (Callout Warning)"
                    onClick={() => insertSnippet('\n<div class="callout callout-warning">\n  <div class="callout-icon"><i class="fa-solid fa-triangle-exclamation"></i></div>\n  <div class="callout-body"><strong>Cảnh báo:</strong> Lưu ý kỹ thuật quan trọng...</div>\n</div>\n')}
                    className="p-1.5 rounded hover:bg-amber-100 text-amber-700 text-xs font-medium flex items-center gap-1"
                  >
                    <AlertCircle className="w-3.5 h-3.5" /> Warning
                  </button>
                  <button
                    type="button"
                    title="Khối Code"
                    onClick={() => insertSnippet('\n<pre><code>v=spf1 include:_spf.google.com ~all</code></pre>\n')}
                    className="p-1.5 rounded hover:bg-[#EAEAEA] text-[#4A4A4A]"
                  >
                    <FileCode className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    title="Bảng so sánh"
                    onClick={() => insertSnippet('\n<div class="table-responsive">\n  <table class="comparison-table">\n    <thead>\n      <tr><th>Tiêu chí</th><th>Phương án A</th><th>Phương án B</th></tr>\n    </thead>\n    <tbody>\n      <tr><td>Chi phí</td><td>Thấp</td><td>Tối ưu</td></tr>\n    </tbody>\n  </table>\n</div>\n')}
                    className="p-1.5 rounded hover:bg-[#EAEAEA] text-[#4A4A4A]"
                  >
                    <Table className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>

            {/* Editor Body */}
            {editorMode === 'write' ? (
              <div className="p-4">
                <textarea
                  ref={textareaRef}
                  rows={20}
                  value={(langTab === 'vi' ? formData.content_vi : formData.content_en) || ''}
                  onChange={(e) => {
                    const val = e.target.value
                    const field = langTab === 'vi' ? 'content_vi' : 'content_en'
                    setFormData((prev) => ({
                      ...prev,
                      [field]: val,
                      read_time_vi: langTab === 'vi' ? calculateReadTime(val) : prev.read_time_vi,
                    }))
                  }}
                  placeholder="<p class='lead'>Đoạn mở đầu ấn tượng đặt vấn đề...</p>&#10;&#10;<h2>1. Phân tích nguyên nhân kỹ thuật</h2>&#10;<p>Nội dung phân tích chi tiết...</p>"
                  className="w-full font-mono text-sm leading-relaxed p-4 border border-[#EDEDED] rounded-xl outline-none focus:border-[#FA520F] transition-colors bg-[#FCFCFD]"
                />
              </div>
            ) : (
              <div className="p-6 bg-[#FAFAFA] min-h-[400px]">
                <div className="bg-white p-6 sm:p-8 rounded-xl border border-[#EDEDED] max-w-3xl mx-auto shadow-xs">
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] mb-4">
                    {(langTab === 'vi' ? formData.title_vi : formData.title_en) || 'Tiêu đề xem trước'}
                  </h1>
                  <div
                    className="article-preview-body text-base leading-relaxed text-[#334155] space-y-4"
                    dangerouslySetInnerHTML={{
                      __html: (langTab === 'vi' ? formData.content_vi : formData.content_en) || '<p class="text-gray-400 italic">Chưa có nội dung soạn thảo...</p>',
                    }}
                  />
                </div>
              </div>
            )}
          </div>

        </div>

        {/* ── RIGHT COLUMN (30%): Sticky Configuration Panel ──────────────── */}
        <div className="lg:col-span-4 space-y-5 lg:sticky lg:top-4">
          
          {/* Card 1: Cấu hình Xuất bản */}
          <div className="bg-white rounded-xl border border-[#EDEDED] p-5 shadow-sm space-y-4">
            <h3 className="text-xs font-bold text-[#4A4A4A] uppercase tracking-wider border-b border-[#EDEDED] pb-2">
              CẤU HÌNH XUẤT BẢN
            </h3>

            {/* Status Select */}
            <div>
              <label className="text-xs font-semibold text-[#4A4A4A] block mb-1">Trạng thái bài viết</label>
              <select
                value={formData.status || 'published'}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                className="w-full text-sm border border-[#EDEDED] rounded-lg px-3 py-2 outline-none focus:border-[#FA520F] bg-white font-medium"
              >
                <option value="published">Đã xuất bản (Công khai)</option>
                <option value="draft">Bản nháp (Nội bộ)</option>
                <option value="archived">Lưu trữ</option>
              </select>
            </div>

            {/* Featured Checkbox */}
            <div className="flex items-start gap-2.5 p-3 rounded-lg bg-amber-50/60 border border-amber-200/80">
              <input
                type="checkbox"
                id="isFeaturedCheck"
                checked={Boolean(formData.is_featured)}
                onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                className="mt-0.5 rounded text-[#FA520F] focus:ring-[#FA520F]"
              />
              <label htmlFor="isFeaturedCheck" className="text-xs text-amber-950 font-medium cursor-pointer">
                <strong>Ghim lên trang chủ</strong>
                <span className="block text-[11px] text-amber-800 font-normal mt-0.5">
                  Ưu tiên hiển thị trong 3 bài viết nổi bật tại Landing Page chính.
                </span>
              </label>
            </div>

            {/* SEO Slug */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-[#4A4A4A]">Đường dẫn URL (Slug)</label>
                <button
                  type="button"
                  onClick={() => setAutoSlug(!autoSlug)}
                  className="text-[11px] text-[#FA520F] hover:underline"
                >
                  {autoSlug ? 'Tắt tự động sinh' : 'Bật tự động sinh'}
                </button>
              </div>
              <div className="relative">
                <input
                  type="text"
                  value={formData.slug || ''}
                  onChange={(e) => {
                    setAutoSlug(false)
                    setFormData({ ...formData, slug: e.target.value })
                  }}
                  placeholder="tai-sao-email-vao-spam"
                  className="w-full text-xs font-mono pl-3 pr-8 py-2 border border-[#EDEDED] rounded-lg outline-none focus:border-[#FA520F]"
                />
                <button
                  type="button"
                  onClick={async () => {
                    if (formData.slug) {
                      await copyToClipboard(formData.slug)
                      showToast('Đã sao chép slug!', 'success')
                    }
                  }}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#A8A8A8] hover:text-[#1F1F1F]"
                  title="Sao chép slug"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>
              </div>
              <p className="text-[11px] text-[#8A8A8A] mt-1 font-mono">
                /blog/{formData.slug || 'slug-bai-viet'}
              </p>
            </div>

            {/* Published Date */}
            <div>
              <label className="text-xs font-semibold text-[#4A4A4A] block mb-1">Ngày xuất bản</label>
              <input
                type="date"
                value={formData.published_at || new Date().toISOString().split('T')[0]}
                onChange={(e) => setFormData({ ...formData, published_at: e.target.value })}
                className="w-full text-xs border border-[#EDEDED] rounded-lg px-3 py-2 outline-none focus:border-[#FA520F]"
              />
            </div>

            {/* Estimated Read Time */}
            <div>
              <label className="text-xs font-semibold text-[#4A4A4A] block mb-1">Thời gian đọc ước tính</label>
              <input
                type="text"
                value={formData.read_time_vi || '5 phút đọc'}
                onChange={(e) => setFormData({ ...formData, read_time_vi: e.target.value })}
                className="w-full text-xs border border-[#EDEDED] rounded-lg px-3 py-2 outline-none focus:border-[#FA520F]"
                placeholder="VD: 6 phút đọc"
              />
            </div>
          </div>

          {/* Card 2: Phân loại & Chuyển đổi (Lead Generation) */}
          <div className="bg-white rounded-xl border border-[#EDEDED] p-5 shadow-sm space-y-4">
            <h3 className="text-xs font-bold text-[#4A4A4A] uppercase tracking-wider border-b border-[#EDEDED] pb-2">
              PHÂN LOẠI &amp; CHUYỂN ĐỔI (LEAD GEN)
            </h3>

            {/* Category Dropdown */}
            <div>
              <label className="text-xs font-semibold text-[#4A4A4A] block mb-1">
                Chuyên mục trụ cột <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.category || 'tu-van-giai-phap'}
                onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                className="w-full text-sm border border-[#EDEDED] rounded-lg px-3 py-2 outline-none focus:border-[#FA520F] bg-white"
              >
                {CATEGORY_OPTIONS.map((c) => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
            </div>

            {/* Related Service (Contextual CTA) */}
            <div>
              <label className="text-xs font-semibold text-[#4A4A4A] block mb-1">
                Dịch vụ liên kết (Contextual CTA) <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.related_service || 'web-development'}
                onChange={(e) => setFormData({ ...formData, related_service: e.target.value })}
                className="w-full text-sm border border-[#EDEDED] rounded-lg px-3 py-2 outline-none focus:border-[#FA520F] bg-white"
              >
                {SERVICE_OPTIONS.map((s) => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>
            </div>

            {/* Preview of Contextual CTA Box */}
            {selectedService && (
              <div className="p-3 rounded-lg bg-indigo-50 border border-indigo-100 text-xs text-indigo-900 space-y-1">
                <span className="font-bold block text-[11px] text-indigo-700 uppercase">
                  CTA TỰ ĐỘNG XUẤT HIỆN CUỐI BÀI:
                </span>
                <p className="line-clamp-2 italic">{selectedService.ctaDesc}</p>
              </div>
            )}
          </div>

          {/* Card 3: Ảnh đại diện (Thumbnail 16:9) */}
          <div className="bg-white rounded-xl border border-[#EDEDED] p-5 shadow-sm space-y-3">
            <h3 className="text-xs font-bold text-[#4A4A4A] uppercase tracking-wider border-b border-[#EDEDED] pb-2">
              ẢNH ĐẠI DIỆN (THUMBNAIL 16:9)
            </h3>

            {/* Preview */}
            <div className="w-full aspect-video rounded-lg overflow-hidden bg-[#EDEDED] border border-[#E0E0E0] relative group">
              {formData.thumbnail ? (
                <img
                  src={formData.thumbnail}
                  alt={formData.thumbnail_alt || formData.title_vi || 'Thumbnail'}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-xs text-[#A8A8A8]">
                  <span>Chưa có ảnh bìa</span>
                </div>
              )}
            </div>

            {/* Upload Button */}
            <div>
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
                className="w-full justify-center"
              >
                <Upload className="w-3.5 h-3.5 mr-1.5" />
                Tải ảnh lên (Cloudinary)
              </Button>
            </div>

            {/* Direct URL input */}
            <div>
              <label className="text-[11px] text-[#6A6A6A] block mb-1">Hoặc dán link ảnh trực tiếp:</label>
              <input
                type="text"
                value={formData.thumbnail || ''}
                onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
                placeholder="https://images.unsplash.com/..."
                className="w-full text-xs font-mono border border-[#EDEDED] rounded-lg px-2.5 py-1.5 outline-none focus:border-[#FA520F]"
              />
            </div>

            {/* Alt Text */}
            <div>
              <label className="text-[11px] text-[#6A6A6A] block mb-1">Thẻ Alt ảnh (Tối ưu SEO):</label>
              <input
                type="text"
                value={formData.thumbnail_alt || ''}
                onChange={(e) => setFormData({ ...formData, thumbnail_alt: e.target.value })}
                placeholder="Mô tả nội dung bức ảnh..."
                className="w-full text-xs border border-[#EDEDED] rounded-lg px-2.5 py-1.5 outline-none focus:border-[#FA520F]"
              />
            </div>
          </div>

        </div>

      </div>
    </div>
  )
}
