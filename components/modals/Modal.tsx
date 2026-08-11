import { X } from "lucide-react"

/* ============================================================================
   MODAL WRAPPER
   ============================================================================ */
   export  function Modal({
    title,
    subtitle,
    icon: Icon,
    onClose,
    children,
    footer,
  }: {
    title: string
    subtitle?: string
    icon: React.ElementType
    onClose: () => void
    children: React.ReactNode
    footer: React.ReactNode
  }) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-stone-900/40 backdrop-blur-[1px]" onClick={onClose} />
        <div className="relative flex max-h-[90vh] w-full max-w-lg flex-col rounded-xl bg-white shadow-2xl">
          <div className="flex items-start justify-between border-b border-stone-200 px-5 py-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-stone-900 p-2 text-amber-400">
                <Icon className="h-4 w-4" />
              </div>
              <div>
                <h2 className="text-base font-semibold text-stone-900">{title}</h2>
                {subtitle && <p className="text-xs text-stone-400">{subtitle}</p>}
              </div>
            </div>
            <button onClick={onClose} className="rounded-md p-1.5 text-stone-400 hover:bg-stone-100 hover:text-stone-600">
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto px-5 py-4">{children}</div>
          <div className="flex items-center justify-end gap-2 border-t border-stone-200 px-5 py-3.5">{footer}</div>
        </div>
      </div>
    )
  }
  