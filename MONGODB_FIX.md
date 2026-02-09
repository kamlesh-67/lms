# MongoDB Connection Fix for Vercel

The error `Server selection timeout: No available servers` usually means Vercel cannot reach your MongoDB database because of **Network Access restrictions**.

Since Vercel uses dynamic IP addresses, you must allow access from **all IP addresses** in your MongoDB Atlas dashboard.

## 1. Go to MongoDB Atlas
Log in to your [MongoDB Atlas Dashboard](https://cloud.mongodb.com/).

## 2. Network Access
1. In the sidebar, under **Security**, click **Network Access**.
2. Click the **+ Add IP Address** button.
3. Click **Allow Access from Anywhere**.
   - It should add `0.0.0.0/0` to the whitelist.
4. Click **Confirm**.

## 3. Wait & Redeploy
- It may take 1-2 minutes for the changes to propagate.
- Once the status is "Active", try to log in to your Vercel URL again.

> **Note:** Use `0.0.0.0/0` only for production apps where dynamic IPs are required (like Vercel). Your password protection is still active and keeps your database secure.
