# Annoyingly, git_branch can only be specified for non-production domains.
# Therefore, this code creates two separate resources for production and development domains.
resource "vercel_project_domain" "domain_prod" {
  count = var.vercel_source_branch == "main" ? 1 : 0

  project_id = var.vercel_project_id
  domain     = var.app_domain
}

resource "vercel_project_domain" "domain_dev" {
  count = var.vercel_source_branch == "dev" ? 1 : 0

  project_id = var.vercel_project_id
  domain     = var.app_domain

  git_branch = var.vercel_source_branch
}

resource "vercel_project_environment_variable" "url" {
  project_id = var.vercel_project_id
  key        = "NEXT_PUBLIC_APPLICATION_URL"
  value      = "https://${var.app_domain}"
  target     = [local.vercel_environment]
}
