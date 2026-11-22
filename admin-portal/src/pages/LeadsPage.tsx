import { useState, useMemo } from 'react'
import { Search, Phone, Copy, Eye, Filter, X, ChevronDown, AlertCircle } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '../components/admin/ui/Button'
import { StatusBadge } from '../components/admin/ui/Badge'
import { Input } from '../components/admin/ui/Input'
import { Pagination } from '../components/admin/ui/Pagination'
import { EmptyState, TableSkeleton } from '../components/admin/ui/EmptyState'
import { LeadCard } from '../components/admin/data-display/LeadCard'
import { useLeads } from '../hooks/useLeads'
import { formatDateShort, copyToClipboard } from '../lib/utils'
import { LEAD_STATUS_CONFIG, LEAD_SERVICES } from '../constants/admin'
import type { LeadStatus } from '../types/admin'
import { useToast } from '../hooks/useToast'

const PAGE_SIZE = 10

export function LeadsPage() {
  const { showToast } = useToast()
  const { leads, loading, error, refetch } = useLeads()

  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<LeadStatus | ''>('')
  const [serviceFilter, setServiceFilter] = useState('')
  const [page, setPage] = useState(1)

  const filtered = useMemo(() => leads.filter((lead) => {
    const q = search.toLowerCase()
    const matchSearch = !q || [lead.name, lead.phone, lead.email, lead.company ?? ''].some((f) => f.toLowerCase().includes(q))
    const matchStatus = !statusFilter || lead.status === statusFilter
    const matchService = !serviceFilter || lead.services.includes(serviceFilter)
    return matchSearch && matchStatus && matchService
  }), [leads, search, statusFilter, serviceFilter])

  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)
  const hasFilters = search || statusFilter || serviceFilter

  const handleCopy = async (phone: string) => {
    await copyToClipboard(phone)
    showToast('Đã copy số điện thoại!', 'success')
  }

  const resetFilters = () => {
    setSearch('')
    setStatusFilter('')
    setServiceFilter('')
    setPage(1)
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-xl font-bold text-[#1F1F1F]">Khách hàng tiềm năng</h1>
          <p className="text-sm text-[#6A6A6A] mt-0.5">
            Quản lý yêu cầu tư vấn gửi từ website
            {!loading && <span className="ml-1 font-medium text-[#1F1F1F]">· {leads.length} khách hàng</span>}
          </p>
        </div>
        {error && (
          <button
            onClick={refetch}
            className="flex items-center gap-1.5 text-xs text-red-600 px-3 py-1.5 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors"
          >
            <AlertCircle size={13} />
            Lỗi tải dữ liệu — Thử lại
          </button>
        )}
      </div>

      {/* Toolbar */}
      <div className="flex flex-wrap gap-3">
        <div className="flex-1 min-w-[200px]">
          <Input
            placeholder="Tìm theo tên, SĐT, email, công ty..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1) }}
            icon={<Search size={15} />}
            iconRight={search ? (
              <button onClick={() => setSearch('')}><X size={13} /></button>
            ) : undefined}
          />
        </div>
        <div className="relative">
          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value as LeadStatus | ''); setPage(1) }}
            className="h-11 pl-3 pr-8 text-sm border border-[#C7C7C7] rounded-lg bg-white text-[#1F1F1F] focus:outline-none focus:border-[#FA520F] appearance-none cursor-pointer"
          >
            <option value="">Tất cả trạng thái</option>
            {(Object.entries(LEAD_STATUS_CONFIG) as [LeadStatus, { label: string }][]).map(([k, v]) => (
              <option key={k} value={k}>{v.label}</option>
            ))}
          </select>
          <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#6A6A6A] pointer-events-none" />
        </div>
        <div className="relative">
          <select
            value={serviceFilter}
            onChange={(e) => { setServiceFilter(e.target.value); setPage(1) }}
            className="h-11 pl-3 pr-8 text-sm border border-[#C7C7C7] rounded-lg bg-white text-[#1F1F1F] focus:outline-none focus:border-[#FA520F] appearance-none cursor-pointer"
          >
            <option value="">Tất cả dịch vụ</option>
            {LEAD_SERVICES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#6A6A6A] pointer-events-none" />
        </div>
        {hasFilters && (
          <Button size="md" variant="ghost" icon={<X size={15} />} onClick={resetFilters}>
            Xoá lọc
          </Button>
        )}
      </div>

      {/* Loading */}
      {loading && <TableSkeleton rows={6} />}

      {/* Error */}
      {!loading && error && (
        <div className="flex flex-col items-center justify-center py-16 gap-3">
          <AlertCircle size={28} className="text-red-400" />
          <p className="text-sm text-[#6A6A6A]">{error}</p>
          <Button variant="secondary" onClick={refetch}>Tải lại</Button>
        </div>
      )}

      {/* Mobile card view */}
      {!loading && !error && (
        <div className="grid gap-3 sm:hidden">
          {paginated.length === 0 ? (
            <EmptyState
              icon={<Filter size={24} />}
              title="Không tìm thấy kết quả"
              description="Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm"
              action={<Button variant="secondary" onClick={resetFilters}>Xoá bộ lọc</Button>}
            />
          ) : paginated.map((lead) => (
            <LeadCard key={lead.id} lead={lead} onCopy={() => showToast('Đã copy SĐT!', 'success')} />
          ))}
        </div>
      )}

      {/* Desktop table */}
      {!loading && !error && (
        <div className="hidden sm:block bg-white rounded-xl border border-[#EDEDED] overflow-hidden">
          {paginated.length === 0 ? (
            <EmptyState
              icon={hasFilters ? <Filter size={24} /> : <Search size={24} />}
              title={hasFilters ? 'Không tìm thấy kết quả' : 'Chưa có khách hàng'}
              description={hasFilters ? 'Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm' : 'Khách hàng sẽ xuất hiện khi điền form liên hệ trên website'}
              action={hasFilters ? <Button variant="secondary" onClick={resetFilters}>Xoá bộ lọc</Button> : undefined}
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#EDEDED] bg-[#FAFAFA]">
                    <th className="text-left px-5 py-3 text-xs font-medium text-[#6A6A6A]">Khách hàng</th>
                    <th className="text-left px-3 py-3 text-xs font-medium text-[#6A6A6A]">Liên hệ</th>
                    <th className="text-left px-3 py-3 text-xs font-medium text-[#6A6A6A] hidden lg:table-cell">Dịch vụ</th>
                    <th className="text-left px-3 py-3 text-xs font-medium text-[#6A6A6A]">Trạng thái</th>
                    <th className="text-left px-3 py-3 text-xs font-medium text-[#6A6A6A] hidden md:table-cell">Nguồn</th>
                    <th className="text-left px-3 py-3 text-xs font-medium text-[#6A6A6A] hidden md:table-cell">Ngày tạo</th>
                    <th className="px-3 py-3" />
                  </tr>
                </thead>
                <tbody>
                  {paginated.map((lead) => (
                    <tr key={lead.id} className="border-b border-[#EDEDED] last:border-0 hover:bg-[#FAFAFA] transition-colors">
                      <td className="px-5 py-3.5">
                        <Link to={`/admin/leads/${lead.id}`} className="font-medium text-[#1F1F1F] hover:text-[#FA520F] transition-colors block">
                          {lead.name}
                        </Link>
                        {lead.company && <div className="text-xs text-[#6A6A6A] mt-0.5">{lead.company}</div>}
                      </td>
                      <td className="px-3 py-3.5">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[#4A4A4A] text-xs">{lead.phone}</span>
                          <button
                            onClick={() => handleCopy(lead.phone)}
                            className="text-[#A8A8A8] hover:text-[#FA520F] transition-colors"
                            title="Copy SĐT"
                          >
                            <Copy size={12} />
                          </button>
                          <a href={`tel:${lead.phone}`} className="text-[#A8A8A8] hover:text-[#FA520F] transition-colors" title="Gọi điện">
                            <Phone size={12} />
                          </a>
                        </div>
                        <div className="text-xs text-[#A8A8A8] mt-0.5">{lead.email}</div>
                      </td>
                      <td className="px-3 py-3.5 hidden lg:table-cell">
                        <div className="flex flex-wrap gap-1">
                          {lead.services.slice(0, 2).map((s) => (
                            <span key={s} className="text-xs px-2 py-0.5 bg-[#F5F5F5] text-[#4A4A4A] rounded-full">{s}</span>
                          ))}
                          {lead.services.length > 2 && (
                            <span className="text-xs text-[#6A6A6A]">+{lead.services.length - 2}</span>
                          )}
                        </div>
                      </td>
                      <td className="px-3 py-3.5">
                        <StatusBadge status={lead.status} />
                      </td>
                      <td className="px-3 py-3.5 text-xs text-[#6A6A6A] hidden md:table-cell">{lead.source}</td>
                      <td className="px-3 py-3.5 text-xs text-[#6A6A6A] hidden md:table-cell">{formatDateShort(lead.created_at)}</td>
                      <td className="px-3 py-3.5">
                        <Link to={`/admin/leads/${lead.id}`}>
                          <Button size="sm" variant="ghost" icon={<Eye size={13} />}>Xem</Button>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {filtered.length > PAGE_SIZE && (
            <div className="px-5 py-4 border-t border-[#EDEDED]">
              <Pagination page={page} pageSize={PAGE_SIZE} total={filtered.length} onChange={setPage} />
            </div>
          )}
        </div>
      )}
    </div>
  )
}
