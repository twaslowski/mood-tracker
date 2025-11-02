resource "vercel_project" "mood_tracker" {
  name = "mood-tracker"
  framework = "nextjs"

  git_repository = {
    type = "github"
    repo = "twaslowski/mood-tracker"
  }
}

resource "vercel_project_environment_variable" "supabase_url" {
  project_id = vercel_project.mood_tracker.id
  key  = "NEXT_PUBLIC_SUPABASE_URL"
  value = "https://iwegsqflyrbynymrvfqa.supabase.co"
  target = ["production"]
}

resource "vercel_project_environment_variable" "supabase_publishable_key" {
  project_id = vercel_project.mood_tracker.id
  key  = "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY"
  value = "sb_publishable_LGBKaf-s3vfHy-HFtkvvJQ_1aJ0cR3Q"
  target = ["production"]
}

resource "vercel_project_environment_variable" "google_oauth_client_id" {
  project_id = vercel_project.mood_tracker.id
  key  = "NEXT_PUBLIC_GOOGLE_CLIENT_ID"
  value = "168180207269-q6c3vtgb3ppsg99prtn5ousv4o4kprj5.apps.googleusercontent.com"
  target = ["production"]
}


resource "vercel_project_domain" "domain_production_www" {
  project_id = vercel_project.mood_tracker.id
  domain     = "moody.twaslowski.com"
}
