import { CheckCircle, XCircle, Info, AlertTriangle, X } from 'lucide-react'
import { cn } from '../../../lib/utils'
import type { ToastData } from '../../../types/admin'
import { ToastContext, useToastState } from '../../../hooks/useToast'

const icons = {
  success: <CheckCircle size={16} className="text-green-600" />,
  error: <XCircle size={16} className="text-red-500" />,
  info: <Info size={16} className="text-blue-500" />,
  warning: <AlertTriangle size={16} className="text-amber-500" />,
}

const bgClasses = {
  success: 'border-green-200 bg-green-50',
  error: 'border-red-200 bg-red-50',
  info: 'border-blue-200 bg-blue-50',
  warning: 'border-amber-200 bg-amber-50',
}

function ToastItem({ toast, onRemove }: { toast: ToastData; onRemove: (id: string) => void }) {
  return (
    <div
      className={cn(
        'flex items-start gap-3 px-4 py-3 rounded-lg border shadow-md min-w-[280px] max-w-sm',
        bgClasses[toast.type],
      )}
    >
      <span className="mt-0.5 flex-shrink-0">{icons[toast.type]}</span>
      <p className="text-sm text-[#1F1F1F] flex-1 leading-5">{toast.message}</p>
      <button
        onClick={() => onRemove(toast.id)}
        className="text-[#A8A8A8] hover:text-[#1F1F1F] transition-colors flex-shrink-0 mt-0.5"
      >
        <X size={14} />
      </button>
    </div>
  )
}

export function ToastContainer({ toasts, removeToast }: { toasts: ToastData[]; removeToast: (id: string) => void }) {
  return (
    <div className="fixed bottom-5 right-5 z-[100] flex flex-col gap-2">
      {toasts.map((t) => (
        <ToastItem key={t.id} toast={t} onRemove={removeToast} />
      ))}
    </div>
  )
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const toastState = useToastState()
  return (
    <ToastContext.Provider value={toastState}>
      {children}
      <ToastContainer toasts={toastState.toasts} removeToast={toastState.removeToast} />
    </ToastContext.Provider>
  )
}

