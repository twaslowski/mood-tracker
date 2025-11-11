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

The following languages and frameworks are used:

- [TailwindCSS](https://tailwindcss.com/) - Utility-first CSS framework for styling.
- [TypeScript](https://www.typescriptlang.org/) - Typed superset of JavaScript for better developer experience and code quality

You require the following tools to run the project locally:

- [Supabase CLI](https://supabase.com/docs/guides/cli) - Command line interface for managing Supabase projects.
- [Taskfile](https://taskfile.dev/) - Task runner for automating common development tasks.

The Supabase and Vercel deployments are managed via Terraform. The Terraform code is located in the `terraform/` directory.
You require the following environment variables to deploy the infrastructure:

- `supabase_access_token` - Supabase access token for authenticating with the Supabase CLI.
- `vercel_token` - Vercel token for authenticating with the Vercel CLI.
- `app_domain` - Domain name for the application (e.g., `example.com`).
