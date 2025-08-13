import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.billings.app',
  appName: 'VTopup',
  webDir: 'public',
  server: {
    url: 'http://localhost:3000', // Use localhost with ADB reverse
    cleartext: true
  }
};

export default config;