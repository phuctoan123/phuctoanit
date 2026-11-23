import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Button } from '../components/admin/ui/Button'
import { Tabs } from '../components/admin/ui/Tabs'
import { Input, Textarea } from '../components/admin/ui/Input'
import { Skeleton } from '../components/admin/ui/EmptyState'
import { CONTENT_NAV } from '../constants/admin'
import { cn } from '../lib/utils'
import { useSiteAbout } from '../hooks/useCms'
import { useToast } from '../hooks/useToast'
import { CaseStudiesManager } from '../components/admin/cms/CaseStudiesManager'
import { PostsManager } from '../components/admin/cms/PostsManager'

function ContentSidebar() {
  const location = useLocation()
  return (
    <nav className="w-full lg:w-48 flex-shrink-0">
      <div className="bg-white rounded-xl border border-[#EDEDED] overflow-hidden">
        {CONTENT_NAV.map((item) => {
          const active = location.pathname === item.href
          return (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                'flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium transition-colors border-b border-[#EDEDED] last:border-0',
                active ? 'bg-[#FFF0E8] text-[#FA520F]' : 'text-[#4A4A4A] hover:bg-[#FAFAFA]',
              )}
            >
              {item.label}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}

function LangTabs({ lang, setLang }: { lang: 'vi' | 'en'; setLang: (l: 'vi' | 'en') => void }) {
  return (
    <Tabs
      tabs={[{ id: 'vi', label: '🇻🇳 Tiếng Việt' }, { id: 'en', label: '🇬🇧 English' }]}
      activeTab={lang}
      onChange={(id) => setLang(id as 'vi' | 'en')}
      variant="pill"
    />
  )
}

function SaveBar({ onSave, saving, saved }: { onSave: () => void; saving: boolean; saved: boolean }) {
  return (
    <div className="flex items-center justify-between pt-4 border-t border-[#EDEDED] mt-4">
      {saved ? (
        <span className="text-xs text-green-600 font-medium">✓ Đã lưu thay đổi</span>
      ) : (
        <span className="text-xs text-[#A8A8A8]">Nhớ lưu trước khi rời trang</span>
      )}
      <Button variant="primary" onClick={onSave} loading={saving}>
        Lưu thay đổi
      </Button>
    </div>
  )
}

function useSave() {
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const save = async (fn?: () => Promise<void>) => {
    setSaving(true)
    setSaved(false)
    if (fn) await fn()
    else await new Promise((r) => setTimeout(r, 400))
    setSaving(false)
    setSaved(true)
  }

  return { saving, saved, save }
}

export function ContentPage() {
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold text-[#1F1F1F]">Nội dung website</h1>
        <p className="text-sm text-[#6A6A6A] mt-0.5">Quản lý nội dung hiển thị trên trang chủ</p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {CONTENT_NAV.map((item) => (
          <Link key={item.href} to={item.href}
            className="bg-white rounded-xl border border-[#EDEDED] p-4 hover:border-[#FA520F]/30 hover:shadow-sm transition-all group">
            <div className="text-sm font-medium text-[#1F1F1F] group-hover:text-[#FA520F] transition-colors">{item.label}</div>
            <div className="text-xs text-[#6A6A6A] mt-1">Chỉnh sửa nội dung →</div>
          </Link>
        ))}
      </div>
    </div>
  )
}

export function HeroContentPage() {
  const [lang, setLang] = useState<'vi' | 'en'>('vi')
  const { about, loading, saving, error, save } = useSiteAbout()
  const { showToast } = useToast()

  // Local form state
  const [titleVi, setTitleVi] = useState('')
  const [titleEn, setTitleEn] = useState('')
  const [taglineVi, setTaglineVi] = useState('')
  const [taglineEn, setTaglineEn] = useState('')

  useEffect(() => {
    if (!about) return
    setTitleVi(about.hero_title_vi ?? '')
    setTitleEn(about.hero_title_en ?? '')
    setTaglineVi(about.hero_tagline_vi ?? '')
    setTaglineEn(about.hero_tagline_en ?? '')
  }, [about])

  const handleSave = async () => {
    const result = await save({
      hero_title_vi: titleVi,
      hero_title_en: titleEn,
      hero_tagline_vi: taglineVi,
      hero_tagline_en: taglineEn,
    })
    if (result.success) showToast('Đã lưu nội dung Hero!', 'success')
    else showToast(result.error ?? 'Lỗi khi lưu.', 'error')
  }

  return (
    <div className="space-y-5">
      <h1 className="text-xl font-bold text-[#1F1F1F]">Hero / Banner</h1>
      <div className="flex flex-col lg:flex-row gap-5">
        <ContentSidebar />
        <div className="flex-1 bg-white rounded-xl border border-[#EDEDED] p-5 space-y-4">
          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-11 rounded-xl" />)}
            </div>
          ) : error ? (
            <p className="text-sm text-red-600">Lỗi tải dữ liệu: {error}</p>
          ) : (
            <>
              <LangTabs lang={lang} setLang={setLang} />
              <Input
                label={`Tiêu đề (${lang.toUpperCase()})`}
                placeholder="Tiêu đề banner..."
                value={lang === 'vi' ? titleVi : titleEn}
                onChange={(e) => lang === 'vi' ? setTitleVi(e.target.value) : setTitleEn(e.target.value)}
              />
              <Textarea
                label={`Mô tả ngắn (${lang.toUpperCase()})`}
                placeholder="Mô tả..."
                rows={3}
                value={lang === 'vi' ? taglineVi : taglineEn}
                onChange={(e) => lang === 'vi' ? setTaglineVi(e.target.value) : setTaglineEn(e.target.value)}
              />
              <div className="flex items-center justify-between pt-4 border-t border-[#EDEDED] mt-4">
                <span className="text-xs text-[#A8A8A8]">Nhớ lưu trước khi rời trang</span>
                <Button variant="primary" onClick={handleSave} loading={saving}>
                  Lưu thay đổi
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export function AboutContentPage() {
  const [lang, setLang] = useState<'vi' | 'en'>('vi')
  const { about, loading, saving, error, save } = useSiteAbout()
  const { showToast } = useToast()

  const [descVi, setDescVi] = useState('')
  const [descEn, setDescEn] = useState('')
  const [philoVi, setPhiloVi] = useState('')
  const [philoEn, setPhiloEn] = useState('')

  useEffect(() => {
    if (!about) return
    setDescVi(about.about_desc_vi ?? '')
    setDescEn(about.about_desc_en ?? '')
    setPhiloVi(about.work_philosophy_vi ?? '')
    setPhiloEn(about.work_philosophy_en ?? '')
  }, [about])

  const handleSave = async () => {
    const result = await save({
      about_desc_vi: descVi,
      about_desc_en: descEn,
      work_philosophy_vi: philoVi,
      work_philosophy_en: philoEn,
    })
    if (result.success) showToast('Đã lưu nội dung Giới thiệu!', 'success')
    else showToast(result.error ?? 'Lỗi khi lưu.', 'error')
  }

  return (
    <div className="space-y-5">
      <h1 className="text-xl font-bold text-[#1F1F1F]">Giới thiệu</h1>
      <div className="flex flex-col lg:flex-row gap-5">
        <ContentSidebar />
        <div className="flex-1 bg-white rounded-xl border border-[#EDEDED] p-5 space-y-4">
          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-24 rounded-xl" />)}
            </div>
          ) : error ? (
            <p className="text-sm text-red-600">Lỗi tải dữ liệu: {error}</p>
          ) : (
            <>
              <LangTabs lang={lang} setLang={setLang} />
              <Textarea
                label={`Giới thiệu (${lang.toUpperCase()})`}
                placeholder="Nội dung giới thiệu bản thân..."
                rows={4}
                value={lang === 'vi' ? descVi : descEn}
                onChange={(e) => lang === 'vi' ? setDescVi(e.target.value) : setDescEn(e.target.value)}
              />
              <Textarea
                label={`Triết lý làm việc (${lang.toUpperCase()})`}
                placeholder="Motto hoặc triết lý..."
                rows={3}
                value={lang === 'vi' ? philoVi : philoEn}
                onChange={(e) => lang === 'vi' ? setPhiloVi(e.target.value) : setPhiloEn(e.target.value)}
              />
              <div>
                <div className="text-xs font-medium text-[#4A4A4A] mb-2">Avatar</div>
                <div className="border-2 border-dashed border-[#EDEDED] rounded-xl p-6 text-center">
                  <p className="text-sm text-[#A8A8A8]">Upload ảnh avatar (kết nối Supabase Storage)</p>
                  <Button size="sm" variant="secondary" className="mt-3" disabled>
                    Chọn ảnh (Chưa kết nối)
                  </Button>
                </div>
              </div>
              <div className="flex items-center justify-between pt-4 border-t border-[#EDEDED] mt-4">
                <span className="text-xs text-[#A8A8A8]">Nhớ lưu trước khi rời trang</span>
                <Button variant="primary" onClick={handleSave} loading={saving}>
                  Lưu thay đổi
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

function SimpleListContent({ title, fields }: { title: string; fields: { label: string; placeholder: string; type?: string }[] }) {
  const [lang, setLang] = useState<'vi' | 'en'>('vi')
  const { saving, saved, save } = useSave()
  return (
    <div className="space-y-5">
      <h1 className="text-xl font-bold text-[#1F1F1F]">{title}</h1>
      <div className="flex flex-col lg:flex-row gap-5">
        <ContentSidebar />
        <div className="flex-1 bg-white rounded-xl border border-[#EDEDED] p-5 space-y-4">
          <LangTabs lang={lang} setLang={setLang} />
          {fields.map((f) =>
            f.type === 'textarea' ? (
              <Textarea key={f.label} label={`${f.label} (${lang.toUpperCase()})`} placeholder={f.placeholder} rows={3} />
            ) : (
              <Input key={f.label} label={`${f.label} (${lang.toUpperCase()})`} placeholder={f.placeholder} />
            ),
          )}
          <SaveBar onSave={save} saving={saving} saved={saved} />
        </div>
      </div>
    </div>
  )
}

export function SkillsContentPage() {
  return <SimpleListContent title="Năng lực" fields={[
    { label: 'Tiêu đề kỹ năng 1', placeholder: 'Tên kỹ năng...' },
    { label: 'Mô tả kỹ năng 1', placeholder: 'Mô tả...', type: 'textarea' },
    { label: 'Tiêu đề kỹ năng 2', placeholder: 'Tên kỹ năng...' },
    { label: 'Mô tả kỹ năng 2', placeholder: 'Mô tả...', type: 'textarea' },
    { label: 'Tiêu đề kỹ năng 3', placeholder: 'Tên kỹ năng...' },
    { label: 'Mô tả kỹ năng 3', placeholder: 'Mô tả...', type: 'textarea' },
  ]} />
}

export function ServicesContentPage() {
  return <SimpleListContent title="Dịch vụ" fields={[
    { label: 'Tên dịch vụ 1', placeholder: 'Tên dịch vụ...' },
    { label: 'Mô tả dịch vụ 1', placeholder: 'Mô tả ngắn...', type: 'textarea' },
    { label: 'Tên dịch vụ 2', placeholder: 'Tên dịch vụ...' },
    { label: 'Mô tả dịch vụ 2', placeholder: 'Mô tả ngắn...', type: 'textarea' },
  ]} />
}

export function CaseStudiesContentPage() {
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold text-[#1F1F1F]">Dự án tiêu biểu (Case Studies)</h1>
        <p className="text-sm text-[#6A6A6A] mt-0.5">Quản lý danh sách các bài toán và giải pháp thực tế cho khách hàng B2B</p>
      </div>
      <div className="flex flex-col lg:flex-row gap-5">
        <ContentSidebar />
        <div className="flex-1 bg-white rounded-xl border border-[#EDEDED] p-5">
          <CaseStudiesManager />
        </div>
      </div>
    </div>
  )
}

export function PostsContentPage() {
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold text-[#1F1F1F]">Góc Tư Vấn &amp; Giải Pháp (Blog / Insights)</h1>
        <p className="text-sm text-[#6A6A6A] mt-0.5">Quản lý bài viết chia sẻ kiến thức, tư vấn giải pháp và chuyển đổi số</p>
      </div>
      <div className="flex flex-col lg:flex-row gap-5">
        <ContentSidebar />
        <div className="flex-1 bg-white rounded-xl border border-[#EDEDED] p-5">
          <PostsManager />
        </div>
      </div>
    </div>
  )
}

export function TestimonialsContentPage() {
  return <SimpleListContent title="Đánh giá" fields={[
    { label: 'Tên người đánh giá', placeholder: 'Nguyễn Văn A...' },
    { label: 'Chức danh / Công ty', placeholder: 'CEO tại Công ty ABC...' },
    { label: 'Nội dung đánh giá', placeholder: 'Nội dung quote...', type: 'textarea' },
  ]} />
}

export function PricingContentPage() {
  return <SimpleListContent title="Gói hợp tác" fields={[
    { label: 'Badge gói 1', placeholder: 'End-to-End...' },
    { label: 'Tiêu đề gói 1', placeholder: 'Tên gói...' },
    { label: 'Tagline gói 1', placeholder: 'Mô tả ngắn gói...', type: 'textarea' },
    { label: 'Badge gói 2', placeholder: 'Solution Consulting...' },
    { label: 'Tiêu đề gói 2', placeholder: 'Tên gói...' },
  ]} />
}
