variable "supabase_access_token" {
  description = "The access token for Supabase API."
  type        = string
  sensitive   = true
}

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

variable "google_oauth_client_id" {
    description = "The Google OAuth client id for Supabase authentication."
    type        = string
    sensitive   = true
}

variable "google_oauth_client_secret" {
  description = "The Google OAuth client secret for Supabase authentication."
  type        = string
  sensitive   = true
}

variable "vercel_api_key" {
  description = "The API key for Vercel."
  type        = string
  sensitive   = true
}
