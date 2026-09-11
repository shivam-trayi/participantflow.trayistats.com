/**
 * Hashing utilities for fingerprinting
 */

/**
 * Hash entropy using SHA-256 (or fallback to simple hash)
 */
export async function hashEntropy(entropy) {
  const entropyString = JSON.stringify(entropy);

  // Try to use SubtleCrypto (SHA-256) if available
  if (window.crypto && window.crypto.subtle) {
    try {
      const encoder = new TextEncoder();
      const data = encoder.encode(entropyString);
      const hashBuffer = await window.crypto.subtle.digest('SHA-256', data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    } catch (e) {
      // Fall through to fallback hash
    }
  }

  // Fallback: Simple hash function
  let hash = 0;
  for (let i = 0; i < entropyString.length; i++) {
    const char = entropyString.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash).toString(36) + Date.now().toString(36);
}

/**
 * Simple string hash function (murmurhash-like)
 */
export function simpleHash(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = Math.imul(31, h) + str.charCodeAt(i) | 0;
  }
  return Math.abs(h).toString(36);
}