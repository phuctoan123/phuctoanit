import { formatRelativeTime } from '../../../lib/utils'
import type { LeadActivity } from '../../../types/admin'
import { cn } from '../../../lib/utils'

const activityConfig = {
  created: { label: 'Lead được tạo', color: 'bg-blue-500' },
  status_changed: { label: 'Thay đổi trạng thái', color: 'bg-purple-500' },
  note_added: { label: 'Ghi chú', color: 'bg-[#FA520F]' },
  follow_up_created: { label: 'Đặt lịch Follow-up', color: 'bg-green-500' },
  follow_up_completed: { label: 'Hoàn tất Follow-up', color: 'bg-teal-500' },
  info_updated: { label: 'Cập nhật thông tin', color: 'bg-gray-500' },
}

interface ActivityTimelineProps {
  activities: LeadActivity[]
  className?: string
}

export function ActivityTimeline({ activities, className }: ActivityTimelineProps) {
  const sorted = [...activities].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
  )

  return (
    <div className={cn('space-y-0', className)}>
      {sorted.map((activity, idx) => {
        const config = activityConfig[activity.type]
        return (
          <div key={activity.id} className="flex gap-3">
            <div className="flex flex-col items-center">
              <div className={cn('w-2.5 h-2.5 rounded-full mt-1 flex-shrink-0', config.color)} />
              {idx < sorted.length - 1 && (
                <div className="w-px flex-1 bg-[#EDEDED] mt-1" />
              )}
            </div>
            <div className="pb-4 flex-1 min-w-0">
              <div className="flex items-baseline gap-2 flex-wrap">
                <span className="text-xs font-medium text-[#4A4A4A]">{config.label}</span>
                <span className="text-xs text-[#A8A8A8]">{formatRelativeTime(activity.created_at)}</span>
              </div>
              {activity.content && (
                <p className="text-sm text-[#6A6A6A] mt-1 leading-5">{activity.content}</p>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}

