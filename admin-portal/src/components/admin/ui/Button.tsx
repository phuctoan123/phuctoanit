import { cn } from '../../../lib/utils'

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger'
type ButtonSize = 'sm' | 'md' | 'lg'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  loading?: boolean
  icon?: React.ReactNode
  iconRight?: React.ReactNode
}

const variantClasses: Record<ButtonVariant, string> = {
  primary: 'bg-[#FA520F] text-white hover:bg-[#E04800] active:bg-[#CC3A05] disabled:bg-[#E5E5E5] disabled:text-[#A8A8A8]',
  secondary: 'bg-white text-[#1F1F1F] border border-[#C7C7C7] hover:bg-[#FAFAFA] active:bg-[#EDEDED] disabled:opacity-50',
  ghost: 'bg-transparent text-[#4A4A4A] hover:bg-[#F5F5F5] active:bg-[#EDEDED] disabled:opacity-50',
  danger: 'bg-red-600 text-white hover:bg-red-700 active:bg-red-800 disabled:opacity-50',
}

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'h-8 px-3 text-xs gap-1.5',
  md: 'h-10 px-4 text-sm gap-2',
  lg: 'h-11 px-5 text-sm gap-2',
}

export function Button({
  variant = 'secondary',
  size = 'md',
  loading = false,
  icon,
  iconRight,
  children,
  className,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center font-medium rounded-lg transition-colors duration-150 cursor-pointer select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FA520F] focus-visible:ring-offset-1',
        variantClasses[variant],
        sizeClasses[size],
        (disabled || loading) && 'cursor-not-allowed',
        className,
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : icon}
      {children && <span>{children}</span>}
      {!loading && iconRight}
    </button>
  )
}

