# 🎧 Vyre (WIP)

**Vyre** is a modern music web application built with **Next.js**, designed to deliver a fast, responsive, and immersive listening experience directly in the browser.

## 🚀 Introduction

Vyre is a lightweight and scalable music platform that allows users to discover, stream, and enjoy music seamlessly. Built with the power of **Next.js**, it focuses on performance, smooth UI interactions, and a clean developer-friendly architecture.

---

# 🛠️ How to Setup

Follow these steps to run **Vyre** locally.

---

## 1. Clone or Download the Repository

Clone the repository using Git, or download the project ZIP and extract it to your desired location.

```bash
git clone https://github.com/your-username/vyre.git
cd vyre
```

---

## 2. Install Dependencies

This project uses **pnpm** as the package manager.

```bash
pnpm install
```

---

## 3. Setup a Supabase Backend

Vyre requires a **Supabase Cloud backend** for authentication, database, and file storage.

You must create **your own Supabase project** instead of using a shared backend. This is important because the platform may store **user-uploaded or copyrighted music**, so each deployment should operate on its own backend and storage for legal and security reasons.

Steps:

1. Go to https://supabase.com
2. Create a new project
3. Open your project dashboard
4. Copy the **Project URL**
5. Copy the **Publishable (anon) key**

---

## 4. Configure the Database (SQL Setup)

After creating your Supabase project, you must initialize the database schema.
You can find the relevant sql scripts under the sql folder.

1. Open your **Supabase Dashboard**
2. Navigate to **SQL Editor**
3. Create a **New Query**
4. Use the scripts under the **SQL** folder. Make sure to run them in order.
5. For Script #1, you need to enable the hook function **custom_access_token_hook** under **Authentication -> (Auth) Hooks** -> **Add Hook**. 
   1. Select **Add Customize Access Token (JWT) Claims hook**
   2. Hook Type: **Postgres**
   3. Postgres Schema: **Public**
   4. Under Postgres Function select the new function.
   5. Click Create Hook

---

## 5. Set Up Storage Buckets

This step must be completed manually in Supabase.

### 5.1. Create the Buckets

1. Open your **Supabase Dashboard**
2. Navigate to **Storage**
3. Click **New Bucket**
4. Create the following buckets:

- `cover-art`
- `music`

---

### 5.2. Configure Bucket Policies

1. Go to the **Policies** tab
2. Click **New Policy**
3. Select **For Full Customization**
4. Enable the following permissions:
   - `Select`
   - `Insert`
   - `Update`
5. Under **Policy Definition**, enter the following SQL:

Replace bucket-id with the name of the bucket (for example, music or cover-art).

```sql
((bucket_id = 'bucket-id'::text) AND (auth.role() = 'authenticated'::text))
```

---

## 6. Create Environment Variables

Create a file in the root of the project called:

```
.env.local
```

Add the following configuration:

```env
NEXT_PUBLIC_SUPABASE_URL=YOUR_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=YOUR_PUB_KEY
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

Replace:

* `YOUR_SUPABASE_URL` with your Supabase project URL
* `YOUR_PUB_KEY` with your Supabase publishable key

⚠️ In production, replace `NEXT_PUBLIC_SITE_URL` with your actual website domain.

---

## 7. (Optional) Generate TypeScript Types

You can generate database types directly from Supabase. This allows your queries to be fully type-safe. You will need to link your supabase project with the CLI.

```bash
pnpm run supabase-types
```


This will generate TypeScript types for your database schema.

You can then import them in your project for better autocomplete and type safety when working with Supabase.

---

## 8. Start the Development Server

Run the development server:

```bash
pnpm dev
```

Then open your browser and visit:

```
http://localhost:3000
```

---
