import {
  id = "iwegsqflyrbynymrvfqa"
  to = supabase_project.production
}

# Supabase free tier only provides one environment, so only create for production
resource "supabase_project" "production" {
  organization_id   = "znyzmuexwtcdboygolnu"
  name              = "mood-tracker"
  database_password = "tf-example"
  region            = "eu-west-1"
  lifecycle {
    ignore_changes = [database_password]
  }
}

resource "supabase_settings" "production" {
  project_ref = supabase_project.production.id

  api = jsonencode({
    db_schema            = "public,graphql_public"
    db_extra_search_path = "public,extensions"
    max_rows             = 1000
  })

  auth = jsonencode({
    external_github_enabled       = true
    external_github_client_id     = var.github_oauth_client_id
    external_github_client_secret = var.github_oauth_client_secret

    site_url                     = "https://moody.twaslowski.com"
  })
}
