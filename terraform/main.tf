resource "vercel_project" "mood_tracker" {
  name = "mood-tracker"
  framework = "nextjs"

  git_repository = {
    type = "github"
    repo = "twaslowski/mood-tracker"
  }
}
