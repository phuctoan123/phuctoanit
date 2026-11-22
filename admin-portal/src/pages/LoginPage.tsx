import { useState } from 'react'
import { Eye, EyeOff, Lock } from 'lucide-react'
import { Navigate, useNavigate } from 'react-router-dom'
import { Button } from '../components/admin/ui/Button'
import { Input } from '../components/admin/ui/Input'
import { useAuth } from '../hooks/useAuth'

export function LoginPage() {
  const { session, signIn, loading } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  if (!loading && session) {
    return <Navigate to="/admin" replace />
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!email || !password) {
      setError('Vui lòng nhập email và mật khẩu.')
      return
    }
    setSubmitting(true)
    const { error } = await signIn(email, password)
    setSubmitting(false)
    if (error) {
      setError('Email hoặc mật khẩu không đúng. Vui lòng thử lại.')
    } else {
      navigate('/admin', { replace: true })
    }
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-[#FA520F] flex items-center justify-center mb-4 shadow-md">
            <span className="text-white font-bold text-xl">PT</span>
          </div>
          <h1 className="text-xl font-bold text-[#1F1F1F]">Đăng nhập quản trị</h1>
          <p className="text-sm text-[#6A6A6A] mt-1 text-center">
            Quản lý website và khách hàng
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl border border-[#EDEDED] p-6 space-y-4"
          style={{ boxShadow: 'rgba(0,0,0,0.04) 0px 4px 12px' }}
        >
          <Input
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin@phuctoanit.id.vn"
            autoComplete="email"
            required
          />
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-[#4A4A4A]">Mật khẩu</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
                required
                className="w-full h-11 px-3 pr-10 text-sm text-[#1F1F1F] bg-white border border-[#C7C7C7] rounded-lg focus:outline-none focus:border-[#FA520F] focus:ring-1 focus:ring-[#FA520F] placeholder:text-[#A8A8A8] transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#A8A8A8] hover:text-[#4A4A4A] transition-colors"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 px-3 py-2.5 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
              <Lock size={14} />
              {error}
            </div>
          )}

          <Button
            type="submit"
            variant="primary"
            className="w-full"
            loading={submitting}
          >
            Đăng nhập
          </Button>
        </form>

        <p className="text-center text-xs text-[#A8A8A8] mt-6">
          phuctoanit.id.vn — Admin Portal v1.0
        </p>
      </div>
    </div>
  )
}
