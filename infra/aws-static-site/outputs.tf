output "bucket_name" {
  description = "S3 bucket holding the site's static assets — used by scripts/deploy-aws.sh."
  value       = aws_s3_bucket.site.id
}

output "cloudfront_distribution_id" {
  description = "CloudFront distribution ID — used by scripts/deploy-aws.sh to invalidate the cache after each deploy."
  value       = aws_cloudfront_distribution.site.id
}

output "cloudfront_domain_name" {
  description = "Default CloudFront domain (*.cloudfront.net). Live and usable over HTTPS immediately, even before a custom domain is registered."
  value       = aws_cloudfront_distribution.site.domain_name
}

output "site_url" {
  description = "The URL to use as siteUrl in src/data/site.ts and site in astro.config.mjs."
  value       = local.has_domain ? "https://${var.domain_name}" : "https://${aws_cloudfront_distribution.site.domain_name}"
}

output "acm_validation_records" {
  description = "DNS records to create at your domain registrar/DNS host to validate the ACM certificate. Empty until domain_name is set; see infra/aws-static-site/README.md for the full flow."
  value = local.has_domain ? [
    for dvo in aws_acm_certificate.site[0].domain_validation_options : {
      name  = dvo.resource_record_name
      type  = dvo.resource_record_type
      value = dvo.resource_record_value
    }
  ] : []
}
