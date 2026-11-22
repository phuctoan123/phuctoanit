import { useState, useMemo } from 'react'
import { Phone, Copy, Eye, CheckCircle, AlertCircle, Plus } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '../components/admin/ui/Button'
import { Tabs } from '../components/admin/ui/Tabs'
import { EmptyState, Skeleton } from '../components/admin/ui/EmptyState'
import { FollowUpModal } from '../components/admin/crm/FollowUpModal'
import { useFollowUps } from '../hooks/useLeads'
import { formatDate, isToday, isOverdue, copyToClipboard } from '../lib/utils'
import { useToast } from '../hooks/useToast'

type TabId = 'today' | 'overdue' | 'upcoming' | 'done'

export function FollowUpsPage() {
  const { showToast } = useToast()
  const { followUps, loading, error, markDone, refetch } = useFollowUps()
  const [activeTab, setActiveTab] = useState<TabId>('today')
  const [markingId, setMarkingId] = useState<string | null>(null)
  const [showCreate, setShowCreate] = useState(false)

  const grouped = useMemo(() => ({
    overdue: followUps.filter((f) => f.status === 'pending' && isOverdue(f.scheduled_at) && !isToday(f.scheduled_at)),
    today: followUps.filter((f) => f.status === 'pending' && isToday(f.scheduled_at)),
    upcoming: followUps.filter((f) => f.status === 'pending' && !isOverdue(f.scheduled_at) && !isToday(f.scheduled_at)),
    done: followUps.filter((f) => f.status === 'done'),
  }), [followUps])

  const tabItems = [
    { id: 'overdue', label: 'Quá hạn', count: grouped.overdue.length },
    { id: 'today', label: 'Hôm nay', count: grouped.today.length },
    { id: 'upcoming', label: 'Sắp tới', count: grouped.upcoming.length },
    { id: 'done', label: 'Đã hoàn tất', count: grouped.done.length },
  ]

  const displayItems = grouped[activeTab]

  const handleCopy = async (phone: string) => {
    await copyToClipboard(phone)
    showToast('Đã copy số điện thoại!', 'success')
  }

  const handleMarkDone = async (id: string) => {
    setMarkingId(id)
    const { success } = await markDone(id)
    setMarkingId(null)
    if (success) showToast('Đã đánh dấu hoàn thành!', 'success')
    else showToast('Không thể cập nhật. Thử lại.', 'error')
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-xl font-bold text-[#1F1F1F]">Lịch Follow-up</h1>
          <p className="text-sm text-[#6A6A6A] mt-0.5">Theo dõi khách hàng cần liên hệ lại</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {error && (
            <button
              onClick={refetch}
              className="flex items-center gap-1 text-xs text-red-600 px-2.5 py-1.5 bg-red-50 border border-red-200 rounded-lg"
            >
              <AlertCircle size={12} /> Lỗi — Thử lại
            </button>
          )}
          <Button size="sm" variant="primary" icon={<Plus size={14} />} onClick={() => setShowCreate(true)}>
            Tạo Follow-up
          </Button>
        </div>
      </div>

      {/* Loading skeleton */}
      {loading && (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-20 rounded-xl" />
          ))}
        </div>
      )}

      {!loading && (
        <>
          <Tabs tabs={tabItems} activeTab={activeTab} onChange={(id) => setActiveTab(id as TabId)} />

          <div className="bg-white rounded-xl border border-[#EDEDED] overflow-hidden">
            {displayItems.length === 0 ? (
              <EmptyState
                icon={<CheckCircle size={24} />}
                title={
                  activeTab === 'today' ? 'Không có lịch hôm nay' :
                  activeTab === 'overdue' ? 'Không có lịch quá hạn' :
                  activeTab === 'upcoming' ? 'Không có lịch sắp tới' :
                  'Chưa có follow-up nào hoàn tất'
                }
                description={activeTab === 'today' ? 'Bạn đã xử lý tất cả lịch hôm nay!' : undefined}
              />
            ) : (
              <div className="divide-y divide-[#EDEDED]">
                {displayItems.map((fu) => (
                  <div
                    key={fu.id}
                    className={`flex items-center gap-4 px-5 py-4 hover:bg-[#FAFAFA] transition-colors ${
                      activeTab === 'overdue' ? 'border-l-4 border-l-red-400' :
                      activeTab === 'today' ? 'border-l-4 border-l-[#FA520F]' : ''
                    }`}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <Link
                          to={`/admin/leads/${fu.lead_id}`}
                          className="font-medium text-[#1F1F1F] hover:text-[#FA520F] text-sm transition-colors"
                        >
                          {fu.lead?.name ?? 'Khách hàng'}
                        </Link>
                        {fu.lead?.company && (
                          <span className="text-xs text-[#6A6A6A]">· {fu.lead.company}</span>
                        )}
                      </div>
                      <p className="text-sm text-[#4A4A4A] mb-1 line-clamp-1">{fu.content}</p>
                      <span className={`text-xs font-medium ${activeTab === 'overdue' ? 'text-red-600' : 'text-[#6A6A6A]'}`}>
                        {formatDate(fu.scheduled_at)}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      {fu.lead?.phone && (
                        <>
                          <button
                            onClick={() => handleCopy(fu.lead!.phone)}
                            className="p-1.5 rounded-lg hover:bg-[#F5F5F5] text-[#A8A8A8] hover:text-[#FA520F] transition-colors"
                            title="Copy SĐT"
                          >
                            <Copy size={14} />
                          </button>
                          <a
                            href={`tel:${fu.lead.phone}`}
                            className="p-1.5 rounded-lg hover:bg-[#F5F5F5] text-[#A8A8A8] hover:text-[#FA520F] transition-colors"
                            title="Gọi điện"
                          >
                            <Phone size={14} />
                          </a>
                        </>
                      )}
                      <Link
                        to={`/admin/leads/${fu.lead_id}`}
                        className="p-1.5 rounded-lg hover:bg-[#F5F5F5] text-[#A8A8A8] hover:text-[#1F1F1F] transition-colors"
                        title="Xem chi tiết"
                      >
                        <Eye size={14} />
                      </Link>
                      {fu.status === 'pending' && (
                        <button
                          onClick={() => handleMarkDone(fu.id)}
                          disabled={markingId === fu.id}
                          className="p-1.5 rounded-lg hover:bg-green-50 text-[#A8A8A8] hover:text-green-600 transition-colors disabled:opacity-50"
                          title="Đánh dấu hoàn tất"
                        >
                          {markingId === fu.id ? (
                            <span className="inline-block w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <CheckCircle size={14} />
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}

      <FollowUpModal
        open={showCreate}
        onClose={() => setShowCreate(false)}
        onSuccess={() => { refetch(); showToast('Đã tạo lịch follow-up!', 'success') }}
      />
    </div>
  )
}
