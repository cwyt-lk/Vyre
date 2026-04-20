# 🎧 Vyre

**Vyre** is a modern music web application built with **Next.js**, designed to deliver a fast, responsive, and immersive listening experience directly in the browser.

Vyre is a lightweight and scalable music platform that allows users to discover, stream, and enjoy music seamlessly. Built with the power of **Next.js**, it focuses on performance, smooth UI interactions, and a clean developer-friendly architecture.

## 🛠️ Setup Instructions

Follow these steps to run **Vyre** locally.

### Prerequisites
- Node.js (version 18 or later)
- pnpm package manager
- Git (for cloning the repository)
- Docker Desktop (required for local Supabase setup)

### 1. Clone the Repository
Clone the repository and navigate to the project directory:

```bash
git clone https://github.com/your-username/vyre.git
cd vyre
```

### 2. Install Dependencies
Install the project dependencies using pnpm:

```bash
pnpm install
```

### 3. Set Up Supabase Backend
Vyre requires a Supabase backend for authentication, database relations, and media storage. Choose between cloud or local setup.

#### Create Project & Credentials
- **Cloud Setup:**
  1. Go to [supabase.com](https://supabase.com) and create a new project.
  2. Navigate to **Project Settings > API**.
  3. Copy the **Project URL** and the **anon (public) key**.

- **Local Setup:**
  1. Install the [Supabase CLI](https://supabase.com/docs/guides/cli).
  2. Run `supabase init` in the project root.
  3. Run `supabase start` to launch Docker containers.
  4. Use the local URL and keys from the terminal output.

#### Initialize Database
Initialize the database schema by running the provided SQL scripts in order:

1. Open the **SQL Editor** (Dashboard for cloud, or `localhost:54323` for local).
2. Execute scripts `01_schema.sql` through `05_functions.sql` sequentially.
3. Ensure each script completes without errors before proceeding.

#### Enable Auth Hook (Custom JWT)
Vyre uses a `custom_access_token_hook` to inject custom claims into user tokens.

- **Cloud Setup:**
  1. Navigate to **Authentication → Hooks**.
  2. Click **Add Hook** and select **Customize Access Token (JWT) Claims**.
  3. Set **Hook Type** to `Postgres`.
  4. Set **Postgres Schema** to `public`.
  5. Select the `custom_access_token_hook` function.
  6. Click **Create Hook**.

- **Local Setup:**
  Add/update the following in `supabase/config.toml`:

  ```toml
  [auth.hook.custom_access_token]
  enabled = true
  uri = "pg-functions://postgres/public/custom_access_token_hook"
  ```

#### (Optional) Set Up OAuth Providers
Enable social login (Google, GitHub, Discord, etc.) for passwordless signup.

- **Cloud Setup:**
  1. Go to **Authentication → Providers**.
  2. Choose a provider and obtain credentials from its developer portal (e.g., [Google Cloud Console](https://console.cloud.google.com/)).
  3. Enable the provider in Supabase and enter the **Client ID** and **Secret**.
  4. Add Supabase's **Callback URL** to the provider's authorized redirect URIs.

- **Local Setup:**
  Update `supabase/config.toml`:

  ```toml
  [auth.external.google]
  enabled = true
  client_id = "your-client-id.apps.googleusercontent.com"
  secret = "your-client-secret"
  redirect_uri = "http://localhost:3000/auth/callback"
  ```

#### (Optional) Disable Email Confirmation (Cloud Only)
To skip email verification for development:

1. Open the Supabase Dashboard.
2. Navigate to **Authentication → Configuration → Auth Settings**.
3. In **Email Settings**, toggle **Confirm email** to **Off**.
4. Save changes.

#### (Optional) Admin Privilege Escalation
If you want to escalate an accounts privileges you will need to do that manually in the Supabase Backend.

1. Open the Supabase Dashboard.
2. Table Editor
3. Select the "user_roles" table
4. Adjust the associated user id and their role to "admin"

### 4. Configure Environment Variables
Create a `.env.local` file in the project root with the following:

```env
NEXT_PUBLIC_SUPABASE_URL=YOUR_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=YOUR_PUB_KEY
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

Replace placeholders with your Supabase project URL and publishable key. In production, update `NEXT_PUBLIC_SITE_URL` to your domain.

### 5. (Optional) Generate TypeScript Types
Generate type-safe database types:

```bash
# Cloud Only
pnpm supabase:types

# Local Only
pnpm supabase:types:local
```

This creates TypeScript types for better autocomplete and type safety.

### 6. Start the Development Server
Run the development server:

```bash
pnpm dev
```

Open your browser and visit `http://localhost:3000` to view the application.

### Running with Docker (Local Setup)
If you're using the local Supabase setup, manage the Docker containers with these commands:

```bash
# Start Supabase services
pnpm supabase:start

# Stop Supabase services
pnpm supabase:stop
```
