import { useEffect, useState } from "react";
import { supabase } from "../utils/supabaseClient";
import BikeCard from "../components/BikeCard";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";

export default function Bikes() {
  const [bikes, setBikes] = useState([]);
  const [loading, setLoading] = useState(true);

  const [categoryFilter, setCategoryFilter] = useState("Alle");
  const [sortOption, setSortOption] = useState("default");

  const [selectedBike, setSelectedBike] = useState(null);
  const [quickViewOpen, setQuickViewOpen] = useState(false);

  const { addToCart } = useCart();
  const navigate = useNavigate();

  // Load bikes from Supabase
  useEffect(() => {
    const loadBikes = async () => {
      const { data, error } = await supabase
        .from("bikes")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error && data) {
        setBikes(data);
      }

      setLoading(false);
    };

    loadBikes();
  }, []);

  // Unique categories for filters
  const categories = ["Alle", ...Array.from(new Set(bikes.map((b) => b.category)))];

  // Filtered + sorted bikes
  const processedBikes = bikes
    .filter((bike) =>
      categoryFilter === "Alle" ? true : bike.category === categoryFilter
    )
    .sort((a, b) => {
      if (sortOption === "price-asc") {
        return a.price - b.price;
      }
      if (sortOption === "price-desc") {
        return b.price - a.price;
      }
      if (sortOption === "newest") {
        return (
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
      }
      if (sortOption === "stock-desc") {
        return (b.stock || 0) - (a.stock || 0);
      }
      return 0;
    });

  const openQuickView = (bike) => {
    setSelectedBike(bike);
    setQuickViewOpen(true);
  };

  const closeQuickView = () => {
    setQuickViewOpen(false);
    setSelectedBike(null);
  };

  const formatPrice = (value) =>
    new Intl.NumberFormat("da-DK").format(value) + " kr";

  if (loading) {
    return (
      <div className="text-center py-10 text-xl text-gray-600">Loading bikes...</div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">

      {/* HERO SECTION */}
      <section className="text-center mb-10">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
          Vores Cykler
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Udforsk vores udvalg af kvalitetscykler til hverdagsbrug, motion og eventyr.
        </p>
      </section>

      {/* FILTERS + SORTING */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        {/* Category filters */}
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-4 py-2 rounded-full text-sm border transition ${
                categoryFilter === cat
                  ? "bg-black text-white border-black"
                  : "bg-white text-gray-800 border-gray-300 hover:bg-gray-100"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Sorting */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Sortér efter:</span>
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
          >
            <option value="default">Standard</option>
            <option value="price-asc">Pris: Lav → Høj</option>
            <option value="price-desc">Pris: Høj → Lav</option>
            <option value="newest">Nyeste</option>
            <option value="stock-desc">Lager: Høj → Lav</option>
          </select>
        </div>
      </div>

      {/* GRID OF BIKES */}
      {processedBikes.length === 0 ? (
        <p className="text-center text-gray-600">Ingen cykler fundet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {processedBikes.map((bike) => (
            <BikeCard key={bike.id} bike={bike} onQuickView={openQuickView} />
          ))}
        </div>
      )}

      {/* QUICK VIEW SIDE PANEL */}
      {quickViewOpen && selectedBike && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black bg-opacity-40 z-40"
            onClick={closeQuickView}
          />

          {/* Panel */}
          <div className="fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-50 flex flex-col">
            <div className="flex justify-between items-center px-6 py-4 border-b">
              <h2 className="text-lg font-semibold truncate">
                {selectedBike.name}
              </h2>
              <button
                onClick={closeQuickView}
                className="text-2xl leading-none"
              >
                ×
              </button>
            </div>

            <div className="p-6 flex-1 overflow-y-auto flex flex-col gap-4">
              {/* Image */}
              <div className="bg-gray-100 rounded-lg flex items-center justify-center h-56 overflow-hidden">
                <img
                  src={selectedBike.image_url}
                  alt={selectedBike.name}
                  className="w-full h-full object-contain"
                />
              </div>

              {/* Price */}
              <p className="text-2xl font-bold text-black">
                {formatPrice(selectedBike.price)}
              </p>

              {/* Stock */}
              {selectedBike.stock !== null && selectedBike.stock !== undefined && (
                <p className="text-sm text-gray-700">
                  Lager:{" "}
                  <span className="font-medium">
                    {selectedBike.stock > 0
                      ? `${selectedBike.stock} på lager`
                      : "Ikke på lager"}
                  </span>
                </p>
              )}

              {/* Description (short) */}
              <p className="text-gray-700 text-sm leading-relaxed">
                {selectedBike.description}
              </p>

              {/* Buttons */}
              <div className="flex flex-col gap-3 mt-4">
                <button
                  onClick={() => {
                    addToCart(selectedBike);
                  }}
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition"
                >
                  Add to Cart
                </button>

                <button
                  onClick={() => {
                    closeQuickView();
                    navigate(`/bikes/${selectedBike.id}`);
                  }}
                  className="w-full px-4 py-2 border border-gray-400 rounded-lg hover:bg-gray-100 transition"
                >
                  View full details
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
