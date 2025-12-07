const express = require('express');
const router = express.Router();
const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

function formatOptions(options) {
  if (!options) return "";

  const parts = [];

  if (options.temperature) parts.push(`${options.temperature}`);
  if (options.sugar) parts.push(`${options.sugar} Sugar`);
  if (options.ice) {
    const iceLabel = options.ice === "None" ? "No" : options.ice;
    parts.push(`${iceLabel} Ice`);
  }

  if (options.toppings && options.toppings.length > 0)
    parts.push(`${options.toppings.join(", ")}`);

  if (options.misc && options.misc.length > 0)
    parts.push(`${options.misc.join(", ")}`);

  return parts.join(" • ");
}

function generateReceiptHtml({
  customerName,
  orderId,
  items,
  subtotal,
  tax,
  total,
  createdAt
}) {
  const safeItems = Array.isArray(items) ? items : [];
  const itemsRows = safeItems.map((item) => {
    const optionsText = formatOptions(item.options);

    return `
      <tr>
        <td style="padding: 8px 12px; border-bottom: 1px solid #eee;">
          ${item.name}
        </td>
        <td style="padding: 8px 12px; border-bottom: 1px solid #eee; text-align:center;">
          ${item.quantity}
        </td>
        <td style="padding: 8px 12px; border-bottom: 1px solid #eee; text-align:right;">
          $${item.displayPrice}
        </td>
      </tr>

      ${optionsText ? `
        <tr>
          <td colspan="3"
              style="padding: 0 12px 8px 12px; color: #666; font-size: 12px;">
            ${optionsText}
          </td>
        </tr>
      ` : ""}
    `;
  }).join("");


  const safeSubtotal = Number(subtotal) || 0;
  const safeTax = Number(tax) || 0;
  const safeTotal = Number(total) || 0;

  return `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
    <h2 style="text-align:center; margin-bottom: 0.5rem;">Boba by Taele – Receipt</h2>
    <p style="text-align:center; margin-top: 0;">Order #${orderId}</p>

    <p>Hi ${customerName || 'there'},</p>
    <p>Thanks for your order! Here is your receipt for <strong>Order #${orderId}</strong> placed on ${new Date(createdAt).toLocaleString()}.</p>

    <table style="width: 100%; border-collapse: collapse; margin-top: 16px;">
      <thead>
        <tr>
          <th style="padding: 8px 12px; border-bottom: 2px solid #000; text-align:left;">Item</th>
          <th style="padding: 8px 12px; border-bottom: 2px solid #000; text-align:center;">Qty</th>
          <th style="padding: 8px 12px; border-bottom: 2px solid #000; text-align:right;">Price</th>
        </tr>
      </thead>
      <tbody>
        ${itemsRows}
      </tbody>
    </table>

    <div style="margin-top: 16px; text-align:right;">
      <p>Subtotal: <strong>$${safeSubtotal.toFixed(2)}</strong></p>
      <p>Tax: <strong>$${safeTax.toFixed(2)}</strong></p>
      <p>Total: <strong>$${safeTotal.toFixed(2)}</strong></p>
    </div>

    <p style="margin-top: 24px; font-size: 0.9rem; color: #555;">
      Loved your order? Tell your friends or review us online!
    </p>
  </div>
  `;
}

router.post('/', async (req, res) => {
  try {

    const {
      customerEmail,
      customerName,
      orderId,
      items,
      subtotal,
      tax,
      total,
      createdAt
    } = req.body;

    const html = generateReceiptHtml({
      customerName,
      orderId,
      items,
      subtotal,
      tax,
      total,
      createdAt: createdAt || new Date().toISOString()
    });

    const msg = {
      to: customerEmail,
      from: {
        email: process.env.SENDGRID_FROM_EMAIL,
        name: 'Boba by Taele'
      },
      subject: `Your Boba by Taele Receipt – Order #${orderId}`,
      html
    };

    await sgMail.send(msg);

    res.status(200).json({ message: 'Receipt email sent successfully' });
  } catch (err) {
    console.error('Error sending receipt email:');
    console.error(err?.response?.body || err);
    res.status(500).json({ error: 'Failed to send receipt email' });
  }
});

module.exports = router;
