"use client";

import { useEffect } from "react";

export default function ViewTracker({ slug }: { slug: string }) {
  useEffect(() => {
    try {
      fetch(`/api/articles/${slug}/view`, { method: "POST" }).catch(() => {});
    } catch {
      // Non-blocking
    }
  }, [slug]);

  return null;
}
