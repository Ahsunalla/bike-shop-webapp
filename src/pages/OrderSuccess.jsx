import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

export default function OrderSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { clearCart } = useCart();

  const [order, setOrder] = useState(null);

  useEffect(() => {
    // Load the snapshot saved in Checkout.jsx
    const saved = localStorage.getItem("lastOrder");
    if (saved) {
      try {
        setOrder(JSON.parse(saved));
      } catch {
        setOrder(null);
      }
    }

    // Clear cart after successful order
    clearCart();
    localStorage.removeItem("cart");
    // optional: localStorage.removeItem("lastOrder");
  }, [clearCart]);

  const sessionId = searchParams.get("session_id");

  const formatPrice = (value) =>
    new Intl.NumberFormat("da-DK").format(value) + " kr";

  // If we somehow don't have order data
  if (!order) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-20 text-center">
        <h1 className="text-3xl font-bold mb-4">
          Thank you for your order!
        </h1>
        <p className="text-gray-600 mb-6">
          Your payment has been completed. We couldn't load the order details,
          but a confirmation has been sent if the payment succeeded.
        </p>
        <button
          onClick={() => navigate("/")}
          className="px-6 py-3 bg-black text-white rounded-full hover:bg-gray-800 transition"
        >
          Back to homepage
        </button>
      </div>
    );
  }

  const { items, customer, total, createdAt } = order;

  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      <h1 className="text-4xl font-bold mb-4 text-center">
        Thank you for your order!
      </h1>

      <p className="text-center text-gray-600 mb-8">
        Your payment has been processed. A confirmation will be sent to{" "}
        <span className="font-semibold">{customer.email}</span>.
      </p>

      {/* Customer + meta info */}
      <div className="bg-white shadow rounded-xl p-6 mb-8">
        <p>
          <span className="font-semibold">Name:</span> {customer.name}
        </p>
        <p>
          <span className="font-semibold">Address:</span>{" "}
          {customer.address}, {customer.postal} {customer.city}
        </p>
        <p>
          <span className="font-semibold">Phone:</span> {customer.phone}
        </p>
        {sessionId && (
          <p className="mt-2 text-sm text-gray-500">
            Payment reference (Stripe session id): {sessionId}
          </p>
        )}
        {createdAt && (
          <p className="mt-1 text-sm text-gray-500">
            Order time: {new Date(createdAt).toLocaleString("da-DK")}
          </p>
        )}
      </div>

      {/* Order items */}
      <h2 className="text-2xl font-semibold mb-3">Order summary</h2>
      <div className="bg-white shadow rounded-xl p-6 mb-6 space-y-3">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex justify-between border-b last:border-0 pb-2"
          >
            <div>
              <p className="font-medium">{item.name}</p>
              <p className="text-sm text-gray-600">Qty: {item.qty}</p>
            </div>
            <p className="font-semibold text-black">
              {formatPrice(item.price * item.qty)}
            </p>
          </div>
        ))}
      </div>

      <h3 className="text-xl font-bold mb-8">
        Total paid:{" "}
        <span className="text-black">{formatPrice(total)}</span>
      </h3>

      <div className="flex justify-center gap-4">
        <button
          onClick={() => navigate("/bikes")}
          className="px-6 py-3 border border-black rounded-full hover:bg-gray-100 transition"
        >
          Continue shopping
        </button>
        <button
          onClick={() => navigate("/")}
          className="px-6 py-3 bg-black text-white rounded-full hover:bg-gray-800 transition"
        >
          Back to homepage
        </button>
      </div>
    </div>
  );
}
