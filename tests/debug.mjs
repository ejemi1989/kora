import { chromium } from "@playwright/test";
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
await page.goto("http://localhost:3001/sign-up", { waitUntil: "networkidle", timeout: 15000 });
await page.waitForTimeout(3000);
await page.screenshot({ path: "/tmp/sign-up.png", fullPage: true });
const text = await page.textContent("body");
console.log("=== PAGE TEXT (first 2000 chars) ===");
console.log(text.substring(0, 2000));
const clerkEls = await page.locator("[class*=cl-]").all();
console.log(`\n=== CLERK ELEMENTS (${clerkEls.length} found) ===`);
for (const el of clerkEls.slice(0, 15)) {
  const tag = await el.evaluate(e => e.tagName);
  const visible = await el.isVisible();
  const box = await el.boundingBox();
  const cls = await el.getAttribute("class");
  console.log(`  ${tag} visible=${visible} box=${JSON.stringify(box)} cls=${cls?.substring(0,80)}`);
}
const bodyText = await page.evaluate(() => document.body.innerText);
console.log("\n=== BODY INNER TEXT ===");
console.log(bodyText);
await browser.close();
