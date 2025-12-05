import { createBrowserRouter } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import BikeDetails from "./pages/BikeDetails";
import Home from "./pages/Home";
import Bikes from "./pages/Bikes";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Parts from "./pages/Parts";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import OrderSuccess from "./pages/OrderSuccess";


const router = createBrowserRouter([
  {
    element: <MainLayout />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/bikes", element: <Bikes /> },
      { path: "/bikes/:id", element: <BikeDetails />},
      { path: "/about", element: <About /> },
      { path: "/contact", element: <Contact /> },
      { path: "/parts", element: <Parts /> },
      { path: "/cart", element: <Cart /> },
      { path: "/checkout", element: <Checkout /> },
      { path: "/order-success", element: <OrderSuccess /> }
    ],
  },
]);

export default router;




