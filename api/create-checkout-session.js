// api/create-checkout-session.js
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // Vercel can send req.body as a string – handle both cases
    const rawBody = req.body;
    const parsedBody =
      typeof rawBody === "string" ? JSON.parse(rawBody) : rawBody;

    const items = parsedBody?.items;

    if (!Array.isArray(items) || items.length === 0) {
      return res
        .status(400)
        .json({ error: "No items were sent in the request." });
    }

    const line_items = items.map((item) => ({
      price_data: {
        currency: "dkk",
        product_data: { name: item.name },
        // Stripe expects amount in øre (cents)
        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.qty,
    }));

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items,
      success_url: `${req.headers.origin}/order-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.origin}/checkout`,
    });

    return res.status(200).json({ url: session.url });
  } catch (err) {
    console.error("Stripe checkout session error:", err);
    return res.status(500).json({ error: err.message || "Server error" });
  }
}
