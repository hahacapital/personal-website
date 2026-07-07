# Only created once `domain_name` is set. Must live in us-east-1 — a hard
# AWS requirement for any certificate attached to a CloudFront distribution.
resource "aws_acm_certificate" "site" {
  count = local.has_domain ? 1 : 0

  provider                  = aws.us_east_1
  domain_name               = var.domain_name
  subject_alternative_names = var.subject_alternative_names
  validation_method         = "DNS"

  lifecycle {
    create_before_destroy = true
  }
}

# Blocks `apply` until ACM confirms DNS validation succeeded. Populate
# `var.acm_validation_fqdns` with the CNAME records you created at your DNS
# provider (see the acm_validation_records output) before applying this.
resource "aws_acm_certificate_validation" "site" {
  count = local.has_domain ? 1 : 0

  provider                = aws.us_east_1
  certificate_arn         = aws_acm_certificate.site[0].arn
  validation_record_fqdns = var.acm_validation_fqdns
}
