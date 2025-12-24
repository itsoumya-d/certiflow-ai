import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/login');
    });

    test('should display login page with form elements', async ({ page }) => {
        // Check page title
        await expect(page).toHaveTitle(/CertiFlow AI/);

        // Check form elements exist
        await expect(page.getByPlaceholder(/email/i)).toBeVisible();
        await expect(page.getByPlaceholder(/password/i)).toBeVisible();
        await expect(page.getByRole('button', { name: /sign in/i })).toBeVisible();
    });

    test('should show error for invalid credentials', async ({ page }) => {
        await page.getByPlaceholder(/email/i).fill('invalid@test.com');
        await page.getByPlaceholder(/password/i).fill('wrongpassword');
        await page.getByRole('button', { name: /sign in/i }).click();

        // Should show error message
        await expect(page.getByText(/invalid/i)).toBeVisible({ timeout: 5000 });
    });

    test('should login successfully with admin credentials', async ({ page }) => {
        await page.getByPlaceholder(/email/i).fill('admin@certiflow.ai');
        await page.getByPlaceholder(/password/i).fill('admin123');
        await page.getByRole('button', { name: /sign in/i }).click();

        // Should redirect to dashboard
        await expect(page).toHaveURL(/dashboard/, { timeout: 10000 });
    });

    test('should login with quick demo buttons', async ({ page }) => {
        // Click admin demo button
        const adminButton = page.getByRole('button', { name: /admin/i }).first();
        if (await adminButton.isVisible()) {
            await adminButton.click();
            await expect(page).toHaveURL(/dashboard/, { timeout: 10000 });
        }
    });

    test('should show/hide password toggle', async ({ page }) => {
        const passwordInput = page.getByPlaceholder(/password/i);
        await passwordInput.fill('testpassword');

        // Initially password type
        await expect(passwordInput).toHaveAttribute('type', 'password');

        // Find and click toggle button (if exists)
        const toggleButton = page.locator('[aria-label*="password"]').or(
            page.locator('button:near(:text("Password"))').first()
        );
        if (await toggleButton.count() > 0) {
            await toggleButton.click();
            // Should now show text
        }
    });
});

test.describe('Protected Routes', () => {
    test('should redirect to login when accessing dashboard unauthenticated', async ({ page }) => {
        await page.goto('/dashboard');

        // Should redirect to login
        await expect(page).toHaveURL(/login/, { timeout: 5000 });
    });

    test('should redirect to login when accessing agents page unauthenticated', async ({ page }) => {
        await page.goto('/agents');

        await expect(page).toHaveURL(/login/, { timeout: 5000 });
    });

    test('should redirect to login when accessing evidence page unauthenticated', async ({ page }) => {
        await page.goto('/evidence');

        await expect(page).toHaveURL(/login/, { timeout: 5000 });
    });
});

test.describe('Public Routes', () => {
    test('should access landing page without auth', async ({ page }) => {
        await page.goto('/');

        // Should stay on landing page
        await expect(page).toHaveURL('/');
        await expect(page.getByText(/CertiFlow/i).first()).toBeVisible();
    });

    test('should access login page without auth', async ({ page }) => {
        await page.goto('/login');

        await expect(page).toHaveURL(/login/);
    });
});

test.describe('Authenticated User Flow', () => {
    test.beforeEach(async ({ page }) => {
        // Login first
        await page.goto('/login');
        await page.getByPlaceholder(/email/i).fill('admin@certiflow.ai');
        await page.getByPlaceholder(/password/i).fill('admin123');
        await page.getByRole('button', { name: /sign in/i }).click();
        await expect(page).toHaveURL(/dashboard/, { timeout: 10000 });
    });

    test('should display dashboard with compliance score', async ({ page }) => {
        await expect(page.getByText(/dashboard/i).first()).toBeVisible();
        await expect(page.getByText(/compliance/i).first()).toBeVisible();
    });

    test('should navigate to agents page', async ({ page }) => {
        await page.getByRole('link', { name: /agents/i }).click();
        await expect(page).toHaveURL(/agents/);
        await expect(page.getByText(/AI Agents/i)).toBeVisible();
    });

    test('should navigate to evidence page', async ({ page }) => {
        await page.getByRole('link', { name: /evidence/i }).click();
        await expect(page).toHaveURL(/evidence/);
        await expect(page.getByText(/Evidence Library/i)).toBeVisible();
    });

    test('should display live connection status on agents page', async ({ page }) => {
        await page.goto('/agents');

        // Should show live indicator after SSE connects
        await expect(page.getByText(/live/i)).toBeVisible({ timeout: 10000 });
    });
});
