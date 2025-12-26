
resource "bunnynet_storage_zone" "www" {
	name                 = "${var.service_name}-web"
	zone_tier            = "Standard"
	region               = "UK"
	replication_regions  = ["BR", "NY", "LA", "SG", "SYD"]
}

resource "bunnynet_pullzone" "www" {
	name         = "${var.service_name}-web"
	cors_enabled = false

	origin {
		type        = "StorageZone"
		storagezone = bunnynet_storage_zone.www.id
	}

	routing {
		tier  = "Standard"
		zones = ["AF", "ASIA", "EU", "SA", "US"]
	}
}

resource "bunnynet_pullzone_hostname" "bunnynet_www" {
	pullzone    = bunnynet_pullzone.www.id
	name        = "${var.service_name}-web.b-cdn.net"
	tls_enabled = true
	force_ssl   = true
}

resource "bunnynet_pullzone_hostname" "www" {
	pullzone    = bunnynet_pullzone.www.id
	name        = "${var.service_name}.${data.bunnynet_dns_zone.dns.domain}"
	tls_enabled = true
	force_ssl   = false
}

resource "bunnynet_pullzone_edgerule" "redirect_pullzone_domain" {
	enabled     = true
	pullzone    = bunnynet_pullzone.www.id
	description = "Redirect pullzone domain to cdn domain."

	actions = [
		{
			type       = "Redirect"
			parameter1 = "https://${bunnynet_pullzone_hostname.www.name}"
			parameter2 = "301"
			parameter3 = null
		}
	]

	match_type = "MatchAny"
	triggers = [
		{
			type       = "Url"
			match_type = "MatchAny"
			patterns   = [
				"https://${bunnynet_pullzone_hostname.bunnynet_www.name}/*"
			]
			parameter1 = null
			parameter2 = null
		}
	]
}
