import crypto from "crypto";

export function generateContentHash(title: string, url: string): string {
  // Normalize URL (strip tracking parameters like utm_*, ref, etc.)
  let cleanUrl = url.trim().toLowerCase();
  try {
    const parsed = new URL(url);
    parsed.searchParams.delete("utm_source");
    parsed.searchParams.delete("utm_medium");
    parsed.searchParams.delete("utm_campaign");
    parsed.searchParams.delete("utm_term");
    parsed.searchParams.delete("utm_content");
    parsed.searchParams.delete("ref");
    parsed.searchParams.delete("fbclid");
    cleanUrl = parsed.origin + parsed.pathname;
  } catch {
    // If not a standard URL, use raw trimmed string
  }

  const cleanTitle = title.trim().toLowerCase().replace(/\s+/g, " ");
  return crypto.createHash("sha256").update(`${cleanUrl}::${cleanTitle}`).digest("hex");
}
