#!/usr/bin/env bash
# Builds the site and deploys it to the S3 + CloudFront stack provisioned by
# infra/aws-static-site. Run `terraform apply` there at least once first.
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
INFRA_DIR="${REPO_ROOT}/infra/aws-static-site"

cd "$REPO_ROOT"
npm run build

BUCKET=$(terraform -chdir="$INFRA_DIR" output -raw bucket_name)
DISTRIBUTION_ID=$(terraform -chdir="$INFRA_DIR" output -raw cloudfront_distribution_id)
SITE_URL=$(terraform -chdir="$INFRA_DIR" output -raw site_url)

echo "Syncing dist/ to s3://${BUCKET} ..."
aws s3 sync dist/ "s3://${BUCKET}" --delete

echo "Invalidating CloudFront distribution ${DISTRIBUTION_ID} ..."
aws cloudfront create-invalidation --distribution-id "${DISTRIBUTION_ID}" --paths "/*" >/dev/null

echo "Deployed: ${SITE_URL}"
