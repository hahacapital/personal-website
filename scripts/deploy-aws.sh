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

# `aws s3 sync` guesses Content-Type from file extension but never appends a
# charset, so text files without an in-document charset declaration (HTML has
# <meta charset>; plain text and XML don't) can be misread as non-UTF-8 by
# clients that don't sniff encoding — e.g. llms.txt's CJK/em-dash content
# rendering as mojibake. `cp` (not `sync`) is required here: sync only
# re-uploads a file whose size/mtime changed, so it won't reapply a
# Content-Type-only fix to files it just synced unchanged.
echo "Setting explicit UTF-8 charset on text-based Content-Types ..."
aws s3 cp dist/ "s3://${BUCKET}" --recursive --exclude "*" --include "*.html" --content-type "text/html; charset=utf-8"
aws s3 cp dist/ "s3://${BUCKET}" --recursive --exclude "*" --include "*.css" --content-type "text/css; charset=utf-8"
aws s3 cp dist/ "s3://${BUCKET}" --recursive --exclude "*" --include "*.txt" --content-type "text/plain; charset=utf-8"
aws s3 cp dist/ "s3://${BUCKET}" --recursive --exclude "*" --include "*.xml" --content-type "text/xml; charset=utf-8"

echo "Invalidating CloudFront distribution ${DISTRIBUTION_ID} ..."
aws cloudfront create-invalidation --distribution-id "${DISTRIBUTION_ID}" --paths "/*" >/dev/null

echo "Deployed: ${SITE_URL}"
