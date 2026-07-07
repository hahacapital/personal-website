# AWS static-site hosting (Tokyo region)

Terraform for hosting this site on S3 + CloudFront instead of Cloudflare Pages/Vercel — a private S3 bucket in `ap-northeast-1` (Tokyo) as the origin, served over HTTPS through CloudFront via Origin Access Control (OAC), with a CloudFront Function handling Astro's directory-style routing (`/about/` → `/about/index.html`).

S3's own static-website-hosting endpoint doesn't support HTTPS, so it isn't used here — CloudFront reads directly from the bucket's private REST endpoint instead.

## Prerequisites

- [Terraform](https://developer.hashicorp.com/terraform/install) >= 1.9
- AWS credentials with permission to manage S3, CloudFront, and (if you set a custom domain) ACM in `us-east-1`
- This repo built at least once (`npm run build` from the repo root) before you run the deploy script

## First apply — no domain yet

```bash
cd infra/aws-static-site
cp terraform.tfvars.example terraform.tfvars
# edit terraform.tfvars: set a globally-unique bucket_name

terraform init
terraform plan
terraform apply
```

This creates the S3 bucket, CloudFront distribution, OAC, and URL-rewrite function, and gets you a live site at `https://<distribution-id>.cloudfront.net` immediately — no domain required.

Then deploy the built site:

```bash
cd ../..            # back to repo root
./scripts/deploy-aws.sh
```

## Adding a custom domain later

Once you've registered a domain (see the main README's "Before Going Live" section):

1. In `terraform.tfvars`, set `domain_name` (and `subject_alternative_names` if you want `www.` too).
2. `terraform apply` — this creates the ACM certificate (in `us-east-1`) and prints `acm_validation_records` in the output. Nothing else changes yet; the distribution still serves over the default certificate until validation completes.
3. Create the printed CNAME record(s) at your domain registrar / DNS provider.
4. Set `acm_validation_fqdns` in `terraform.tfvars` to the FQDN(s) you just created.
5. `terraform apply` again — Terraform waits for ACM to confirm DNS validation, then attaches the certificate and the domain alias(es) to the distribution.
6. Point your domain's DNS at the CloudFront distribution: a `CNAME` (for a subdomain like `www`) or, for a root/apex domain via Route 53, an `ALIAS` record targeting the distribution's domain name (`terraform output cloudfront_domain_name`).
7. Update `siteUrl` in `../../src/data/site.ts` and `site` in `../../astro.config.mjs` to the real domain (`terraform output site_url` prints the exact value to use), and re-run `./scripts/deploy-aws.sh`.

## Deploying content after the first apply

`scripts/deploy-aws.sh` (repo root) rebuilds the site, syncs `dist/` to the S3 bucket, and invalidates the CloudFront cache. Run it after every change you want to ship:

```bash
./scripts/deploy-aws.sh
```

## Notes

- `force_destroy = true` on the bucket means `terraform destroy` won't get stuck on non-empty-bucket errors — the bucket holds only rebuildable static output, nothing worth protecting from deletion.
- Not implemented here (optional future enhancement, not needed to ship): per-file-type `Cache-Control` headers on the S3 sync (e.g. long-lived caching for Astro's content-hashed `_astro/*` assets, short/no-cache for HTML). CloudFront's managed `CachingOptimized` policy gives reasonable defaults without this.
- Estimated cost for a low-traffic personal site: a few cents to low single-digit dollars per month (S3 storage + requests, CloudFront data transfer) — no fixed/minimum charges for either service.
