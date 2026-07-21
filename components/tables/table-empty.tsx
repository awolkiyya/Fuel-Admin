import { ReactNode } from 'react'

interface TableEmptyProps {
  colSpan: number
  title: string
  description?: string
  icon?: ReactNode
  action?: ReactNode
}

export function TableEmpty({
  colSpan,
  title,
  description,
  icon,
  action,
}: TableEmptyProps) {
  return (
    <tr>
      <td colSpan={colSpan} className="p-10">
        <div className="flex flex-col items-center justify-center gap-4 text-center">
          {icon}

          <div className="space-y-1">
            <h2 className="text-sm font-semibold">{title}</h2>

            {description && (
              <p className="text-xs text-muted-foreground">
                {description}
              </p>
            )}
          </div>

          {action}
        </div>
      </td>
    </tr>
  )
}
