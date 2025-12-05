import { useCart } from "../context/CartContext";

export default function BikeCard({ bike, onQuickView }) {
  const { addToCart } = useCart();

  const stockLow = bike.stock <= 3;
  const stockColor = stockLow ? "bg-red-500" : "bg-green-500";
  const stockLabel =
    bike.stock <= 0 ? "Out of stock" : stockLow ? "Low stock" : "In stock";

  const isOutOfStock = bike.stock <= 0;

  return (
    <div
      onClick={() => onQuickView && onQuickView(bike)}
      className="cursor-pointer bg-white rounded-xl shadow-md hover:shadow-xl transition p-6 flex flex-col items-center"
    >
      {/* Image with hover zoom */}
      <div className="w-full h-48 flex items-center justify-center mb-4 overflow-hidden">
        <img
          src={bike.image_url}
          alt={bike.name}
          className="w-full h-full object-contain transition-transform duration-300 hover:scale-105"
        />
      </div>

      {/* Title */}
      <h3 className="text-lg font-semibold text-center text-gray-900 mb-2 line-clamp-2">
        {bike.name}
      </h3>

      {/* Price (black, formatted) */}
      <p className="text-black font-semibold text-center text-lg mb-4">
        {new Intl.NumberFormat("da-DK").format(bike.price)} kr
      </p>

      {/* Add to Cart button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          if (!isOutOfStock) addToCart(bike);
        }}
        disabled={isOutOfStock}
        className={`border px-6 py-2 rounded-full transition ${
          isOutOfStock
            ? "border-gray-400 text-gray-500 cursor-not-allowed"
            : "border-black hover:bg-black hover:text-white"
        }`}
      >
        {isOutOfStock ? "Out of stock" : "Add To Cart"}
      </button>

      {/* Stock indicator */}
      <div className="flex items-center gap-2 mt-3">
        <span className={`w-3 h-3 rounded-full ${stockColor}`}></span>
        <span className="text-sm text-gray-700">
          {bike.stock > 0 ? `${stockLabel} (${bike.stock})` : "Out of stock"}
        </span>
      </div>

      {/* Quick view hint */}
      <p className="mt-2 text-xs text-gray-500">
        Click card for quick view
      </p>
    </div>
  );
}
