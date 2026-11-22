import { useState } from 'react'
import { ArrowLeft, Phone, Copy, ExternalLink, AlertCircle } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import { Button } from '../components/admin/ui/Button'
import { StatusBadge } from '../components/admin/ui/Badge'
import { Textarea } from '../components/admin/ui/Input'
import { StatusPipeline } from '../components/admin/data-display/StatusPipeline'
import { ActivityTimeline } from '../components/admin/data-display/ActivityTimeline'
import { Skeleton } from '../components/admin/ui/EmptyState'
import { useLeadDetail } from '../hooks/useLeads'
import { formatDate, formatDateShort, copyToClipboard, isOverdue } from '../lib/utils'
import type { LeadStatus } from '../types/admin'
import { useToast } from '../hooks/useToast'

function DetailSkeleton() {
  return (
    <div className="space-y-5 max-w-5xl">
      <Skeleton className="h-6 w-32" />
      <div className="flex items-center gap-3">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-6 w-20" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 space-y-5">
          <Skeleton className="h-56 rounded-xl" />
          <Skeleton className="h-32 rounded-xl" />
          <Skeleton className="h-48 rounded-xl" />
        </div>
        <div className="space-y-5">
          <Skeleton className="h-40 rounded-xl" />
          <Skeleton className="h-48 rounded-xl" />
        </div>
      </div>
    </div>
  )
}

export function LeadDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { showToast } = useToast()
  const {
    lead, activities, followUps,
    loading, saving, error,
    saveNote, changeStatus, markFollowUpDone,
  } = useLeadDetail(id)

  const [note, setNote] = useState('')

  if (loading) return <DetailSkeleton />

  if (error || !lead) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3">
        <AlertCircle size={32} className="text-red-400" />
        <p className="text-sm text-[#6A6A6A]">
          {error ?? 'Không tìm thấy khách hàng'}
        </p>
        <Link to="/admin/leads">
          <Button variant="primary">Quay lại danh sách</Button>
        </Link>
      </div>
    )
  }

  const handleCopy = async () => {
    await copyToClipboard(lead.phone)
    showToast('Đã copy số điện thoại!', 'success')
  }

  const handleStatusChange = async (newStatus: LeadStatus) => {
    const { success, error } = await changeStatus(newStatus)
    if (success) showToast('Đã cập nhật trạng thái!', 'success')
    else showToast(error ?? 'Lỗi cập nhật trạng thái', 'error')
  }

  const handleSaveNote = async () => {
    if (!note.trim()) return
    const { success, error } = await saveNote(note)
    if (success) {
      showToast('Đã lưu ghi chú!', 'success')
      setNote('')
    } else {
      showToast(error ?? 'Lỗi lưu ghi chú', 'error')
    }
  }

  const handleMarkFollowUpDone = async (fuId: string) => {
    const { success } = await markFollowUpDone(fuId)
    if (success) showToast('Đã đánh dấu hoàn thành!', 'success')
    else showToast('Không thể cập nhật. Thử lại.', 'error')
  }

  return (
    <div className="space-y-5 max-w-5xl">
      {/* Back + Header */}
      <div>
        <Link to="/admin/leads" className="inline-flex items-center gap-1.5 text-sm text-[#6A6A6A] hover:text-[#FA520F] transition-colors mb-3">
          <ArrowLeft size={15} />
          Quay lại danh sách
        </Link>
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-xl font-bold text-[#1F1F1F]">{lead.name}</h1>
              <StatusBadge status={lead.status} />
            </div>
            {lead.company && <p className="text-sm text-[#6A6A6A] mt-0.5">{lead.company}</p>}
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <Button size="sm" variant="secondary" icon={<Copy size={13} />} onClick={handleCopy}>
              Copy SĐT
            </Button>
            <a
              href={`tel:${lead.phone}`}
              className="inline-flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 rounded-lg border border-[#EDEDED] text-[#4A4A4A] hover:bg-[#F5F5F5] transition-colors"
            >
              <Phone size={13} />
              Gọi điện
            </a>
          </div>
        </div>
      </div>

      {/* Grid layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left col: main info */}
        <div className="lg:col-span-2 space-y-5">
          {/* Customer info */}
          <div className="bg-white rounded-xl border border-[#EDEDED] p-5">
            <h2 className="text-sm font-semibold text-[#1F1F1F] mb-4">Thông tin khách hàng</h2>
            <div className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
              <div>
                <div className="text-xs text-[#6A6A6A] mb-0.5">Họ tên</div>
                <div className="text-[#1F1F1F] font-medium">{lead.name}</div>
              </div>
              <div>
                <div className="text-xs text-[#6A6A6A] mb-0.5">Công ty</div>
                <div className="text-[#1F1F1F]">{lead.company || '—'}</div>
              </div>
              <div>
                <div className="text-xs text-[#6A6A6A] mb-0.5">Số điện thoại</div>
                <div className="flex items-center gap-1.5">
                  <a href={`tel:${lead.phone}`} className="text-[#FA520F] font-medium">{lead.phone}</a>
                  <button onClick={handleCopy} className="text-[#A8A8A8] hover:text-[#FA520F]"><Copy size={12} /></button>
                </div>
              </div>
              <div>
                <div className="text-xs text-[#6A6A6A] mb-0.5">Email</div>
                <a href={`mailto:${lead.email}`} className="text-[#FA520F] text-sm">{lead.email}</a>
              </div>
              <div>
                <div className="text-xs text-[#6A6A6A] mb-0.5">Nguồn</div>
                <div className="text-[#1F1F1F]">{lead.source}</div>
              </div>
              <div>
                <div className="text-xs text-[#6A6A6A] mb-0.5">Ngày tiếp nhận</div>
                <div className="text-[#1F1F1F]">{formatDate(lead.created_at)}</div>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-[#EDEDED]">
              <div className="text-xs text-[#6A6A6A] mb-1.5">Dịch vụ quan tâm</div>
              <div className="flex flex-wrap gap-1.5">
                {lead.services.map((s) => (
                  <span key={s} className="text-sm px-3 py-1 bg-[#FFF0E8] text-[#FA520F] border border-[#FA520F]/20 rounded-full font-medium">
                    {s}
                  </span>
                ))}
              </div>
              {lead.other_industry && (
                <p className="text-xs text-[#6A6A6A] mt-2">Ngành/Quy mô: {lead.other_industry}</p>
              )}
            </div>
            <div className="mt-4 pt-4 border-t border-[#EDEDED]">
              <div className="text-xs text-[#6A6A6A] mb-1.5">Nội dung yêu cầu</div>
              <p className="text-sm text-[#4A4A4A] leading-relaxed">{lead.message}</p>
            </div>
            {lead.poc_url && (
              <div className="mt-4 pt-4 border-t border-[#EDEDED]">
                <div className="text-xs text-[#6A6A6A] mb-1.5">URL Demo / POC</div>
                <a href={lead.poc_url} target="_blank" rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm text-[#FA520F] hover:underline">
                  <ExternalLink size={13} />
                  {lead.poc_url}
                </a>
              </div>
            )}
          </div>

          {/* Pipeline */}
          <div className="bg-white rounded-xl border border-[#EDEDED] p-5">
            <h2 className="text-sm font-semibold text-[#1F1F1F] mb-4">Pipeline tư vấn</h2>
            <StatusPipeline currentStatus={lead.status} onStatusChange={handleStatusChange} />
            <p className="text-xs text-[#A8A8A8] mt-3">
              Click vào bước để cập nhật trạng thái · Lịch sử sẽ được lưu tự động
            </p>
          </div>

          {/* Note form */}
          <div className="bg-white rounded-xl border border-[#EDEDED] p-5">
            <h2 className="text-sm font-semibold text-[#1F1F1F] mb-3">Thêm ghi chú tư vấn</h2>
            <Textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Ghi chú nội dung trao đổi, kết quả cuộc gọi, thỏa thuận..."
              rows={4}
            />
            <div className="flex justify-end mt-3">
              <Button
                variant="primary"
                onClick={handleSaveNote}
                loading={saving}
                disabled={!note.trim()}
              >
                Lưu ghi chú
              </Button>
            </div>
          </div>

          {/* Activity timeline */}
          <div className="bg-white rounded-xl border border-[#EDEDED] p-5">
            <h2 className="text-sm font-semibold text-[#1F1F1F] mb-4">Lịch sử hoạt động</h2>
            {activities.length === 0 ? (
              <p className="text-sm text-[#6A6A6A]">Chưa có hoạt động nào.</p>
            ) : (
              <ActivityTimeline activities={activities} />
            )}
          </div>
        </div>

        {/* Right col: opportunity + follow-ups */}
        <div className="space-y-5">
          {/* Opportunity info */}
          <div className="bg-[#FFFAEB] rounded-xl border border-[#FA520F]/20 p-5">
            <h2 className="text-sm font-semibold text-[#1F1F1F] mb-3">Thông tin cơ hội</h2>
            <div className="space-y-2.5 text-sm">
              <div className="flex justify-between">
                <span className="text-[#6A6A6A]">Trạng thái</span>
                <StatusBadge status={lead.status} />
              </div>
              <div className="flex justify-between">
                <span className="text-[#6A6A6A]">Nguồn Lead</span>
                <span className="text-[#1F1F1F] font-medium">{lead.source}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#6A6A6A]">Ngày tạo</span>
                <span className="text-[#1F1F1F]">{formatDateShort(lead.created_at)}</span>
              </div>
              <div className="border-t border-[#FA520F]/10 pt-2.5">
                <span className="text-xs text-[#6A6A6A]">Giá trị cơ hội (ước tính)</span>
                <p className="text-xs text-[#A8A8A8] mt-1">Chưa nhập — tính năng sắp triển khai</p>
              </div>
            </div>
          </div>

          {/* Follow-ups */}
          <div className="bg-white rounded-xl border border-[#EDEDED] p-5">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-[#1F1F1F]">Follow-up</h2>
              <Button size="sm" variant="secondary">+ Thêm</Button>
            </div>
            {followUps.length === 0 ? (
              <p className="text-xs text-[#6A6A6A]">Chưa có lịch follow-up.</p>
            ) : (
              <div className="space-y-3">
                {followUps.map((fu) => (
                  <div key={fu.id} className={`p-3 rounded-lg border text-sm ${
                    fu.status === 'done' ? 'bg-[#F9F9F9] border-[#EDEDED]' :
                    isOverdue(fu.scheduled_at) ? 'bg-red-50 border-red-200' :
                    'bg-[#F0FDF4] border-green-200'
                  }`}>
                    <div className="text-xs text-[#6A6A6A] mb-1">{formatDate(fu.scheduled_at)}</div>
                    <p className="text-[#4A4A4A] text-xs">{fu.content}</p>
                    <div className="mt-2 flex items-center justify-between">
                      <span className={`text-xs font-medium ${
                        fu.status === 'done' ? 'text-[#6A6A6A]' :
                        isOverdue(fu.scheduled_at) ? 'text-red-600' : 'text-green-600'
                      }`}>
                        {fu.status === 'done' ? '✓ Đã xong' : isOverdue(fu.scheduled_at) ? 'Quá hạn' : 'Đang chờ'}
                      </span>
                      {fu.status === 'pending' && (
                        <button
                          onClick={() => handleMarkFollowUpDone(fu.id)}
                          className="text-xs text-[#FA520F] hover:underline"
                        >
                          Đánh dấu xong
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
