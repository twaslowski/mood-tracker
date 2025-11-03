# Since there is only one instance of Supabase in the free tier,
# all Supabase environment variables point to the same Supabase project across all environments.
resource "vercel_project_environment_variable" "supabase_url" {
  project_id = var.vercel_project_id
  key        = "NEXT_PUBLIC_SUPABASE_URL"
  value      = "https://iwegsqflyrbynymrvfqa.supabase.co"
  target     = ["production", "preview"]

  git_branch = var.vercel_source_branch
}

resource "vercel_project_environment_variable" "supabase_publishable_key" {
  project_id = var.vercel_project_id
  key        = "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY"
  value      = "sb_publishable_LGBKaf-s3vfHy-HFtkvvJQ_1aJ0cR3Q"
  target     = ["production", "preview"]

  git_branch = var.vercel_source_branch
}

resource "vercel_project_domain" "domain_production" {
  project_id = var.vercel_project_id
  domain     = var.app_domain

  git_branch = var.vercel_source_branch
}
