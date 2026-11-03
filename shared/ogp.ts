/**
 * The default share image (top page and posts without a thumbnail), as a path on the site.
 * X, Teams and others cache images by URL, so bump `v` whenever the image changes;
 * the new URL makes them fetch it again (design/ogp has the source).
 */
export const OGP_DEFAULT_IMAGE = '/ogp-default.jpeg?v=20261103'
