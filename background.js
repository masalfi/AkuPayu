// Listen for messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'setProxy') {
    setProxyConfiguration(request.config)
      .then(() => sendResponse({ success: true }))
      .catch(error => sendResponse({ success: false, error: error.message }));
    return true; // Keep message channel open for async response
  }

  if (request.action === 'clearProxy') {
    clearProxyConfiguration()
      .then(() => sendResponse({ success: true }))
      .catch(error => sendResponse({ success: false, error: error.message }));
    return true;
  }

  if (request.action === 'setUserAgent') {
    setUserAgent(request.userAgent)
      .then(() => sendResponse({ success: true }))
      .catch(error => sendResponse({ success: false, error: error.message }));
    return true;
  }

  if (request.action === 'setWebRTC') {
    setWebRTCProtection(request.enabled)
      .then(() => sendResponse({ success: true }))
      .catch(error => sendResponse({ success: false, error: error.message }));
    return true;
  }
});

// Set proxy configuration
async function setProxyConfiguration(config) {
  const { type, host, port, username, password } = config;

  // Create proxy configuration object
  const proxyConfig = {
    mode: 'fixed_servers',
    rules: {}
  };

  // Map proxy type to Chrome proxy scheme
  const schemeMap = {
    'http': 'http',
    'https': 'https',
    'socks4': 'socks4',
    'socks5': 'socks5'
  };

  const scheme = schemeMap[type] || 'http';

  // Configure proxy rules based on type
  if (type === 'socks4' || type === 'socks5') {
    // SOCKS proxy configuration
    proxyConfig.rules.singleProxy = {
      scheme: scheme,
      host: host,
      port: port
    };
  } else {
    // HTTP/HTTPS proxy configuration
    proxyConfig.rules.singleProxy = {
      scheme: scheme,
      host: host,
      port: port
    };
  }

  // Set proxy configuration
  return new Promise((resolve, reject) => {
    chrome.proxy.settings.set(
      {
        value: proxyConfig,
        scope: 'regular'
      },
      () => {
        if (chrome.runtime.lastError) {
          reject(new Error(chrome.runtime.lastError.message));
        } else {
          // Handle authentication if provided
          if (username && password) {
            setupProxyAuth(username, password);
          }
          resolve();
        }
      }
    );
  });
}

// Clear proxy configuration
function clearProxyConfiguration() {
  return new Promise((resolve, reject) => {
    chrome.proxy.settings.clear(
      { scope: 'regular' },
      () => {
        if (chrome.runtime.lastError) {
          reject(new Error(chrome.runtime.lastError.message));
        } else {
          // Remove authentication listener
          if (chrome.webRequest.onAuthRequired.hasListener(authListener)) {
            chrome.webRequest.onAuthRequired.removeListener(authListener);
          }
          resolve();
        }
      }
    );
  });
}

// Store authentication credentials
let proxyAuthCredentials = null;

// Authentication listener
const authListener = (details) => {
  if (proxyAuthCredentials && details.isProxy) {
    return {
      authCredentials: {
        username: proxyAuthCredentials.username,
        password: proxyAuthCredentials.password
      }
    };
  }
};

// Setup proxy authentication
function setupProxyAuth(username, password) {
  proxyAuthCredentials = { username, password };

  // Remove existing listener if any
  if (chrome.webRequest.onAuthRequired.hasListener(authListener)) {
    chrome.webRequest.onAuthRequired.removeListener(authListener);
  }

  // Add authentication listener
  chrome.webRequest.onAuthRequired.addListener(
    authListener,
    { urls: ['<all_urls>'] },
    ['blocking']
  );
}

// User Agent Management
let currentUserAgent = '';
const USER_AGENT_RULE_ID = 1;

async function setUserAgent(userAgent) {
  currentUserAgent = userAgent;

  // Remove existing rules
  try {
    const existingRules = await chrome.declarativeNetRequest.getDynamicRules();
    const ruleIds = existingRules.map(rule => rule.id);
    if (ruleIds.length > 0) {
      await chrome.declarativeNetRequest.updateDynamicRules({
        removeRuleIds: ruleIds
      });
    }
  } catch (error) {
    console.error('Error removing existing rules:', error);
  }

  // If userAgent is empty, we're resetting to default
  if (!userAgent) {
    return;
  }

  // Add new rule to modify User-Agent header
  const rule = {
    id: USER_AGENT_RULE_ID,
    priority: 1,
    action: {
      type: 'modifyHeaders',
      requestHeaders: [
        {
          header: 'user-agent',
          operation: 'set',
          value: userAgent
        }
      ]
    },
    condition: {
      urlFilter: '*',
      resourceTypes: [
        'main_frame',
        'sub_frame',
        'stylesheet',
        'script',
        'image',
        'font',
        'object',
        'xmlhttprequest',
        'ping',
        'csp_report',
        'media',
        'websocket',
        'webtransport',
        'webbundle',
        'other'
      ]
    }
  };

  try {
    await chrome.declarativeNetRequest.updateDynamicRules({
      addRules: [rule]
    });
  } catch (error) {
    console.error('Error setting user agent:', error);
    throw error;
  }
}

// WebRTC Protection
async function setWebRTCProtection(enabled) {
  try {
    // Check if privacy API is available
    if (!chrome.privacy || !chrome.privacy.network) {
      throw new Error('Privacy API not available');
    }

    // Set WebRTC IP handling policy
    const policy = enabled
      ? 'disable_non_proxied_udp'  // Prevent WebRTC IP leak
      : 'default';  // Default behavior

    await chrome.privacy.network.webRTCIPHandlingPolicy.set({
      value: policy,
      scope: 'regular'
    });

    console.log('WebRTC protection set to:', enabled ? 'enabled' : 'disabled');
  } catch (error) {
    console.error('Error setting WebRTC protection:', error);
    throw error;
  }
}

// Restore settings on startup
async function restoreSettings() {
  const {
    proxyConnected,
    currentProxy,
    selectedUserAgent,
    customUserAgent,
    webrtcProtection
  } = await chrome.storage.local.get([
    'proxyConnected',
    'currentProxy',
    'selectedUserAgent',
    'customUserAgent',
    'webrtcProtection'
  ]);

  // Restore proxy
  if (proxyConnected && currentProxy) {
    try {
      await setProxyConfiguration(currentProxy);
      console.log('Proxy configuration restored');
    } catch (error) {
      console.error('Failed to restore proxy:', error);
    }
  }

  // Restore User Agent
  if (selectedUserAgent && selectedUserAgent !== 'default') {
    try {
      const userAgentPresets = {
        // Chrome Desktop
        'chrome-win-latest': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'chrome-win-11': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'chrome-mac-latest': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'chrome-mac-ventura': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 13_6_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'chrome-linux': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'chrome-old': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4896.127 Safari/537.36',

        // Firefox Desktop
        'firefox-win-latest': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:121.0) Gecko/20100101 Firefox/121.0',
        'firefox-win-11': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:121.0) Gecko/20100101 Firefox/121.0',
        'firefox-mac-latest': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 14.2; rv:121.0) Gecko/20100101 Firefox/121.0',
        'firefox-linux': 'Mozilla/5.0 (X11; Linux x86_64; rv:121.0) Gecko/20100101 Firefox/121.0',
        'firefox-old': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:100.0) Gecko/20100101 Firefox/100.0',

        // Safari Desktop & Mobile
        'safari-mac-latest': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 14_2) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2 Safari/605.1.15',
        'safari-mac-ventura': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 13_6) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Safari/605.1.15',
        'safari-ios-latest': 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2 Mobile/15E148 Safari/604.1',
        'safari-ipad-latest': 'Mozilla/5.0 (iPad; CPU OS 17_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2 Mobile/15E148 Safari/604.1',

        // Edge Desktop
        'edge-win-latest': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 Edg/120.0.0.0',
        'edge-win-11': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 Edg/120.0.0.0',
        'edge-mac': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 Edg/120.0.0.0',

        // Mobile Android
        'android-chrome-latest': 'Mozilla/5.0 (Linux; Android 13) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.6099.144 Mobile Safari/537.36',
        'android-chrome-12': 'Mozilla/5.0 (Linux; Android 12) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.6099.144 Mobile Safari/537.36',
        'android-samsung': 'Mozilla/5.0 (Linux; Android 13; SAMSUNG SM-S918B) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/23.0 Chrome/115.0.0.0 Mobile Safari/537.36',
        'android-firefox': 'Mozilla/5.0 (Android 13; Mobile; rv:121.0) Gecko/121.0 Firefox/121.0',

        // Mobile iOS
        'ios-chrome': 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/120.0.6099.119 Mobile/15E148 Safari/604.1',
        'ios-firefox': 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) FxiOS/121.0 Mobile/15E148 Safari/605.1.15',

        // Opera & Other Browsers
        'opera-windows': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 OPR/105.0.0.0',
        'opera-mac': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 OPR/105.0.0.0',
        'brave-windows': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'vivaldi-windows': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 Vivaldi/6.4.3160.47',

        // Bots & Crawlers
        'googlebot': 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
        'bingbot': 'Mozilla/5.0 (compatible; bingbot/2.0; +http://www.bing.com/bingbot.htm)'
      };

      const userAgent = selectedUserAgent === 'custom'
        ? customUserAgent
        : userAgentPresets[selectedUserAgent];

      if (userAgent) {
        await setUserAgent(userAgent);
        console.log('User Agent restored:', selectedUserAgent);
      }
    } catch (error) {
      console.error('Failed to restore user agent:', error);
    }
  }

  // Restore WebRTC Protection
  if (webrtcProtection) {
    try {
      await setWebRTCProtection(webrtcProtection);
      console.log('WebRTC protection restored:', webrtcProtection);
    } catch (error) {
      console.error('Failed to restore WebRTC protection:', error);
    }
  }
}

// Restore on startup
chrome.runtime.onStartup.addListener(async () => {
  await restoreSettings();
  console.log('Settings restored on startup');
});

// Also restore on extension install/update
chrome.runtime.onInstalled.addListener(async () => {
  await restoreSettings();
  console.log('Settings restored on install/update');
});
