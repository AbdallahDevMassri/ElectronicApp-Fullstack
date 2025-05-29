import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { useState } from "react";
import Navbar1 from "../Components/Layout/Navbar";
import Footer from "../Components/Layout/Footer";
import { AppProvider } from "../Context/Context";
import Home from "../Pages/Home";
import AddProduct from "../Pages/AddProduct";
import Product from "../Pages/Product";
import Cart from "../Pages/Cart";
import "./App.css";
import UpdateProduct from "../Pages/UpdateProduct";

function App() {
  const { isAuthenticated } = useAuth0();
  const [cart, setCart] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    console.log("Selected category:", category);
  };
  const addToCart = (product) => {
    const existingProduct = cart.find((item) => item.id === product.id);
    if (existingProduct) {
      setCart(
        cart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };
  return (
    <AppProvider>
      <BrowserRouter>
        <Navbar1 onSelectCategory={handleCategorySelect} />
        <Routes>
          <Route
            path="/"
            element={
              isAuthenticated ? (
                <Home />
              ) : (
                <p>You need to log in to fetch messages.</p>
              )
            }
          />

          <Route
            path="/home"
            element={
              <Home addToCart={addToCart} selectedCategory={selectedCategory} />
            }
          />
          <Route path="/add_product" element={<AddProduct />} />
          <Route path="/product" element={<Product />} />
          <Route path="/product/:id" element={<Product />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/product/update/:id" element={<UpdateProduct />} />
        </Routes>

        {/* <Footer /> */}
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;
