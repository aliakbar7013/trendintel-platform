export interface FetchedImage {
  url: string;
  caption: string;
  photographer?: string;
  source: "pixabay" | "pexels" | "unsplash" | "curated";
  width: number;
  height: number;
}

const CATEGORY_FALLBACK_IMAGES: Record<
  string,
  { url: string; caption: string; width: number; height: number }[]
> = {
  "ai-tech": [
    {
      url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1600&q=80",
      caption: "High-density neural network server rack architecture.",
      width: 1600,
      height: 900,
    },
    {
      url: "https://images.unsplash.com/photo-1677442136019-21780efad99a?auto=format&fit=crop&w=1600&q=80",
      caption: "Frontier artificial intelligence compute matrix visualizer.",
      width: 1600,
      height: 900,
    },
    {
      url: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1600&q=80",
      caption: "Cybersecurity and quantum computational data streams.",
      width: 1600,
      height: 900,
    },
    {
      url: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1600&q=80",
      caption: "Semiconductor wafer fabrication and microchip circuitry.",
      width: 1600,
      height: 900,
    },
  ],
  "crypto-web3": [
    {
      url: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&w=1600&q=80",
      caption: "Distributed ledger cryptography and decentralized node network.",
      width: 1600,
      height: 900,
    },
    {
      url: "https://images.unsplash.com/photo-1622979135225-d2ba269bc1df?auto=format&fit=crop&w=1600&q=80",
      caption: "Digital asset liquidity routing and tokenized treasury protocols.",
      width: 1600,
      height: 900,
    },
    {
      url: "https://images.unsplash.com/photo-1642543492481-44e81e3914a7?auto=format&fit=crop&w=1600&q=80",
      caption: "Decentralized finance smart contract verification terminal.",
      width: 1600,
      height: 900,
    },
  ],
  "global-finance": [
    {
      url: "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&w=1600&q=80",
      caption: "Global financial exchange displays and bond yield curves.",
      width: 1600,
      height: 900,
    },
    {
      url: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=1600&q=80",
      caption: "Algorithmic market analytics and macroeconomic indicators.",
      width: 1600,
      height: 900,
    },
    {
      url: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1600&q=80",
      caption: "Institutional banking district and sovereign treasury headquarters.",
      width: 1600,
      height: 900,
    },
  ],
  "startups-business": [
    {
      url: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&w=1600&q=80",
      caption: "High-growth tech enterprise strategy and product development team.",
      width: 1600,
      height: 900,
    },
    {
      url: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1600&q=80",
      caption: "Software venture engineering sprint and operational scaleup.",
      width: 1600,
      height: 900,
    },
    {
      url: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1600&q=80",
      caption: "Executive board meeting analyzing venture capital syndicate terms.",
      width: 1600,
      height: 900,
    },
  ],
};

export async function fetchEditorialImage(
  searchQuery: string,
  categorySlug: string
): Promise<FetchedImage> {
  const cleanQuery = encodeURIComponent(
    searchQuery.slice(0, 50).replace(/[^\w\s]/g, "").trim() || "technology finance"
  );

  // 1. Pixabay API (Free, Instant Key, 5000 req/hr)
  const pixabayKey = process.env.PIXABAY_API_KEY?.trim();
  if (pixabayKey) {
    try {
      const res = await fetch(
        `https://pixabay.com/api/?key=${pixabayKey}&q=${cleanQuery}&image_type=photo&orientation=horizontal&min_width=1200&per_page=5&safesearch=true`,
        { next: { revalidate: 3600 } }
      );
      if (res.ok) {
        const data = await res.json();
        if (data.hits && data.hits.length > 0) {
          const qualifying =
            data.hits.find((h: any) => h.imageWidth >= 1200) || data.hits[0];
          if (qualifying && qualifying.largeImageURL) {
            return {
              url: qualifying.largeImageURL,
              caption: qualifying.tags
                ? `Cover imagery: ${qualifying.tags}`
                : `Photo: ${qualifying.user} / Pixabay`,
              photographer: qualifying.user,
              source: "pixabay",
              width: qualifying.imageWidth || 1280,
              height: qualifying.imageHeight || 720,
            };
          }
        }
      }
    } catch (err: any) {
      console.warn("Pixabay API fetch failed:", err.message);
    }
  }

  // 2. Pexels API (If available / unpaused)
  const pexelsKey = process.env.PEXELS_API_KEY?.trim();
  if (pexelsKey) {
    try {
      const res = await fetch(
        `https://api.pexels.com/v1/search?query=${cleanQuery}&orientation=landscape&per_page=5`,
        {
          headers: { Authorization: pexelsKey },
          next: { revalidate: 3600 },
        }
      );

      if (res.ok) {
        const data = await res.json();
        if (data.photos && data.photos.length > 0) {
          const qualifyingPhoto =
            data.photos.find(
              (p: any) => p.width >= 1200 && p.height >= 675
            ) || data.photos[0];

          if (qualifyingPhoto && qualifyingPhoto.width >= 1200) {
            const bestSrc =
              qualifyingPhoto.src.large2x ||
              qualifyingPhoto.src.original ||
              qualifyingPhoto.src.landscape ||
              qualifyingPhoto.src.large;

            return {
              url: bestSrc,
              caption: qualifyingPhoto.alt || `Photo: ${qualifyingPhoto.photographer} / Pexels`,
              photographer: qualifyingPhoto.photographer,
              source: "pexels",
              width: qualifyingPhoto.width,
              height: qualifyingPhoto.height,
            };
          }
        }
      }
    } catch (err: any) {
      console.warn("Pexels API fetch failed:", err.message);
    }
  }

  // 3. Unsplash Developer API (If configured)
  const unsplashKey = process.env.UNSPLASH_ACCESS_KEY?.trim();
  if (unsplashKey) {
    try {
      const res = await fetch(
        `https://api.unsplash.com/search/photos?query=${cleanQuery}&orientation=landscape&per_page=5`,
        {
          headers: { Authorization: `Client-ID ${unsplashKey}` },
          next: { revalidate: 3600 },
        }
      );
      if (res.ok) {
        const data = await res.json();
        if (data.results && data.results.length > 0) {
          const photo = data.results[0];
          return {
            url: photo.urls.regular || photo.urls.full,
            caption: photo.alt_description || `Photo by ${photo.user.name} on Unsplash`,
            photographer: photo.user.name,
            source: "unsplash",
            width: photo.width || 1600,
            height: photo.height || 900,
          };
        }
      }
    } catch (err: any) {
      console.warn("Unsplash API fetch failed:", err.message);
    }
  }

  // 4. Curated Fallback (All curated images are verified at 1600x900 for Google Discover)
  const pool =
    CATEGORY_FALLBACK_IMAGES[categorySlug] || CATEGORY_FALLBACK_IMAGES["ai-tech"];
  const selected = pool[Math.floor(Math.random() * pool.length)];

  return {
    url: selected.url,
    caption: selected.caption,
    source: "curated",
    width: selected.width,
    height: selected.height,
  };
}
