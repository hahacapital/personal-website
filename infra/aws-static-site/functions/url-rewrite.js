// CloudFront Function (viewer-request) — rewrites extensionless / trailing-
// slash request URIs to the matching index.html, since CloudFront's own
// default_root_object only applies at the site root, not subdirectories.
// Astro's static output is all directory-style (`/about/index.html` served
// at `/about/`), so every non-root page needs this.
async function handler(event) {
  var request = event.request;
  var uri = request.uri;

  if (uri.endsWith('/')) {
    request.uri += 'index.html';
  } else if (!uri.includes('.')) {
    request.uri += '/index.html';
  }

  return request;
}
