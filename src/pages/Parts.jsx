import { useEffect, useState } from "react";
import { supabase } from "../utils/supabaseClient";
import PartsCard from "../components/PartsCard";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";

export default function Parts() {
  const [parts, setParts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [categoryFilter, setCategoryFilter] = useState("Alle");
  const [sortOption, setSortOption] = useState("default");

  const [selectedPart, setSelectedPart] = useState(null);
  const [quickViewOpen, setQuickViewOpen] = useState(false);

  const { addToCart } = useCart();
  const navigate = useNavigate();

  // Load parts from Supabase
  useEffect(() => {
    const loadParts = async () => {
      const { data, error } = await supabase
        .from("parts")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error && data) {
        setParts(data);
      }

      setLoading(false);
    };

    loadParts();
  }, []);

  const categories = ["Alle", ...Array.from(new Set(parts.map((p) => p.category)))];

  // Filter + sort
  const processedParts = parts
    .filter((p) => (categoryFilter === "Alle" ? true : p.category === categoryFilter))
    .sort((a, b) => {
      if (sortOption === "price-asc") return a.price - b.price;
      if (sortOption === "price-desc") return b.price - a.price;
      if (sortOption === "newest")
        return new Date(b.created_at) - new Date(a.created_at);
      return 0;
    });

  const openQuickView = (part) => {
    setSelectedPart(part);
    setQuickViewOpen(true);
  };

  const closeQuickView = () => {
    setQuickViewOpen(false);
    setSelectedPart(null);
  };

  const formatPrice = (v) => new Intl.NumberFormat("da-DK").format(v) + " kr";

  if (loading) return <div className="text-center py-10 text-xl">Loading parts...</div>;

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">

      {/* Title */}
      <section className="text-center mb-10">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
          Bike Parts
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          All the components you need to upgrade, maintain or customize your bike.
        </p>
      </section>

      {/* Filters + sorting */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
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

        <select
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
        >
          <option value="default">Standard</option>
          <option value="price-asc">Pris: Lav → Høj</option>
          <option value="price-desc">Pris: Høj → Lav</option>
          <option value="newest">Nyeste</option>
        </select>
      </div>

      {/* Parts grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {processedParts.map((part) => (
          <PartsCard key={part.id} part={part} onQuickView={openQuickView} />
        ))}
      </div>

      {/* QUICK VIEW PANEL */}
      {quickViewOpen && selectedPart && (
        <>
          <div className="fixed inset-0 bg-black bg-opacity-40 z-40" onClick={closeQuickView} />

          <div className="fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-50 flex flex-col">
            <div className="flex justify-between items-center px-6 py-4 border-b">
              <h2 className="text-lg font-semibold truncate">{selectedPart.name}</h2>
              <button onClick={closeQuickView} className="text-2xl leading-none">×</button>
            </div>

            <div className="p-6 flex-1 overflow-y-auto flex flex-col gap-4">
              <div className="rounded-lg flex items-center justify-center h-56 overflow-hidden">
                <img src={selectedPart.image_url} className="w-full h-full object-contain" />
              </div>

              <p className="text-2xl font-bold text-black">{formatPrice(selectedPart.price)}</p>

              <p className="text-gray-700 text-sm leading-relaxed">{selectedPart.description}</p>

              <div className="flex flex-col gap-3 mt-4">
                <button
                  onClick={() => addToCart(selectedPart)}
                  className="w-full px-4 py-3 rounded-full bg-blue-600 text-white hover:bg-blue-500 transition"
                >
                  Add to Cart
                </button>

                <button
                  className="w-full border border-black py-3 rounded-full hover:bg-black hover:text-white transition"
                  onClick={() => {
                    closeQuickView();
                    navigate(`/parts/${selectedPart.id}`);
                  }}
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
