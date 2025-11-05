locals {
  vercel_environment = var.vercel_source_branch == "main" ? "production" : "preview"
  zone_id = "4b58b66e5ed4bfc634b5b387c895bbd8"
}