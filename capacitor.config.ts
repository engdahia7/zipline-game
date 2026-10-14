import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.zipline.game.puzzle',
  appName: 'ZipLine',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  }
};

export default config;
