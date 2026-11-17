export interface InitialCategory {
  name: string;
  slug: string;
  description: string;
  color: string;
  order: number;
  feeds: { name: string; url: string }[];
}

export const INITIAL_CATEGORIES: InitialCategory[] = [
  {
    name: "AI & Tech",
    slug: "ai-tech",
    description: "Cutting-edge artificial intelligence, frontier neural architectures, semiconductor geopolitics, and enterprise technology intelligence.",
    color: "#00f0ff",
    order: 1,
    feeds: [
      {
        name: "TechCrunch AI & Enterprise",
        url: "https://techcrunch.com/category/artificial-intelligence/feed/",
      },
      {
        name: "The Verge Tech Wire",
        url: "https://www.theverge.com/rss/index.xml",
      },
      {
        name: "VentureBeat AI Intelligence",
        url: "https://venturebeat.com/category/ai/feed/",
      },
      {
        name: "Ars Technica Silicon & Cloud",
        url: "https://feeds.arstechnica.com/arstechnica/technology-lab",
      },
      {
        name: "Wired Technology & Compute",
        url: "https://www.wired.com/feed/category/business/latest/rss",
      },
    ],
  },
  {
    name: "Crypto & Web3",
    slug: "crypto-web3",
    description: "Institutional cryptocurrency developments, decentralized liquidity networks, regulatory frameworks, and tokenized asset intelligence.",
    color: "#10b981",
    order: 2,
    feeds: [
      {
        name: "CoinDesk Institutional",
        url: "https://www.coindesk.com/arc/outboundfeeds/rss/",
      },
      {
        name: "Cointelegraph Markets",
        url: "https://cointelegraph.com/rss",
      },
      {
        name: "Decrypt Web3 Dispatches",
        url: "https://decrypt.co/feed",
      },
      {
        name: "Blockworks Macro & Crypto",
        url: "https://blockworks.co/feed",
      },
      {
        name: "Bitcoin Magazine",
        url: "https://bitcoinmagazine.com/.rss/full/",
      },
    ],
  },
  {
    name: "Global Finance",
    slug: "global-finance",
    description: "Macroeconomic forecasting, central bank monetary trajectories, treasury yield curves, and international fintech market shifts.",
    color: "#f59e0b",
    order: 3,
    feeds: [
      {
        name: "MarketWatch Top Intelligence",
        url: "https://feeds.content.dowjones.io/public/rss/mw_topstories",
      },
      {
        name: "Investing.com Macro Economy",
        url: "https://www.investing.com/rss/news_14.rss",
      },
      {
        name: "Financial Times Markets Wire",
        url: "https://www.ft.com/markets?format=rss",
      },
      {
        name: "The Economist Finance",
        url: "https://www.economist.com/finance-and-economics/rss.xml",
      },
    ],
  },
  {
    name: "Startups & Business",
    slug: "startups-business",
    description: "Venture capital deal flows, seed-to-scaleup expansion tactics, enterprise software valuations, and high-growth leadership strategy.",
    color: "#f43f5e",
    order: 4,
    feeds: [
      {
        name: "TechCrunch Startups & Venture",
        url: "https://techcrunch.com/category/startups/feed/",
      },
      {
        name: "EU-Startups European Intelligence",
        url: "https://www.eu-startups.com/feed/",
      },
      {
        name: "Sifted VC & Scaleup Coverage",
        url: "https://sifted.eu/feed",
      },
      {
        name: "GeekWire Tech Ecosystem",
        url: "https://www.geekwire.com/startups/feed/",
      },
      {
        name: "Tech in Asia Venture Track",
        url: "https://www.techinasia.com/feed",
      },
      {
        name: "Google News Venture Capital",
        url: "https://news.google.com/rss/search?q=tech+startups+venture+capital+funding+round&hl=en-US&gl=US&ceid=US:en",
      },
    ],
  },
];

export interface TrendStat {
  metric: string;
  label: string;
  context: string;
  change?: string;
}

export interface StarterArticle {
  title: string;
  seoTitle?: string;
  slug: string;
  focusKeyword?: string;
  excerpt: string;
  tldr: string;
  categorySlug: string;
  featuredImage: string;
  imageCaption: string;
  sourceName: string;
  sourceUrl: string;
  readingTime: number;
  isFeatured: boolean;
  isBreaking: boolean;
  keyTakeaways: string[];
  content: string;
  faqs: { question: string; answer: string }[];
  trendStat: TrendStat;
  topicTags: string[];
}

export const STARTER_ARTICLES: StarterArticle[] = [
  {
    title: "Frontier AI Clusters Cross 100,000 Accelerators: The New Geopolitics of Compute",
    seoTitle: "Frontier AI Clusters Cross 100K Chips: The Compute Moat",
    slug: "frontier-ai-clusters-100k-accelerators-compute-geopolitics",
    focusKeyword: "frontier AI clusters compute geopolitics",
    excerpt: "Hyper-scale cloud consortiums and sovereign wealth funds are committing tens of billions to erect gigawatt-scale data campuses, redefining global computational leverage.",
    tldr: "Hyperscale cloud consortiums are constructing gigawatt-scale data center halls housing over 100,000 synchronized accelerators. The shift transforms electrical grid interconnects and liquid thermal dissipation into sovereign competitive moats, tightening global silicon supply chains and reshaping enterprise AI training economics.",
    categorySlug: "ai-tech",
    featuredImage: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1600&q=80",
    imageCaption: "High-density modular data hall powering trillion-parameter neural training runs.",
    sourceName: "TechCrunch Enterprise",
    sourceUrl: "https://techcrunch.com",
    readingTime: 5,
    isFeatured: true,
    isBreaking: true,
    keyTakeaways: [
      "Frontier AI training facilities are shifting from megawatts to multi-gigawatt power grids.",
      "Sovereign data mandates in Europe and the Middle East are accelerating localized sovereign compute clusters.",
      "Silicon cooling architecture has decisively flipped from forced-air chillers to closed-loop direct-to-chip liquid cooling.",
      "Capital expenditures for top-tier foundational labs now exceed typical commercial aerospace investments."
    ],
    trendStat: {
      metric: "100,000+ Units",
      label: "Cluster Scaling Density",
      context: "Single-site training topology crossing gigawatt power thresholds",
      change: "+240% YoY",
    },
    topicTags: ["artificial-intelligence", "semiconductors", "compute-geopolitics"],
    content: `
      <h2>The Shift Toward Multi-Gigawatt Compute Campuses</h2>
      <p>The arms race for machine intelligence is no longer primarily constrained by algorithm theory or raw dataset availability. In 2025, the paramount operational bottleneck has migrated irrevocably toward electrical grid interconnects, power distribution, and thermal dissipation at planetary scales.</p>
      <p>Hyperscale cloud providers alongside sovereign investment vehicles are mobilizing unprecedented capital pools to construct computational facilities capable of housing over 100,000 synchronized accelerator units. Where previous generations measured data center consumption in tens of megawatts, new facility proposals routinely demand between 1.2 and 2.5 gigawatts of continuous, uninterrupted baseload power.</p>
      
      <blockquote>
        "The competitive moat of frontier artificial intelligence is no longer software weight alone; it is the physical infrastructure required to energize and cool planetary-scale matrix multiplication engines."
      </blockquote>

      <h2>Why It Matters: Silicon Geopolitics and Sovereign Infrastructure</h2>
      <p>As nation-states recognize computational capacity as a fundamental pillar of national sovereignty—parallel to energy reserves or semiconductor fabrication—foreign policy is rapidly aligning around compute bilateral pacts. Developing economies are negotiating sovereign clusters backed by subsidized clean energy contracts, ensuring domestic control over foundational reasoning models.</p>
      <p>Simultaneously, the supply chains supporting direct-to-chip liquid cooling, silicon photonics interconnects, and ultra-high-bandwidth memory (HBM4) have tightened. Export controls and technology pacts are compelling companies to engineer modular, distributed training topologies capable of bridging latency gaps across regionally partitioned campuses.</p>

      <h2>Market and Industry Impact</h2>
      <p>For enterprise technology leaders, this concentration of compute infrastructure signals a structural bifurcation in the software industry:</p>
      <ul>
        <li><strong>Infrastructure Providers:</strong> Utility providers and specialized nuclear/geothermal energy developers are commanding historic valuation multiples as compute power purchase agreements (PPAs) become Wall Street's favorite synthetic asset.</li>
        <li><strong>Application Layer:</strong> Startups are abandoning full pre-training in favor of targeted post-training, synthetic distillation, and domain-adapted reasoning wrappers, drastically optimizing unit inference economics.</li>
        <li><strong>Capital Efficiency:</strong> Institutional investors are demanding rigorous return-on-invested-capital (ROIC) calculations on model serving clusters, accelerating the migration toward speculatively decoded edge inference.</li>
      </ul>
      <p>As next-generation reasoning architectures enter mainstream production, the organizations controlling cost-optimized, low-latency compute corridors will dictate the pace of digital transformation across health, defense, and high-frequency markets.</p>
    `,
    faqs: [
      {
        question: "Why are AI clusters suddenly demanding gigawatts of power?",
        answer: "Next-generation trillion-parameter multimodal models require millions of matrix floating-point operations performed in parallel. Coordinating hundreds of thousands of chips with microsecond interconnect latency requires concentrated geographic footprints with massive, uninterruptible power feeds."
      },
      {
        question: "What is sovereign compute and why does it matter?",
        answer: "Sovereign compute refers to computational infrastructure owned, operated, and governed within a specific nation's borders to comply with national security and data privacy mandates without relying on foreign jurisdictions."
      },
      {
        question: "How does liquid cooling affect data center operational costs?",
        answer: "Direct-to-chip liquid cooling removes heat up to 3,000 times more efficiently than air cooling, reducing Power Usage Effectiveness (PUE) from 1.4 down to 1.08 and unlocking higher chip clock frequencies without thermal throttling."
      }
    ]
  },
  {
    title: "Institutional Digital Asset Inflows Hit Record Highs as Tokenized Treasuries Surpass $4B",
    seoTitle: "Institutional Crypto Inflows: Tokenized Treasuries Cross $4B",
    slug: "institutional-crypto-inflows-tokenized-treasuries-surpass-4b",
    focusKeyword: "institutional crypto tokenized treasuries RWA",
    excerpt: "Real-world asset (RWA) tokenization and regulated on-chain settlement channels are bridging the trillion-dollar gap between traditional sovereign debt and decentralized finance.",
    tldr: "On-chain tokenized US Treasuries and sovereign debt products have crossed $4.25 billion in aggregate value, driven by Tier-1 custodians launching automated atomic settlement rails. Regulated digital deposit tokens are now displacing archaic wire networks for interbank FX clearing and institutional yield access.",
    categorySlug: "crypto-web3",
    featuredImage: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&w=1600&q=80",
    imageCaption: "Digital asset ledger synchronization visualizing decentralized liquidity settlement.",
    sourceName: "CoinDesk Market Intelligence",
    sourceUrl: "https://coindesk.com",
    readingTime: 4,
    isFeatured: true,
    isBreaking: false,
    keyTakeaways: [
      "Tokenized short-term US Treasury products have surged past $4.2 billion in aggregate on-chain value.",
      "Global Tier-1 custodians are rolling out institutional deposit token rails with instantaneous T+0 atomic settlement.",
      "Regulatory alignment across Singapore, Abu Dhabi, and Switzerland has formalized the legal enforceability of tokenized claims.",
      "Decentralized liquidity protocols are increasingly absorbing sovereign yield as foundational collateral."
    ],
    trendStat: {
      metric: "$4.25 Billion",
      label: "On-Chain RWA Sovereign Debt",
      context: "Aggregate tokenized short-duration US debt held on audited public ledgers",
      change: "+310% YTD",
    },
    topicTags: ["bitcoin", "cryptocurrency", "tokenized-assets"],
    content: `
      <h2>The Convergence of Traditional Debt and Decentralized Ledgers</h2>
      <p>Over the past four quarters, the institutional narrative surrounding digital assets has matured from volatile speculative trading toward structural financial plumbing. At the center of this paradigm shift is the explosive growth of Real-World Asset (RWA) tokenization, specifically short-duration sovereign obligations.</p>
      <p>Data from decentralized liquidity tracking desks indicates that on-chain representations of US Treasuries, sovereign bills, and regulated repo agreements have officially crossed the $4.2 billion threshold. Traditional corporate treasurers are discovering that holding yield-bearing tokenized debt permits instantaneous 24/7 liquidity deployment while eliminating friction in cross-border collateralization.</p>

      <blockquote>
        "Tokenization transforms static yield into programmable, friction-free liquidity. What took two business days to settle via legacy clearing networks now executes in milliseconds on immutable ledgers."
      </blockquote>

      <h2>Why It Matters: Eliminating Settlement Friction</h2>
      <p>The standard T+1 and T+2 settlement windows prevalent in conventional clearinghouses introduce counterparty risk, margin buffers, and capital inefficiency. By tokenizing sovereign assets onto high-throughput, compliant distributed networks, institutional desks achieve atomic Delivery-versus-Payment (DvP).</p>
      <p>Furthermore, major sovereign wealth funds and private banking conglomerates have inaugurated private tokenization pipelines, allowing accredited family offices to borrow against tokenized fixed-income portfolios in automated decentralized credit markets.</p>

      <h2>Market and Industry Impact</h2>
      <p>This structural bridge is generating tangible economic effects across capital markets:</p>
      <ul>
        <li><strong>Commercial Banking Disruption:</strong> Wholesale deposit tokens issued by chartered banks are supplanting archaic wire networks for interbank FX clearing.</li>
        <li><strong>Yield Democratization:</strong> Global market participants excluded from direct Western treasury purchases can now access risk-free benchmark yields via audited smart contract vaults.</li>
        <li><strong>Risk Architecture:</strong> Smart contract audit standards and real-time oracle proof-of-reserves have become non-negotiable prerequisites for institutional asset onboarding.</li>
      </ul>
      <p>As central banks finalize digital currency (CBDC) pilot projects and stablecoin regulatory frameworks solidify, the boundary between Wall Street clearing and decentralized ledgers will continue to dissolve.</p>
    `,
    faqs: [
      {
        question: "What is an RWA (Real World Asset) in crypto?",
        answer: "RWAs are tangible financial assets—such as government bonds, real estate deeds, or commodities—represented digitally as tokens on a blockchain, enabling fractional ownership and automated settlement."
      },
      {
        question: "How do tokenized treasuries pay yield to holders?",
        answer: "Yield is typically distributed either through rebasing (increasing token quantities in investor wallets) or through accumulation (the redemption value of each token steadily increases relative to the underlying dollar benchmark)."
      },
      {
        question: "Is holding tokenized debt legal for institutional funds?",
        answer: "Yes, provided the issuing entity operates under established regulatory licenses (such as Bermuda BMA, Swiss FINMA, or Abu Dhabi FSRA) and enforces strict Know-Your-Customer (KYC) identity compliance on-chain."
      }
    ]
  },
  {
    title: "Central Banks Pivot Toward Data-Driven Rate Adjustments Amid Resilient Service Inflation",
    seoTitle: "Central Banks Rate Pivot: Service Inflation & Corporate Debt",
    slug: "central-banks-rate-adjustments-service-inflation-macro",
    focusKeyword: "central banks interest rates service inflation",
    excerpt: "Federal Reserve and ECB monetary committees recalibrate quantitative tightening schedules as stubborn wage dynamics collide with automated labor productivity gains.",
    tldr: "Global central banking committees are anchoring benchmark interest rates in restrictive territory as persistent service sector wage pressure offsets cooling durable goods inflation. Corporate treasuries face a $2.8 trillion debt refinancing wall, accelerating aggressive enterprise automation investments to preserve margins.",
    categorySlug: "global-finance",
    featuredImage: "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&w=1600&q=80",
    imageCaption: "Global trading desks processing algorithmic economic indicators and bond curve signals.",
    sourceName: "Yahoo Finance Global",
    sourceUrl: "https://finance.yahoo.com",
    readingTime: 4,
    isFeatured: true,
    isBreaking: false,
    keyTakeaways: [
      "Monetary policy committees are holding benchmark rates in restrictive territory longer than early bond curve projections suggested.",
      "Service sector wage inflation remains sticky even as durable goods pricing trends toward deflation.",
      "Capital expenditures in enterprise automation and software tooling are buffering corporate operating margins.",
      "Sovereign debt refinancing burdens are prompting increased scrutiny of fiscal deficit trajectories across G7 economies."
    ],
    trendStat: {
      metric: "4.42%",
      label: "10-Year Benchmark Yield",
      context: "Structural equilibrium rate factoring long-term productivity and energy investments",
      change: "+28 bps",
    },
    topicTags: ["macroeconomics", "monetary-policy", "central-banking"],
    content: `
      <h2>The Macroeconomic Balancing Act</h2>
      <p>Central banking authorities across North America and the Eurozone are navigating one of the most complex macro environments in recent memory. While headline Consumer Price Index figures have cooled significantly from historical peaks, underlying core service inflation—anchored by specialized labor costs and commercial real estate rent renewals—continues to exhibit persistence.</p>
      <p>Federal Reserve governors and European Central Bank officials have reiterated that future interest rate decisions will remain strictly meeting-by-meeting and data-dependent. Wall Street's aggressive hopes for rapid rate cutting cycles have been replaced by a sober recognition of a 'higher-for-longer' structural baseline.</p>

      <blockquote>
        "The neutral interest rate has likely shifted upward due to structural shifts in global supply chain redundancy, defense re-armament, and the insatiable capital appetite of energy transition infrastructure."
      </blockquote>

      <h2>Why It Matters: Corporate Balance Sheets and Debt Maturities</h2>
      <p>During the low-rate decade, multinational corporations locked in multi-year fixed corporate bonds at negligible coupons. Over the next 18 months, an estimated $2.8 trillion of this corporate credit will mature and require refinancing at substantially higher prevailing yields.</p>
      <p>Companies with robust free cash flows and low leverage ratios are capitalizing on their balance sheet strength by executing accretive share buybacks and strategic M&A. In contrast, highly leveraged zombie firms face narrowing interest coverage ratios and credit rating downgrades.</p>

      <h2>Market and Industry Impact</h2>
      <p>The macroeconomic cross-currents are producing clear sector winners and structural adjustments:</p>
      <ul>
        <li><strong>Fixed Income Resurgence:</strong> Asset allocators are locking in multi-year duration yields in sovereign and investment-grade corporate bonds, presenting attractive risk-adjusted equity alternatives.</li>
        <li><strong>Private Credit Influx:</strong> Alternative asset managers continue to vacuum up market share from commercial banks, deploying customized mezzanine and senior secured direct lending facilities.</li>
        <li><strong>Productivity Imperative:</strong> Corporate C-suites are mandating aggressive automation programs to decouple revenue growth from headcount expansion, directly stimulating enterprise AI software adoption.</li>
      </ul>
      <p>Navigating this monetary chapter demands relentless focus on liquidity buffers, disciplined balance sheet management, and prudent duration hedging.</p>
    `,
    faqs: [
      {
        question: "What does 'higher for longer' mean for everyday consumers?",
        answer: "It means mortgage rates, auto loan financing, and revolving credit card APRs will remain elevated, increasing borrowing costs while rewarding conservative cash savers with higher bank deposit yields."
      },
      {
        question: "Why has service inflation proved more stubborn than goods inflation?",
        answer: "Goods inflation is heavily impacted by global shipping bottlenecks and raw material commodities which normalize quickly. Services inflation is driven primarily by healthcare, housing, and skilled wages, which adjust gradually over longer multi-year contracts."
      },
      {
        question: "How does high interest rate policy affect startup venture funding?",
        answer: "Elevated risk-free treasury rates raise the cost of capital across the economy, compelling venture funds to focus on profitable business models and cash generation rather than growth-at-all-costs metrics."
      }
    ]
  },
  {
    title: "Venture Capital Rebounds Around Vertical SaaS and Deep-Tech Defensibility",
    seoTitle: "Venture Capital Rebounds: Vertical SaaS & Deep Tech Moats",
    slug: "venture-capital-vertical-saas-deep-tech-defensibility",
    focusKeyword: "vertical SaaS venture capital deep tech",
    excerpt: "Seed and Series A deployment accelerates for specialized domain software, autonomous manufacturing systems, and hardware-software frontier co-design.",
    tldr: "Early-stage venture capital is aggressively rebounding around vertical domain software and hardware-software frontier defensibility. Investors are rewarding capital-efficient technical teams demonstrating sub-12-month payback periods while horizontal SaaS faces multiple compression from generative code tooling.",
    categorySlug: "startups-business",
    featuredImage: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&w=1600&q=80",
    imageCaption: "Founders and engineers architecting proprietary industrial software workflows.",
    sourceName: "TechCrunch Startups",
    sourceUrl: "https://techcrunch.com",
    readingTime: 4,
    isFeatured: false,
    isBreaking: false,
    keyTakeaways: [
      "Early-stage venture rounds are increasingly concentrated in specialized vertical platforms with proprietary workflow locks.",
      "Generalist horizontal software tools are experiencing multiple compression due to automated software generation.",
      "Deep-tech verticals—including robotics foundation models, biomanufacturing, and spatial optics—command premium term sheets.",
      "Founders demonstrating sub-12-month customer payback periods are securing oversubscribed funding rounds."
    ],
    trendStat: {
      metric: "$1.84B / Day",
      label: "Deep-Tech Early Deal Flow",
      context: "Average weekly venture capital deployment into verified specialized hardware/software ventures",
      change: "+48% MoM",
    },
    topicTags: ["venture-capital", "startups", "vertical-saas"],
    content: `
      <h2>The Re-Architecting of Early-Stage Venture Investing</h2>
      <p>Following two years of rigorous valuation resets, global venture capital deployment has entered a distinct phase of disciplined acceleration. Rather than underwriting generic horizontal tools that risk disintermediation by native AI platforms, prominent venture partnerships are deploying capital into deeply entrenched vertical monopolies.</p>
      <p>From automated aerospace compliance platforms to specialized legal evidentiary engines, software companies that embed themselves directly within high-friction regulated operations are securing premium pricing power and near-zero churn rates.</p>

      <blockquote>
        "The question for investors is no longer 'Can this be built?' but 'What prevents a competitor from generating this entire application with an autonomous coding agent next quarter?' Defensibility lies in proprietary data loops and physical execution integration."
      </blockquote>

      <h2>Why It Matters: The Flight to Deep Defensibility</h2>
      <p>The commoditization of baseline code generation has drastically reduced the cost of launching prototype applications. Consequently, investors have elevated their standard of defensibility. Capital is gravitating toward founders who possess unfair domain distribution advantages or who combine software orchestration with physical-world robotics, sensor telemetry, and hardware co-design.</p>
      <p>Startup capitalization tables have also become leaner. Modern technical teams of six to eight senior engineers are routinely achieving Annual Recurring Revenue (ARR) milestones that historically necessitated fifty full-time personnel.</p>

      <h2>Market and Industry Impact</h2>
      <p>The startup landscape is witnessing a structural transformation in founder strategy:</p>
      <ul>
        <li><strong>Micro-Unicorn Emergence:</strong> Capital-efficient organizations reaching $100M+ enterprise valuations with minimal cumulative dilution and ultra-lean headcounts.</li>
        <li><strong>Strategic Corporate M&A:</strong> Legacy Fortune 500 incumbents are pursuing bolt-on acquisitions of applied automation startups to modernize proprietary legacy mainframes.</li>
        <li><strong>Syndicate Evolution:</strong> Angel networks and institutional venture arms are prioritizing operators with direct regulatory or scientific domain credentials over generic growth marketers.</li>
      </ul>
      <p>As venture dynamics stabilize, founders who execute with extreme capital discipline while building durable institutional moats stand poised to capture generational market leadership.</p>
    `,
    faqs: [
      {
        question: "What is Vertical SaaS compared to Horizontal SaaS?",
        answer: "Horizontal SaaS builds generic software tools (like general CRM, spreadsheets, or chat) used across all industries. Vertical SaaS designs bespoke software tailored entirely to the regulatory, workflow, and compliance needs of a single specific vertical (such as construction, dental surgery, or aerospace machining)."
      },
      {
        question: "What is a 'proprietary data loop'?",
        answer: "It is an engineering feedback system where customer usage of the software generates unique, proprietary operational data that cannot be scraped from the public web, continuously fine-tuning the company's internal models and strengthening its competitive moat."
      },
      {
        question: "Why are venture-backed team sizes getting smaller?",
        answer: "Advanced AI engineering copilots, serverless cloud platforms, and automated continuous deployment allow small technical teams to produce software volume and complexity that previously required large engineering departments."
      }
    ]
  }
];
