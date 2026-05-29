import { chromium } from "@playwright/test";
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
await page.goto("http://localhost:3001/sign-up", { waitUntil: "networkidle", timeout: 15000 });
await page.waitForTimeout(4000);
await page.screenshot({ path: "/tmp/sign-up-full.png", fullPage: true });
await page.setViewportSize({ width: 390, height: 844 });
await page.waitForTimeout(1000);
await page.screenshot({ path: "/tmp/sign-up-mobile.png", fullPage: true });
console.log("Screenshots saved to /tmp/sign-up-full.png and /tmp/sign-up-mobile.png");

// Check if the form fields are actually visible/interactable
const emailField = page.locator("input[type=email]");
const passwordField = page.locator("input[type=password]");
console.log("Email field visible:", await emailField.isVisible());
console.log("Password field visible:", await passwordField.isVisible());
console.log("Email field count:", await emailField.count());
console.log("Password field count:", await passwordField.count());

// Check for any console errors
page.on("console", msg => {
  if (msg.type() === "error") console.log("CONSOLE ERROR:", msg.text());
});
await browser.close();
