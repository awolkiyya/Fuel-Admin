"use client"

import { Skeleton } from "@/components/ui/skeleton"

type ColumnType = "text" | "avatar" | "badge" | "actions"

interface ColumnConfig {
  width?: string
  height?: string
  type?: ColumnType
}

interface TableSkeletonProps {
  rows?: number
  columnsConfig?: ColumnConfig[]
}

export function TableSkeleton({
  rows = 8,
  columnsConfig = [],
}: TableSkeletonProps) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div
          key={rowIndex}
          className="grid items-center gap-4"
          style={{
            gridTemplateColumns: columnsConfig
              .map((col) => col.width || "1fr")
              .join(" "),
          }}
        >
          {columnsConfig.map((col, colIndex) => {
            const type = col.type || "text"

            /* -----------------------------
               COLUMN TYPES
            ------------------------------ */
            if (type === "avatar") {
              return (
                <div key={colIndex} className="flex items-center gap-3">
                  <Skeleton className="h-8 w-8 rounded-full" />
                  <div className="space-y-1">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                </div>
              )
            }

            if (type === "badge") {
              return (
                <Skeleton
                  key={colIndex}
                  className="h-5 w-16 rounded-md"
                />
              )
            }

            if (type === "actions") {
              return (
                <Skeleton
                  key={colIndex}
                  className="h-8 w-8 rounded-md ml-auto"
                />
              )
            }

            /* DEFAULT TEXT */
            return (
              <Skeleton
                key={colIndex}
                className={col.height || "h-4 w-full"}
              />
            )
          })}
        </div>
      ))}
    </div>
  )
}