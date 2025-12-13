import { renderHook, act } from "@testing-library/react";
import { CartProvider, useCart } from "../context/CartContext";





test("Can add items to cart", () => {
  const wrapper = ({ children }) => <CartProvider>{children}</CartProvider>;

  const { result } = renderHook(() => useCart(), { wrapper });

  act(() => {
    result.current.addToCart({ id: 1, name: "Bike", price: 1000 });
  });

  expect(result.current.cart.length).toBe(1);
  expect(result.current.cart[0].qty).toBe(1);
});










test("removes item from cart", () => {
  const wrapper = ({ children }) => <CartProvider>{children}</CartProvider>;
  const { result } = renderHook(() => useCart(), { wrapper });

  act(() => {
    result.current.addToCart({ id: 1, name: "Bike", price: 100 });
    result.current.removeFromCart(1);
  });

  expect(result.current.cart.length).toBe(0);
});

test("clearCart empties entire cart", () => {
  const wrapper = ({ children }) => <CartProvider>{children}</CartProvider>;
  const { result } = renderHook(() => useCart(), { wrapper });

  act(() => {
    result.current.addToCart({ id: 1, name: "Bike", price: 100 });
    result.current.addToCart({ id: 2, name: "Helmet", price: 50 });
    result.current.clearCart();
  });

  expect(result.current.cart.length).toBe(0);
});
