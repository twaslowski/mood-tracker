import {
  id = "iwegsqflyrbynymrvfqa"
  to = supabase_project.production
}

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
}
