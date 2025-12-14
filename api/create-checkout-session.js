// api/create-checkout-session.js
import Stripe from "stripe";

// Use Stripe's fetch-based HTTP client – works better on some hosts (Vercel/Cloudflare etc.)
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2024-06-20",
  httpClient: Stripe.createFetchHttpClient(),
  maxNetworkRetries: 1, // optional: avoid super long waits
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { items } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: "Cart is empty" });
    }

    const line_items = items.map((item) => ({
      price_data: {
        currency: "dkk",
        product_data: {
          name: item.name || "Product",
        },
        // Stripe wants *integer* amount in øre
        unit_amount: Math.round(Number(item.price) * 100),
      },
      quantity: item.qty || 1,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items,
      success_url: `${req.headers.origin}/order-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.origin}/checkout`,
    });

    return res.status(200).json({ url: session.url });
  } catch (err) {
    console.error("Stripe checkout error:", err); // shows up in Vercel logs

    return res.status(500).json({
      error: err?.message || "Server error when creating checkout session",
    });
  }
}
