const FROM_ADDRESS = "noreply@denimarketplace.com";
const FROM_NAME = "Deni Marketplace";

export function wrapTemplate(title: string, body: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
</head>
<body style="margin:0;padding:0;background:#fafafa;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#fafafa;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:8px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.08);">
          <tr>
            <td style="padding:24px 32px;border-bottom:1px solid #ebebeb;">
              <span style="font-size:20px;font-weight:700;color:#171717;letter-spacing:-0.02em;">Deni</span>
            </td>
          </tr>
          <tr>
            <td style="padding:32px;">
              ${body}
            </td>
          </tr>
          <tr>
            <td style="padding:16px 32px;border-top:1px solid #ebebeb;font-size:12px;color:#888888;text-align:center;">
              Deni Marketplace &mdash; Authentic African food, delivered
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export function orderConfirmationEmail(params: {
  customerName: string;
  orderId: string;
  items: string[];
  total: string;
  trackingUrl: string;
}) {
  const itemsHtml = params.items.map((item) => `<li style="margin-bottom:4px;">${item}</li>`).join("");

  const body = `
    <h1 style="font-size:22px;font-weight:600;color:#171717;margin:0 0 8px;letter-spacing:-0.02em;">Order Confirmed!</h1>
    <p style="font-size:15px;color:#4d4d4d;margin:0 0 24px;line-height:1.6;">Hi ${params.customerName}, your order has been confirmed and is being processed.</p>

    <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f5;border-radius:6px;padding:16px;margin-bottom:24px;">
      <tr>
        <td style="font-size:13px;color:#888888;padding-bottom:4px;">Order Reference</td>
      </tr>
      <tr>
        <td style="font-size:16px;font-weight:600;color:#171717;font-family:monospace;padding-bottom:16px;">${params.orderId}</td>
      </tr>
      <tr>
        <td style="font-size:13px;color:#888888;padding-bottom:4px;">Items</td>
      </tr>
      <tr>
        <td style="font-size:14px;color:#171717;padding-bottom:16px;">
          <ul style="margin:0;padding-left:18px;">${itemsHtml}</ul>
        </td>
      </tr>
      <tr>
        <td style="font-size:13px;color:#888888;padding-bottom:4px;">Total</td>
      </tr>
      <tr>
        <td style="font-size:18px;font-weight:700;color:#ea2804;">${params.total}</td>
      </tr>
    </table>

    <a href="${params.trackingUrl}" style="display:inline-block;padding:12px 24px;background:#ea2804;color:#ffffff;text-decoration:none;border-radius:6px;font-size:14px;font-weight:600;">Track Your Order</a>
  `;

  return {
    from: `${FROM_NAME} <${FROM_ADDRESS}>`,
    subject: `Order ${params.orderId} confirmed \u2014 thank you!`,
    html: wrapTemplate("Order Confirmed", body),
  };
}

export function welcomeEmail(params: { customerName: string; shopUrl: string }) {
  const body = `
    <h1 style="font-size:22px;font-weight:600;color:#171717;margin:0 0 8px;letter-spacing:-0.02em;">Welcome to Deni!</h1>
    <p style="font-size:15px;color:#4d4d4d;margin:0 0 24px;line-height:1.6;">Hi ${params.customerName}, we're excited to have you on board. Discover authentic African food delivered straight to your door.</p>
    <a href="${params.shopUrl}" style="display:inline-block;padding:12px 24px;background:#ea2804;color:#ffffff;text-decoration:none;border-radius:6px;font-size:14px;font-weight:600;">Start Shopping</a>
  `;

  return {
    from: `${FROM_NAME} <${FROM_ADDRESS}>`,
    subject: "Welcome to Deni Marketplace!",
    html: wrapTemplate("Welcome", body),
  };
}

export function trackingUpdateEmail(params: {
  customerName: string;
  orderId: string;
  status: string;
  description: string;
  trackingUrl: string;
}) {
  const body = `
    <h1 style="font-size:22px;font-weight:600;color:#171717;margin:0 0 8px;letter-spacing:-0.02em;">Delivery Update</h1>
    <p style="font-size:15px;color:#4d4d4d;margin:0 0 24px;line-height:1.6;">Hi ${params.customerName}, there's an update on your order <span style="font-family:monospace;font-weight:600;">${params.orderId}</span>.</p>

    <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f5;border-radius:6px;padding:16px;margin-bottom:24px;">
      <tr>
        <td style="font-size:13px;color:#888888;padding-bottom:4px;">New Status</td>
      </tr>
      <tr>
        <td style="font-size:16px;font-weight:600;color:#ea2804;padding-bottom:12px;">${params.status}</td>
      </tr>
      <tr>
        <td style="font-size:14px;color:#4d4d4d;line-height:1.5;">${params.description}</td>
      </tr>
    </table>

    <a href="${params.trackingUrl}" style="display:inline-block;padding:12px 24px;background:#ea2804;color:#ffffff;text-decoration:none;border-radius:6px;font-size:14px;font-weight:600;">View Tracking Details</a>
  `;

  return {
    from: `${FROM_NAME} <${FROM_ADDRESS}>`,
    subject: `Your order ${params.orderId} \u2014 ${params.status}`,
    html: wrapTemplate("Delivery Update", body),
  };
}
