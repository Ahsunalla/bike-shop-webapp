import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { ShoppingCartIcon, MagnifyingGlassIcon } from "@heroicons/react/24/solid";
import { useState, useEffect } from "react";
import { supabase } from "../utils/supabaseClient";

export default function Navbar() {
  const { cart } = useCart();
  const cartCount = cart.reduce((sum, item) => sum + item.qty, 0);
  const navigate = useNavigate();

  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  // GLOBAL SEARCH (Bikes + Parts)
  useEffect(() => {
    const runSearch = async () => {
      if (query.trim() === "") {
        setResults([]);
        return;
      }

      // Search bikes
      const { data: bikes } = await supabase
        .from("bikes")
        .select("id, name, image_url, price")
        .ilike("name", `%${query}%`);

      // Search parts
      const { data: parts } = await supabase
        .from("parts")
        .select("id, name, image_url, price")
        .ilike("name", `%${query}%`);

      setResults([
        ...(bikes || []).map((b) => ({ ...b, type: "bike" })),
        ...(parts || []).map((p) => ({ ...p, type: "part" })),
      ]);

      setShowDropdown(true);
    };

    runSearch();
  }, [query]);

  // CLOSE DROPDOWN ON OUTSIDE CLICK + ESC KEY
  useEffect(() => {
    const handleClick = (e) => {
      if (!e.target.closest(".search-container")) {
        setShowDropdown(false);
      }
    };

    const handleEsc = (e) => {
      if (e.key === "Escape") {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleEsc);

    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleEsc);
    };
  }, []);

  // When clicking a result
  const handleSelect = (item) => {
    setQuery("");
    setShowDropdown(false);

    if (item.type === "bike") navigate(`/bikes/${item.id}`);
    else navigate(`/parts/${item.id}`);
  };

  return (
    <nav style={{ backgroundColor: "#FE3C4C" }} className="text-white">
      <div className="w-full flex justify-between items-center px-16 py-4 relative">

        {/* LOGO */}
        <Link to="/" className="text-2xl font-bold">MS Cykler</Link>

        {/* NAV LINKS */}
        <div className="flex items-center space-x-8 text-lg">
          <Link to="/" className="hover:text-gray-200">Home</Link>
          <Link to="/bikes" className="hover:text-gray-200">Bikes</Link>
          <Link to="/parts" className="hover:text-gray-200">Bike Parts</Link>
          <Link to="/about" className="hover:text-gray-200">About</Link>
          <Link to="/contact" className="hover:text-gray-200">Contact</Link>

          {/* SEARCH BAR */}
          <div className="relative search-container">
            <input
              type="text"
              value={query}
              onFocus={() => setShowDropdown(true)}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search..."
              className="pl-3 pr-10 py-1 rounded-full text-black focus:outline-none w-40"
            />

            {/* SEARCH ICON */}
            <MagnifyingGlassIcon
              className="h-5 w-5 text-gray-500 absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none"
            />

            {/* RESULTS DROPDOWN */}
            {showDropdown && results.length > 0 && (
              <div className="absolute right-0 mt-2 bg-white text-black shadow-lg rounded-lg w-64 max-h-80 overflow-y-auto z-50">
                {results.map((item) => (
                  <div
                    key={`${item.type}-${item.id}`}
                    onClick={() => handleSelect(item)}
                    className="flex items-center gap-3 p-3 hover:bg-gray-100 cursor-pointer"
                  >
                    <img
                      src={item.image_url}
                      className="w-12 h-12 object-contain rounded"
                      alt=""
                    />
                    <div>
                      <p className="font-semibold">{item.name}</p>
                      <p className="text-sm text-gray-600">
                        {item.type === "bike" ? "Bike" : "Part"} —{" "}
                        {new Intl.NumberFormat("da-DK").format(item.price)} kr
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* CART ICON */}
          <Link to="/cart" className="relative hover:text-gray-200">
            <ShoppingCartIcon className="h-7 w-7" />

            {cartCount > 0 && (
              <span className="absolute -top-2 -right-3 bg-black text-white text-xs font-bold rounded-full px-1.5 py-0.5">
                {cartCount}
              </span>
            )}
          </Link>

        </div>
      </div>
    </nav>
  );
}
