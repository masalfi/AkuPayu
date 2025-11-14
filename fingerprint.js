// Fingerprint Protection Script
// Injected at document_start to override APIs before page scripts run

(async function() {
  'use strict';

  // Check if fingerprint protection is enabled
  const checkProtection = async () => {
    try {
      const result = await chrome.storage.local.get('fingerprintProtection');
      return result.fingerprintProtection || false;
    } catch (error) {
      return false;
    }
  };

  const isEnabled = await checkProtection();

  if (!isEnabled) {
    return; // Protection disabled, don't override anything
  }

  // Generate consistent random noise for this session
  const sessionSeed = Math.random().toString(36).substring(7);

  // Simple seeded random number generator
  function seededRandom(seed) {
    const x = Math.sin(seed++) * 10000;
    return x - Math.floor(x);
  }

  let seedCounter = 0;
  function getRandomNoise() {
    seedCounter++;
    return seededRandom(sessionSeed.charCodeAt(0) * seedCounter) * 2 - 1;
  }

  // ============================================
  // 1. Canvas Fingerprint Protection
  // ============================================
  const originalToDataURL = HTMLCanvasElement.prototype.toDataURL;
  const originalToBlob = HTMLCanvasElement.prototype.toBlob;
  const originalGetImageData = CanvasRenderingContext2D.prototype.getImageData;

  // Add noise to canvas data
  function addCanvasNoise(imageData) {
    const data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
      // Add small random noise to RGB values
      const noise = Math.floor(getRandomNoise() * 3);
      data[i] = Math.min(255, Math.max(0, data[i] + noise));     // R
      data[i + 1] = Math.min(255, Math.max(0, data[i + 1] + noise)); // G
      data[i + 2] = Math.min(255, Math.max(0, data[i + 2] + noise)); // B
      // Keep alpha unchanged
    }
    return imageData;
  }

  HTMLCanvasElement.prototype.toDataURL = function() {
    const context = this.getContext('2d');
    if (context) {
      const imageData = context.getImageData(0, 0, this.width, this.height);
      addCanvasNoise(imageData);
      context.putImageData(imageData, 0, 0);
    }
    return originalToDataURL.apply(this, arguments);
  };

  HTMLCanvasElement.prototype.toBlob = function() {
    const context = this.getContext('2d');
    if (context) {
      const imageData = context.getImageData(0, 0, this.width, this.height);
      addCanvasNoise(imageData);
      context.putImageData(imageData, 0, 0);
    }
    return originalToBlob.apply(this, arguments);
  };

  CanvasRenderingContext2D.prototype.getImageData = function() {
    const imageData = originalGetImageData.apply(this, arguments);
    return addCanvasNoise(imageData);
  };

  // ============================================
  // 2. WebGL Fingerprint Protection
  // ============================================
  const getParameterProto = WebGLRenderingContext.prototype.getParameter;
  WebGLRenderingContext.prototype.getParameter = function(parameter) {
    // Spoof specific WebGL parameters
    if (parameter === 37445) { // UNMASKED_VENDOR_WEBGL
      return 'Intel Inc.';
    }
    if (parameter === 37446) { // UNMASKED_RENDERER_WEBGL
      return 'Intel Iris OpenGL Engine';
    }
    return getParameterProto.apply(this, arguments);
  };

  if (window.WebGL2RenderingContext) {
    const getParameterProto2 = WebGL2RenderingContext.prototype.getParameter;
    WebGL2RenderingContext.prototype.getParameter = function(parameter) {
      if (parameter === 37445) {
        return 'Intel Inc.';
      }
      if (parameter === 37446) {
        return 'Intel Iris OpenGL Engine';
      }
      return getParameterProto2.apply(this, arguments);
    };
  }

  // ============================================
  // 3. Audio Context Fingerprint Protection
  // ============================================
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  if (AudioContext) {
    const originalCreateAnalyser = AudioContext.prototype.createAnalyser;
    AudioContext.prototype.createAnalyser = function() {
      const analyser = originalCreateAnalyser.apply(this, arguments);
      const originalGetFloatFrequencyData = analyser.getFloatFrequencyData;

      analyser.getFloatFrequencyData = function(array) {
        originalGetFloatFrequencyData.apply(this, arguments);
        // Add small noise to audio data
        for (let i = 0; i < array.length; i++) {
          array[i] += getRandomNoise() * 0.01;
        }
      };

      return analyser;
    };
  }

  // ============================================
  // 4. Screen Resolution Spoofing
  // ============================================
  Object.defineProperties(window.screen, {
    width: {
      get: () => 1920,
      configurable: true
    },
    height: {
      get: () => 1080,
      configurable: true
    },
    availWidth: {
      get: () => 1920,
      configurable: true
    },
    availHeight: {
      get: () => 1040,
      configurable: true
    },
    colorDepth: {
      get: () => 24,
      configurable: true
    },
    pixelDepth: {
      get: () => 24,
      configurable: true
    }
  });

  // ============================================
  // 5. Navigator Properties Spoofing
  // ============================================
  Object.defineProperties(Navigator.prototype, {
    hardwareConcurrency: {
      get: () => 4,
      configurable: true
    },
    deviceMemory: {
      get: () => 8,
      configurable: true
    },
    platform: {
      get: () => {
        const platforms = ['Win32', 'Linux x86_64', 'MacIntel'];
        return platforms[Math.floor(seededRandom(sessionSeed.length) * platforms.length)];
      },
      configurable: true
    },
    maxTouchPoints: {
      get: () => 0,
      configurable: true
    }
  });

  // ============================================
  // 6. Plugin Enumeration Protection
  // ============================================
  Object.defineProperty(Navigator.prototype, 'plugins', {
    get: () => {
      // Return empty plugin list
      return {
        length: 0,
        item: () => null,
        namedItem: () => null,
        refresh: () => {}
      };
    },
    configurable: true
  });

  // ============================================
  // 7. Font Enumeration Protection
  // ============================================
  const originalOffsetWidth = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'offsetWidth');
  const originalOffsetHeight = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'offsetHeight');

  Object.defineProperty(HTMLElement.prototype, 'offsetWidth', {
    get: function() {
      const width = originalOffsetWidth.get.call(this);
      // Add small variation to prevent font detection
      return width + Math.floor(getRandomNoise() * 0.5);
    }
  });

  Object.defineProperty(HTMLElement.prototype, 'offsetHeight', {
    get: function() {
      const height = originalOffsetHeight.get.call(this);
      return height + Math.floor(getRandomNoise() * 0.5);
    }
  });

  // ============================================
  // 8. Battery API Protection
  // ============================================
  if (navigator.getBattery) {
    navigator.getBattery = async () => {
      return {
        charging: true,
        chargingTime: 0,
        dischargingTime: Infinity,
        level: 1.0,
        addEventListener: () => {},
        removeEventListener: () => {}
      };
    };
  }

  // ============================================
  // 9. Timezone Offset Protection
  // ============================================
  const originalGetTimezoneOffset = Date.prototype.getTimezoneOffset;
  Date.prototype.getTimezoneOffset = function() {
    return 0; // UTC timezone
  };

  // ============================================
  // 10. Language Protection (optional - keep real or spoof)
  // ============================================
  // Keeping languages as-is for now to avoid breaking site functionality

  console.log('[AkuPayu] Fingerprint Protection Active ✓');

})();
