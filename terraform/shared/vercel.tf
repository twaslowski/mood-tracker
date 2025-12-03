resource "vercel_project" "project" {
  name      = "pulselog"
  framework = "nextjs"

  git_repository = {
    type = "github"
    repo = "twaslowski/pulselog"
  }

  automatically_expose_system_environment_variables = true
}
