/**
 * HMAC Request Signing Utilities
 * Uses Web Crypto API (SubtleCrypto) for browser-compatible HMAC-SHA256
 */

const SIGNING_SALT = 'ipranker-sdk-v1';

/**
 * Derive a signing key from the API key using HMAC-SHA256
 * Key = HMAC-SHA256(apiKey, 'ipranker-sdk-v1')
 */
export async function deriveSigningKey(apiKey) {
  try {
    if (!window.crypto?.subtle) return null;
    const encoder = new TextEncoder();
    const keyMaterial = await window.crypto.subtle.importKey('raw', encoder.encode(apiKey), {
      name: 'HMAC',
      hash: 'SHA-256'
    }, false, ['sign']);

    // Derive the signing key: HMAC-SHA256(apiKey, salt)
    const saltBytes = encoder.encode(SIGNING_SALT);
    const derivedBytes = await window.crypto.subtle.sign('HMAC', keyMaterial, saltBytes);

    // Import the derived bytes as the actual signing key
    return await window.crypto.subtle.importKey('raw', derivedBytes, {
      name: 'HMAC',
      hash: 'SHA-256'
    }, false, ['sign']);
  } catch {
    return null;
  }
}

/**
 * Generate HMAC-SHA256 signature for a request
 * Signs: timestamp + '.' + bodyString
 * Returns hex-encoded signature
 */
export async function generateSignature(signingKey, timestamp, bodyString) {
  const encoder = new TextEncoder();
  const message = `${timestamp}.${bodyString}`;
  const signature = await window.crypto.subtle.sign('HMAC', signingKey, encoder.encode(message));
  const hashArray = Array.from(new Uint8Array(signature));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}