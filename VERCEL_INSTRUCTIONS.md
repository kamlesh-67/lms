# Vercel Deployment Instructions

Your application code is now **Vercel Ready**. To prevent the `MissingSecret` error and ensure a successful deployment, you **MUST** add the following Environment Variables in your Vercel Project Settings.

## 1. Go to Vercel Dashboard
Navigate to: **Settings** > **Environment Variables**

## 2. Add These Variables

| Variable Name | Value (Copy & Paste) |
|--------------|----------------------|
| **`AUTH_SECRET`** | `8f8b302bc1780b4b0099d9f660e6b32ee404245d586b933b72f9cdd69ae4a176` |
| **`DATABASE_URL`** | `mongodb+srv://kamleshprajapat858_db_user:bBYBiI15q8h71e1y@cluster0.cjwbx9h.mongodb.net/lmd?appName=Cluster0&retryWrites=true&w=majority` |

## 3. Redeploy
After adding these variables, go to the **Deployments** tab and **Redeploy** the latest commit for the changes to take effect.

---

### Why was this error happening?
NextAuth (the authentication library) requires a `secret` to encrypt sessions.
- **Locally:** We fixed it by adding `AUTH_SECRET` to your `.env` file.
- **On Vercel:** `.env` files are ignored for security (gitignored). You must manually add these keys in the Vercel dashboard.
