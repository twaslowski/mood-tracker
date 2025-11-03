# VERCEL VARS
variable "vercel_api_key" {
  description = "The API key for Vercel."
  type        = string
  sensitive   = true
}

variable "environment" {
  description = "The target environment for Vercel deployment (production | preview)."
  type        = string
  default     = "production"
}

variable "vercel_source_branch" {
  description = "The source branch for Vercel preview deployments."
  type        = string
  default     = "main"
}

variable "app_domain" {
  description = "The custom domain for the Vercel project."
  type        = string
}

# SUPABASE VARS
variable "supabase_access_token" {
  description = "The access token for Supabase API."
  type        = string
  sensitive   = true
}

# DNS & CERT VARS
variable "cloudflare_api_key" {
  description = "The API key for Cloudflare."
  type        = string
  sensitive   = true
}

# GITHUB SSO VARS
variable "github_oauth_client_id" {
  description = "The GitHub OAuth client id for Supabase authentication."
  type        = string
  sensitive   = true
}

variable "github_oauth_client_secret" {
  description = "The GitHub OAuth client secret for Supabase authentication."
  type        = string
  sensitive   = true
}
