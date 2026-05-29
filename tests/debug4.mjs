import { chromium } from "@playwright/test";
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });

// Capture console errors and network failures
page.on("console", msg => {
  if (msg.type() === "error") console.log("CONSOLE ERROR:", msg.text());
});
page.on("pageerror", err => console.log("PAGE ERROR:", err.message));
page.on("requestfailed", req => console.log("REQUEST FAILED:", req.url(), req.failure()?.errorText));

await page.goto("http://localhost:3001/sign-up", { waitUntil: "networkidle", timeout: 15000 });
await page.waitForTimeout(5000);

// Get all visible text (only visible elements)
const visibleText = await page.evaluate(() => {
  const walker = document.createTreeWalker(document.body, 4);
  const texts = [];
  while (walker.nextNode()) {
    const el = walker.currentNode;
    if (el.offsetParent !== null && el.textContent?.trim()) {
      const text = el.textContent.trim();
      if (text.length > 0) texts.push(text);
    }
  }
  return texts.slice(0, 40);
});
console.log("\n=== VISIBLE TEXT ELEMENTS ===");
for (const t of visibleText) console.log(`  [${t.substring(0, 80)}]`);

// Check Clerk CDN
const clerkCdn = await page.evaluate(() => {
  const scripts = document.querySelectorAll("script");
  return Array.from(scripts).map(s => s.src?.substring(0, 120)).filter(Boolean);
});
console.log("\n=== SCRIPTS LOADED ===");
for (const s of clerkCdn) console.log(`  ${s}`);

await browser.close();
