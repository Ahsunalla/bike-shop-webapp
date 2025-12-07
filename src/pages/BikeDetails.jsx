import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../utils/supabaseClient";
import { useCart } from "../context/CartContext";

export default function BikeDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [bike, setBike] = useState(null);
  const [loading, setLoading] = useState(true);
  const [relatedBikes, setRelatedBikes] = useState([]);

  // Sticky bar visibility
  const [showStickyBar, setShowStickyBar] = useState(false);

  // Specs accordion
  const [specsOpen, setSpecsOpen] = useState(true);

  // Helper: format price as Danish number like the following: 12.999 kr
  const formatPrice = (value) => {
    if (value === null || value === undefined) return "";
    return new Intl.NumberFormat("da-DK").format(value) + " kr";
  };

  // Helper: render stock message with low-stock logic
  const renderStock = () => {
    if (bike.stock === null || bike.stock === undefined) return null;

    if (bike.stock <= 0) {
      return (
        <p className="mt-2 flex items-center text-red-600 font-medium">
          <span className="w-3 h-3 bg-red-500 rounded-full mr-2"></span>
          Out of stock
        </p>
      );
    }

    if (bike.stock <= 3) {
      return (
        <p className="mt-2 flex items-center text-yellow-600 font-medium">
          <span className="w-3 h-3 bg-yellow-400 rounded-full mr-2"></span>
          Low stock (only {bike.stock} left)
        </p>
      );
    }

    return (
      <p className="mt-2 flex items-center text-green-600 font-medium">
        <span className="w-3 h-3 bg-green-500 rounded-full mr-2"></span>
        In stock ({bike.stock})
      </p>
    );
  };

  // Show sticky bar after scrolling
  useEffect(() => {
    const handleScroll = () => {
      setShowStickyBar(window.scrollY > 250);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Load bike + related bikes
  useEffect(() => {
    const loadBike = async () => {
      const { data, error } = await supabase
        .from("bikes")
        .select("*")
        .eq("id", id)
        .single();

      if (!error && data) {
        setBike(data);

        const { data: related } = await supabase
          .from("bikes")
          .select("*")
          .eq("category", data.category)
          .neq("id", id)
          .limit(10);

        setRelatedBikes(related || []);
      }

      setLoading(false);
    };

    loadBike();
  }, [id]);

  if (loading) {
    return (
      <div className="text-center py-10 text-xl text-gray-600">
        Loading bike...
      </div>
    );
  }

  if (!bike) {
    return (
      <div className="text-center py-10 text-xl text-red-600">
        Bike not found.
      </div>
    );
  }

  const isOutOfStock = bike.stock !== null && bike.stock !== undefined && bike.stock <= 0;

  return (
    <>
      {/* Sticky Add to Cart Bar */}
      {showStickyBar && (
        <div className="fixed top-0 left-0 w-full bg-white shadow-md z-50 py-3 px-6 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-900 truncate max-w-[40%]">
            {bike.name}
          </h3>

          {/* PRICE (Black, formatted) */}
          <p className="text-xl font-bold text-black">
            {formatPrice(bike.price)}
          </p>

          <button
            onClick={() => addToCart(bike)}
            disabled={isOutOfStock}
            className={`px-6 py-2 rounded-lg transition active:scale-95 ${
              isOutOfStock
                ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-500"
            }`}
          >
            {isOutOfStock ? "Out of stock" : "Add to Cart"}
          </button>
        </div>
      )}

      {/* MAIN CONTENT */}
      <div className="max-w-6xl mx-auto px-6 py-10">

        {/* Breadcrumb */}
        <div className="text-sm text-gray-600 mb-4">
          <span
            onClick={() => navigate("/")}
            className="cursor-pointer hover:underline"
          >
            Home
          </span>{" "}
          /{" "}
          <span
            onClick={() => navigate("/bikes")}
            className="cursor-pointer hover:underline"
          >
            Bikes
          </span>{" "}
          / <span className="font-semibold">{bike.name}</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">

          {/* LEFT IMAGE with zoom on hover */}
          <div>
            <div className="bg-gray-100 rounded-lg shadow overflow-hidden">
              <img
                src={bike.image_url}
                alt={bike.name}
                className="w-full h-[420px] object-contain transition-transform duration-300 hover:scale-105"
              />
            </div>
          </div>

          {/* RIGHT DETAILS */}
          <div>
            <h1 className="text-4xl font-bold text-gray-900 leading-tight">
              {bike.name}
            </h1>

            {/* PRICE (Black, formatted) */}
            <p className="text-3xl font-semibold mt-4 text-black">
              {formatPrice(bike.price)}
            </p>

            {/* Stock section with low-stock logic */}
            {renderStock()}

            <p className="text-gray-700 mt-6 leading-relaxed">
              {bike.description}
            </p>

            {/* BUTTONS ABOVE SPECS */}
            <div className="flex gap-4 mt-8 mb-10">
              <button
                onClick={() => addToCart(bike)}
                disabled={isOutOfStock}
                className={`px-6 py-3 rounded-lg transition active:scale-95 ${
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

            {/* Specifications Accordion */}
            {bike.specs && (
              <div className="mt-4 bg-gray-100 rounded-lg">
                {/* Accordion header */}
                <button
                  onClick={() => setSpecsOpen((prev) => !prev)}
                  className="w-full flex justify-between items-center px-6 py-4"
                >
                  <span className="text-2xl font-semibold">
                    Specifications
                  </span>
                  <span className="text-2xl">
                    {specsOpen ? "−" : "+"}
                  </span>
                </button>

                {/* Accordion content */}
                {specsOpen && (
                  <div className="px-6 pb-6">
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-700">
                      {Object.entries(bike.specs).map(([k, v]) => (
                        <li
                          key={k}
                          className="flex items-start gap-2 p-3 bg-white rounded shadow-sm"
                        >
                          <span className="font-semibold capitalize">
                            {k}:
                          </span>
                          <span>{v}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* FULL-WIDTH RELATED SLIDER */}
        {relatedBikes.length > 0 && (
          <div className="mt-20 w-full">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">
                Other buyers also looked at
              </h2>

              <button
                onClick={() =>
                  document
                    .getElementById("wide-slider")
                    .scrollBy({ left: 350, behavior: "smooth" })
                }
                className="text-3xl px-4"
              >
                →
              </button>
            </div>

            <div
              id="wide-slider"
              className="overflow-x-auto flex gap-10 pb-4 scrollbar-hide"
            >
              {relatedBikes.map((item) => (
                <div
                  key={item.id}
                  onClick={() => navigate(`/bikes/${item.id}`)}
                  className="min-w-[200px] cursor-pointer"
                >
                  <img
                    src={item.image_url}
                    alt={item.name}
                    className="w-[200px] h-[200px] object-contain rounded-md"
                  />

                  <p className="mt-2 font-semibold text-sm">
                    {item.name}
                  </p>

                  {/* PRICE (Black, formatted) */}
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
