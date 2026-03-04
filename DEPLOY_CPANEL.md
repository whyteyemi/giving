# Deploy to cPanel (Production)

This repo contains:
- Frontend: Vite/React (static build in `dist/`)
- Backend: PHP endpoints (`api.php`, `donate.php`) + uploads
- Database: MySQL schema (`database/schema_prod_mysql.sql`)

## 0) What you need
- A domain on cPanel (e.g. `https://yourdomain.com`)
- MySQL database + user created in cPanel
- Paystack secret key (live)

## 1) Create MySQL DB + import schema
1. cPanel → **MySQL Database Wizard**
2. Create database: `cpanelUser_giving`
3. Create user: `cpanelUser_givinguser`
4. Assign **ALL PRIVILEGES**
5. Open phpMyAdmin → select the new DB → Import:
   - `database/schema_prod_mysql.sql`

## 2) Configure backend secrets
### Option A (recommended): env vars (SetEnv)
In the folder where `api.php` lives, add/update `.htaccess` with:

```apache
SetEnv APP_ENV production
SetEnv APP_URL https://yourdomain.com
SetEnv APP_SECRET <generate-a-long-random-secret>

SetEnv DB_HOST localhost
SetEnv DB_NAME cpanelUser_giving
SetEnv DB_USER cpanelUser_givinguser
SetEnv DB_PASS <db-password>

SetEnv CORS_ORIGINS https://yourdomain.com,https://www.yourdomain.com

SetEnv PAYSTACK_SECRET_KEY <your-paystack-live-secret>
```

### Option B: config.php (only if you can store outside webroot)
Copy `backend/config.sample.php` → `backend/config.php` and edit values.

## 3) Upload frontend
1. Locally (or via our build step), run: `npm run build`
2. Upload **contents** of `dist/` to: `public_html/`
3. Ensure `public_html/.htaccess` exists for SPA routing.

## 4) Upload backend
Upload these to `public_html/`:
- `api.php`
- `donate.php`
- `backend/` directory
- `uploads/` directory (create if missing)

Then create `/public_html/uploads/.htaccess` from `public_html_uploads_htaccess.txt`.

## 5) Point frontend to backend (same origin)
Default frontend expects `api.php` and `donate.php` on the same domain.
If you deploy API to a subdomain or subfolder, set:
- `VITE_API_BASE=/api` (example) at build time.

## 6) Post-deploy checklist
- Visit site home page
- Create a user, then promote to admin:
  - phpMyAdmin: `UPDATE profiles SET role='admin' WHERE email='you@example.com';`
- Test admin:
  - Add event
  - Upload media
  - Add impact record
  - Field reports CRUD
- Test donations:
  - Initialize transaction
  - Verify transaction
  - Webhook endpoint: `/donate.php?action=paystack_webhook`

## Troubleshooting
- 500 error: check cPanel error logs + confirm env vars are set correctly
- CORS error: update `CORS_ORIGINS`
- Upload fails: confirm `uploads/` permissions (0755) and PHP upload limits
