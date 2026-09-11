/**
 * IPRanker SDK - Main Class
 * Single API call for IP Intelligence analysis with automatic fingerprint + behavior collection
 */

import { FingerprintCollector, BehaviorCollector, DeviceCollector } from './collectors';
import { APIClient } from './api/client';
/**
 * API version this SDK targets.
 * Each major SDK release is built for a specific API version.
 * - SDK v1.x → API v1
 * - SDK v2.x → API v2 (future)
 */
const API_VERSION = 'v1';
export class IPRanker {
  /** In-memory cached fingerprint data from getVisitorId() - most secure, cleared on page refresh */
  _cachedFingerprint = null;
  constructor(apiKey, options = {}) {
    // Validate API key
    if (!apiKey || typeof apiKey !== 'string' || apiKey.length < 10) {
      throw new Error('Invalid API key. Please provide a valid IPRanker API key.');
    }
    this.apiKey = apiKey;

    // Set default options
    this.options = {
      baseURL: options.baseURL || 'https://api.ipranker.com',
      collectBehavior: options.collectBehavior !== false,
      // default true
      behaviorTimeout: options.behaviorTimeout || 5000,
      // 5 seconds
      cache: options.cache !== false,
      // default true
      cacheTimeout: options.cacheTimeout || 300000,
      // 5 minutes
      debug: options.debug || false
    };

    // Set callbacks
    this.callbacks = {
      onReady: options.onReady,
      onAnalyzing: options.onAnalyzing,
      onComplete: options.onComplete,
      onError: options.onError
    };

    // Initialize components with versioned API paths
    // baseURL should NOT include version (e.g., 'https://api.ipranker.com' or 'http://localhost:4001/api')
    const versionedBaseURL = `${this.options.baseURL}/${API_VERSION}`;
    this.apiClient = new APIClient(versionedBaseURL, this.apiKey);
    const fingerprintEndpoint = `${versionedBaseURL}/fingerprint-visitor-id`;
    this.fingerprintCollector = new FingerprintCollector(fingerprintEndpoint, this.apiKey);
    this.behaviorCollector = new BehaviorCollector();
    this.deviceCollector = new DeviceCollector();

    // Initialize collectors
    this._initialize();
  }

  /**
   * Initialize SDK
   */
  _initialize() {
    try {
      // Start collecting behavioral data in background
      if (this.options.collectBehavior) {
        this.behaviorCollector.start();
      }
      this._log('IPRanker SDK initialized');
      this.callbacks.onReady?.();
    } catch (error) {
      this._handleError(error);
    }
  }

  /**
   * Analyze current visitor - main method
   * Collects fingerprint + behavioral data and sends to IPRanker API
   */
  async analyze(customOptions) {
    try {
      this._log('Starting analysis...');
      this.callbacks.onAnalyzing?.();

      // Get IP for cache key (use provided IP or 'auto' for auto-detected)
      const cacheKey = customOptions?.ip || 'auto';

      // Check cache first (per IP address)
      if (this.options.cache) {
        const cached = this._getCachedResult(cacheKey);
        if (cached) {
          this._log('Returning cached result for IP:', cacheKey);
          this.callbacks.onComplete?.(cached);
          return cached;
        }
      }

      // Step 1: Use provided fingerprint OR cached fingerprint OR collect new one
      // Priority: explicit option > cached from getVisitorId() > fresh collection
      let fingerprintData;
      if (customOptions?.fingerprint) {
        this._log('Using pre-collected fingerprint data (explicit option)...');
        fingerprintData = customOptions.fingerprint;
      } else if (this._cachedFingerprint) {
        this._log('Using cached fingerprint data from getVisitorId()...');
        fingerprintData = this._cachedFingerprint;
      } else {
        this._log('Collecting fresh fingerprint data...');
        fingerprintData = await this.fingerprintCollector.collect();
      }

      // Step 2: Collect behavioral data (with timeout)
      this._log('Collecting behavioral data...');
      const behaviorData = this.options.collectBehavior ? await this._collectBehaviorWithTimeout(customOptions?.timeout || this.options.behaviorTimeout) : null;

      // Step 3: Collect device data
      this._log('Collecting device data...');
      const deviceData = await this.deviceCollector.collect();

      // Step 4: Prepare request payload
      const payload = {
        fingerprint: fingerprintData,
        behavior: behaviorData,
        device: deviceData,
        includeRawData: customOptions?.includeRawData || false
      };

      // Only include IP if explicitly provided (otherwise backend will auto-detect from request)
      if (customOptions?.ip) {
        payload.ip = customOptions.ip;
      }
      this._log('Sending analysis request to IPRanker API...', {
        ip: payload.ip,
        hasIp: !!payload.ip
      });

      // Step 5: Send to IPRanker API
      const result = await this.apiClient.analyze(payload);

      // Step 6: Cache result (per IP address)
      if (this.options.cache) {
        this._cacheResult(cacheKey, result);
      }
      this._log('Analysis complete', result);
      this.callbacks.onComplete?.(result);
      return result;
    } catch (error) {
      this._handleError(error);
      throw error;
    }
  }

  /**
   * Get fingerprint data only (without full analysis)
   * Note: This method does NOT cache the fingerprint internally.
   * Use getVisitorId() if you want automatic caching for subsequent analyze() calls.
   */
  async getFingerprint() {
    return await this.fingerprintCollector.collect();
  }

  /**
   * Get visitor ID (fingerprint installation ID) independently.
   *
   * This method:
   * 1. Collects device fingerprint data
   * 2. Caches it in-memory (for automatic use by subsequent analyze() calls)
   * 3. Returns only the visitor ID string
   *
   * Use case: When you need the visitor ID for your own tracking/storage,
   * and will call analyze() later. The SDK will automatically reuse the
   * cached fingerprint, avoiding redundant collection.
   *
   * Security: Cache is in-memory only (most secure), cleared on page refresh.
   *
   * @returns Promise<string | null> - The visitor ID, or null if collection failed
   *
   * @example
   * ```typescript
   * // Get visitor ID for your tracking
   * const visitorId = await ipranker.getVisitorId();
   * console.log('Visitor:', visitorId);
   *
   * // Later, analyze() automatically uses cached fingerprint
   * const result = await ipranker.analyze();
   * ```
   */
  async getVisitorId() {
    try {
      this._log('Collecting fingerprint for visitor ID...');
      const fingerprintData = await this.fingerprintCollector.collect();

      // Cache in-memory for subsequent analyze() calls
      this._cachedFingerprint = fingerprintData;
      this._log('Fingerprint cached in-memory');
      return fingerprintData.installationId;
    } catch (error) {
      this._log('Failed to get visitor ID:', error);
      return null;
    }
  }

  /**
   * Clear the in-memory cached fingerprint.
   * Useful if you want to force a fresh fingerprint collection on next analyze() call.
   */
  clearFingerprintCache() {
    this._cachedFingerprint = null;
    this._log('Fingerprint cache cleared');
  }

  /**
   * Get behavioral data only
   */
  getBehaviorData() {
    return this.behaviorCollector.getData();
  }

  /**
   * Get device data only
   */
  async getDeviceData() {
    return await this.deviceCollector.collect();
  }

  /**
   * Clear cache
   */
  clearCache() {
    this._clearCache();
    this._log('Cache cleared');
  }

  /**
   * Stop behavioral data collection and cleanup
   */
  destroy() {
    this.behaviorCollector.stop();
    this._log('SDK destroyed');
  }

  // ========== Private Methods ==========

  /**
   * Collect behavioral data with timeout
   */
  async _collectBehaviorWithTimeout(timeout) {
    return Promise.race([Promise.resolve(this.behaviorCollector.getData()), new Promise(resolve => setTimeout(() => resolve(null), timeout))]);
  }

  /**
   * Get cached result if available and not expired (per IP address)
   */
  _getCachedResult(ip) {
    try {
      const cacheData = localStorage.getItem('ipranker_cache');
      if (!cacheData) return null;
      const cache = JSON.parse(cacheData);

      // Migration: Clear old cache format (has 'result' and 'timestamp' at root level)
      if (cache.result && cache.timestamp) {
        this._log('Clearing old cache format');
        localStorage.removeItem('ipranker_cache');
        return null;
      }
      const entry = cache[ip];
      if (!entry || !entry.result || !entry.timestamp) return null;
      const age = Date.now() - entry.timestamp;
      if (age < this.options.cacheTimeout) {
        return entry.result;
      }

      // Remove expired entry
      delete cache[ip];
      localStorage.setItem('ipranker_cache', JSON.stringify(cache));
      return null;
    } catch (e) {
      // If parsing fails, clear the cache
      localStorage.removeItem('ipranker_cache');
      return null;
    }
  }

  /**
   * Cache result to localStorage (per IP address)
   */
  _cacheResult(ip, result) {
    try {
      let cache = {};
      const existing = localStorage.getItem('ipranker_cache');
      if (existing) {
        cache = JSON.parse(existing);
      }
      cache[ip] = {
        result,
        timestamp: Date.now()
      };
      localStorage.setItem('ipranker_cache', JSON.stringify(cache));
    } catch (e) {
      // Cache failed, ignore
      this._log('Cache failed:', e);
    }
  }

  /**
   * Clear cache from localStorage
   */
  _clearCache() {
    try {
      localStorage.removeItem('ipranker_cache');
    } catch (e) {}
  }

  /**
   * Handle errors
   */
  _handleError(error) {
    this._log('Error:', error);
    this.callbacks.onError?.(error);
  }

  /**
   * Debug logging
   */
  _log(...args) {
    if (this.options.debug) {
      console.log('[IPRanker SDK]', ...args);
    }
  }
}
export default IPRanker;