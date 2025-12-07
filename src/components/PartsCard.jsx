import { useCart } from "../context/CartContext";

export default function PartsCard({ part, onQuickView }) {
  const { addToCart } = useCart();

  const stockLow = part.stock <= 3;
  const isOutOfStock = part.stock <= 0;

  const stockColor =
    part.stock <= 0
      ? "bg-red-500"
      : stockLow
      ? "bg-yellow-400"
      : "bg-green-500";

  const stockLabel =
    part.stock <= 0
      ? "Out of stock"
      : stockLow
      ? `Low stock (${part.stock})`
      : `In stock (${part.stock})`;

  return (
    <div
      onClick={() => onQuickView && onQuickView(part)}
      className="cursor-pointer bg-white rounded-xl shadow-md hover:shadow-xl transition p-6 flex flex-col items-center"
    >
      {/* Image */}
      <div className="w-full h-48 flex items-center justify-center mb-4 overflow-hidden">
        <img
          src={part.image_url}
          alt={part.name}
          className="w-full h-full object-contain transition-transform duration-300 hover:scale-105"
        />
      </div>

      {/* Name */}
      <h3 className="text-lg font-semibold text-center text-gray-900 mb-2 line-clamp-2">
        {part.name}
      </h3>

      {/* Price */}
      <p className="text-black font-semibold text-center text-lg mb-4">
        {new Intl.NumberFormat("da-DK").format(part.price)} kr
      </p>

      {/* Add to cart button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          if (!isOutOfStock) addToCart(part);
        }}
        disabled={isOutOfStock}
        className={`border px-6 py-2 rounded-full transition ${
          isOutOfStock
            ? "border-gray-400 text-gray-500 cursor-not-allowed"
            : "border-black hover:bg-black hover:text-white"
        }`}
      >
        {isOutOfStock ? "Out of stock" : "Add to Cart"}
      </button>

      {/* Stock indicator */}
      <div className="flex items-center gap-2 mt-3">
        <span className={`w-3 h-3 rounded-full ${stockColor}`}></span>
        <span className="text-sm text-gray-700">{stockLabel}</span>
      </div>

      <p className="mt-2 text-xs text-gray-500">Click card for quick view</p>
    </div>
  );
}
