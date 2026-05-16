function normalizeBaseUrl(value: string | undefined) {
  return value?.replace(/\/$/, "");
}

export function getCommerceServiceUrl() {
  return normalizeBaseUrl(process.env.COMMERCE_SERVICE_URL);
}

export function getPublicCommerceServiceUrl() {
  return normalizeBaseUrl(process.env.NEXT_PUBLIC_COMMERCE_SERVICE_URL);
}

export function buildCommerceServiceUrl(path: string) {
  const baseUrl = getCommerceServiceUrl();

  if (!baseUrl) {
    throw new Error("COMMERCE_SERVICE_URL is not configured.");
  }

  return `${baseUrl}${path}`;
}

export function buildPublicCommerceServiceUrl(path: string) {
  const baseUrl = getPublicCommerceServiceUrl();

  if (!baseUrl) {
    throw new Error("NEXT_PUBLIC_COMMERCE_SERVICE_URL is not configured.");
  }

  return `${baseUrl}${path}`;
}
