import { useToast } from "./use-toast"
import React from "react"

interface ToastProps {
  id: string
  title?: string
  description?: string
  variant?: "default" | "destructive"
  onDismiss: (id: string) => void
}

const Toast: React.FC<ToastProps> = ({
  id,
  title,
  description,
  variant = "default",
  onDismiss,
}) => {
  const bgColor = variant === "destructive" ? "bg-red-600" : "bg-gray-800"

  return (
    <div
      className={`${bgColor} text-white rounded-lg shadow-lg p-4 mb-4 min-w-[300px] animate-slideIn`}
      role="alert"
    >
      <div className="flex justify-between items-start">
        <div>
          {title && <div className="font-medium">{title}</div>}
          {description && (
            <div className="text-sm opacity-90 mt-1">{description}</div>
          )}
        </div>
        <button
          onClick={() => onDismiss(id)}
          className="ml-4 text-white opacity-70 hover:opacity-100 transition-opacity"
        >
          ×
        </button>
      </div>
    </div>
  )
}

export function Toaster() {
  const { toasts, dismiss } = useToast()

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col items-end">
      {toasts.map((toast) => (
        <Toast key={toast.id} {...toast} onDismiss={dismiss} />
      ))}
    </div>
  )
}
