import packageJson from '../package.json' assert { type: 'json' }

// type Manifest = chrome.runtime.ManifestV3

export default {
  manifest_version: 3,
  name: packageJson.name,
  description: packageJson.description,
  version: packageJson.version,
  icons: {
    16: 'images/16.png',
    32: 'images/32.png',
    48: 'images/48.png',
    128: 'images/128.png'
  },
  permissions: [
    'storage',
    'cookies',
    'tabs',
    'webRequest',
    'webRequestBlocking',
  ],
  host_permissions: [
    '<all_urls>'
  ],
  background: {
    service_worker: 'service-worker.js',
    type: 'module'
  },
  action: {
    default_icon: {
      16: 'images/16.png',
      32: 'images/32.png',
      48: 'images/48.png',
      128: 'images/128.png'
    },
    // default_popup: 'popup.html'
  }
}
