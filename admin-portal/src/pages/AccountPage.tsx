import { useState } from 'react'
import { LogOut, Mail, Calendar, KeyRound } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { Button } from '../components/admin/ui/Button'
import { ConfirmDialog } from '../components/admin/ui/Modal'
import { formatDateShort } from '../lib/utils'
import { supabase } from '../lib/supabase'
import { useToast } from '../hooks/useToast'

export function AccountPage() {
  const { user, signOut } = useAuth()
  const { showToast } = useToast()
  const [confirmLogout, setConfirmLogout] = useState(false)
  const [loggingOut, setLoggingOut] = useState(false)
  const [sendingReset, setSendingReset] = useState(false)

  const handleLogout = async () => {
    setLoggingOut(true)
    await signOut()
  }

  const handleResetPassword = async () => {
    if (!user?.email) return
    setSendingReset(true)
    const { error } = await supabase.auth.resetPasswordForEmail(user.email)
    setSendingReset(false)
    if (error) {
      showToast('Không thể gửi email đặt lại mật khẩu. Thử lại.', 'error')
    } else {
      showToast('Email đặt lại mật khẩu đã được gửi!', 'success')
    }
  }

  return (
    <div className="space-y-5 max-w-xl">
      <div>
        <h1 className="text-xl font-bold text-[#1F1F1F]">Tài khoản quản trị</h1>
        <p className="text-sm text-[#6A6A6A] mt-0.5">Thông tin tài khoản và phiên đăng nhập</p>
      </div>

      <div className="bg-white rounded-xl border border-[#EDEDED] p-6 space-y-5">
        {/* Avatar */}
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-[#FA520F] flex items-center justify-center">
            <span className="text-white font-bold text-2xl">
              {user?.email?.[0]?.toUpperCase() || 'A'}
            </span>
          </div>
          <div>
            <div className="text-base font-semibold text-[#1F1F1F]">Quản trị viên</div>
            <div className="text-sm text-[#6A6A6A]">Tài khoản duy nhất</div>
          </div>
        </div>

        <div className="pt-4 border-t border-[#EDEDED] space-y-3">
          <div className="flex items-center gap-3 text-sm">
            <Mail size={15} className="text-[#A8A8A8]" />
            <span className="text-[#6A6A6A]">Email</span>
            <span className="ml-auto font-medium text-[#1F1F1F]">{user?.email}</span>
          </div>
          {user?.created_at && (
            <div className="flex items-center gap-3 text-sm">
              <Calendar size={15} className="text-[#A8A8A8]" />
              <span className="text-[#6A6A6A]">Ngày tạo tài khoản</span>
              <span className="ml-auto text-[#1F1F1F]">{formatDateShort(user.created_at)}</span>
            </div>
          )}
        </div>

        <div className="pt-4 border-t border-[#EDEDED]">
          <div className="text-xs font-medium text-[#4A4A4A] mb-3">Đổi mật khẩu</div>
          <p className="text-sm text-[#6A6A6A] mb-3">
            Sử dụng Supabase Auth để đặt lại mật khẩu qua email.
          </p>
          <Button
            variant="secondary"
            size="sm"
            icon={<KeyRound size={14} />}
            onClick={handleResetPassword}
            loading={sendingReset}
          >
            Gửi link đặt lại mật khẩu
          </Button>
        </div>

        <div className="pt-4 border-t border-[#EDEDED]">
          <Button
            variant="danger"
            icon={<LogOut size={15} />}
            onClick={() => setConfirmLogout(true)}
          >
            Đăng xuất
          </Button>
        </div>
      </div>

      <ConfirmDialog
        open={confirmLogout}
        onClose={() => setConfirmLogout(false)}
        onConfirm={handleLogout}
        title="Đăng xuất?"
        description="Bạn sẽ được chuyển về trang đăng nhập."
        confirmLabel="Đăng xuất"
        cancelLabel="Huỷ"
        loading={loggingOut}
      />
    </div>
  )
}
