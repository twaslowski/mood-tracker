moved {
  from = cloudflare_dns_record.dns
  to   = cloudflare_dns_record.app_domain
}

resource "cloudflare_dns_record" "app_domain" {
  name    = var.app_domain
  ttl     = 36000
  type    = "CNAME"
  zone_id = local.zone_id
  content = "cname.vercel-dns.com"
  comment = "managed-by:terraform;application:moody"
}