import 'dotenv/config';

import { defineConfig, devices } from '@playwright/test';

const appUrl = process.env.APP_URL || 'http://127.0.0.1:3000';

export default defineConfig({
  testDir: './tests',
  timeout: 60_000,
  expect: {
    timeout: 10_000,
  },
  fullyParallel: false,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: appUrl,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'off',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    },
  ],
  webServer: {
    command: 'npm run dev',
    url: appUrl,
    reuseExistingServer: true,
    timeout: 120_000,
  },
});
