resource "vercel_project" "mood_tracker" {
  name      = "mood-tracker"
  framework = "nextjs"

  git_repository = {
    type = "github"
    repo = "twaslowski/mood-tracker"
  }
}

import {
  id = "prj_DERvzLFdawxq7KDaTKBs183e0JIK"
  to = vercel_project.mood_tracker
}

resource "vercel_project_environment_variable" "supabase_url" {
  project_id = vercel_project.mood_tracker.id
  key        = "NEXT_PUBLIC_SUPABASE_URL"
  value      = "https://iwegsqflyrbynymrvfqa.supabase.co"
  target     = [var.environment]

  git_branch = var.vercel_source_branch
}

resource "vercel_project_environment_variable" "supabase_publishable_key" {
  project_id = vercel_project.mood_tracker.id
  key        = "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY"
  value      = "sb_publishable_LGBKaf-s3vfHy-HFtkvvJQ_1aJ0cR3Q"
  target     = [var.environment]

  git_branch = var.vercel_source_branch
}

import {
  id = "prj_DERvzLFdawxq7KDaTKBs183e0JIK/dev.moody.twaslowski.com"
  to = vercel_project_domain.domain_production
}

resource "vercel_project_domain" "domain_production" {
  project_id = vercel_project.mood_tracker.id
  domain     = var.app_domain

  git_branch = var.vercel_source_branch
}
