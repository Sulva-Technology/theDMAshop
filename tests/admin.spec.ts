import path from 'path';
import { fileURLToPath } from 'url';

import { expect, test, type Page } from '@playwright/test';

const adminEmail = process.env.E2E_ADMIN_EMAIL || process.env.ADMIN_BOOTSTRAP_EMAIL;
const adminPassword = process.env.E2E_ADMIN_PASSWORD || process.env.ADMIN_BOOTSTRAP_PASSWORD;
const currentDir = path.dirname(fileURLToPath(import.meta.url));
const uploadFixture = path.resolve(currentDir, 'fixtures', 'admin-upload.svg');

async function loginAsAdmin(page: Page) {
  if (!adminEmail || !adminPassword) {
    test.skip(true, 'Set E2E_ADMIN_EMAIL/E2E_ADMIN_PASSWORD or ADMIN_BOOTSTRAP_EMAIL/ADMIN_BOOTSTRAP_PASSWORD.');
  }

  await page.goto('/admin');
  await expect(page).toHaveURL(/\/auth$/);
  await page.getByTestId('auth-email').fill(adminEmail ?? '');
  await page.getByTestId('auth-password').fill(adminPassword ?? '');
  await page.getByTestId('auth-submit').click();
  await expect(page).toHaveURL(/\/admin$/);
  await expect(page.getByTestId('admin-dashboard-heading')).toBeVisible();
}

test.describe.configure({ mode: 'serial' });

test('redirects unauthenticated users away from admin routes', async ({ page }) => {
  await page.goto('/admin');
  await expect(page).toHaveURL(/\/auth$/);
});

test('allows an admin to access every admin module route', async ({ page }) => {
  await loginAsAdmin(page);

  await page.goto('/admin/products');
  await expect(page).toHaveURL(/\/admin\/products$/);
  await expect(page.getByRole('heading', { name: 'Products' })).toBeVisible();

  await page.goto('/admin/orders');
  await expect(page).toHaveURL(/\/admin\/orders$/);
  await expect(page.getByTestId('admin-orders-heading')).toBeVisible();

  await page.goto('/admin/customers');
  await expect(page).toHaveURL(/\/admin\/customers$/);
  await expect(page.getByTestId('admin-customers-heading')).toBeVisible();

  await page.goto('/admin/content');
  await expect(page).toHaveURL(/\/admin\/content$/);
  await expect(page.getByRole('heading', { name: 'Content Management' })).toBeVisible();

  await page.goto('/admin/analytics');
  await expect(page).toHaveURL(/\/admin\/analytics$/);
  await expect(page.getByTestId('admin-analytics-heading')).toBeVisible();
});

test('creates a product with an uploaded image from the admin products screen', async ({ page }) => {
  const uniqueSuffix = Date.now();
  const productTitle = `Admin Test Product ${uniqueSuffix}`;

  await loginAsAdmin(page);
  await page.goto('/admin/products');

  await page.getByTestId('admin-products-add-button').click();
  await page.getByTestId('image-upload-input-product-media').first().setInputFiles(uploadFixture);
  await expect(page.getByText('Image(s) uploaded successfully')).toBeVisible();

  await page.getByTestId('admin-products-title').fill(productTitle);
  await page.getByTestId('admin-products-summary').fill('Created by the Playwright admin test suite.');
  await page.getByTestId('admin-products-price').fill('49.99');
  await page.getByTestId('admin-products-save-button').click();

  await expect(page.getByText('Product added successfully')).toBeVisible();
  await expect(page.getByText(productTitle)).toBeVisible();
});

test('uploads CMS imagery and persists content changes', async ({ page }) => {
  const slogan = `Admin test slogan ${Date.now()}`;

  await loginAsAdmin(page);
  await page.goto('/admin/content');

  await page.getByTestId('image-upload-input-product-media').first().setInputFiles(uploadFixture);
  await expect(page.getByText('Image(s) uploaded successfully')).toBeVisible();

  await page.getByTestId('admin-cms-hero-slogan').fill(slogan);
  await page.getByTestId('admin-cms-save-button').click();
  await expect(page.getByText('Content settings saved')).toBeVisible();

  await page.reload();
  await expect(page.getByTestId('admin-cms-hero-slogan')).toHaveValue(slogan);
});

test('loads customer summaries without permission errors', async ({ page }) => {
  await loginAsAdmin(page);
  await page.goto('/admin/customers');

  await expect(page.getByTestId('admin-customers-heading')).toBeVisible();
  await expect(page.getByText(/Unable to load customers/i)).toHaveCount(0);
  await expect(page.locator('[data-testid^="admin-customer-view-"]').first()).toBeVisible();
});

test('loads the orders module and advances fulfillment when actionable orders exist', async ({ page }) => {
  await loginAsAdmin(page);
  await page.goto('/admin/orders');

  await expect(page.getByTestId('admin-orders-heading')).toBeVisible();
  await expect(page.getByText(/Unable to load orders/i)).toHaveCount(0);
  const viewOrderButtons = page.locator('[data-testid^="admin-order-view-"]');
  const orderCount = await viewOrderButtons.count();

  if (orderCount === 0) {
    await expect(page.getByText('No orders found.')).toBeVisible();
    return;
  }

  await viewOrderButtons.first().click();
  const advanceButton = page.getByRole('button', { name: /Mark as/i });
  const cancelButton = page.getByRole('button', { name: /Cancel order/i });

  if (await advanceButton.count()) {
    await advanceButton.click();
    await expect(page.getByText(/Order updated to/i)).toBeVisible();
    return;
  }

  await expect(cancelButton).toHaveCount(0);
});
