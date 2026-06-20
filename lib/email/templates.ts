const FROM = "Deni Marketplace <info@denimarketplace.com>";

export function baseTemplate(content: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background:#fafafa;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#fafafa;padding:40px 0;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.06);">
        <tr>
          <td style="padding:28px 36px;background:#ea2804;">
            <span style="font-size:20px;font-weight:700;color:#ffffff;letter-spacing:-0.02em;">Deni Marketplace</span>
          </td>
        </tr>
        <tr><td style="padding:32px 36px;">${content}</td></tr>
        <tr>
          <td style="padding:20px 36px;border-top:1px solid #ebebeb;font-size:12px;color:#888888;text-align:center;line-height:1.6;">
            Deni Marketplace &mdash; Authentic African food, delivered<br>
            <a href="https://denimarketplace.com" style="color:#ea2804;text-decoration:none;">denimarketplace.com</a>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

function btn(text: string, url: string): string {
  return `<a href="${url}" style="display:inline-block;padding:14px 28px;background:#ea2804;color:#ffffff;text-decoration:none;border-radius:8px;font-size:14px;font-weight:600;margin:16px 0;">${text} →</a>`;
}

function box(items: Array<{ label: string; value: string }>): string {
  const rows = items.map((i) => `
    <tr>
      <td style="font-size:13px;color:#888888;padding:6px 0 2px;">${i.label}</td>
    </tr>
    <tr>
      <td style="font-size:15px;font-weight:600;color:#171717;padding:0 0 12px;${i === items[items.length - 1] ? "padding-bottom:0;" : ""}">${i.value}</td>
    </tr>
  `).join("");
  return `<table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f5;border-radius:8px;padding:18px 20px;margin:16px 0;">${rows}</table>`;
}

export function welcome(name: string): { from: string; subject: string; html: string } {
  return {
    from: FROM,
    subject: "Welcome to Deni Marketplace!",
    html: baseTemplate(`
      <h1 style="font-size:24px;font-weight:700;color:#171717;margin:0 0 8px;letter-spacing:-0.02em;">Welcome, ${name}!</h1>
      <p style="font-size:15px;color:#4d4d4d;margin:0 0 8px;line-height:1.6;">Thank you for joining Deni Marketplace — your destination for authentic African food.</p>
      <p style="font-size:15px;color:#4d4d4d;margin:0 0 8px;line-height:1.6;">Browse hundreds of products from trusted sellers, place orders securely, and track your deliveries in real time.</p>
      ${btn("Start Shopping", "https://denimarketplace.com/user/shop")}
    `),
  };
}

export function orderConfirmed(params: {
  name: string;
  orderId: string;
  items: string[];
  total: string;
}): { from: string; subject: string; html: string } {
  return {
    from: FROM,
    subject: `Order ${params.orderId} confirmed ✓`,
    html: baseTemplate(`
      <h1 style="font-size:24px;font-weight:700;color:#171717;margin:0 0 8px;letter-spacing:-0.02em;">Order Confirmed</h1>
      <p style="font-size:15px;color:#4d4d4d;margin:0 0 8px;line-height:1.6;">Hi ${params.name}, your order has been received and is now being processed.</p>
      ${box([
        { label: "Order Reference", value: params.orderId },
        { label: "Items", value: params.items.join(", ") },
        { label: "Total", value: params.total },
      ])}
      ${btn("Track Your Order", `https://denimarketplace.com/user/tracking`)}
    `),
  };
}

export function orderShipped(params: {
  name: string;
  orderId: string;
  trackingNumber: string;
}): { from: string; subject: string; html: string } {
  return {
    from: FROM,
    subject: `Your order ${params.orderId} is on its way!`,
    html: baseTemplate(`
      <h1 style="font-size:24px;font-weight:700;color:#171717;margin:0 0 8px;letter-spacing:-0.02em;">On Its Way!</h1>
      <p style="font-size:15px;color:#4d4d4d;margin:0 0 8px;line-height:1.6;">Hi ${params.name}, your order has been shipped and is heading to you.</p>
      ${box([
        { label: "Order", value: params.orderId },
        { label: "Tracking Number", value: params.trackingNumber },
      ])}
      ${btn("Track Delivery", `https://denimarketplace.com/user/tracking`)}
    `),
  };
}

export function orderDelivered(params: {
  name: string;
  orderId: string;
}): { from: string; subject: string; html: string } {
  return {
    from: FROM,
    subject: `Your order ${params.orderId} has been delivered!`,
    html: baseTemplate(`
      <h1 style="font-size:24px;font-weight:700;color:#17a34a;margin:0 0 8px;letter-spacing:-0.02em;">Delivered!</h1>
      <p style="font-size:15px;color:#4d4d4d;margin:0 0 8px;line-height:1.6;">Hi ${params.name}, your order ${params.orderId} has been successfully delivered. We hope you enjoy your products!</p>
      ${btn("Order Again", "https://denimarketplace.com/user/shop")}
    `),
  };
}

export function broadcast(params: {
  subject: string;
  html: string;
}): { from: string; subject: string; html: string } {
  return {
    from: FROM,
    subject: params.subject,
    html: baseTemplate(params.html),
  };
}
