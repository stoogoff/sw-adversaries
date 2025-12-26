
terraform {
	backend "local" {
		path = "state/terraform.tfstate"
	}
}
