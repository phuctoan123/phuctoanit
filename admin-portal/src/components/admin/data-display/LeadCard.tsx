import { Phone, Copy, Building2, Calendar } from 'lucide-react'
import { Link } from 'react-router-dom'
import { StatusBadge } from '../ui/Badge'
import { Button } from '../ui/Button'
import { formatDateShort, copyToClipboard } from '../../../lib/utils'
import type { Lead } from '../../../types/admin'

interface LeadCardProps {
  lead: Lead
  onCopy?: () => void
}

export function LeadCard({ lead, onCopy }: LeadCardProps) {
  const handleCopy = async () => {
    await copyToClipboard(lead.phone)
    onCopy?.()
  }

  return (
    <div className="bg-white border border-[#EDEDED] rounded-xl p-4 hover:border-[#C7C7C7] transition-colors">
      <div className="flex items-start justify-between gap-2 mb-3">
        <div>
          <Link to={`/admin/leads/${lead.id}`} className="font-semibold text-[#1F1F1F] hover:text-[#FA520F] transition-colors text-sm">
            {lead.name}
          </Link>
          {lead.company && (
            <div className="flex items-center gap-1 text-xs text-[#6A6A6A] mt-0.5">
              <Building2 size={11} />
              {lead.company}
            </div>
          )}
        </div>
        <StatusBadge status={lead.status} />
      </div>
      <div className="space-y-1.5 mb-3">
        <div className="flex flex-wrap gap-1">
          {lead.services.map((s) => (
            <span key={s} className="text-xs px-2 py-0.5 bg-[#F5F5F5] text-[#4A4A4A] rounded-full">
              {s}
            </span>
          ))}
        </div>
      </div>
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1 text-xs text-[#6A6A6A]">
          <Calendar size={11} />
          {formatDateShort(lead.created_at)}
        </div>
        <div className="flex gap-1">
          <Button size="sm" variant="ghost" icon={<Copy size={13} />} onClick={handleCopy}>
            Copy SĐT
          </Button>
          <a
            href={`tel:${lead.phone}`}
            className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1.5 rounded-lg text-[#4A4A4A] hover:bg-[#F5F5F5] transition-colors"
          >
            <Phone size={13} />
            Gọi
          </a>
        </div>
      </div>
    </div>
  )
}

