import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog"

import { cn } from "@/lib/utils"


type BaseModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  children: React.ReactNode

  className?: string
}


export function BaseModal({
  open,
  onOpenChange,
  title,
  children,
  className,
}: BaseModalProps) {

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >

      <DialogContent
        className={cn(
          "w-full",
          className
        )}
      >

        <DialogHeader>
          <DialogTitle>
            {title}
          </DialogTitle>
        </DialogHeader>


        <div className="space-y-4">
          {children}
        </div>


      </DialogContent>

    </Dialog>
  )
}