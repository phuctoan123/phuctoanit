import { useMemo } from 'react'
import { Users, CalendarCheck, TrendingUp, CheckCircle, Phone, Copy, ChevronRight, AlertCircle } from 'lucide-react'
import { Link } from 'react-router-dom'
import { KpiCard } from '../components/admin/data-display/KpiCard'
import { StatusBadge } from '../components/admin/ui/Badge'
import { Button } from '../components/admin/ui/Button'
import { EmptyState, Skeleton } from '../components/admin/ui/EmptyState'
import { useLeads, useFollowUps } from '../hooks/useLeads'
import { formatDateShort, isToday, isOverdue, copyToClipboard } from '../lib/utils'
import { useToast } from '../hooks/useToast'

function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <Skeleton className="h-6 w-36" />
        <Skeleton className="h-4 w-64" />
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-24 rounded-xl" />
        ))}
      </div>
      <Skeleton className="h-48 rounded-xl" />
      <Skeleton className="h-64 rounded-xl" />
    </div>
  )
}

export function DashboardPage() {
  const { showToast } = useToast()
  const { leads, loading: leadsLoading, error: leadsError } = useLeads()
  const { followUps, loading: fuLoading, error: fuError } = useFollowUps()

  const loading = leadsLoading || fuLoading
  const error = leadsError || fuError

  const stats = useMemo(() => ({
    total: leads.length,
    new: leads.filter((l) => l.status === 'new').length,
    active: leads.filter((l) =>
      ['contacted', 'poc_in_progress', 'proposal_sent'].includes(l.status),
    ).length,
    won: leads.filter((l) => l.status === 'closed_won').length,
  }), [leads])

  const todayFollowUps = useMemo(() =>
    followUps.filter((f) => f.status === 'pending' && isToday(f.scheduled_at)),
    [followUps],
  )

  const overdueFollowUps = useMemo(() =>
    followUps.filter((f) => f.status === 'pending' && isOverdue(f.scheduled_at) && !isToday(f.scheduled_at)),
    [followUps],
  )

  const recentLeads = useMemo(() =>
    [...leads]
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, 5),
    [leads],
  )

  const urgentItems = [...overdueFollowUps, ...todayFollowUps]

  const handleCopyPhone = async (phone: string) => {
    await copyToClipboard(phone)
    showToast('Đã copy số điện thoại!', 'success')
  }

  if (loading) return <DashboardSkeleton />

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3">
        <AlertCircle size={32} className="text-red-400" />
        <p className="text-sm text-[#6A6A6A]">Không thể tải dữ liệu: {error}</p>
        <p className="text-xs text-[#A8A8A8]">Kiểm tra kết nối Supabase trong .env</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-xl font-bold text-[#1F1F1F]">Dashboard</h1>
        <p className="text-sm text-[#6A6A6A] mt-0.5">Tổng quan hoạt động website và khách hàng tiềm năng</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <KpiCard
          label="Tổng Lead"
          value={stats.total}
          description="Toàn bộ"
          icon={<Users size={16} />}
        />
        <KpiCard
          label="Lead mới"
          value={stats.new}
          description="Chưa liên hệ"
          icon={<TrendingUp size={16} />}
          highlight={stats.new > 0}
        />
        <KpiCard
          label="Đang tư vấn"
          value={stats.active}
          description="Đang theo dõi"
          icon={<Users size={16} />}
        />
        <KpiCard
          label="Follow-up hôm nay"
          value={todayFollowUps.length}
          description={overdueFollowUps.length > 0 ? `${overdueFollowUps.length} quá hạn` : 'Lịch cần xử lý'}
          icon={<CalendarCheck size={16} />}
          highlight={overdueFollowUps.length > 0}
        />
        <KpiCard
          label="Đã chốt"
          value={stats.won}
          description="Tổng cộng"
          icon={<CheckCircle size={16} />}
        />
      </div>

      {/* Urgent tasks */}
      <div className="bg-white rounded-xl border border-[#EDEDED] overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#EDEDED]">
          <div>
            <h2 className="text-sm font-semibold text-[#1F1F1F]">Việc cần xử lý hôm nay</h2>
            <p className="text-xs text-[#6A6A6A] mt-0.5">Follow-up đến hạn và quá hạn</p>
          </div>
          <Link to="/admin/follow-ups" className="text-xs text-[#FA520F] hover:underline flex items-center gap-1">
            Xem tất cả <ChevronRight size={12} />
          </Link>
        </div>
        {urgentItems.length === 0 ? (
          <EmptyState
            icon={<CalendarCheck size={24} />}
            title="Không có việc cần xử lý hôm nay"
            description="Bạn đã xử lý tất cả lịch follow-up!"
          />
        ) : (
          <div className="divide-y divide-[#EDEDED]">
            {urgentItems.map((fu) => (
              <div key={fu.id} className="flex items-center gap-3 px-5 py-3.5 hover:bg-[#FAFAFA] transition-colors">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Link to={`/admin/leads/${fu.lead_id}`} className="text-sm font-medium text-[#1F1F1F] hover:text-[#FA520F] transition-colors">
                      {fu.lead?.name}
                    </Link>
                    {isOverdue(fu.scheduled_at) && !isToday(fu.scheduled_at) && (
                      <span className="text-xs px-1.5 py-0.5 bg-red-50 text-red-600 rounded-full border border-red-200">Quá hạn</span>
                    )}
                    {isToday(fu.scheduled_at) && (
                      <span className="text-xs px-1.5 py-0.5 bg-green-50 text-green-600 rounded-full border border-green-200">Hôm nay</span>
                    )}
                  </div>
                  <p className="text-xs text-[#6A6A6A] mt-0.5 truncate">{fu.content}</p>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  {fu.lead?.phone && (
                    <>
                      <Button
                        size="sm"
                        variant="ghost"
                        icon={<Copy size={13} />}
                        onClick={() => handleCopyPhone(fu.lead!.phone)}
                      />
                      <a
                        href={`tel:${fu.lead.phone}`}
                        className="inline-flex items-center justify-center w-7 h-7 rounded-lg text-[#4A4A4A] hover:bg-[#F5F5F5] transition-colors"
                      >
                        <Phone size={13} />
                      </a>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recent leads */}
      <div className="bg-white rounded-xl border border-[#EDEDED] overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#EDEDED]">
          <h2 className="text-sm font-semibold text-[#1F1F1F]">Lead mới nhất</h2>
          <Link to="/admin/leads" className="text-xs text-[#FA520F] hover:underline flex items-center gap-1">
            Xem tất cả <ChevronRight size={12} />
          </Link>
        </div>
        {recentLeads.length === 0 ? (
          <EmptyState
            icon={<Users size={24} />}
            title="Chưa có khách hàng"
            description="Khách hàng sẽ xuất hiện khi điền form liên hệ trên website"
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#EDEDED] bg-[#FAFAFA]">
                  <th className="text-left px-5 py-2.5 text-xs font-medium text-[#6A6A6A]">Khách hàng</th>
                  <th className="text-left px-3 py-2.5 text-xs font-medium text-[#6A6A6A] hidden sm:table-cell">Dịch vụ</th>
                  <th className="text-left px-3 py-2.5 text-xs font-medium text-[#6A6A6A]">Trạng thái</th>
                  <th className="text-left px-3 py-2.5 text-xs font-medium text-[#6A6A6A] hidden md:table-cell">Ngày tạo</th>
                  <th className="px-3 py-2.5" />
                </tr>
              </thead>
              <tbody>
                {recentLeads.map((lead) => (
                  <tr key={lead.id} className="border-b border-[#EDEDED] last:border-0 hover:bg-[#FAFAFA] transition-colors">
                    <td className="px-5 py-3">
                      <div className="font-medium text-[#1F1F1F]">{lead.name}</div>
                      {lead.company && <div className="text-xs text-[#6A6A6A]">{lead.company}</div>}
                    </td>
                    <td className="px-3 py-3 hidden sm:table-cell">
                      <div className="flex flex-wrap gap-1">
                        {lead.services.slice(0, 2).map((s) => (
                          <span key={s} className="text-xs px-2 py-0.5 bg-[#F5F5F5] text-[#4A4A4A] rounded-full">{s}</span>
                        ))}
                        {lead.services.length > 2 && (
                          <span className="text-xs text-[#6A6A6A]">+{lead.services.length - 2}</span>
                        )}
                      </div>
                    </td>
                    <td className="px-3 py-3">
                      <StatusBadge status={lead.status} />
                    </td>
                    <td className="px-3 py-3 text-xs text-[#6A6A6A] hidden md:table-cell">
                      {formatDateShort(lead.created_at)}
                    </td>
                    <td className="px-3 py-3 text-right">
                      <Link to={`/admin/leads/${lead.id}`} className="text-xs text-[#FA520F] hover:underline">
                        Xem
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
