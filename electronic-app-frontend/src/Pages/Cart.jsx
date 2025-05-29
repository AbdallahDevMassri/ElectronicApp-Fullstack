import React, { useContext, useState, useEffect } from "react";
import AppContext from "../Context/Context";
import CheckoutPopup from "../Components/Ui/CheckoutPopup";
import { Button } from "react-bootstrap";

const Cart = () => {
  const { cart, removeFromCart, clearCart } = useContext(AppContext);
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [cartImage, setCartImage] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchImagesAndUpdateCart = async () => {
      try {
        const res = await fetch("http://localhost:8080/api/products");
        if (!res.ok) throw new Error("Failed to fetch products");
        const backendProducts = await res.json();
        const backendProductIds = backendProducts.map((product) => product.id);

        const updatedCartItems = cart.filter((item) =>
          backendProductIds.includes(item.id)
        );

        const cartItemsWithImages = await Promise.all(
          updatedCartItems.map(async (item) => {
            try {
              const imageRes = await fetch(
                `http://localhost:8080/api/product/${item.id}/image`
              );
              if (!imageRes.ok) throw new Error("Failed to fetch image");
              const imageBlob = await imageRes.blob();
              const imageUrl = URL.createObjectURL(imageBlob);
              setCartImage(imageBlob); // Keep the last image blob (you might want to manage this differently)
              return { ...item, imageUrl };
            } catch (error) {
              console.error("Error fetching image:", error);
              return { ...item, imageUrl: "placeholder-image-url" };
            }
          })
        );

        setCartItems(cartItemsWithImages);
      } catch (error) {
        console.error("Error fetching product data:", error);
      }
    };

    if (cart.length) {
      fetchImagesAndUpdateCart();
    }
  }, [cart]);

  useEffect(() => {
    const total = cartItems.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );
    setTotalPrice(total);
  }, [cartItems]);

  const handleIncreaseQuantity = (itemId) => {
    setCartItems((prevItems) =>
      prevItems.map((item) => {
        if (item.id === itemId) {
          if (item.quantity < item.stockQuantity) {
            return { ...item, quantity: item.quantity + 1 };
          } else {
            alert("Cannot add more than available stock");
          }
        }
        return item;
      })
    );
  };

  const handleDecreaseQuantity = (itemId) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === itemId
          ? { ...item, quantity: Math.max(item.quantity - 1, 1) }
          : item
      )
    );
  };

  const handleRemoveFromCart = (itemId) => {
    removeFromCart(itemId);
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== itemId));
  };

  const handleCheckout = async () => {
    try {
      for (const item of cartItems) {
        const { imageUrl, imageName, imageData, imageType, quantity, ...rest } =
          item;

        const updatedStockQuantity = item.stockQuantity - item.quantity;
        const updatedProductData = {
          ...rest,
          stockQuantity: updatedStockQuantity,
        };

        const cartProduct = new FormData();
        if (cartImage) {
          cartProduct.append("imageFile", cartImage);
        }
        cartProduct.append(
          "product",
          new Blob([JSON.stringify(updatedProductData)], {
            type: "application/json",
          })
        );

        const response = await fetch(
          `http://localhost:8080/api/product/${item.id}`,
          {
            method: "PUT",
            body: cartProduct,
          }
        );

        if (!response.ok) {
          throw new Error("Failed to update product");
        }
      }
      clearCart();
      setCartItems([]);
      setShowModal(false);
    } catch (error) {
      console.error("Error during checkout", error);
    }
  };

  return (
    <div className="cart-container">
      <div className="shopping-cart">
        <div className="title">Shopping Bag</div>
        {cartItems.length === 0 ? (
          <div className="empty" style={{ textAlign: "left", padding: "2rem" }}>
            <h4>Your cart is empty</h4>
          </div>
        ) : (
          <>
            {cartItems.map((item) => (
              <li key={item.id} className="cart-item">
                <div
                  className="item"
                  style={{ display: "flex", alignContent: "center" }}
                  key={item.id}
                >
                  <div>
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="cart-item-image"
                    />
                  </div>
                  <div className="description">
                    <span>{item.brand}</span>
                    <span>{item.name}</span>
                  </div>

                  <div className="quantity">
                    <button
                      className="plus-btn"
                      type="button"
                      onClick={() => handleIncreaseQuantity(item.id)}
                    >
                      <i className="bi bi-plus-square-fill"></i>
                    </button>
                    <input
                      type="button"
                      name="name"
                      value={item.quantity}
                      readOnly
                    />
                    <button
                      className="minus-btn"
                      type="button"
                      onClick={() => handleDecreaseQuantity(item.id)}
                    >
                      <i className="bi bi-dash-square-fill"></i>
                    </button>
                  </div>

                  <div className="total-price " style={{ textAlign: "center" }}>
                    ${item.price * item.quantity}
                  </div>
                  <button
                    className="remove-btn"
                    onClick={() => handleRemoveFromCart(item.id)}
                  >
                    <i className="bi bi-trash3-fill"></i>
                  </button>
                </div>
              </li>
            ))}
            <div className="total">Total: ${totalPrice}</div>
            <Button
              className="btn btn-primary"
              style={{ width: "100%" }}
              onClick={() => setShowModal(true)}
            >
              Checkout
            </Button>
          </>
        )}
      </div>
      <CheckoutPopup
        show={showModal}
        handleClose={() => setShowModal(false)}
        cartItems={cartItems}
        totalPrice={totalPrice}
        handleCheckout={handleCheckout}
      />
    </div>
  );
};

export default Cart;
