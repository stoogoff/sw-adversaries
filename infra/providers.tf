
terraform {
	required_providers {
		bunnynet = {
			source = "BunnyWay/bunnynet"
		}
	}
}

provider "bunnynet" {
	api_key = var.bunny_api_key
}
