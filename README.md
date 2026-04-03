# HDMS

HDMS is a Next.js App Router project for role-based academic record submission, filtering, and reporting on top of Supabase.

## Stack

- Next.js + Tailwind CSS
- Supabase Auth + PostgreSQL + Storage
- CSV and PDF export routes
- AWS Amplify deployment support

## Local setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create `.env.local` from `.env.example` and set:

   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

3. In Supabase SQL Editor, run:

   - `supabase/schema.sql`
   - `supabase/seed.sql`

4. Create Auth users in Supabase. The trigger will mirror them into `public.users`.

5. Start the app:

   ```bash
   npm run dev
   ```

## Core routes

- `/login`
- `/dashboard`
- `/forms/[category]`
- `/admin`
- `/reports`

## Implementation notes

- Dynamic form values are stored in `records.form_data` as `jsonb`.
- Evidence files are stored in the private `record-files` bucket.
- Faculty access is scoped to their own records by RLS.
- Admin access is unrestricted across records and files.

## Deployment

An `amplify.yml` file is included for AWS Amplify builds. Add the same Supabase environment variables in Amplify before deploying.
