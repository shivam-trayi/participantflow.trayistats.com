/**
 * @internal
 */

import { detectFonts } from '../utils/fontDetector';
import { simpleHash } from '../utils/hash';
export class FingerprintCollector {
  constructor(fingerprintEndpoint = 'https://fingerprint.ipranker.com/fingerprint-visitor-id', apiKey) {
    this.fingerprintEndpoint = fingerprintEndpoint;
    this.apiKey = apiKey;
  }
  async collect() {
    // Collect all signals once — reused for both local result and API payload
    const [fontData, webrtcData] = await Promise.all([this.collectFontFingerprint(), this.collectWebRTCFingerprint()]);
    const sensorData = this.collectSensorFingerprint();
    const advancedBrowserData = this.collectAdvancedBrowserFeatures();
    const hardwareData = this.collectHardwareData();
    const permissionsData = await this.collectPermissionsState();
    const webglData = this.getWebGLFingerprint();
    const canvasText = this.getCanvasFingerprint();
    const canvasGeometry = this.getCanvasGeometryFingerprint();
    const canvasBlending = this.getCanvasBlendingFingerprint();

    // Build the local fingerprint result (source of truth for console/SDK output)
    const localFingerprint = {
      installationId: null,
      canvas: {
        text: canvasText,
        geometry: canvasGeometry,
        blending: canvasBlending
      },
      webgl: webglData ? {
        vendor: webglData.vendor || null,
        renderer: webglData.renderer || null,
        extensions: webglData.extensions || 0
      } : {
        vendor: null,
        renderer: null,
        extensions: 0
      },
      audio: null,
      screen: {
        width: window.screen.width,
        height: window.screen.height,
        colorDepth: window.screen.colorDepth,
        pixelRatio: window.devicePixelRatio,
        orientation: window.screen.orientation?.type || window.orientation || 'unknown'
      },
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      language: navigator.language,
      platform: navigator.platform,
      fonts: fontData,
      webrtc: webrtcData,
      sensors: sensorData,
      advancedBrowser: advancedBrowserData,
      hardware: hardwareData,
      permissions: permissionsData
    };

    // Try to get visitorId from the API (enrich local data with server-generated ID)
    try {
      const userAgent = navigator.userAgent;
      const devicePayload = {
        platform: {
          brands: navigator.userAgentData?.brands || [],
          platform: navigator.platform,
          mobile: /Mobile|Android|iPhone|iPad|iPod/i.test(userAgent),
          architecture: navigator.userAgentData?.architecture || 'unknown',
          bitness: navigator.userAgentData?.bitness || 'unknown',
          browserInfo: {
            userAgent,
            language: navigator.language,
            languages: navigator.languages || [navigator.language]
          }
        },
        screen: {
          width: window.screen.width,
          height: window.screen.height,
          colorDepth: window.screen.colorDepth,
          pixelDepth: window.screen.pixelDepth || window.screen.colorDepth,
          orientation: window?.screen.orientation?.type || window.orientation || 'portrait-primary',
          pixelRatio: window.devicePixelRatio || 1
        },
        hardware: hardwareData,
        capabilities: {
          cookiesEnabled: navigator.cookieEnabled,
          doNotTrack: navigator.doNotTrack === '1' || window.doNotTrack === '1',
          pdfViewerEnabled: navigator.pdfViewerEnabled ?? true
        },
        localization: {
          languages: navigator.languages || [navigator.language],
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
        },
        fingerprints: {
          canvasText,
          canvasBlending,
          canvasGeometry,
          webgl: webglData,
          timingResolution: typeof performance !== 'undefined' && typeof performance.now === 'function' ? 'high' : 'low'
        },
        fonts: {
          fontCount: fontData.fontCount,
          fontFingerprint: fontData.fontFingerprint
        },
        webrtc: webrtcData,
        sensors: sensorData,
        advancedBrowser: advancedBrowserData,
        permissions: permissionsData
      };
      const headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      };
      if (this.apiKey) {
        headers['x-api-key'] = this.apiKey;
      }
      const response = await fetch(this.fingerprintEndpoint, {
        method: 'POST',
        headers,
        credentials: 'omit',
        body: JSON.stringify({
          deviceData: devicePayload
        })
      });
      if (response.ok) {
        const apiData = await response.json();
        const visitorId = apiData.visitorId || apiData.fingerprints?.installationId || null;
        if (visitorId) {
          localFingerprint.installationId = visitorId;
        }
      }
    } catch {
      // API failed — local fingerprint is still complete, just without server visitorId
    }
    return localFingerprint;
  }
  async collectFontFingerprint() {
    try {
      return await detectFonts();
    } catch {
      return {
        installedFonts: [],
        fontCount: 0,
        fontFingerprint: 'error',
        detectionTimeMs: 0
      };
    }
  }
  async collectWebRTCFingerprint() {
    const result = {
      webrtcSupported: !!window.RTCPeerConnection,
      mediaDevicesCount: 0,
      hasCamera: false,
      hasMicrophone: false,
      hasSpeaker: false,
      webrtcFingerprint: ''
    };
    try {
      if (navigator.mediaDevices?.enumerateDevices) {
        const devices = await navigator.mediaDevices.enumerateDevices();
        result.mediaDevicesCount = devices.length;
        result.hasCamera = devices.some(d => d.kind === 'videoinput');
        result.hasMicrophone = devices.some(d => d.kind === 'audioinput');
        result.hasSpeaker = devices.some(d => d.kind === 'audiooutput');
      }
    } catch {/* silent */}
    result.webrtcFingerprint = simpleHash(JSON.stringify({
      supported: result.webrtcSupported,
      devices: result.mediaDevicesCount,
      camera: result.hasCamera,
      mic: result.hasMicrophone,
      speaker: result.hasSpeaker
    }));
    return result;
  }
  collectSensorFingerprint() {
    const result = {
      accelerometerSupported: 'Accelerometer' in window,
      gyroscopeSupported: 'Gyroscope' in window,
      magnetometerSupported: 'Magnetometer' in window,
      ambientLightSupported: 'AmbientLightSensor' in window,
      sensorFingerprint: ''
    };
    result.sensorFingerprint = simpleHash(JSON.stringify({
      accel: result.accelerometerSupported,
      gyro: result.gyroscopeSupported,
      mag: result.magnetometerSupported,
      light: result.ambientLightSupported
    }));
    return result;
  }
  collectAdvancedBrowserFeatures() {
    const result = {
      localStorageEnabled: this.isStorageAvailable('localStorage'),
      sessionStorageEnabled: this.isStorageAvailable('sessionStorage'),
      indexedDBEnabled: !!window.indexedDB,
      cacheAPIEnabled: 'caches' in window,
      webGL2Supported: !!document.createElement('canvas').getContext('webgl2'),
      webAssemblySupported: typeof WebAssembly === 'object',
      serviceWorkerSupported: 'serviceWorker' in navigator,
      doNotTrack: navigator.doNotTrack === '1' || window.doNotTrack === '1',
      pdfViewerEnabled: navigator.pdfViewerEnabled ?? true,
      browserFeaturesFingerprint: ''
    };
    result.browserFeaturesFingerprint = simpleHash(JSON.stringify({
      ls: result.localStorageEnabled,
      ss: result.sessionStorageEnabled,
      idb: result.indexedDBEnabled,
      cache: result.cacheAPIEnabled,
      webgl2: result.webGL2Supported,
      wasm: result.webAssemblySupported,
      sw: result.serviceWorkerSupported,
      dnt: result.doNotTrack,
      pdf: result.pdfViewerEnabled
    }));
    return result;
  }
  isStorageAvailable(type) {
    try {
      const storage = window[type];
      const testKey = '__t__';
      storage.setItem(testKey, testKey);
      storage.removeItem(testKey);
      return true;
    } catch {
      return false;
    }
  }
  collectHardwareData() {
    const webglData = this.getWebGLFingerprint();
    return {
      cores: navigator.hardwareConcurrency || 4,
      memory: navigator.deviceMemory || null,
      maxTouchPoints: navigator.maxTouchPoints || 0,
      gpuVendor: webglData?.vendor || null,
      gpuRenderer: webglData?.renderer || null
    };
  }
  async collectPermissionsState() {
    const result = {
      geolocation: 1,
      notifications: 1,
      camera: 1,
      microphone: 1
    };
    const encodeState = state => {
      switch (state) {
        case 'granted':
          return 2;
        case 'prompt':
          return 1;
        case 'denied':
          return 0;
        default:
          return 1;
      }
    };
    try {
      if (navigator.permissions) {
        const names = ['geolocation', 'notifications', 'camera', 'microphone'];
        for (const name of names) {
          try {
            const status = await navigator.permissions.query({
              name: name
            });
            result[name] = encodeState(status.state);
          } catch {/* unsupported */}
        }
      }
    } catch {/* silent */}
    return result;
  }
  getCanvasFingerprint() {
    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return null;
      canvas.width = 240;
      canvas.height = 60;
      ctx.textBaseline = 'alphabetic';
      ctx.fillStyle = '#f60';
      ctx.fillRect(100, 1, 62, 20);
      ctx.fillStyle = '#069';
      ctx.font = '11pt Arial';
      ctx.fillText('Cwm fjordbank glyphs vext quiz, 😃', 2, 15);
      ctx.fillStyle = 'rgba(102, 204, 0, 0.7)';
      ctx.font = '18pt Arial';
      ctx.fillText('Cwm fjordbank glyphs vext quiz, 😃', 4, 45);
      return canvas.toDataURL();
    } catch {
      return null;
    }
  }
  getCanvasBlendingFingerprint() {
    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return null;
      canvas.width = 100;
      canvas.height = 100;
      ctx.fillStyle = 'rgb(255,0,255)';
      ctx.beginPath();
      ctx.arc(50, 50, 50, 0, Math.PI * 2, true);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = 'rgb(0,255,255)';
      ctx.globalCompositeOperation = 'multiply';
      ctx.beginPath();
      ctx.arc(25, 25, 25, 0, Math.PI * 2, true);
      ctx.closePath();
      ctx.fill();
      return canvas.toDataURL();
    } catch {
      return null;
    }
  }
  getCanvasGeometryFingerprint() {
    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return null;
      canvas.width = 122;
      canvas.height = 110;
      ctx.globalCompositeOperation = 'multiply';
      for (let i = 0; i < 20; i++) {
        ctx.fillStyle = `rgb(${Math.floor(255 - i * 10)}, ${Math.floor(i * 10)}, ${Math.floor(i * 5)})`;
        ctx.beginPath();
        ctx.arc(i * 5, i * 5, i + 10, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.fill();
      }
      return canvas.toDataURL();
    } catch {
      return null;
    }
  }
  getWebGLFingerprint() {
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) return null;
      const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
      return {
        vendor: debugInfo ? gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL) : gl.getParameter(gl.VENDOR),
        renderer: debugInfo ? gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) : gl.getParameter(gl.RENDERER),
        version: gl.getParameter(gl.VERSION),
        shadingLanguageVersion: gl.getParameter(gl.SHADING_LANGUAGE_VERSION),
        extensions: gl.getSupportedExtensions()?.length || 0
      };
    } catch {
      return null;
    }
  }
}