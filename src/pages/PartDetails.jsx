import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../utils/supabaseClient";
import { useCart } from "../context/CartContext";

export default function PartDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [part, setPart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [relatedParts, setRelatedParts] = useState([]);

  const [showStickyBar, setShowStickyBar] = useState(false);

  const formatPrice = (value) =>
    new Intl.NumberFormat("da-DK").format(value) + " kr";

  // Sticky bar show on scroll
  useEffect(() => {
    const handleScroll = () => setShowStickyBar(window.scrollY > 250);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const loadPart = async () => {
      const { data, error } = await supabase
        .from("parts")
        .select("*")
        .eq("id", id)
        .single();

      if (!error && data) {
        setPart(data);

        const { data: related } = await supabase
          .from("parts")
          .select("*")
          .eq("category", data.category)
          .neq("id", id)
          .limit(10);

        setRelatedParts(related || []);
      }

      setLoading(false);
    };

    loadPart();
  }, [id]);

  if (loading) return <div className="text-center py-10">Loading…</div>;
  if (!part) return <div className="text-center py-10 text-red-600">Part not found.</div>;

  const isOutOfStock = part.stock <= 0;

  // Stock label
  const renderStock = () => {
    if (part.stock <= 0)
      return (
        <p className="mt-2 flex items-center text-red-600 font-medium">
          <span className="w-3 h-3 bg-red-500 rounded-full mr-2" />
          Out of stock
        </p>
      );

    if (part.stock <= 3)
      return (
        <p className="mt-2 flex items-center text-yellow-600 font-medium">
          <span className="w-3 h-3 bg-yellow-400 rounded-full mr-2" />
          Low stock ({part.stock})
        </p>
      );

    return (
      <p className="mt-2 flex items-center text-green-600 font-medium">
        <span className="w-3 h-3 bg-green-500 rounded-full mr-2" />
        In stock ({part.stock})
      </p>
    );
  };

  return (
    <>
      {/* Sticky Add to Cart Bar */}
      {showStickyBar && (
        <div className="fixed top-0 left-0 w-full bg-white shadow z-50 py-3 px-6 flex justify-between items-center">
          <h3 className="text-lg font-semibold truncate max-w-[40%]">{part.name}</h3>

          <p className="text-xl font-bold text-black">{formatPrice(part.price)}</p>

          <button
            onClick={() => addToCart(part)}
            disabled={isOutOfStock}
            className={`px-6 py-2 rounded-lg transition ${
              isOutOfStock
                ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-500"
            }`}
          >
            {isOutOfStock ? "Out of stock" : "Add to Cart"}
          </button>
        </div>
      )}

      {/* Main content */}
      <div className="max-w-6xl mx-auto px-6 py-10">
        {/* Breadcrumb */}
        <div className="text-sm text-gray-600 mb-4">
          <span onClick={() => navigate("/")} className="cursor-pointer hover:underline">
            Home
          </span>{" "}
          /{" "}
          <span onClick={() => navigate("/parts")} className="cursor-pointer hover:underline">
            Parts
          </span>{" "}
          / <span className="font-semibold">{part.name}</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* LEFT Image */}
          <div>
            <div className="rounded-lg shadow overflow-hidden">
              <img
                src={part.image_url}
                alt={part.name}
                className="w-full h-[420px] object-contain hover:scale-105 transition"
              />
            </div>
          </div>

          {/* RIGHT Details */}
          <div>
            <h1 className="text-4xl font-bold text-gray-900 leading-tight">{part.name}</h1>

            <p className="text-3xl font-semibold mt-4 text-black">
              {formatPrice(part.price)}
            </p>

            {renderStock()}

            <p className="text-gray-700 mt-6 leading-relaxed">{part.description}</p>

            <div className="flex gap-4 mt-8 mb-10">
              <button
                onClick={() => addToCart(part)}
                disabled={isOutOfStock}
                className={`px-6 py-3 rounded-lg transition ${
                  isOutOfStock
                    ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                    : "bg-blue-600 text-white hover:bg-blue-500"
                }`}
              >
                {isOutOfStock ? "Out of stock" : "Add to Cart"}
              </button>

              <button
                onClick={() => navigate(-1)}
                className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-700 transition"
              >
                ← Back
              </button>
            </div>
          </div>
        </div>

        {/* Related parts */}
        {relatedParts.length > 0 && (
          <div className="mt-20">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Other buyers also looked at</h2>

              <button
                onClick={() =>
                  document.getElementById("parts-slider").scrollBy({ left: 350, behavior: "smooth" })
                }
                className="text-3xl px-4"
              >
                →
              </button>
            </div>

            <div
              id="parts-slider"
              className="overflow-x-auto flex gap-10 pb-4 scrollbar-hide"
            >
              {relatedParts.map((item) => (
                <div
                  key={item.id}
                  onClick={() => navigate(`/parts/${item.id}`)}
                  className="min-w-[200px] cursor-pointer"
                >
                  <img
                    src={item.image_url}
                    alt={item.name}
                    className="w-[200px] h-[200px] object-contain rounded-md"
                  />

                  <p className="mt-2 font-semibold text-sm">{item.name}</p>
                  <p className="text-black text-sm font-bold">
                    {formatPrice(item.price)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
