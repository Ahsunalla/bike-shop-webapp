import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";

export default function Cart() {
  const { cart, removeFromCart, updateQty } = useCart();
  const navigate = useNavigate();

  const formatPrice = (value) =>
    new Intl.NumberFormat("da-DK").format(value) + " kr";

  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  if (cart.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-20 text-center">
        <h1 className="text-3xl font-bold mb-4">Din kurv er tom</h1>
        <p className="text-gray-600 mb-6">
          Tilføj en cykel til din kurv for at komme i gang.
        </p>
        <button
          onClick={() => navigate("/bikes")}
          className="px-6 py-3 bg-black text-white rounded-full hover:bg-gray-800 transition"
        >
          Se cykler
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-16">
      <h1 className="text-4xl font-bold mb-10 text-center">Din Kurv</h1>

      {/* CART ITEMS */}
      <div className="space-y-8">
        {cart.map((item) => (
          <div
            key={item.id}
            className="flex flex-col sm:flex-row items-center sm:items-start gap-6 bg-white shadow p-5 rounded-xl"
          >
            {/* Image */}
            <img
              src={item.image_url}
              alt={item.name}
              className="w-40 h-32 object-contain rounded-lg bg-gray-100 p-2"
            />

            {/* Info */}
            <div className="flex-1 w-full">
              <h2 className="text-xl font-semibold">{item.name}</h2>
              <p className="text-black font-medium mt-1">
                {formatPrice(item.price)}
              </p>

              {/* Quantity */}
              <div className="flex items-center gap-4 mt-4">
                <button
                  onClick={() => updateQty(item.id, item.qty - 1)}
                  disabled={item.qty <= 1}
                  className={`px-3 py-1 rounded-lg border transition ${
                    item.qty <= 1
                      ? "border-gray-300 text-gray-400 cursor-not-allowed"
                      : "border-gray-400 hover:bg-gray-100"
                  }`}
                >
                  -
                </button>

                <span className="text-lg font-semibold">{item.qty}</span>

                <button
                  onClick={() => updateQty(item.id, item.qty + 1)}
                  className="px-3 py-1 rounded-lg border border-gray-400 hover:bg-gray-100 transition"
                >
                  +
                </button>
              </div>

              {/* Subtotal */}
              <p className="mt-3 text-gray-700 text-sm">
                Subtotal:{" "}
                <span className="font-semibold">
                  {formatPrice(item.price * item.qty)}
                </span>
              </p>
            </div>

            {/* Remove button */}
            <div className="flex-shrink-0">
              <button
                onClick={() => removeFromCart(item.id)}
                className="text-red-600 hover:text-red-800 font-semibold text-sm"
              >
                Fjern
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* SUMMARY BOX */}
      <div className="mt-12 p-6 bg-gray-100 rounded-xl shadow flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <h2 className="text-2xl font-bold">
          Total: <span className="text-black">{formatPrice(total)}</span>
        </h2>

        <div className="flex flex-wrap gap-4">
          <button
            onClick={() => navigate("/bikes")}
            className="px-6 py-3 border border-black rounded-full hover:bg-gray-200 transition"
          >
            Fortsæt med at handle
          </button>

          <button
            onClick={() => navigate("/checkout")}
            className="px-6 py-3 bg-black text-white rounded-full hover:bg-gray-800 transition"
          >
            Gå til betaling
          </button>
        </div>
      </div>
    </div>
  );
}
