/**
 * Ensures resume URLs are absolute URLs
 * Converts relative paths to full backend URLs
 */
export function getAbsoluteResumeUrl(url: string | undefined): string | undefined {
  if (!url) return undefined;

  // If already absolute URL (starts with http/https), return as is
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }

  // If relative path, convert to backend URL
  if (url.startsWith('/')) {
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    return `${backendUrl}${url}`;
  }

  // Return as is if unknown format
  return url;
}
