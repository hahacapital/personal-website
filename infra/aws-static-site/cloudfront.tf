resource "aws_cloudfront_origin_access_control" "site" {
  name                              = "${var.bucket_name}-oac"
  description                       = "OAC for ${var.bucket_name} S3 origin"
  origin_access_control_origin_type = "s3"
  signing_behavior                  = "always"
  signing_protocol                  = "sigv4"
}

resource "aws_cloudfront_function" "url_rewrite" {
  name    = "${replace(var.bucket_name, ".", "-")}-url-rewrite"
  runtime = "cloudfront-js-2.0"
  comment = "Append index.html to extensionless/trailing-slash URIs (Astro static output)"
  publish = true
  code    = file("${path.module}/functions/url-rewrite.js")
}

resource "aws_cloudfront_distribution" "site" {
  enabled             = true
  is_ipv6_enabled     = true
  default_root_object = "index.html"
  comment             = "Personal website (${var.bucket_name})"
  aliases             = local.has_domain ? concat([var.domain_name], var.subject_alternative_names) : []

  origin {
    domain_name              = aws_s3_bucket.site.bucket_regional_domain_name
    origin_id                = "s3-site-origin"
    origin_access_control_id = aws_cloudfront_origin_access_control.site.id
  }

  default_cache_behavior {
    allowed_methods        = ["GET", "HEAD"]
    cached_methods         = ["GET", "HEAD"]
    target_origin_id       = "s3-site-origin"
    viewer_protocol_policy = "redirect-to-https"

    # AWS managed "CachingOptimized" policy — current replacement for the
    # deprecated inline `forwarded_values` block.
    cache_policy_id = "658327ea-f89d-4fab-a63d-7e88639e58f6"

    function_association {
      event_type   = "viewer-request"
      function_arn = aws_cloudfront_function.url_rewrite.arn
    }
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  # Two states: no custom domain yet (default CloudFront cert, usable
  # immediately) vs. a registered domain with its own ACM certificate.
  # Only one set of these attributes is ever non-null at a time.
  viewer_certificate {
    cloudfront_default_certificate = local.has_domain ? null : true
    acm_certificate_arn            = local.acm_cert_arn
    ssl_support_method             = local.has_domain ? "sni-only" : null
    minimum_protocol_version       = local.has_domain ? "TLSv1.2_2021" : null
  }

  tags = {
    Project = "personal-website"
  }
}
