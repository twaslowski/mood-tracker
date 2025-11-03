locals {
  vercel_environment = var.vercel_source_branch == "main" ? "production" : "preview"
}