/**
 * API Client for IPRanker
 * Handles communication with IPRanker backend API
 */

import { deriveSigningKey, generateSignature } from '../utils/hmac';
export class APIClient {
  constructor(baseURL, apiKey) {
    this.baseURL = baseURL;
    this.apiKey = apiKey;
    // Pre-derive signing key asynchronously (non-blocking)
    this.signingKeyPromise = deriveSigningKey(apiKey).catch(() => null);
  }

  /**
   * Send analysis request to IPRanker API
   */
  async analyze(payload) {
    const startTime = Date.now();
    try {
      const bodyString = JSON.stringify(payload);
      const headers = {
        'Content-Type': 'application/json',
        'X-API-Key': this.apiKey
      };

      // Add HMAC signature if SubtleCrypto is available
      const signingKey = await this.signingKeyPromise;
      if (signingKey) {
        const timestamp = Date.now();
        const signature = await generateSignature(signingKey, timestamp, bodyString);
        headers['X-Signature'] = signature;
        headers['X-Timestamp'] = String(timestamp);
      }
      const response = await fetch(`${this.baseURL}/analyze`, {
        method: 'POST',
        headers,
        body: bodyString
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API Error: ${response.status} ${response.statusText} - ${errorText}`);
      }
      const result = await response.json();
      const responseTime = Date.now() - startTime;
      return {
        ...result,
        responseTime
      };
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`IPRanker API request failed: ${error.message}`);
      }
      throw error;
    }
  }
}