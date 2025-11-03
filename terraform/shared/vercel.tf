import {
  id = "prj_DERvzLFdawxq7KDaTKBs183e0JIK"
  to = vercel_project.mood_tracker
}

resource "vercel_project" "mood_tracker" {
  name      = "mood-tracker"
  framework = "nextjs"

  git_repository = {
    type = "github"
    repo = "twaslowski/mood-tracker"
  }
}
