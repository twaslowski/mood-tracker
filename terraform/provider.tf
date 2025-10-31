terraform {
  required_providers {
    vercel = {
      source  = "vercel/vercel"
      version = "3.5.0"
    }
  }
}

provider "vercel" {
  api_token = var.vercel_api_key
}