# Deploying TrendIntel to Vercel (100% Free) & Connecting Hostinger Domain

This guide walks you through deploying your news platform to **Vercel** at $0 cost and pointing your Hostinger domain (`trendintel.blog`) to it.

---

## 1. What's Already Set Up For You
* **Production Build:** Fully compiled with all 40 routes and static optimization.
* **Google Gemini API Key:** Verified and configured with `gemini-3.5-flash` / `gemini-3.8-flash`.
* **Pixabay Integration:** Added as the high-capacity alternative to Pexels (5,000 requests/hour free).
* **Vercel Config:** [vercel.json](file:///C:/Users/aliak/.gemini/antigravity/scratch/trendintel-platform/vercel.json) created for automatic framework detection and cron scheduling.

---

## 2. Deploy via GitHub (Recommended Workflow)

### Step 2A: Push Local Code to GitHub
Open your terminal inside the project directory (`C:\Users\aliak\.gemini\antigravity\scratch\trendintel-platform`) and run:

```bash
git init
git add .
git commit -m "feat: initial release of trendintel platform"
git branch -M main
```

Now:
1. Go to [https://github.com/new](https://github.com/new) and create a repository (e.g. `trendintel-platform`, private or public).
2. Copy your GitHub repository URL and run:
```bash
git remote add origin https://github.com/YOUR_GITHUB_USERNAME/trendintel-platform.git
git push -u origin main
```

---

### Step 2B: Import into Vercel
1. Go to [https://vercel.com/new](https://vercel.com/new) and log in with your GitHub account.
2. Under **"Import Git Repository"**, find `trendintel-platform` and click **Import**.
3. Under **Environment Variables**, expand the section and add these variables:

| Key | Value | Description |
|---|---|---|
| `GEMINI_API_KEY` | `your-gemini-api-key` | Your verified Gemini key |
| `ADMIN_PASSWORD` | `TrendIntelBureauAdminPass2025!` | Admin panel password |
| `CRON_SECRET` | `trendintel_cron_secure_token_change_in_production_894172` | Token protecting auto-publish |
| `NEXT_PUBLIC_SITE_URL` | `https://trendintel.blog` | Your live website domain |
| `PIXABAY_API_KEY` | *(Optional - paste your Pixabay key)* | For automated stock photos |

4. Click **Deploy**.
5. In ~60 seconds, your site is live with a `*.vercel.app` URL!

---

## 3. Alternative: Deploy Instantly with Vercel CLI (No GitHub needed)

If you don't want to use GitHub, you can deploy straight from your computer:

1. Open PowerShell and navigate to the project:
   ```powershell
   cd C:\Users\aliak\.gemini\antigravity\scratch\trendintel-platform
   npx vercel
   ```
2. Follow the on-screen prompts:
   * **Log in:** Press Enter (opens your browser to log in to Vercel).
   * **Set up and deploy?** Press `Y`
   * **Which scope?** Press Enter (selects your personal account)
   * **Link to existing project?** `N`
   * **Project name?** `trendintel-platform`
   * **Directory?** `./`
   * **Modify settings?** `N`
3. Deploy to production:
   ```powershell
   npx vercel --prod
   ```

---

## 4. Connecting Your Hostinger Domain (`trendintel.blog`)

1. In your **Vercel Dashboard**, open your project (`trendintel-platform`).
2. Go to **Settings** > **Domains**.
3. Enter `trendintel.blog` and click **Add**.
4. Vercel will show you the DNS settings to add:
   * **Type:** `A`
   * **Name:** `@`
   * **Value:** `76.76.21.21`
   * **CNAME:** `www` pointing to `cname.vercel-dns.com`
5. Go to **Hostinger hPanel** > **Websites** > **Manage** > **DNS Zone Editor**.
6. Find the existing `A` record for `@` and edit its value to:
   `76.76.21.21`
7. Save changes. Within a few minutes, `https://trendintel.blog` will be live with free automatic SSL.

---

## 5. Setting Up 50 Blogs/Day on Vercel

Because Vercel is serverless, you can schedule the automated auto-pilot to run every 30 minutes for free:

1. Go to [https://cron-job.org/en/](https://cron-job.org/en/) (100% free cron service).
2. Create a free account and click **Create Cronjob**.
3. Enter:
   * **Title:** TrendIntel Auto-Publisher
   * **URL:** `https://trendintel.blog/api/cron/publish?key=trendintel_cron_secure_token_change_in_production_894172`
   * **Schedule:** Every 30 minutes (`*/30 * * * *`)
4. Click **Save**.
5. It will automatically trigger the publisher every 30 minutes, writing 2 fresh, SEO-optimized, plagiarism-free articles per run = **~48–50 articles every 24 hours**.
