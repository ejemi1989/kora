import { chromium } from "@playwright/test";
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
await page.goto("http://localhost:3001/sign-up", { waitUntil: "networkidle", timeout: 15000 });
await page.waitForTimeout(3000);

// Check all input elements
const inputs = await page.evaluate(() => {
  const all = document.querySelectorAll("input");
  return Array.from(all).map(el => ({
    type: el.type,
    name: el.name,
    id: el.id,
    placeholder: el.placeholder,
    visible: el.offsetParent !== null,
    rect: el.getBoundingClientRect(),
    classes: el.className.substring(0, 80),
  }));
});
console.log("INPUTS:", JSON.stringify(inputs, null, 2));

// Check all iframes
const iframes = await page.evaluate(() => {
  const all = document.querySelectorAll("iframe");
  return Array.from(all).map(el => ({
    src: el.src?.substring(0, 100),
    title: el.title,
    visible: el.offsetParent !== null,
    rect: el.getBoundingClientRect(),
  }));
});
console.log("IFRAMES:", JSON.stringify(iframes, null, 2));

// Check shadow roots
const hasShadow = await page.evaluate(() => {
  const all = document.querySelectorAll("*");
  const results = [];
  for (const el of all) {
    if (el.shadowRoot) {
      results.push(el.tagName + (el.className ? "." + el.className.substring(0, 40) : ""));
    }
  }
  return results;
});
console.log("SHADOW ROOTS:", JSON.stringify(hasShadow, null, 2));

// Grab the HTML around where email label appears
const htmlSnippet = await page.evaluate(() => {
  const body = document.body;
  const walker = document.createTreeWalker(body, 4 /* SHOW_ELEMENT */);
  const results = [];
  let count = 0;
  while (walker.nextNode() && count < 50) {
    const el = walker.currentNode;
    if (el.textContent?.includes("Email") || el.tagName === "INPUT" || el.tagName === "IFRAME") {
      results.push({
        tag: el.tagName,
        text: el.textContent?.substring(0, 60),
        cls: el.className?.substring(0, 40),
        rect: el.getBoundingClientRect(),
        visible: el.offsetParent !== null,
      });
      count++;
    }
  }
  return results;
});
console.log("EMAIL-RELATED ELEMENTS:", JSON.stringify(htmlSnippet, null, 2));

await browser.close();
