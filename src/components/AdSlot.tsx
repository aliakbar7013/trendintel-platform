import Script from "next/script";
import { getSiteSettings } from "@/lib/db";

interface AdSlotProps {
  slotId?: string;
  client?: string;
  format?: "horizontal" | "rectangle" | "responsive";
  className?: string;
  enabled?: boolean;
}

/**
 * Google AdSense Slot Component
 *
 * NOTE FOR ADSENSE REVIEW:
 * By default, this component renders NULL (completely hidden) when adsEnabled === false.
 * Google AdSense policy rejects domains displaying empty or dummy placeholder boxes
 * during domain review. Operators can toggle ads ON in the Admin Bureau once approved.
 */
export default async function AdSlot({
  slotId = "default-slot",
  client,
  format = "horizontal",
  className = "",
  enabled,
}: AdSlotProps) {
  let isEnabled = enabled;
  let adsenseClient = client;

  // If enabled prop not explicitly passed, query current site settings
  if (isEnabled === undefined) {
    try {
      const settings = await getSiteSettings();
      isEnabled = settings.adsEnabled;
      if (!adsenseClient) {
        adsenseClient = settings.adsenseClientId;
      }
    } catch {
      isEnabled = false;
    }
  }

  // When Ads are OFF (awaiting AdSense approval), render NOTHING to keep the site clean
  if (!isEnabled) {
    return null;
  }

  const clientId = adsenseClient || "ca-pub-XXXXXXXXXXXXXXXX";

  // When Ads are ON (approved by AdSense), render the live Google AdSense ad unit & script
  return (
    <div className={`my-8 text-center overflow-hidden ${className}`}>
      <Script
        id="adsbygoogle-init"
        async
        src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${clientId}`}
        crossOrigin="anonymous"
        strategy="lazyOnload"
      />

      <div className="flex items-center justify-between border-b border-white/5 pb-1 mb-2 text-[9px] uppercase tracking-wider text-slate-500 font-mono">
        <span>Advertisement</span>
        <span className="text-slate-600">Sponsored Intelligence</span>
      </div>

      <div className="flex min-h-[90px] items-center justify-center bg-[#090b10] border border-white/5 rounded-lg p-2">
        <ins
          className="adsbygoogle"
          style={{ display: "block", minWidth: "250px", width: "100%" }}
          data-ad-client={clientId}
          data-ad-slot={slotId}
          data-ad-format={format === "responsive" ? "auto" : format}
          data-full-width-responsive="true"
        />
      </div>
    </div>
  );
}
