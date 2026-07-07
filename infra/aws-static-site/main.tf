terraform {
  required_version = ">= 1.9"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 6.0"
    }
  }
}

# Default provider for the S3 bucket, CloudFront distribution, and every
# other resource that isn't pinned to a specific region.
provider "aws" {
  region = var.aws_region
}

# CloudFront-linked ACM certificates must be requested in us-east-1
# regardless of which region the rest of the stack lives in — this is an
# AWS requirement, not a Terraform quirk.
provider "aws" {
  alias  = "us_east_1"
  region = "us-east-1"
}

locals {
  has_domain = var.domain_name != ""

  # `one()` safely resolves the 0-or-1 count(s) on the conditional ACM
  # resources below to null-or-value instead of erroring on a direct index
  # into a possibly-empty resource.
  acm_cert_arn = local.has_domain ? one(aws_acm_certificate_validation.site[*].certificate_arn) : null
}
