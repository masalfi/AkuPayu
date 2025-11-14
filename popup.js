// DOM Elements
const elements = {
  proxyType: document.getElementById('proxyType'),
  proxyHost: document.getElementById('proxyHost'),
  proxyPort: document.getElementById('proxyPort'),
  useAuth: document.getElementById('useAuth'),
  authFields: document.getElementById('authFields'),
  proxyUsername: document.getElementById('proxyUsername'),
  proxyPassword: document.getElementById('proxyPassword'),
  userAgent: document.getElementById('userAgent'),
  customUserAgentField: document.getElementById('customUserAgentField'),
  customUserAgent: document.getElementById('customUserAgent'),
  webrtcProtection: document.getElementById('webrtcProtection'),
  fingerprintProtection: document.getElementById('fingerprintProtection'),
  connectBtn: document.getElementById('connectBtn'),
  disconnectBtn: document.getElementById('disconnectBtn'),
  saveProxyBtn: document.getElementById('saveProxyBtn'),
  message: document.getElementById('message'),
  statusIndicator: document.getElementById('statusIndicator'),
  proxyList: document.getElementById('proxyList')
};

// User Agent presets
const userAgentPresets = {
  'default': '',

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

// Show/hide authentication fields
elements.useAuth.addEventListener('change', () => {
  if (elements.useAuth.checked) {
    elements.authFields.classList.remove('hidden');
  } else {
    elements.authFields.classList.add('hidden');
  }
});

// User Agent selector
elements.userAgent.addEventListener('change', () => {
  if (elements.userAgent.value === 'custom') {
    elements.customUserAgentField.classList.remove('hidden');
  } else {
    elements.customUserAgentField.classList.add('hidden');
    // Apply user agent immediately
    applyUserAgent();
  }
});

// Custom User Agent input
elements.customUserAgent.addEventListener('blur', () => {
  if (elements.userAgent.value === 'custom') {
    applyUserAgent();
  }
});

// WebRTC Protection toggle
elements.webrtcProtection.addEventListener('change', async () => {
  try {
    await chrome.runtime.sendMessage({
      action: 'setWebRTC',
      enabled: elements.webrtcProtection.checked
    });

    await chrome.storage.local.set({
      webrtcProtection: elements.webrtcProtection.checked
    });

    showMessage(
      elements.webrtcProtection.checked ? 'WebRTC protection enabled' : 'WebRTC protection disabled',
      'success'
    );
  } catch (error) {
    showMessage('Failed to toggle WebRTC: ' + error.message, 'error');
    elements.webrtcProtection.checked = !elements.webrtcProtection.checked;
  }
});

// Fingerprint Protection toggle
elements.fingerprintProtection.addEventListener('change', async () => {
  try {
    await chrome.storage.local.set({
      fingerprintProtection: elements.fingerprintProtection.checked
    });

    showMessage(
      elements.fingerprintProtection.checked
        ? 'Fingerprint protection enabled - Reload pages for effect'
        : 'Fingerprint protection disabled',
      'success'
    );
  } catch (error) {
    showMessage('Failed to toggle Fingerprint protection: ' + error.message, 'error');
    elements.fingerprintProtection.checked = !elements.fingerprintProtection.checked;
  }
});

// Apply User Agent
async function applyUserAgent() {
  let userAgent = '';

  if (elements.userAgent.value === 'custom') {
    userAgent = elements.customUserAgent.value.trim();
  } else {
    userAgent = userAgentPresets[elements.userAgent.value] || '';
  }

  try {
    await chrome.runtime.sendMessage({
      action: 'setUserAgent',
      userAgent: userAgent
    });

    await chrome.storage.local.set({
      selectedUserAgent: elements.userAgent.value,
      customUserAgent: elements.customUserAgent.value
    });

    if (userAgent) {
      showMessage('User agent updated', 'success');
    } else {
      showMessage('User agent reset to default', 'success');
    }
  } catch (error) {
    showMessage('Failed to update user agent: ' + error.message, 'error');
  }
}

// Show message to user
function showMessage(text, type = 'success') {
  elements.message.textContent = text;
  elements.message.className = `message ${type}`;
  elements.message.classList.remove('hidden');

  setTimeout(() => {
    elements.message.classList.add('hidden');
  }, 3000);
}

// Update status indicator
function updateStatus(connected) {
  if (connected) {
    elements.statusIndicator.classList.add('connected');
    elements.statusIndicator.querySelector('.status-text').textContent = 'Connected';
    elements.connectBtn.disabled = true;
    elements.disconnectBtn.disabled = false;
  } else {
    elements.statusIndicator.classList.remove('connected');
    elements.statusIndicator.querySelector('.status-text').textContent = 'Disconnected';
    elements.connectBtn.disabled = false;
    elements.disconnectBtn.disabled = true;
  }
}

// Connect to proxy
elements.connectBtn.addEventListener('click', async () => {
  const host = elements.proxyHost.value.trim();
  const port = parseInt(elements.proxyPort.value);
  const type = elements.proxyType.value;

  // Validation
  if (!host) {
    showMessage('Please enter proxy host/IP address', 'error');
    return;
  }

  if (!port || port < 1 || port > 65535) {
    showMessage('Please enter a valid port (1-65535)', 'error');
    return;
  }

  const proxyConfig = {
    type,
    host,
    port
  };

  // Add authentication if enabled
  if (elements.useAuth.checked) {
    const username = elements.proxyUsername.value.trim();
    const password = elements.proxyPassword.value;

    if (!username || !password) {
      showMessage('Please enter username and password', 'error');
      return;
    }

    proxyConfig.username = username;
    proxyConfig.password = password;
  }

  try {
    // Send config to background script
    await chrome.runtime.sendMessage({
      action: 'setProxy',
      config: proxyConfig
    });

    // Save current state
    await chrome.storage.local.set({
      proxyConnected: true,
      currentProxy: proxyConfig
    });

    updateStatus(true);
    showMessage('Proxy connected successfully!', 'success');
  } catch (error) {
    showMessage('Failed to connect: ' + error.message, 'error');
  }
});

// Disconnect proxy
elements.disconnectBtn.addEventListener('click', async () => {
  try {
    await chrome.runtime.sendMessage({ action: 'clearProxy' });

    await chrome.storage.local.set({
      proxyConnected: false,
      currentProxy: null
    });

    updateStatus(false);
    showMessage('Proxy disconnected', 'success');
  } catch (error) {
    showMessage('Failed to disconnect: ' + error.message, 'error');
  }
});

// Save current proxy configuration
elements.saveProxyBtn.addEventListener('click', async () => {
  const host = elements.proxyHost.value.trim();
  const port = parseInt(elements.proxyPort.value);
  const type = elements.proxyType.value;

  if (!host || !port) {
    showMessage('Please enter host and port to save', 'error');
    return;
  }

  const proxyConfig = {
    id: Date.now().toString(),
    name: `${type.toUpperCase()} - ${host}:${port}`,
    type,
    host,
    port
  };

  if (elements.useAuth.checked) {
    proxyConfig.username = elements.proxyUsername.value.trim();
    proxyConfig.password = elements.proxyPassword.value;
  }

  // Get existing saved proxies
  const { savedProxies = [] } = await chrome.storage.local.get('savedProxies');
  savedProxies.push(proxyConfig);

  await chrome.storage.local.set({ savedProxies });

  showMessage('Proxy saved successfully!', 'success');
  loadSavedProxies();
});

// Load saved proxies
async function loadSavedProxies() {
  const { savedProxies = [] } = await chrome.storage.local.get('savedProxies');

  if (savedProxies.length === 0) {
    elements.proxyList.innerHTML = '<p class="empty-state">No saved proxies</p>';
    return;
  }

  elements.proxyList.innerHTML = savedProxies.map(proxy => `
    <div class="proxy-item" data-id="${proxy.id}">
      <div class="proxy-info">
        <div class="proxy-name">${proxy.name}</div>
        <div class="proxy-details">${proxy.type.toUpperCase()} ${proxy.username ? '(Auth)' : ''}</div>
      </div>
      <div class="proxy-actions">
        <button class="icon-btn load-proxy" data-id="${proxy.id}" title="Load">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M4 12H20M20 12L14 6M20 12L14 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </button>
        <button class="icon-btn delete delete-proxy" data-id="${proxy.id}" title="Delete">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M6 6L18 18M6 18L18 6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </button>
      </div>
    </div>
  `).join('');

  // Add event listeners to load buttons
  document.querySelectorAll('.load-proxy').forEach(btn => {
    btn.addEventListener('click', loadProxy);
  });

  // Add event listeners to delete buttons
  document.querySelectorAll('.delete-proxy').forEach(btn => {
    btn.addEventListener('click', deleteProxy);
  });
}

// Load a saved proxy into the form
async function loadProxy(e) {
  const id = e.currentTarget.dataset.id;
  const { savedProxies = [] } = await chrome.storage.local.get('savedProxies');
  const proxy = savedProxies.find(p => p.id === id);

  if (proxy) {
    elements.proxyType.value = proxy.type;
    elements.proxyHost.value = proxy.host;
    elements.proxyPort.value = proxy.port;

    if (proxy.username && proxy.password) {
      elements.useAuth.checked = true;
      elements.authFields.classList.remove('hidden');
      elements.proxyUsername.value = proxy.username;
      elements.proxyPassword.value = proxy.password;
    } else {
      elements.useAuth.checked = false;
      elements.authFields.classList.add('hidden');
    }

    showMessage('Proxy loaded', 'success');
  }
}

// Delete a saved proxy
async function deleteProxy(e) {
  e.stopPropagation();
  const id = e.currentTarget.dataset.id;

  const { savedProxies = [] } = await chrome.storage.local.get('savedProxies');
  const filteredProxies = savedProxies.filter(p => p.id !== id);

  await chrome.storage.local.set({ savedProxies: filteredProxies });

  showMessage('Proxy deleted', 'success');
  loadSavedProxies();
}

// Initialize on load
async function initialize() {
  // Load saved proxies
  loadSavedProxies();

  // Check current proxy state
  const {
    proxyConnected = false,
    currentProxy,
    selectedUserAgent = 'default',
    customUserAgent = '',
    webrtcProtection = false,
    fingerprintProtection = false
  } = await chrome.storage.local.get([
    'proxyConnected',
    'currentProxy',
    'selectedUserAgent',
    'customUserAgent',
    'webrtcProtection',
    'fingerprintProtection'
  ]);

  // Restore proxy settings
  if (proxyConnected && currentProxy) {
    updateStatus(true);

    // Load current proxy into form
    elements.proxyType.value = currentProxy.type;
    elements.proxyHost.value = currentProxy.host;
    elements.proxyPort.value = currentProxy.port;

    if (currentProxy.username) {
      elements.useAuth.checked = true;
      elements.authFields.classList.remove('hidden');
      elements.proxyUsername.value = currentProxy.username;
      elements.proxyPassword.value = currentProxy.password || '';
    }
  } else {
    updateStatus(false);
  }

  // Restore User Agent settings
  elements.userAgent.value = selectedUserAgent;
  if (selectedUserAgent === 'custom') {
    elements.customUserAgent.value = customUserAgent;
    elements.customUserAgentField.classList.remove('hidden');
  }

  // Restore WebRTC settings
  elements.webrtcProtection.checked = webrtcProtection;

  // Restore Fingerprint Protection settings
  elements.fingerprintProtection.checked = fingerprintProtection;
}

// Run initialization
initialize();
