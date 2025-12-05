import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function OrderSuccess() {
  const navigate = useNavigate();
  const query = new URLSearchParams(useLocation().search);
  const sessionId = query.get("session_id");

  return (
    <div className="max-w-3xl mx-auto px-6 py-20 text-center">
      <h1 className="text-4xl font-bold mb-6">Betaling gennemført!</h1>

      <p className="text-lg text-gray-700 mb-6">
        Tak for din ordre. Vi har sendt dig en e-mail med bekræftelse.
      </p>

      <p className="text-xl text-gray-900 font-semibold mb-8">
        Stripe Session ID:<br />
        <span className="text-black">{sessionId}</span>
      </p>

      <button
        onClick={() => navigate("/")}
        className="px-6 py-3 bg-black text-white rounded-full hover:bg-gray-900 transition"
      >
        Tilbage til forsiden
      </button>
    </div>
  );
}
