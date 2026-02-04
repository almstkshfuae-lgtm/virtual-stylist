type CapacitorConfig = {
  appId: string;
  appName: string;
  webDir: string;
  server?: {
    androidScheme?: string;
  };
};

const config: CapacitorConfig = {
  appId: 'com.stylish.virtualstylist',
  appName: 'Virtual Stylist AI',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  }
};

export default config;
