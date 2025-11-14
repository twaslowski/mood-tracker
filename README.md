Generated from the NextJS Supabase starter.

The aim of this project is to cleanly rewrite my [open-mood-tracker](https://github.com/twaslowski/open-mood-tracker)
project in NextJS cleanly using Supabase as a backend. The point is to have a cleanly written and architected project
that I can use as reference for future projects, more so than actually building something that will be used
by millions of people.

## Architecture

This project uses the following services:

- [NextJS](https://nextjs.org/) - React framework for building web applications. Hosted on [Vercel](https://vercel.com/).
- [Supabase](https://supabase.com/) - Backend as a service providing database, authentication, and storage.
  Hosted on Supabase's cloud. Functionalities used: Auth, Database, Edge functions (for Telegram integration).

## Deploying Supabase

Largely, Supabase is configured via the `supabase/config.toml` file. This applies to both local and prod environments.
To apply to prod, run `supabase config push`.

To apply database schema migrations, run `supabase db push --project-ref <your-project-ref>`.
To apply the environment variables required for edge functions,
run `supabase functions env set --project-ref <your-project-ref> --env-file <env-file>`.

## Deploying to Vercel

Vercel is set up via the `vercel.tf`
