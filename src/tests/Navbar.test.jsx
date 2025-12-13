import { render, screen, fireEvent } from "@testing-library/react";
import Navbar from "../components/Navbar";
import { CartProvider } from "../context/CartContext";
import { BrowserRouter } from "react-router-dom";

// Mock Supabase search response
vi.mock("../utils/supabaseClient", () => ({
  supabase: {
    from: () => ({
      select: () => ({
        ilike: () =>
          Promise.resolve({
            data: [
              { id: 1, name: "Red Bike", image_url: "bike.jpg", price: 2600, type: "bike" },
              { id: 2, name: "Helmet", image_url: "helmet.jpg", price: 200, type: "part" },
              { id: 3, name: "Red Bike", image_url: "bike2.jpg", price: 2600, type: "part" },
            ],
          }),
      }),
    }),
  },
}));





describe("Navbar Search", () => {
  test("Search bar shows results for bikes + parts", async () => {
    render(
      <BrowserRouter>
        <CartProvider>
          <Navbar />
        </CartProvider>
      </BrowserRouter>
    );

    const input = screen.getByPlaceholderText("Search...");

    // simulate typing
    fireEvent.change(input, { target: { value: "e" } });

    // Check "Red Bike" appears (twice is fine)
    const bikeResults = await screen.findAllByText("Red Bike");
    expect(bikeResults.length).toBeGreaterThan(0);

    // Check "Helmet" appears (twice is fine)
    const partResults = await screen.findAllByText("Helmet");
    expect(partResults.length).toBeGreaterThan(0);
  });
});








test("closes search results when clicking outside", async () => {
  render(
    <BrowserRouter>
      <CartProvider>
        <Navbar bikes={[]} parts={[]} />
      </CartProvider>
    </BrowserRouter>
  );

  const input = screen.getByPlaceholderText("Search...");
  fireEvent.change(input, { target: { value: "e" } });

  // Click outside
  fireEvent.click(document.body);

  expect(screen.queryByText("Bike")).not.toBeInTheDocument();
});











