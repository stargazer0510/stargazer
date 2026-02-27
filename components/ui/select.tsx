import { forwardRef } from 'react'
import { cn } from '@/lib/utils'

// SVG chevron을 data URI로 인라인 — lucide 의존 없이 커스텀 화살표
const CHEVRON_SVG =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%239ca3af' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E"

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  hasError?: boolean
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, hasError, style, children, ...props }, ref) => {
    return (
      <select
        ref={ref}
        className={cn(
          'w-full appearance-none rounded-xl border bg-white px-3.5 py-2.5 text-sm text-gray-900',
          'focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent',
          'disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-400',
          'transition-colors',
          hasError
            ? 'border-red-400 focus:ring-red-400'
            : 'border-gray-200 hover:border-gray-300',
          className
        )}
        style={{
          backgroundImage: `url("${CHEVRON_SVG}")`,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'right 12px center',
          paddingRight: '40px',
          ...style,
        }}
        {...props}
      >
        {children}
      </select>
    )
  }
)

Select.displayName = 'Select'

export { Select }
