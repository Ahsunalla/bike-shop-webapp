// src/pages/Checkout.jsx
import { useCart } from "../context/CartContext";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Checkout() {
  const { cart, clearCart } = useCart();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    postal: "",
    city: "",
  });

  const [errors, setErrors] = useState({});

  const formatPrice = (value) =>
    new Intl.NumberFormat("da-DK").format(value) + " kr";

  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  const validate = () => {
    const newErrors = {};
    const fields = ["name", "email", "phone", "address", "postal", "city"];

    fields.forEach((f) => {
      if (!form[f].trim()) newErrors[f] = "Påkrævet";
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePayment = async () => {
    if (!validate()) return;

    try {
      const res = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: cart }),
      });

      const data = await res.json();

      if (!res.ok) {
        console.error("Payment API error:", data);
        alert(data.error || "Payment error. Try again.");
        return;
      }

      if (data.url) {
        // Optionally clear the cart only after successful redirect
        // clearCart();
        window.location.href = data.url;
      } else {
        console.error("Payment API returned no URL:", data);
        alert("Payment error. No redirect URL returned.");
      }
    } catch (err) {
      console.error("Network error calling payment API:", err);
      alert("Network error. Try again.");
    }
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-20 text-center">
        <h1 className="text-3xl font-bold mb-4">Din kurv er tom</h1>
        <p className="text-gray-600 mb-6">
          Tilføj en cykel for at fortsætte til checkout.
        </p>
        <button
          onClick={() => navigate("/bikes")}
          className="px-6 py-3 bg-black text-white rounded-full hover:bg-gray-900 transition"
        >
          Se cykler
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-16">
      <h1 className="text-4xl font-bold mb-10 text-center">Checkout</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* CUSTOMER FORM */}
        <div>
          <h2 className="text-2xl font-semibold mb-4">Dine oplysninger</h2>

          <div className="space-y-4">
            {["name", "email", "phone", "address", "postal", "city"].map(
              (field) => (
                <div key={field}>
                  <input
                    type="text"
                    placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                    value={form[field]}
                    onChange={(e) =>
                      setForm({ ...form, [field]: e.target.value })
                    }
                    className={`w-full px-4 py-3 border rounded-lg ${
                      errors[field] ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {errors[field] && (
                    <p className="text-red-600 text-sm mt-1">
                      {errors[field]}
                    </p>
                  )}
                </div>
              )
            )}
          </div>
        </div>

        {/* ORDER SUMMARY */}
        <div>
          <h2 className="text-2xl font-semibold mb-4">Ordreoversigt</h2>

          <div className="space-y-4">
            {cart.map((item) => (
              <div key={item.id} className="flex justify-between border-b pb-3">
                <div>
                  <p className="font-semibold">{item.name}</p>
                  <p className="text-gray-600 text-sm">Antal: {item.qty}</p>
                </div>

                <p className="text-black font-semibold">
                  {formatPrice(item.price * item.qty)}
                </p>
              </div>
            ))}
          </div>

          <h3 className="text-xl font-bold mt-6">
            Total: <span className="text-black">{formatPrice(total)}</span>
          </h3>

          <button
            onClick={handlePayment}
            className="mt-8 w-full py-3 bg-black text-white 
            rounded-full hover:bg-gray-900 transition"
          >
            Betal nu
          </button>
        </div>
      </div>
    </div>
  );
}
