import { test, expect } from "@playwright/test"

const BASE = "http://localhost:3001"

test.describe("Route protection", () => {
  for (const path of ["/admin/overview", "/seller/overview", "/user/overview"]) {
    test(`redirects unauthenticated ${path} to sign-in`, async ({ page }) => {
      await page.goto(`${BASE}${path}`, { waitUntil: "networkidle" })
      await page.waitForURL(/\/sign-in/, { timeout: 15000 })
      expect(page.url()).toContain("/sign-in")
    })
  }
})

test.describe("Public pages render", () => {
  test("landing page loads", async ({ page }) => {
    await page.goto(BASE, { waitUntil: "networkidle" })
    await expect(page.locator("body")).toBeVisible()
    const text = await page.textContent("body")
    expect(text).toContain("Deni")
  })

  test("sign-in page renders", async ({ page }) => {
    await page.goto(`${BASE}/sign-in`, { waitUntil: "networkidle" })
    await expect(page.locator("body")).toBeVisible()
    const text = await page.textContent("body")
    expect(text).toContain("Sign in")
  })

  test("sign-up page renders", async ({ page }) => {
    await page.goto(`${BASE}/sign-up`, { waitUntil: "networkidle" })
    await expect(page.locator("body")).toBeVisible()
    const text = await page.textContent("body")
    expect(text).toContain("Create your account")
  })
})

test.describe("Auth callback", () => {
  test("redirects unauthenticated to sign-in", async ({ page }) => {
    await page.goto(`${BASE}/auth/callback`, { waitUntil: "networkidle" })
    await expect(page).toHaveURL(/\/sign-in/, { timeout: 15000 })
  })
})
