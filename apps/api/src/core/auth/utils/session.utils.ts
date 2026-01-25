import { UAParser } from 'ua-parser-js';

/**
 * Extract a friendly device name from user agent string
 * @param userAgent - The user agent string from request headers
 * @returns A friendly device name (e.g., "Chrome on Windows", "Safari on iPhone")
 */
export function extractDeviceName(userAgent: string): string {
  if (!userAgent) return 'Unknown Device';

  const parser = new UAParser(userAgent);
  const result = parser.getResult();

  const browser = result.browser.name || 'Unknown Browser';
  const os = result.os.name || 'Unknown OS';
  const device = result.device.type
    ? `${result.device.vendor || ''} ${result.device.model || ''}`.trim()
    : null;

  if (device) {
    return `${browser} on ${device}`;
  }

  return `${browser} on ${os}`;
}

/**
 * Extract client IP address from request
 * @param request - Express request object
 * @returns IP address string
 */
export function extractClientIp(request: any): string {
  // Check for common proxy headers
  const forwarded = request.headers['x-forwarded-for'];
  if (forwarded) {
    // x-forwarded-for can contain multiple IPs, take the first one
    return forwarded.split(',')[0].trim();
  }

  const realIp = request.headers['x-real-ip'];
  if (realIp) {
    return realIp;
  }

  // Fallback to socket IP
  return request.ip || request.connection?.remoteAddress || 'Unknown';
}
