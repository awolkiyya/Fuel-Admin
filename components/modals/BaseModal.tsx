import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog"

type BaseModalProps = {
    open: boolean
    onOpenChange: (open: boolean) => void
    title: string
    children: React.ReactNode
  }
  
  export function BaseModal({
    open,
    onOpenChange,
    title,
    children,
  }: BaseModalProps) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="w-full">
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
          </DialogHeader>
  
          <div className="space-y-4">
            {children}
          </div>
        </DialogContent>
      </Dialog>
    )
  }