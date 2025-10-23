import React from 'react'
import { AlertTriangle, Trash2, X } from 'lucide-react'
import { Button } from '@/components/custom/button'

interface ConfirmDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  description: string
  confirmText?: string
  cancelText?: string
  variant?: 'danger' | 'warning' | 'info'
}

export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'danger',
}: ConfirmDialogProps) {
  if (!isOpen) return null

  const variantStyles = {
    danger: {
      icon: <Trash2 className="h-6 w-6 text-red-600 dark:text-red-400" />,
      confirmBtn:
        'bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600',
    },
    warning: {
      icon: (
        <AlertTriangle className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
      ),
      confirmBtn:
        'bg-yellow-600 hover:bg-yellow-700 dark:bg-yellow-500 dark:hover:bg-yellow-600',
    },
    info: {
      icon: (
        <AlertTriangle className="h-6 w-6 text-blue-600 dark:text-blue-400" />
      ),
      confirmBtn:
        'bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600',
    },
  }

  const style = variantStyles[variant]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Dialog */}
      <div className="animate-in fade-in zoom-in-95 relative z-10 w-full max-w-md duration-200">
        <div className="mx-4 rounded-lg bg-white p-6 shadow-xl dark:bg-gray-800">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 transition-colors hover:text-gray-600 dark:hover:text-gray-200"
          >
            <X className="h-5 w-5" />
          </button>

          {/* Icon */}
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20">
            {style.icon}
          </div>

          {/* Content */}
          <div className="mb-6">
            <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
              {title}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              {description}
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <Button
              onClick={onClose}
              variant="outline"
              className="flex-1 border-gray-300 hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700"
            >
              {cancelText}
            </Button>
            <Button
              onClick={() => {
                onConfirm()
                onClose()
              }}
              className={`flex-1 text-white ${style.confirmBtn}`}
            >
              {confirmText}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
