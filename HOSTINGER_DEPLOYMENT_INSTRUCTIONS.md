# Hostinger Step-by-Step Deployment Guide for TrendIntel.blog

This package is self-contained and pre-built for **Hostinger Node.js Web Hosting** and **Hostinger Cloud/VPS Hosting**.

---

## Deployment Package Information

* **Archive:** `hostinger-deploy.zip`
* **Startup File:** `server.js`
* **Node.js Compatibility:** Version 20.x LTS or 22.x LTS
* **Dependencies:** Pre-bundled in `node_modules` (no build step required on Hostinger)

---

## Step 1: Upload to Hostinger

1. Log in to your **Hostinger hPanel** (https://hpanel.hostinger.com).
2. Go to **Websites** > click **Manage** on your domain (`trendintel.blog`).
3. Open **Files** > **File Manager**.
4. Navigate to your website root directory (`public_html` or domain folder).
5. Click **Upload** (top right) and select `hostinger-deploy.zip`.
6. Right-click `hostinger-deploy.zip` and choose **Extract**. Extract all files into the root directory.

---

## Step 2: Configure Node.js in Hostinger hPanel

1. In hPanel, use the left search bar and type **"Node.js"**.
2. Click **Node.js** and set the following parameters:
   * **Node.js Version:** `20.x` or `22.x`
   * **Application Mode:** `Production`
   * **Application Root:** `/public_html` (or your domain folder)
   * **Application Startup File:** `server.js`
3. Click **Save Changes**.

---

## Step 3: Create MySQL Database & Environment Variables

### 3A. Create Database
1. In hPanel, go to **Databases** > **MySQL Databases**.
2. Create a new database:
   * **Database Name:** e.g. `u123456789_trendintel`
   * **Username:** e.g. `u123456789_trenduser`
   * **Password:** your secure database password
3. Note the Database Host (usually `localhost` or `127.0.0.1:3306`).

### 3B. Create `.env` file
In the File Manager root directory, create a `.env` file (or edit `.env.example` and rename it to `.env`):

```env
# Database connection string
DATABASE_URL="mysql://u123456789_trenduser:your_db_password@127.0.0.1:3306/u123456789_trendintel"

# Google Gemini API key (Free at https://aistudio.google.com/)
GEMINI_API_KEY="your-gemini-api-key-here"

# Pexels API key (Free at https://www.pexels.com/api/)
PEXELS_API_KEY="your-pexels-api-key-here"

# Secure Cron execution token
CRON_SECRET="trendintel_cron_secure_token_change_in_production_894172"

# Bureau Security Key for /admin login
ADMIN_PASSWORD="TrendIntelBureauAdminPass2025!"

# Canonical URL
NEXT_PUBLIC_SITE_URL="https://trendintel.blog"
NODE_ENV="production"
PORT=3000
```

> **Note:** If you don't connect MySQL right away, TrendIntel will automatically use the built-in local store (`data/local-store.json`) with zero errors.

---

## Step 4: Run Database Schema Push (One-Time)

In Hostinger hPanel:
1. Open **Advanced** > **SSH Access** (or Terminal).
2. Connect to your site directory:
   ```bash
   cd public_html
   npx prisma db push
   ```
This creates all required tables (`Article`, `Category`, `Feed`, `CronLog`, `SiteSetting`, `ReferralVisit`) in your MySQL database.

---

## Step 5: Start / Restart the Application

1. Return to the **Node.js** section in hPanel.
2. Click **"Restart Application"** or **"Start Application"**.
3. Visit `https://trendintel.blog` in your browser. Your newsroom is live!

---

## Step 6: Configure 50 Blogs/Day Cron Job

To automate the publishing of ~50 stories every 24 hours:

1. In hPanel, go to **Advanced** > **Cron Jobs**.
2. Select **Custom** schedule.
3. Set the schedule to every 30 minutes:
   * **Minutes:** `*/30`
   * **Hours:** `*`
   * **Day:** `*`
   * **Month:** `*`
   * **Day of week:** `*`
4. In the **Command** field, enter:
   ```bash
   curl -s "https://trendintel.blog/api/cron/publish?key=trendintel_cron_secure_token_change_in_production_894172" > /dev/null
   ```
5. Click **Save**.

---

## Step 7: Monetization (Google AdSense) Roadmap

1. **Keep Ads OFF during domain review:** The site is pre-configured with ads disabled (`adsEnabled: false`). No blank ad containers or placeholder text will appear.
2. **Submit to AdSense:** Add `https://trendintel.blog` in your Google AdSense console.
3. **Turn ON after approval:** Once Google approves your domain, log in to `https://trendintel.blog/admin`, navigate to **Monetization & Ads**, paste your `ca-pub-XXXXXXXXXXXXXXXX` ID, and click **SWITCH ADS ON**. Live advertisements will instantly activate.
