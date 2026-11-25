import { useState, useEffect, useRef, useMemo } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import {
  ArrowLeft,
  Save,
  Send,
  Eye,
  Code,
  Columns,
  Upload,
  Sparkles,
  AlertCircle,
  Lightbulb,
  FileCode,
  Table,
  Bold,
  Italic,
  List,
  ListOrdered,
  Copy,
  ExternalLink,
  Loader2,
  Image as ImageIcon,
  BookTemplate,
  RotateCcw,
} from 'lucide-react'
import { Button } from '../components/admin/ui/Button'
import { Badge } from '../components/admin/ui/Badge'
import { Tabs } from '../components/admin/ui/Tabs'
import { Modal } from '../components/admin/ui/Modal'
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
  const words = text.replace(/<[^>]*>/g, ' ').trim().split(/\s+/).filter(Boolean).length
  const minutes = Math.max(1, Math.ceil(words / 200))
  return `${minutes} phút đọc`
}

function countWords(text: string): number {
  return text.replace(/<[^>]*>/g, ' ').trim().split(/\s+/).filter(Boolean).length
}

const CATEGORY_OPTIONS = [
  { value: 'tu-van-giai-phap', label: 'Tư vấn & Tối ưu chi phí' },
  { value: 'ha-tang-bao-mat', label: 'Hạ tầng & Bảo mật' },
  { value: 'case-study', label: 'Case Study Thực tế' },
  { value: 'chuyen-doi-so', label: 'Chuyển đổi số & Tự động hóa' },
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

// Article Templates
const TEMPLATES = [
  {
    id: 'solution-consulting',
    title: 'Dàn ý: Tư Vấn & Tối Ưu Giải Pháp (F&B / Retail / SaaS)',
    snippet: `<p class="lead">Đoạn mở đầu đặt vấn đề cấp bách: Nêu rõ nỗi đau lớn nhất của chủ doanh nghiệp hoặc bài toán chi phí đang bị lãng phí...</p>

<h2>1. Thực trạng & Phân tích bài toán chi phí thực tế</h2>
<p>Nêu số liệu cụ thể, ví dụ: mức phí hoa hồng trung gian, thời gian nhân viên bỏ ra để làm thủ công...</p>

<h2>2. So sánh các mô hình tiếp cận giải pháp</h2>
<div class="table-responsive">
  <table class="comparison-table">
    <thead>
      <tr>
        <th>Tiêu chí đánh giá</th>
        <th>Phương án truyền thống</th>
        <th>Giải pháp công nghệ đề xuất</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>Chi phí vận hành</strong></td>
        <td>Tốn kém chi phí hoa hồng theo từng tháng</td>
        <td>Đầu tư một lần, tối ưu chi phí dài hạn</td>
      </tr>
      <tr>
        <td><strong>Quyền sở hữu dữ liệu</strong></td>
        <td>Bị phụ thuộc vào bên thứ ba</td>
        <td>Doanh nghiệp nắm giữ 100% dữ liệu khách hàng</td>
      </tr>
    </tbody>
  </table>
</div>

<h2>3. Chiến lược triển khai 3 bước chuyển đổi</h2>
<ol class="step-list">
  <li><strong>Bước 1:</strong> Đánh giá hiện trạng và lựa chọn công nghệ phù hợp với ngân sách.</li>
  <li><strong>Bước 2:</strong> Triển khai bản mẫu thử nghiệm và đo lường tỷ lệ chuyển đổi.</li>
  <li><strong>Bước 3:</strong> Tối ưu hóa quy trình và mở rộng quy mô.</li>
</ol>

<div class="callout callout-tip">
  <div class="callout-icon"><i class="fa-solid fa-lightbulb"></i></div>
  <div class="callout-body">
    <strong>Lời khuyên từ Sales Engineer:</strong> Đừng vội vàng đầu tư hệ thống đồ sộ ngay từ đầu. Hãy bắt đầu từ tính năng mang lại doanh thu trực tiếp nhất!
  </div>
</div>`
  },
  {
    id: 'tech-guide',
    title: 'Dàn ý: Hướng Dẫn Kỹ Thuật & Cấu Hình (Mail / Hosting / DNS)',
    snippet: `<p class="lead">Mô tả sự cố kỹ thuật phổ biến mà khách hàng hay gặp phải và hậu quả nghiêm trọng nếu không khắc phục kịp thời...</p>

<h2>1. Nguyên nhân kỹ thuật cốt lõi</h2>
<p>Giải thích dễ hiểu về cơ chế hoạt động đằng sau sự cố mà các chủ doanh nghiệp không chuyên kỹ thuật cũng nắm được...</p>

<div class="callout callout-warning">
  <div class="callout-icon"><i class="fa-solid fa-triangle-exclamation"></i></div>
  <div class="callout-body">
    <strong>Lưu ý quan trọng:</strong> Cấu hình sai bản ghi có thể khiến toàn bộ email hoặc website ngừng hoạt động trong vòng 24 - 48 giờ!
  </div>
</div>

<h2>2. Hướng dẫn từng bước thiết lập bản ghi chuẩn xác</h2>
<p>Dán đoạn mã cấu hình mẫu hoặc lệnh cần thực hiện:</p>
<pre><code>v=spf1 include:_spf.google.com ~all</code></pre>

<h2>3. Checklist kiểm tra sau khi cấu hình</h2>
<ul>
  <li>Kiểm tra thời gian phân giải DNS (TTL).</li>
  <li>Gửi email thử nghiệm và kiểm tra điểm Spam trên Mail-Tester.</li>
  <li>Theo dõi nhật ký lỗi trong 24 giờ đầu tiên.</li>
</ul>`
  },
  {
    id: 'case-study',
    title: 'Dàn ý: Phân Tích Case Study Thực Chiến (7-Day POC / ERP)',
    snippet: `<p class="lead">Giới thiệu bài toán của một khách hàng doanh nghiệp thực tế: Quy mô, lĩnh vực hoạt động và rào cản lớn nhất trước khi tìm đến giải pháp...</p>

<h2>1. Thách thức lớn nhất trong vận hành</h2>
<p>Mô tả chi tiết những "nút thắt cổ chai" khiến ban giám đốc lo ngại về tính khả thi của phần mềm mới...</p>

<h2>2. Kiến trúc giải pháp & Lộ trình thực hiện</h2>
<div class="timeline-box">
  <div class="timeline-step">
    <div class="step-badge">Giai đoạn 1</div>
    <div class="step-content">
      <h4>Khảo sát & Dựng môi trường Sandbox thử nghiệm</h4>
      <p>Tiếp nhận mẫu dữ liệu thực tế và thiết lập luồng xử lý cốt lõi.</p>
    </div>
  </div>
  <div class="timeline-step">
    <div class="step-badge">Giai đoạn 2</div>
    <div class="step-content">
      <h4>Kiểm tra thực địa & Đào tạo người dùng</h4>
      <p>Cho phép đội ngũ nhân viên trực tiếp thao tác và ghi nhận phản hồi.</p>
    </div>
  </div>
</div>

<h2>3. Kết quả đo lường được (Measurable ROI)</h2>
<ul>
  <li>Tiết kiệm 80% thời gian xử lý thủ công mỗi ngày.</li>
  <li>Loại bỏ hoàn toàn sai sót thất thoát số liệu.</li>
  <li>Hoàn vốn đầu tư (ROI) chỉ sau 4 tháng vận hành.</li>
</ul>`
  }
]

export function PostEditorPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { showToast } = useToast()

  const isEdit = Boolean(id && id !== 'new')
  const [loading, setLoading] = useState(isEdit)
  const [saving, setSaving] = useState(false)
  const [langTab, setLangTab] = useState<'vi' | 'en'>('vi')

  // 3 Editor Modes: 'write' | 'split' | 'preview'
  const [editorMode, setEditorMode] = useState<'write' | 'split' | 'preview'>('split')
  const [autoSlug, setAutoSlug] = useState(!isEdit)
  const [uploadingImage, setUploadingImage] = useState(false)

  // In-content image modal
  const [imgModalOpen, setImgModalOpen] = useState(false)
  const [inContentImgUrl, setInContentImgUrl] = useState('')
  const [inContentImgCaption, setInContentImgCaption] = useState('')
  const [inContentImgAlt, setInContentImgAlt] = useState('')
  const [uploadingContentImg, setUploadingContentImg] = useState(false)

  // Template modal
  const [templateModalOpen, setTemplateModalOpen] = useState(false)

  // Local draft recovery state
  const [hasDraft, setHasDraft] = useState(false)

  const fileInputRef = useRef<HTMLInputElement>(null)
  const contentFileInputRef = useRef<HTMLInputElement>(null)
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
    if (!isEdit || !id) {
      // Check localStorage for unsaved draft
      const draft = localStorage.getItem('draft_post_new')
      if (draft) {
        try {
          const parsed = JSON.parse(draft)
          if (parsed && (parsed.title_vi || parsed.content_vi)) {
            setHasDraft(true)
          }
        } catch { }
      }
      return
    }

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

  // Periodic Auto-save to localStorage
  useEffect(() => {
    if (!formData.title_vi && !formData.content_vi) return
    const key = `draft_post_${id || 'new'}`
    const timer = setInterval(() => {
      try {
        localStorage.setItem(key, JSON.stringify({
          ...formData,
          _savedAt: new Date().toLocaleTimeString('vi-VN')
        }))
      } catch { }
    }, 12000)

    return () => clearInterval(timer)
  }, [formData, id])

  // Restore draft
  const handleRestoreDraft = () => {
    const key = `draft_post_${id || 'new'}`
    const draft = localStorage.getItem(key)
    if (draft) {
      try {
        const parsed = JSON.parse(draft)
        setFormData(parsed)
        setHasDraft(false)
        showToast('Đã khôi phục bản nháp tự động lưu!', 'success')
      } catch {
        showToast('Không thể giải mã bản nháp', 'error')
      }
    }
  }

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

  // Smart Selection Wrapper (B, I, H2, H3, Code, Quotes)
  const wrapSelection = (before: string, after: string = '', defaultText = 'văn bản') => {
    const textarea = textareaRef.current
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const content = (langTab === 'vi' ? formData.content_vi : formData.content_en) || ''
    const selectedText = content.substring(start, end)
    const textToInsert = selectedText || defaultText

    const replacement = before + textToInsert + after
    const newContent = content.substring(0, start) + replacement + content.substring(end)
    const field = langTab === 'vi' ? 'content_vi' : 'content_en'

    setFormData((prev) => ({
      ...prev,
      [field]: newContent,
      read_time_vi: langTab === 'vi' ? calculateReadTime(newContent) : prev.read_time_vi,
    }))

    setTimeout(() => {
      textarea.focus()
      const newCursorPos = start + before.length + textToInsert.length + after.length
      textarea.setSelectionRange(newCursorPos, newCursorPos)
    }, 15)
  }

  // Direct In-content image inserter
  const handleInsertContentImage = () => {
    if (!inContentImgUrl.trim()) {
      showToast('Vui lòng nhập đường dẫn ảnh hoặc tải ảnh lên', 'error')
      return
    }

    const captionHtml = inContentImgCaption.trim()
      ? `\n  <figcaption style="font-size: 13.5px; color: #64748B; text-align: center; margin-top: 8px; font-style: italic;">${inContentImgCaption.trim()}</figcaption>`
      : ''

    const figureHtml = `\n<figure style="margin: 28px 0; border-radius: 12px; overflow: hidden; background: #F8FAFC; border: 1px solid #E2E8F0; padding: 12px;">\n  <img src="${inContentImgUrl.trim()}" alt="${inContentImgAlt.trim() || 'Hình ảnh minh họa'}" style="width: 100%; border-radius: 8px; display: block;" />${captionHtml}\n</figure>\n`

    wrapSelection(figureHtml, '', '')
    setImgModalOpen(false)
    setInContentImgUrl('')
    setInContentImgCaption('')
    setInContentImgAlt('')
    showToast('Đã chèn hình ảnh vào bài viết!', 'success')
  }

  // Image Upload handler (for thumbnail)
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

  // In-content image upload handler
  const handleContentImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploadingContentImg(true)
    try {
      const { url: cloudUrl } = await uploadToCloudinary(file)
      if (cloudUrl) {
        setInContentImgUrl(cloudUrl)
        showToast('Tải ảnh lên thành công!', 'success')
      } else {
        const { url: supUrl } = await uploadMedia(file, 'posts')
        if (supUrl) {
          setInContentImgUrl(supUrl)
          showToast('Tải ảnh lên thành công!', 'success')
        }
      }
    } finally {
      setUploadingContentImg(false)
      if (contentFileInputRef.current) contentFileInputRef.current.value = ''
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

    // Strip legacy or non-column 'featured' attribute
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { featured: _legacyFeatured, ...cleanFormData } = formData as unknown as { featured?: boolean; [key: string]: unknown }

    const payload: Partial<Post> = {
      ...(cleanFormData as Partial<Post>),
      is_featured: Boolean(formData.is_featured ?? (formData as unknown as { featured?: boolean }).featured ?? false),
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

    // Clear local draft upon successful save
    localStorage.removeItem(`draft_post_${id || 'new'}`)
    const actionText = payload.status === 'published' ? 'xuất bản' : 'lưu nháp'
    showToast(`Đã ${actionText} bài viết thành công!`, 'success')

    navigate('/admin/posts')
  }

  // Current active content stats
  const activeContent = (langTab === 'vi' ? formData.content_vi : formData.content_en) || ''
  const wordsTotal = countWords(activeContent)

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
    <div className="space-y-5 pb-16">

      {/* Draft Recovery Notification */}
      {hasDraft && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-3.5 flex items-center justify-between gap-3 text-sm text-amber-900">
          <div className="flex items-center gap-2">
            <RotateCcw className="w-4 h-4 text-amber-600 flex-shrink-0" />
            <span>Phát hiện bản nháp chưa lưu từ phiên làm việc trước. Bạn có muốn khôi phục không?</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleRestoreDraft}
              className="px-3 py-1 bg-amber-600 text-white rounded-lg text-xs font-bold hover:bg-amber-700 transition-colors"
            >
              Khôi phục ngay
            </button>
            <button
              onClick={() => {
                localStorage.removeItem('draft_post_new')
                setHasDraft(false)
              }}
              className="px-2 py-1 text-xs text-amber-700 hover:text-amber-950"
            >
              Bỏ qua
            </button>
          </div>
        </div>
      )}

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
            <span>Mở trang bài viết trên website</span>
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
              <span className="text-xs text-[#6A6A6A]">Trạng thái:</span>
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

      {/* Main 2-Column Responsive Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

        {/* ── LEFT COLUMN (70%): Main Content ─────────────────────────────── */}
        <div className="lg:col-span-8 space-y-5">

          {/* Language Switcher Tabs */}
          <div className="bg-white rounded-xl border border-[#EDEDED] p-4 shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-[#6A6A6A] uppercase tracking-wider">Ngôn ngữ:</span>
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
            <button
              type="button"
              onClick={() => setTemplateModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-[#4F46E5] bg-indigo-50 hover:bg-indigo-100 transition-colors border border-indigo-200"
            >
              <BookTemplate className="w-3.5 h-3.5" />
              Chèn Dàn Ý Mẫu
            </button>
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
                  <div key={idx} className="flex items-center gap-2.5 bg-white/90 p-2.5 rounded-lg border border-indigo-100 shadow-2xs">
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

          {/* Interactive Rich Content Editor */}
          <div className="bg-white rounded-xl border border-[#EDEDED] overflow-hidden shadow-sm">
            {/* Editor Top Bar & Snippet Toolbar */}
            <div className="p-3 border-b border-[#EDEDED] bg-[#FAFAFA] flex flex-wrap items-center justify-between gap-3">

              {/* 3 Layout Switchers */}
              <div className="flex items-center gap-1 bg-[#EDEDED]/80 p-0.5 rounded-lg">
                <button
                  type="button"
                  onClick={() => setEditorMode('write')}
                  className={`px-2.5 py-1.5 rounded-md text-xs font-bold flex items-center gap-1.5 transition-colors ${editorMode === 'write'
                    ? 'bg-white text-[#FA520F] shadow-xs'
                    : 'text-[#6A6A6A] hover:text-[#1F1F1F]'
                    }`}
                  title="Chế độ tập trung soạn thảo"
                >
                  <Code className="w-3.5 h-3.5" />
                  Soạn thảo
                </button>
                <button
                  type="button"
                  onClick={() => setEditorMode('split')}
                  className={`px-2.5 py-1.5 rounded-md text-xs font-bold flex items-center gap-1.5 transition-colors ${editorMode === 'split'
                    ? 'bg-white text-[#4F46E5] shadow-xs'
                    : 'text-[#6A6A6A] hover:text-[#1F1F1F]'
                    }`}
                  title="Vừa gõ vừa xem trực tiếp kết quả song song"
                >
                  <Columns className="w-3.5 h-3.5" />
                  Song song (Live)
                </button>
                <button
                  type="button"
                  onClick={() => setEditorMode('preview')}
                  className={`px-2.5 py-1.5 rounded-md text-xs font-bold flex items-center gap-1.5 transition-colors ${editorMode === 'preview'
                    ? 'bg-white text-emerald-600 shadow-xs'
                    : 'text-[#6A6A6A] hover:text-[#1F1F1F]'
                    }`}
                  title="Xem trước giao diện hoàn chỉnh"
                >
                  <Eye className="w-3.5 h-3.5" />
                  Xem trước
                </button>
              </div>

              {/* Formatting Toolbar */}
              <div className="flex items-center gap-1 flex-wrap">
                <button
                  type="button"
                  title="Mở đầu ấn tượng (Lead Paragraph)"
                  onClick={() => wrapSelection('<p class="lead">', '</p>', 'Đoạn văn mở đầu nổi bật')}
                  className="px-2 py-1 rounded hover:bg-[#EAEAEA] text-[#4A4A4A] text-xs font-bold"
                >
                  Lead
                </button>
                <button
                  type="button"
                  title="Tiêu đề mục lớn H2 (Tự sinh vào Mục lục TOC)"
                  onClick={() => wrapSelection('\n<h2>', '</h2>\n', 'Tiêu đề mục lớn')}
                  className="px-2 py-1 rounded hover:bg-[#EAEAEA] text-[#4A4A4A] text-xs font-bold"
                >
                  H2
                </button>
                <button
                  type="button"
                  title="Tiêu đề phụ H3"
                  onClick={() => wrapSelection('\n<h3>', '</h3>\n', 'Tiêu đề phụ')}
                  className="px-2 py-1 rounded hover:bg-[#EAEAEA] text-[#4A4A4A] text-xs font-bold"
                >
                  H3
                </button>
                <div className="h-4 w-px bg-[#E0E0E0] mx-0.5" />
                <button
                  type="button"
                  title="In đậm văn bản đã chọn"
                  onClick={() => wrapSelection('<strong>', '</strong>', 'chữ in đậm')}
                  className="p-1.5 rounded hover:bg-[#EAEAEA] text-[#4A4A4A]"
                >
                  <Bold className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  title="In nghiêng văn bản đã chọn"
                  onClick={() => wrapSelection('<em>', '</em>', 'chữ in nghiêng')}
                  className="p-1.5 rounded hover:bg-[#EAEAEA] text-[#4A4A4A]"
                >
                  <Italic className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  title="Chèn danh sách chấm tròn"
                  onClick={() => wrapSelection('\n<ul>\n  <li>', '</li>\n  <li>Ý tiếp theo</li>\n</ul>\n', 'Ý thứ nhất')}
                  className="p-1.5 rounded hover:bg-[#EAEAEA] text-[#4A4A4A]"
                >
                  <List className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  title="Chèn danh sách đánh số bước (Step List)"
                  onClick={() => wrapSelection('\n<ol class="step-list">\n  <li><strong>Bước 1:</strong> ', '</li>\n  <li><strong>Bước 2:</strong> Thực hiện tiếp...</li>\n</ol>\n', 'Khởi tạo')}
                  className="p-1.5 rounded hover:bg-[#EAEAEA] text-[#4A4A4A]"
                >
                  <ListOrdered className="w-3.5 h-3.5" />
                </button>
                <div className="h-4 w-px bg-[#E0E0E0] mx-0.5" />
                <button
                  type="button"
                  title="Hộp ghi chú Lời khuyên (Tip)"
                  onClick={() => wrapSelection('\n<div class="callout callout-tip">\n  <div class="callout-icon"><i class="fa-solid fa-lightbulb"></i></div>\n  <div class="callout-body"><strong>Lời khuyên:</strong> ', '</div>\n</div>\n', 'Nội dung tư vấn thực tế')}
                  className="px-2 py-1 rounded bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-semibold flex items-center gap-1 border border-emerald-200"
                >
                  <Lightbulb className="w-3 h-3 text-emerald-600" /> Tip
                </button>
                <button
                  type="button"
                  title="Hộp ghi chú Cảnh báo (Warning)"
                  onClick={() => wrapSelection('\n<div class="callout callout-warning">\n  <div class="callout-icon"><i class="fa-solid fa-triangle-exclamation"></i></div>\n  <div class="callout-body"><strong>Cảnh báo:</strong> ', '</div>\n</div>\n', 'Lưu ý kỹ thuật quan trọng')}
                  className="px-2 py-1 rounded bg-amber-50 hover:bg-amber-100 text-amber-800 text-xs font-semibold flex items-center gap-1 border border-amber-200"
                >
                  <AlertCircle className="w-3 h-3 text-amber-600" /> Cảnh báo
                </button>
                <button
                  type="button"
                  title="Khối Code hoặc Cấu hình DNS"
                  onClick={() => wrapSelection('\n<pre><code>', '</code></pre>\n', 'v=spf1 include:_spf.google.com ~all')}
                  className="p-1.5 rounded hover:bg-[#EAEAEA] text-[#4A4A4A]"
                >
                  <FileCode className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  title="Bảng so sánh"
                  onClick={() => wrapSelection('\n<div class="table-responsive">\n  <table class="comparison-table">\n    <thead>\n      <tr><th>Tiêu chí</th><th>Tự làm</th><th>Thuê ngoài</th></tr>\n    </thead>\n    <tbody>\n      <tr><td>Chi phí</td><td>Thấp</td><td>Tối ưu</td></tr>\n    </tbody>\n  </table>\n</div>\n', '', '')}
                  className="p-1.5 rounded hover:bg-[#EAEAEA] text-[#4A4A4A]"
                >
                  <Table className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  title="Chèn ảnh minh họa vào nội dung bài viết"
                  onClick={() => setImgModalOpen(true)}
                  className="px-2 py-1 rounded bg-blue-50 hover:bg-blue-100 text-blue-800 text-xs font-semibold flex items-center gap-1 border border-blue-200"
                >
                  <ImageIcon className="w-3.5 h-3.5 text-blue-600" /> Chèn ảnh
                </button>
              </div>

            </div>

            {/* Editor Workspace */}
            {editorMode === 'split' ? (
              /* SPLIT VIEW: Left Editor & Right Live Preview */
              <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-[#EDEDED] min-h-[550px]">
                {/* Left: Input Textarea */}
                <div className="p-3 flex flex-col">
                  <textarea
                    ref={textareaRef}
                    rows={24}
                    value={activeContent}
                    onChange={(e) => {
                      const val = e.target.value
                      const field = langTab === 'vi' ? 'content_vi' : 'content_en'
                      setFormData((prev) => ({
                        ...prev,
                        [field]: val,
                        read_time_vi: langTab === 'vi' ? calculateReadTime(val) : prev.read_time_vi,
                      }))
                    }}
                    placeholder="Nhập nội dung bài viết..."
                    className="w-full flex-1 font-mono text-xs sm:text-sm leading-relaxed p-3.5 border border-[#EDEDED] rounded-xl outline-none focus:border-[#FA520F] transition-colors bg-[#FCFCFD] resize-y"
                  />
                  {/* Live Stats */}
                  <div className="mt-2 flex items-center justify-between text-xs text-[#6A6A6A] px-1">
                    <span>{wordsTotal} từ · {activeContent.length} ký tự</span>
                    <span className="font-medium text-[#4F46E5]">{calculateReadTime(activeContent)}</span>
                  </div>
                </div>

                {/* Right: Live Preview Panel */}
                <div className="p-5 bg-[#FAFAFA] overflow-y-auto max-h-[650px]">
                  <div className="text-[11px] font-bold text-[#A8A8A8] uppercase tracking-wider mb-3">
                    XEM TRƯỚC THỰC TẾ (REALTIME PREVIEW):
                  </div>
                  <div
                    className="bg-white p-5 rounded-xl border border-[#EDEDED] shadow-2xs space-y-4 text-sm text-[#334155] leading-relaxed"
                    dangerouslySetInnerHTML={{
                      __html: activeContent || '<p class="text-gray-400 italic">Nội dung xem trước sẽ hiển thị ở đây ngay khi bạn gõ...</p>',
                    }}
                  />
                </div>
              </div>
            ) : editorMode === 'write' ? (
              /* WRITE ONLY VIEW */
              <div className="p-4">
                <textarea
                  ref={textareaRef}
                  rows={22}
                  value={activeContent}
                  onChange={(e) => {
                    const val = e.target.value
                    const field = langTab === 'vi' ? 'content_vi' : 'content_en'
                    setFormData((prev) => ({
                      ...prev,
                      [field]: val,
                      read_time_vi: langTab === 'vi' ? calculateReadTime(val) : prev.read_time_vi,
                    }))
                  }}
                  placeholder="<p class='lead'>Đoạn mở đầu ấn tượng...</p>&#10;&#10;<h2>1. Phân tích nguyên nhân kỹ thuật</h2>"
                  className="w-full font-mono text-sm leading-relaxed p-4 border border-[#EDEDED] rounded-xl outline-none focus:border-[#FA520F] transition-colors bg-[#FCFCFD]"
                />
                <div className="mt-2 flex items-center justify-between text-xs text-[#6A6A6A] px-1">
                  <span>{wordsTotal} từ · {activeContent.length} ký tự</span>
                  <span className="font-medium text-[#4F46E5]">{calculateReadTime(activeContent)}</span>
                </div>
              </div>
            ) : (
              /* FULL PREVIEW VIEW */
              <div className="p-6 bg-[#FAFAFA] min-h-[450px]">
                <div className="bg-white p-6 sm:p-8 rounded-xl border border-[#EDEDED] max-w-3xl mx-auto shadow-xs">
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] mb-4">
                    {(langTab === 'vi' ? formData.title_vi : formData.title_en) || 'Tiêu đề xem trước'}
                  </h1>
                  <div
                    className="text-base leading-relaxed text-[#334155] space-y-4"
                    dangerouslySetInnerHTML={{
                      __html: activeContent || '<p class="text-gray-400 italic">Chưa có nội dung soạn thảo...</p>',
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
            <h3 className="text-xs font-bold text-[#4A4A4A] uppercase tracking-wider border-b border-[#EDEDED] pb-2 flex items-center justify-between">
              <span>CẤU HÌNH XUẤT BẢN</span>
              <span className="text-[10px] text-[#A8A8A8] font-normal">Tự động lưu nháp</span>
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
                  {autoSlug ? 'Tắt tự sinh' : 'Bật tự sinh'}
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

      {/* ── Modal: Chèn Ảnh Vào Thân Bài Viết ────────────────────────────── */}
      <Modal
        open={imgModalOpen}
        onClose={() => setImgModalOpen(false)}
        title="Chèn ảnh minh họa vào bài viết"
        description="Tải ảnh lên Cloudinary hoặc dán link ảnh để chèn vào vị trí con trỏ chuột"
        size="md"
      >
        <div className="space-y-4">
          <div>
            <label className="text-xs font-bold text-[#4A4A4A] block mb-1.5">Tải ảnh từ máy tính (Cloudinary)</label>
            <input
              type="file"
              ref={contentFileInputRef}
              onChange={handleContentImageUpload}
              accept="image/*"
              className="hidden"
            />
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => contentFileInputRef.current?.click()}
              loading={uploadingContentImg}
            >
              <Upload className="w-3.5 h-3.5 mr-1.5" />
              Chọn file từ máy tính
            </Button>
          </div>

          <div>
            <label className="text-xs font-bold text-[#4A4A4A] block mb-1.5">Hoặc Đường dẫn ảnh (URL)</label>
            <input
              type="text"
              value={inContentImgUrl}
              onChange={(e) => setInContentImgUrl(e.target.value)}
              placeholder="https://images.unsplash.com/... hoặc link Cloudinary"
              className="w-full text-xs font-mono border border-[#EDEDED] rounded-lg px-3 py-2 outline-none focus:border-[#FA520F]"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-[#4A4A4A] block mb-1.5">Chú thích chân ảnh (Caption - tùy chọn)</label>
            <input
              type="text"
              value={inContentImgCaption}
              onChange={(e) => setInContentImgCaption(e.target.value)}
              placeholder="VD: Sơ đồ kiến trúc hạ tầng Mail Server và phân giải bản ghi DNS"
              className="w-full text-xs border border-[#EDEDED] rounded-lg px-3 py-2 outline-none focus:border-[#FA520F]"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-[#4A4A4A] block mb-1.5">Thẻ Alt ảnh (Tối ưu SEO)</label>
            <input
              type="text"
              value={inContentImgAlt}
              onChange={(e) => setInContentImgAlt(e.target.value)}
              placeholder="Mô tả ngắn gọn nội dung ảnh..."
              className="w-full text-xs border border-[#EDEDED] rounded-lg px-3 py-2 outline-none focus:border-[#FA520F]"
            />
          </div>

          {inContentImgUrl && (
            <div className="w-full h-36 rounded-lg overflow-hidden bg-[#EDEDED] border border-[#E0E0E0]">
              <img src={inContentImgUrl} alt="Preview" className="w-full h-full object-contain" />
            </div>
          )}

          <div className="flex justify-end gap-2 pt-3 border-t border-[#EDEDED]">
            <Button variant="secondary" onClick={() => setImgModalOpen(false)}>Hủy</Button>
            <Button variant="primary" onClick={handleInsertContentImage}>Chèn vào bài viết</Button>
          </div>
        </div>
      </Modal>

      {/* ── Modal: Dàn Ý Mẫu (Article Templates) ─────────────────────────── */}
      <Modal
        open={templateModalOpen}
        onClose={() => setTemplateModalOpen(false)}
        title="Chọn Dàn Ý Mẫu Cho Bài Viết"
        description="Chèn cấu trúc nội dung chuẩn mực giúp bạn bắt đầu viết bài nhanh chóng và có cấu trúc mạch lạc"
        size="md"
      >
        <div className="space-y-3">
          {TEMPLATES.map((tmpl) => (
            <div
              key={tmpl.id}
              className="p-4 rounded-xl border border-[#EDEDED] hover:border-[#FA520F] hover:bg-[#FFF8F5] transition-all cursor-pointer group"
              onClick={() => {
                const field = langTab === 'vi' ? 'content_vi' : 'content_en'
                setFormData((prev) => ({
                  ...prev,
                  [field]: tmpl.snippet,
                  read_time_vi: langTab === 'vi' ? calculateReadTime(tmpl.snippet) : prev.read_time_vi,
                }))
                setTemplateModalOpen(false)
                showToast(`Đã áp dụng ${tmpl.title}!`, 'success')
              }}
            >
              <h4 className="text-sm font-bold text-[#1F1F1F] group-hover:text-[#FA520F] flex items-center justify-between">
                <span>{tmpl.title}</span>
                <span className="text-xs text-[#FA520F] opacity-0 group-hover:opacity-100 font-medium">Chọn mẫu →</span>
              </h4>
              <p className="text-xs text-[#6A6A6A] mt-1 line-clamp-2">
                Bao gồm tiêu đề H2, H3, bảng so sánh và các khung ghi chú giải pháp đã định dạng sẵn.
              </p>
            </div>
          ))}

          <div className="flex justify-end pt-2">
            <Button variant="secondary" onClick={() => setTemplateModalOpen(false)}>Đóng</Button>
          </div>
        </div>
      </Modal>

    </div>
  )
}
