import { useState, useEffect } from 'react'
import { Tabs } from '../components/admin/ui/Tabs'
import { Input, Textarea } from '../components/admin/ui/Input'
import { Button } from '../components/admin/ui/Button'
import { Skeleton } from '../components/admin/ui/EmptyState'
import { SETTINGS_TABS } from '../constants/admin'
import { useSettings } from '../hooks/useCms'
import { useToast } from '../hooks/useToast'

function SaveBar({ onSave, saving }: { onSave: () => void; saving: boolean }) {
  return (
    <div className="pt-5 border-t border-[#EDEDED] mt-5">
      <Button variant="primary" onClick={onSave} loading={saving}>
        Lưu cài đặt
      </Button>
    </div>
  )
}

export function SettingsPage() {
  const [activeTab, setActiveTab] = useState('general')
  const { settings, loading, saving, error, save } = useSettings()
  const { showToast } = useToast()

  // General tab state
  const [hotline, setHotline] = useState('')
  const [email, setEmail] = useState('')
  const [addressVi, setAddressVi] = useState('')
  const [addressEn, setAddressEn] = useState('')
  const [partnerWebsite, setPartnerWebsite] = useState('')

  // Social tab state
  const [socials, setSocials] = useState<Record<string, string>>({
    zalo: '', facebook: '', instagram: '', linkedin: '', tiktok: '', whatsapp: '',
  })

  // SEO tab state
  const [metaTitleVi, setMetaTitleVi] = useState('')
  const [metaTitleEn, setMetaTitleEn] = useState('')
  const [metaDescVi, setMetaDescVi] = useState('')
  const [metaDescEn, setMetaDescEn] = useState('')

  // Populate form khi load xong settings
  useEffect(() => {
    if (!settings) return
    setHotline(settings.hotline ?? '')
    setEmail(settings.email ?? '')
    setAddressVi(settings.address_vi ?? '')
    setAddressEn(settings.address_en ?? '')
    setPartnerWebsite(settings.partner_website ?? '')

    const sl = settings.social_links ?? {}
    setSocials({
      zalo: sl['zalo'] ?? '',
      facebook: sl['facebook'] ?? '',
      instagram: sl['instagram'] ?? '',
      linkedin: sl['linkedin'] ?? '',
      tiktok: sl['tiktok'] ?? '',
      whatsapp: sl['whatsapp'] ?? '',
    })

    const seo = settings.seo ?? {}
    setMetaTitleVi(seo.meta_title_vi ?? '')
    setMetaTitleEn(seo.meta_title_en ?? '')
    setMetaDescVi(seo.meta_desc_vi ?? '')
    setMetaDescEn(seo.meta_desc_en ?? '')
  }, [settings])

  const handleSaveGeneral = async () => {
    const result = await save({ hotline, email, address_vi: addressVi, address_en: addressEn, partner_website: partnerWebsite })
    if (result.success) showToast('Đã lưu thông tin chung!', 'success')
    else showToast(result.error ?? 'Lỗi khi lưu.', 'error')
  }

  const handleSaveSocial = async () => {
    const result = await save({ social_links: socials })
    if (result.success) showToast('Đã lưu mạng xã hội!', 'success')
    else showToast(result.error ?? 'Lỗi khi lưu.', 'error')
  }

  const handleSaveSeo = async () => {
    const result = await save({
      seo: {
        meta_title_vi: metaTitleVi,
        meta_title_en: metaTitleEn,
        meta_desc_vi: metaDescVi,
        meta_desc_en: metaDescEn,
      },
    })
    if (result.success) showToast('Đã lưu cài đặt SEO!', 'success')
    else showToast(result.error ?? 'Lỗi khi lưu.', 'error')
  }

  if (loading) {
    return (
      <div className="space-y-5 max-w-3xl">
        <div>
          <div className="text-xl font-bold text-[#1F1F1F]">Cài đặt website</div>
          <div className="text-sm text-[#6A6A6A] mt-0.5">Quản lý thông tin liên hệ, mạng xã hội và SEO</div>
        </div>
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-11 rounded-xl" />)}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-5 max-w-3xl">
        <h1 className="text-xl font-bold text-[#1F1F1F]">Cài đặt website</h1>
        <div className="bg-red-50 border border-red-200 rounded-xl p-5 text-sm text-red-700">
          Lỗi tải cài đặt: {error}
        </div>
      </div>
    )
  }

  const SOCIAL_PLATFORMS = [
    { key: 'zalo', label: 'Zalo' },
    { key: 'facebook', label: 'Facebook' },
    { key: 'instagram', label: 'Instagram' },
    { key: 'linkedin', label: 'LinkedIn' },
    { key: 'tiktok', label: 'TikTok' },
    { key: 'whatsapp', label: 'WhatsApp' },
  ]

  return (
    <div className="space-y-5 max-w-3xl">
      <div>
        <h1 className="text-xl font-bold text-[#1F1F1F]">Cài đặt website</h1>
        <p className="text-sm text-[#6A6A6A] mt-0.5">Quản lý thông tin liên hệ, mạng xã hội và SEO</p>
      </div>

      <Tabs
        tabs={SETTINGS_TABS}
        activeTab={activeTab}
        onChange={setActiveTab}
      />

      <div className="bg-white rounded-xl border border-[#EDEDED] p-6">
        {activeTab === 'general' && (
          <div className="space-y-4">
            <h2 className="text-sm font-semibold text-[#1F1F1F] mb-4">Thông tin chung &amp; liên hệ</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Hotline / Zalo"
                placeholder="0913.365.842"
                value={hotline}
                onChange={(e) => setHotline(e.target.value)}
              />
              <Input
                label="Email liên hệ"
                type="email"
                placeholder="admin@domain.vn"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <Input
              label="Địa chỉ (Tiếng Việt)"
              placeholder="Địa chỉ..."
              value={addressVi}
              onChange={(e) => setAddressVi(e.target.value)}
            />
            <Input
              label="Địa chỉ (English)"
              placeholder="Address..."
              value={addressEn}
              onChange={(e) => setAddressEn(e.target.value)}
            />
            <Input
              label="Website đối tác"
              placeholder="https://nasani.vn"
              value={partnerWebsite}
              onChange={(e) => setPartnerWebsite(e.target.value)}
            />
            <SaveBar onSave={handleSaveGeneral} saving={saving} />
          </div>
        )}

        {activeTab === 'social' && (
          <div className="space-y-4">
            <h2 className="text-sm font-semibold text-[#1F1F1F] mb-4">Mạng xã hội</h2>
            {SOCIAL_PLATFORMS.map(({ key, label }) => (
              <Input
                key={key}
                label={label}
                placeholder={`https://${key}.com/...`}
                value={socials[key] ?? ''}
                onChange={(e) => setSocials((prev) => ({ ...prev, [key]: e.target.value }))}
              />
            ))}
            <SaveBar onSave={handleSaveSocial} saving={saving} />
          </div>
        )}

        {activeTab === 'seo' && (
          <div className="space-y-4">
            <h2 className="text-sm font-semibold text-[#1F1F1F] mb-4">SEO &amp; Chia sẻ mạng xã hội</h2>
            <Input
              label="Meta Title (Tiếng Việt)"
              placeholder="Tiêu đề trang..."
              value={metaTitleVi}
              onChange={(e) => setMetaTitleVi(e.target.value)}
            />
            <Input
              label="Meta Title (English)"
              placeholder="Page title..."
              value={metaTitleEn}
              onChange={(e) => setMetaTitleEn(e.target.value)}
            />
            <Textarea
              label="Meta Description (Tiếng Việt)"
              placeholder="Mô tả trang..."
              rows={3}
              value={metaDescVi}
              onChange={(e) => setMetaDescVi(e.target.value)}
            />
            <Textarea
              label="Meta Description (English)"
              placeholder="Page description..."
              rows={3}
              value={metaDescEn}
              onChange={(e) => setMetaDescEn(e.target.value)}
            />
            <div>
              <div className="text-xs font-medium text-[#4A4A4A] mb-2">OG Image</div>
              <div className="border-2 border-dashed border-[#EDEDED] rounded-xl p-6 text-center">
                <p className="text-sm text-[#A8A8A8]">Upload ảnh OG (1200×630px khuyến nghị)</p>
                <Button size="sm" variant="secondary" className="mt-3" disabled>
                  Chọn ảnh (Chưa kết nối)
                </Button>
              </div>
            </div>
            <SaveBar onSave={handleSaveSeo} saving={saving} />
          </div>
        )}

        {activeTab === 'notifications' && (
          <div className="space-y-4">
            <h2 className="text-sm font-semibold text-[#1F1F1F] mb-4">Trạng thái thông báo</h2>
            <div className="space-y-3">
              {[
                { name: 'Telegram Bot', key: 'telegram' },
                { name: 'Email (Resend)', key: 'email' },
              ].map((item) => (
                <div key={item.key} className="flex items-center justify-between p-4 border border-[#EDEDED] rounded-xl">
                  <div>
                    <div className="text-sm font-medium text-[#1F1F1F]">{item.name}</div>
                    <div className="text-xs text-[#6A6A6A] mt-0.5">Chưa cấu hình — thiết lập trong biến môi trường</div>
                  </div>
                  <span className="text-xs px-2.5 py-1 bg-gray-100 text-gray-500 rounded-full border border-gray-200">
                    Chưa kết nối
                  </span>
                </div>
              ))}
            </div>
            <div className="p-4 bg-[#FFFAEB] border border-amber-200 rounded-xl text-sm text-[#4A4A4A]">
              <strong>Lưu ý bảo mật:</strong> Bot Token, API Key và thông tin nhạy cảm không được hiển thị ở đây.{' '}
              Cấu hình trong file <code className="bg-amber-100 px-1 rounded">.env</code> hoặc environment variables trên hosting.
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
