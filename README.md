# Pulselog

A flexible mental health tracker with custom metrics, frictionless data entry, and insightful visualizations.
Track anything from mood and energy to medication effects and chronic pain patterns.
Designed to be the tracker you'll actually keep using.

## Background

- Most mood apps use standardized metrics that don't reflect individual circumstances.
  Someone managing chronic pain needs different tracking than someone working on social anxiety.
  Pulselog aims to solve that by allowing users to create highly flexible metrics that adapt to their personal needs.
- Mental health tracking fails when it becomes a chore. High friction = forgotten entries = useless data.
  Pulselog aims to minimize friction even when tracking a large amount of data.
- Raw data without insights is overwhelming. People need to see patterns – "I sleep worse after evening screen time"
  or "my anxiety spikes on Sundays" – to actually benefit from tracking.

## Features

- Large variety of pre-existing metrics to choose from
- Creation of custom metrics to adapt to user needs
- Low-friction entry creation through the concept of "baselines", which pre-select standard values for users when
  recording entries
- Different visualization options optimised for horizontal and vertical viewports, with statistical insights on the
  roadmap

## Architecture

This project uses the following services:

- [NextJS](https://nextjs.org/) - React framework for building web applications. Hosted
  on [Vercel](https://vercel.com/).
- [Supabase](https://supabase.com/) - Backend as a service providing database, authentication, and storage.
  Hosted on Supabase's cloud. Functionalities used: Auth and Database.

Additionally, Google and GitHub OAuth providers are used for authentication. That means you'll have to set up OAuth
credentials in Google Cloud Console and GitHub Developer Settings.

# Running

Nothing is stopping you from running Pulselog yourself. You just need a Supabase account and somewhere to host a NextJS
app.

## Running locally

This is arguably the easiest way to quickly run. A Taskfile.yaml is available to simplify standard lifecycle tasks.
However, you can even run Pulselog without the Taskfile:

```shell
supabase start
pnpm run
```

You may have to adjust the `.env.local` file, which contains the publishable key for your local Supabase instance.

## Testing & Building

Running `task build` formats, lints, tests and builds Pulselog. 
It is essentially your whole CI workflow in a single command.

## Configuring Supabase & Vercel

All infrastructure is managed with Terraform in the `terraform/` directory. There are two subdirectories:

- `shared/`: Manages the Vercel and Supabase projects
- `application/`: Manages Cloudflare DNS and letsencrypt certificates as well as Vercel domains and environment
  variables, which can vary across environments

Supabase config and database seeding is managed in `supabase/`; configuration can be pushed via `supabase config push`,
database migrations can be pushed with `supabase db push`.
