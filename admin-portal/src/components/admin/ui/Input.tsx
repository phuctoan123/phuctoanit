import { cn } from '../../../lib/utils'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  hint?: string
  icon?: React.ReactNode
  iconRight?: React.ReactNode
}

export function Input({ label, error, hint, icon, iconRight, className, id, ...props }: InputProps) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-')
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={inputId} className="text-xs font-medium text-[#4A4A4A]">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A8A8A8]">
            {icon}
          </div>
        )}
        <input
          id={inputId}
          className={cn(
            'w-full h-11 px-3 text-sm text-[#1F1F1F] bg-white border rounded-lg transition-colors',
            'placeholder:text-[#A8A8A8]',
            'focus:outline-none focus:border-[#FA520F] focus:ring-1 focus:ring-[#FA520F]',
            error ? 'border-red-400' : 'border-[#C7C7C7]',
            icon && 'pl-9',
            iconRight && 'pr-9',
            className,
          )}
          {...props}
        />
        {iconRight && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[#A8A8A8]">
            {iconRight}
          </div>
        )}
      </div>
      {error && <p className="text-xs text-red-500">{error}</p>}
      {hint && !error && <p className="text-xs text-[#6A6A6A]">{hint}</p>}
    </div>
  )
}

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  hint?: string
}

export function Textarea({ label, error, hint, className, id, ...props }: TextareaProps) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-')
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={inputId} className="text-xs font-medium text-[#4A4A4A]">
          {label}
        </label>
      )}
      <textarea
        id={inputId}
        className={cn(
          'w-full px-3 py-2.5 text-sm text-[#1F1F1F] bg-white border rounded-lg transition-colors resize-y min-h-[100px]',
          'placeholder:text-[#A8A8A8]',
          'focus:outline-none focus:border-[#FA520F] focus:ring-1 focus:ring-[#FA520F]',
          error ? 'border-red-400' : 'border-[#C7C7C7]',
          className,
        )}
        {...props}
      />
      {error && <p className="text-xs text-red-500">{error}</p>}
      {hint && !error && <p className="text-xs text-[#6A6A6A]">{hint}</p>}
    </div>
  )
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  error?: string
  options: { value: string; label: string }[]
}

export function Select({ label, error, options, className, id, ...props }: SelectProps) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-')
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={inputId} className="text-xs font-medium text-[#4A4A4A]">
          {label}
        </label>
      )}
      <select
        id={inputId}
        className={cn(
          'w-full h-11 px-3 text-sm text-[#1F1F1F] bg-white border rounded-lg transition-colors appearance-none',
          'focus:outline-none focus:border-[#FA520F] focus:ring-1 focus:ring-[#FA520F]',
          error ? 'border-red-400' : 'border-[#C7C7C7]',
          className,
        )}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  )
}

