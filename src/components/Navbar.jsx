import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { ShoppingCartIcon } from "@heroicons/react/24/solid";

export default function Navbar() {
  const { cart } = useCart();
  const cartCount = cart.reduce((sum, item) => sum + item.qty, 0);

  return (
    <nav className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-4">

        {/* Logo */}
        <Link to="/" className="text-2xl font-bold">BikeShop</Link>

        <div className="flex items-center space-x-8 text-lg">
          <Link to="/" className="hover:text-gray-300">Home</Link>
          <Link to="/bikes" className="hover:text-gray-300">Bikes</Link>
          <Link to="/parts" className="hover:text-gray-300">Bike Parts</Link>
          <Link to="/about" className="hover:text-gray-300">About</Link>
          <Link to="/contact" className="hover:text-gray-300">Contact</Link>

          {/* Cart Icon */}
          <Link to="/cart" className="relative hover:text-gray-300">
            <ShoppingCartIcon className="h-7 w-7" />

            {cartCount > 0 && (
              <span className="absolute -top-2 -right-3 bg-red-600 text-white text-xs font-bold rounded-full px-1.5 py-0.5">
                {cartCount}
              </span>
            )}
          </Link>
        </div>

      </div>
    </nav>
  );
}
