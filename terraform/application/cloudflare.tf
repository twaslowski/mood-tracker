resource "cloudflare_dns_record" "dns" {
  name    = var.app_domain
  ttl     = 36000
  type    = "CNAME"
  zone_id = "4b58b66e5ed4bfc634b5b387c895bbd8"
  content = "cname.vercel-dns.com"
  comment = "managed-by:terraform;application:moody"
}