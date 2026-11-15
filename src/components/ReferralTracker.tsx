"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function ReferralTracker() {
  const pathname = usePathname();

  useEffect(() => {
    try {
      if (typeof window === "undefined" || !document.referrer) return;

      const referrer = document.referrer;
      fetch("/api/analytics/referral", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          referrer,
          targetPath: pathname,
        }),
      }).catch(() => {});
    } catch {
      // Non-blocking
    }
  }, [pathname]);

  return null;
}
