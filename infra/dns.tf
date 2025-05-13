
data "bunnynet_dns_zone" "dns" {
	domain = var.domain
}

resource "bunnynet_dns_record" "primary" {
	zone = data.bunnynet_dns_zone.dns.id

	name  = "swa"
	type  = "CNAME"
	value = "${bunnynet_pullzone.www.name}.${bunnynet_pullzone.www.cdn_domain}"
}
