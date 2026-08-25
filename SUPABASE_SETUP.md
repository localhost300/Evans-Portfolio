# Supabase setup

1. Create a Supabase project.
2. Open **SQL Editor**, paste the complete contents of `supabase/schema.sql`, and run it. The script is safe to run again when updating an existing project.
3. Open **Authentication → Users** and create the administrator email/password.
4. Copy `.env.example` to `.env.local`. Add the project URL and publishable key from **Project Settings → API Keys**. Existing projects can continue using the legacy anon key instead.
5. Restart the development server, then visit `/admin` and sign in.

The public website can read the published `website_content` record and submit enquiries. Only authenticated users can publish content or read, update, and delete enquiries. CMS fields, including the hero image path, are stored inside the `content` JSON document and do not need separate database columns.

Do not add a Supabase secret key or legacy `service_role` key to this project. They bypass Row Level Security and are unnecessary for this browser-authenticated CMS flow. Never prefix a secret key with `NEXT_PUBLIC_`.
