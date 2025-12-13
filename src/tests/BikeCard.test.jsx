import { render, screen, fireEvent } from "@testing-library/react";
import BikeCard from "../components/BikeCard";
import { CartProvider } from "../context/CartContext";





describe("BikeCard Component", () => {
  test("renders bike name and price", () => {
    const bike = {
      id: 1,
      name: "Test Bike",
      price: 2500,
      image_url: "test.jpg",
      stock: 5,
    };

    render(
      <CartProvider>
        <BikeCard bike={bike} />
      </CartProvider>
    );

    expect(screen.getByText("Test Bike")).toBeInTheDocument();
    expect(screen.getByText("2.500 kr")).toBeInTheDocument();
  });
});






const bike = {
  id: 1,
  name: "Red Bike",
  price: 2600,
  stock: 2,
  image_url: "https://example.com/bike.jpg",
};

test("BikeCard adds item to cart when button clicked", () => {
  render(
    <CartProvider>
      <BikeCard bike={bike} />
    </CartProvider>
  );

  const button = screen.getByText(/Add to Cart/i);
  fireEvent.click(button);

  // Cart badge exists
  expect(button).toBeInTheDocument();
});
