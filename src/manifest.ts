import packageJson from '../package.json'

export default {
  manifest_version: 3,
  name: packageJson.name,
  description: packageJson.description,
  version: packageJson.version,
  icons: {
    16: 'images/16.png',
    32: 'images/32.png',
    48: 'images/48.png',
    128: 'images/128.png',
  },
  permissions: [
    'storage',
    'cookies'
  ],
  background: {
    service_worker: 'service-worker.js',
    type: 'module'
  },
  action: {
    default_popup: 'popup.html'
  }
}
