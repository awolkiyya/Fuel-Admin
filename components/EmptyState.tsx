"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ReactNode } from "react";
import { LucideIcon } from "lucide-react";

type EmptyStateProps = {
  icon: LucideIcon;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
};

export function EmptyState({
  icon:Icon,
  title,
  description,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <Card className="border-dashed">
      <CardContent className="flex flex-col items-center justify-center py-16 text-center space-y-4">

      <Icon className="h-3.5 w-3.5 shrink-0" />


        <div className="space-y-1">
          <h3 className="font-semibold">{title}</h3>

          {description && (
            <p className="text-sm text-muted-foreground max-w-sm">
              {description}
            </p>
          )}
        </div>

        {onAction && actionLabel && (
          <Button onClick={onAction}>
            {actionLabel}
          </Button>
        )}

      </CardContent>
    </Card>
  );
}