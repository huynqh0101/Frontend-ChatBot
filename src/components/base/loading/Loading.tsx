import { Spinner, type SpinnerProps } from '@/components/base/spinner/Spinner'
import { cn } from '@/lib/utils'

interface LoadingProps {
  /**
   * Spinner variant to use
   */
  variant?: SpinnerProps['variant']
  /**
   * Size of the spinner
   */
  size?: number
  /**
   * Main loading text
   */
  text?: string
  /**
   * Optional secondary text
   */
  subText?: string
  /**
   * Full screen loading or inline
   */
  fullScreen?: boolean
  /**
   * Additional className for container
   */
  className?: string
  /**
   * Additional className for spinner
   */
  spinnerClassName?: string
}

export function Loading({
  variant = 'circle',
  size = 48,
  text,
  subText,
  fullScreen = true,
  className,
  spinnerClassName,
}: LoadingProps) {
  const containerClasses = cn(
    'flex items-center justify-center',
    fullScreen ? 'h-screen' : 'h-full',
    'bg-gray-100 dark:bg-gray-900',
    className
  )

  return (
    <div className={containerClasses}>
      <div className="text-center">
        <Spinner
          variant={variant}
          size={size}
          className={cn(
            'mx-auto text-blue-600 dark:text-blue-400',
            spinnerClassName
          )}
        />
        {text && (
          <p className="mt-4 text-base font-medium text-gray-700 dark:text-gray-200">
            {text}
          </p>
        )}
        {subText && (
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {subText}
          </p>
        )}
      </div>
    </div>
  )
}
