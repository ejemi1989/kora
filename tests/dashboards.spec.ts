import { test, expect } from "@playwright/test"

const BASE = "http://localhost:3001"

test.describe("Seller dashboard", () => {
  test("redirects unauthenticated to sign-in", async ({ page }) => {
    await page.goto(`${BASE}/seller/overview`, { waitUntil: "networkidle" })
    await expect(page).toHaveURL(/\/sign-in/, { timeout: 15000 })
  })

  test("dynamic pages redirect to sign-in", async ({ page }) => {
    const pages = ["/seller/products", "/seller/orders", "/seller/inventory", "/seller/settings"]
    for (const path of pages) {
      await page.goto(`${BASE}${path}`, { waitUntil: "networkidle" })
      await expect(page).toHaveURL(/\/sign-in/, { timeout: 15000 })
    }
  })
})

test.describe("Admin dashboard", () => {
  test("redirects unauthenticated to sign-in", async ({ page }) => {
    await page.goto(`${BASE}/admin/overview`, { waitUntil: "networkidle" })
    await expect(page).toHaveURL(/\/sign-in/, { timeout: 15000 })
  })

  test("dynamic pages redirect to sign-in", async ({ page }) => {
    const pages = ["/admin/users", "/admin/sellers", "/admin/products", "/admin/orders", "/admin/currencies"]
    for (const path of pages) {
      await page.goto(`${BASE}${path}`, { waitUntil: "networkidle" })
      await expect(page).toHaveURL(/\/sign-in/, { timeout: 15000 })
    }
  })
})
