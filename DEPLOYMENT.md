# Cloudflare Pages & D1 Deployment Guide for ArthaMind

This guide outlines how to deploy **ArthaMind** to **Cloudflare Pages** with a serverless edge **Cloudflare D1 SQL database**.

---

## Prerequisites
1. A Cloudflare account (free tier works completely).
2. Node.js 18+ and npm installed.
3. Cloudflare Wrangler CLI.

---

## 1. Cloudflare Authentication
Log in to your Cloudflare account from your terminal:
```bash
npx wrangler login
```

---

## 2. Create the Cloudflare D1 Database
Create the serverless SQLite database at Cloudflare's edge:
```bash
npx wrangler d1 create arthamind-db
```

Wrangler will output a configuration block resembling:
```toml
[[d1_databases]]
binding = "DB"
database_name = "arthamind-db"
database_id = "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
```

Copy the generated `database_id` and replace the placeholder in [wrangler.toml](file:///e:/jatin/wrangler.toml):
```toml
database_id = "YOUR_ACTUAL_D1_DATABASE_ID"
```

---

## 3. Apply Schema Migrations to D1

Apply the initial schema (tables, indices, foreign keys):
```bash
# Execute against your remote Cloudflare D1 database:
npx wrangler d1 execute arthamind-db --remote --file=./migrations/0001_initial_schema.sql

# Seed initial Indian banking & UPI test data:
npx wrangler d1 execute arthamind-db --remote --file=./migrations/0002_seed_demo_data.sql
```

*(For local testing with Wrangler's local SQLite simulation, replace `--remote` with `--local`).*

---

## 4. Build and Deploy to Cloudflare Pages

Build the production bundle:
```bash
npm run build
```

Deploy the distribution directory (`dist/`) along with the Cloudflare Pages Functions (`functions/`):
```bash
npx wrangler pages deploy dist --project-name=arthamind
```

When prompted to select your project, confirm `arthamind`. Wrangler will upload your edge functions and client assets to Cloudflare's global edge network within seconds.

---

## 5. Link Cloudflare D1 to Pages Project
In the Cloudflare Dashboard:
1. Navigate to **Workers & Pages** > **Pages** > **arthamind**.
2. Go to **Settings** > **Functions** > **D1 database bindings**.
3. Add a binding:
   * **Variable name:** `DB`
   * **D1 database:** `arthamind-db`
4. Redeploy or trigger a new build.

Your app is now fully live with an edge-native SQL database! 🚀
