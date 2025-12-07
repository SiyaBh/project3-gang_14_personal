const BASE_URL = "http://localhost:3001/api/receipt";

export async function sendReceipt(order) {
  try {
    const response = await fetch(BASE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customerEmail: order.customerEmail,
        customerName: order.customerName,
        orderId: order.id,
        items: order.items,
        subtotal: order.subtotal,
        tax: order.tax,
        total: order.total,
        createdAt: order.createdAt
      })
    });

    const text = await response.text();

    let data;
    try {
      data = text ? JSON.parse(text) : {};
    } catch {
      data = { raw: text };
    }

    if (!response.ok) {
      console.error('Failed to send receipt');
      throw new Error(data.error || 'Failed to send receipt email');
    }

    return data;
  } catch (err) {
    console.error('Error calling /api/receipt:', err);
    throw err;
  }
}
