"use client";

import { ReactNode } from "react";
import { Button } from "@/components/ui/button";

type Props = {
  url?: string;
  title: string;
  emptyIcon: ReactNode;
  emptyText: string;
};

export function DocumentPreview({
  url,
  title,
  emptyIcon,
  emptyText,
}: Props) {
  if (!url) {
    return (
      <div className="border rounded-lg p-6 text-center text-muted-foreground">
        <div className="flex justify-center mb-2">{emptyIcon}</div>
        <p className="text-sm">{emptyText}</p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border overflow-hidden">

      {/* Preview */}
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="relative group block bg-muted/20 cursor-zoom-in"
      >
        <img
          src={url}
          alt={title}
          className="w-full max-h-96 object-contain bg-white transition-transform duration-200 group-hover:scale-[1.02]"
          loading="lazy"
        />

        <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/10 transition-colors">
          <span className="opacity-0 group-hover:opacity-100 text-white text-xs font-medium bg-black/60 px-3 py-1 rounded-full transition-opacity">
            Click to view full size
          </span>
        </div>
      </a>

      {/* Action */}
      <div className="border-t p-3 bg-muted/20">
        <Button asChild variant="outline" size="sm" className="w-full">
          <a href={url} target="_blank" rel="noopener noreferrer">
            Open document
          </a>
        </Button>
      </div>
    </div>
  );
}