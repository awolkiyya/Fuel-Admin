import { AlertTriangle } from "lucide-react"
import { Button } from "../ui/button"

/* ============================================================================
   CONFIRM DIALOG (used for destructive actions like delete)
   ============================================================================ */
   function ConfirmDialog({
    title,
    message,
    confirmLabel,
    onConfirm,
    onCancel,
  }: {
    title: string
    message: string
    confirmLabel: string
    onConfirm: () => void
    onCancel: () => void
  }) {
    return (
      <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-stone-900/40 backdrop-blur-[1px]" onClick={onCancel} />
        <div className="relative w-full max-w-sm rounded-xl bg-white p-5 shadow-2xl">
          <div className="flex items-start gap-3">
            <div className="rounded-lg bg-rose-50 p-2 text-rose-600">
              <AlertTriangle className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-stone-900">{title}</h2>
              <p className="mt-1 text-sm text-stone-500">{message}</p>
            </div>
          </div>
          <div className="mt-5 flex items-center justify-end gap-2">
            <Button variant="outline" size="sm" onClick={onCancel}>Cancel</Button>
            <Button size="sm" className="bg-rose-600 text-white hover:bg-rose-700" onClick={onConfirm}>
              {confirmLabel}
            </Button>
          </div>
        </div>
      </div>
    )
  }