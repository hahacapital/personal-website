variable "aws_region" {
  description = "AWS region for the S3 bucket and every resource that isn't CloudFront/ACM (which are global/us-east-1)."
  type        = string
  default     = "ap-northeast-1" # Tokyo
}

variable "bucket_name" {
  description = "Globally-unique S3 bucket name for the site's static assets. Does not need to match the domain name."
  type        = string
}

variable "domain_name" {
  description = "Custom domain for the site (e.g. \"yixiangzhang.com\"). Leave empty (the default) to serve over CloudFront's default *.cloudfront.net domain until a real domain is registered — see infra/aws-static-site/README.md for the two-step flow to add one later."
  type        = string
  default     = ""
}

variable "subject_alternative_names" {
  description = "Additional names to cover on the ACM certificate (e.g. [\"www.yixiangzhang.com\"]). Ignored while domain_name is empty."
  type        = list(string)
  default     = []
}

variable "acm_validation_fqdns" {
  description = "FQDNs of the CNAME validation records you created at your DNS provider for the ACM certificate, once you have one (see the acm_validation_records output for what to create). Leave empty until then."
  type        = list(string)
  default     = []
}
