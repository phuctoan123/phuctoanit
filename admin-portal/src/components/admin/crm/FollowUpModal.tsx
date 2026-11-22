import { useState } from 'react'
import { Modal } from '../ui/Modal'
import { Input, Textarea } from '../ui/Input'
import { Button } from '../ui/Button'
import { createFollowUp } from '../../../lib/db'

interface FollowUpModalProps {
  open: boolean
  onClose: () => void
  leadId?: string       // nếu truyền leadId thì tạo follow-up cho lead đó
  onSuccess?: () => void
}

export function FollowUpModal({ open, onClose, leadId, onSuccess }: FollowUpModalProps) {
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [content, setContent] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const reset = () => {
    setDate('')
    setTime('')
    setContent('')
    setError(null)
  }

  const handleClose = () => {
    reset()
    onClose()
  }

  const handleSubmit = async () => {
    if (!date || !content.trim()) {
      setError('Vui lòng nhập ngày và nội dung follow-up.')
      return
    }
    if (!leadId) {
      setError('Chưa xác định được khách hàng.')
      return
    }

    const scheduledAt = time ? `${date}T${time}:00` : `${date}T09:00:00`

    setSaving(true)
    setError(null)
    const { error: err } = await createFollowUp({
      lead_id: leadId,
      scheduled_at: scheduledAt,
      content: content.trim(),
    })
    setSaving(false)

    if (err) {
      setError(err)
      return
    }

    reset()
    onSuccess?.()
    onClose()
  }

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="Tạo lịch Follow-up"
      description="Lên lịch nhắc nhở liên hệ lại với khách hàng"
      size="sm"
    >
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Ngày hẹn *"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
          <Input
            label="Giờ (tuỳ chọn)"
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
          />
        </div>

        <Textarea
          label="Nội dung cần thực hiện *"
          placeholder="VD: Gọi báo giá gói Starter, gửi proposal..."
          rows={3}
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />

        {error && (
          <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
            {error}
          </p>
        )}

        <div className="flex gap-2 justify-end pt-1">
          <Button variant="secondary" onClick={handleClose} disabled={saving}>
            Huỷ
          </Button>
          <Button variant="primary" onClick={handleSubmit} loading={saving}>
            Tạo Follow-up
          </Button>
        </div>
      </div>
    </Modal>
  )
}
