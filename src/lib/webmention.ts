export interface WebmentionResult {
  target: string;
  endpoint: string | null;
  sent: boolean;
  status?: number;
  error?: string;
}

export async function sendOutboundWebmention(
  sourceArticleUrl: string,
  targetCitationUrl: string
): Promise<WebmentionResult> {
  const result: WebmentionResult = {
    target: targetCitationUrl,
    endpoint: null,
    sent: false,
  };

  try {
    const urlObj = new URL(targetCitationUrl);
    // Ignore invalid or internal targets
    if (urlObj.hostname === "trendintel.blog" || urlObj.hostname === "localhost") {
      return result;
    }

    // 1. Discover Webmention endpoint via HEAD / GET
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 6000);

    const headRes = await fetch(targetCitationUrl, {
      method: "GET",
      signal: controller.signal,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36 TrendIntelBot/1.0",
        Accept: "text/html,application/xhtml+xml",
      },
    });

    clearTimeout(timeout);

    // Check Link header
    const linkHeader = headRes.headers.get("link");
    let endpointUrl: string | null = null;

    if (linkHeader) {
      const match = linkHeader.match(/<([^>]+)>;\s*rel="?(?:[^"]* )?webmention(?: [^"]*)?"?/i);
      if (match) {
        endpointUrl = match[1];
      }
    }

    // If not found in headers, inspect HTML
    if (!endpointUrl) {
      const html = await headRes.text();
      const htmlMatch =
        html.match(/<(?:link|a)[^>]+rel="?(?:[^">]* )?webmention(?: [^">]*)?"?[^>]+href="([^"]+)"/i) ||
        html.match(/<(?:link|a)[^>]+href="([^"]+)"[^>]+rel="?(?:[^">]* )?webmention(?: [^">]*)?"?/i);

      if (htmlMatch) {
        endpointUrl = htmlMatch[1];
      }
    }

    if (!endpointUrl) {
      return result; // Target site doesn't support Webmentions
    }

    // Resolve relative endpoint URL
    const resolvedEndpoint = new URL(endpointUrl, targetCitationUrl).href;
    result.endpoint = resolvedEndpoint;

    // 2. Dispatch W3C Webmention POST
    const body = new URLSearchParams();
    body.append("source", sourceArticleUrl);
    body.append("target", targetCitationUrl);

    const postRes = await fetch(resolvedEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "User-Agent": "TrendIntel-Webmention-Agent/1.0",
      },
      body: body.toString(),
    });

    result.sent = postRes.ok || postRes.status === 201 || postRes.status === 202;
    result.status = postRes.status;
    console.log(`[Webmention] Sent from ${sourceArticleUrl} to ${resolvedEndpoint} (Status: ${postRes.status})`);
  } catch (err: any) {
    result.error = err.message;
    console.warn(`[Webmention] Could not send webmention to ${targetCitationUrl}:`, err.message);
  }

  return result;
}
