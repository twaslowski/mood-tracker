resource "supabase_project" "production" {
  organization_id   = "znyzmuexwtcdboygolnu"
  name              = "mood-tracker"
  database_password = "tf-example"
  region            = "eu-west-1"
  lifecycle {
    ignore_changes = [database_password]
  }
}
