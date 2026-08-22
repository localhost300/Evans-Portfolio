# Supabase setup

1. Create a Supabase project.
2. Open **SQL Editor**, paste the contents of `supabase/schema.sql`, and run it.
3. Open **Authentication → Users** and create the administrator email/password.
4. Copy `.env.example` to `.env.local` and replace both placeholder values with the project URL and anon key from **Project Settings → API**.
5. Restart the development server, then visit `/admin` and sign in.

The public website can read the published `website_content` record and submit enquiries. Only authenticated users can publish content, read enquiries, or delete enquiries.
