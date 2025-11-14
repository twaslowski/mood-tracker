variable "supabase_access_token" {
  description = "The access token for Supabase API."
  type        = string
  sensitive   = true
}

variable "vercel_api_key" {
  description = "The API key for Vercel."
  type        = string
  sensitive   = true
}
