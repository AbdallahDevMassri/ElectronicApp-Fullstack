/* eslint-disable no-unused-vars */
import { useNavigate, useParams } from "react-router-dom";
import { useContext, useEffect } from "react";
import { useState } from "react";
import AppContext from "../Context/Context";
import UpdateProduct from "./UpdateProduct";
import { useAuth0 } from "@auth0/auth0-react";

const Product = () => {
  const { id } = useParams();
  const { data, addToCart, removeFromCart, cart, refreshData } =
    useContext(AppContext);
  const [product, setProduct] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const navigate = useNavigate();

  const { getAccessTokenSilently } = useAuth0();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const token = await getAccessTokenSilently();
        const response = await fetch(
          `http://localhost:8080/api/product/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!response.ok) throw new Error("Failed to fetch product");
        const result = await response.json();
        setProduct(result);

        if (result.imageName) {
          fetchImage(token);
        }
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };

    const fetchImage = async (token) => {
      try {
        const response = await fetch(
          `http://localhost:8080/api/product/${id}/image`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!response.ok) throw new Error("Failed to fetch image");
        const blob = await response.blob();
        setImageUrl(URL.createObjectURL(blob));
      } catch (error) {
        console.error("Error fetching image:", error);
      }
    };

    fetchProduct();
  }, [id, getAccessTokenSilently]);

  const deleteProduct = async () => {
    try {
      const token = await getAccessTokenSilently();
      const response = await fetch(`http://localhost:8080/api/product/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error("Failed to delete product");
      removeFromCart(id);
      alert("Product deleted successfully");

      setTimeout(() => {
        refreshData();
        navigate("/");
      }, 4000);
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  const handleEditClick = () => {
    navigate(`/product/update/${id}`);
  };

  const handlAddToCart = () => {
    addToCart(product);
    alert("Product added to cart");
  };
  if (!product) {
    return (
      <h2 className="text-center" style={{ padding: "10rem" }}>
        Loading...
      </h2>
    );
  }
  return (
    <>
      <div className="containers" style={{ display: "flex" }}>
        <img
          className="left-column-img"
          src={imageUrl}
          alt={product.imageName}
          style={{ width: "50%", height: "auto" }}
        />

        <div className="right-column" style={{ width: "50%" }}>
          <div className="product-description">
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ fontSize: "1.2rem", fontWeight: "lighter" }}>
                {product.category}
              </span>
            </div>

            <h1
              style={{
                fontSize: "2rem",
                marginBottom: "0.5rem",
                textTransform: "capitalize",
                letterSpacing: "1px",
              }}
            >
              {product.name}
            </h1>
            <i style={{ marginBottom: "3rem" }}>{product.brand}</i>
            <p
              style={{
                fontWeight: "bold",
                fontSize: "1rem",
                margin: "10px 0px 0px",
              }}
            >
              PRODUCT DESCRIPTION :
            </p>
            <p style={{ marginBottom: "1rem" }}>{product.description}</p>
          </div>

          <div className="product-price">
            <span style={{ fontSize: "2rem", fontWeight: "bold" }}>
              {"₪" + product.price}
            </span>
            <button
              className={`cart-btn ${
                !product.productAvailable ? "disabled-btn" : ""
              }`}
              onClick={handlAddToCart}
              disabled={!product.productAvailable}
              style={{
                padding: "1rem 2rem",
                fontSize: "1rem",
                backgroundColor: "#007bff",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
                marginBottom: "1rem",
              }}
            >
              {product.productAvailable ? "Add to cart" : "Out of Stock"}
            </button>
            <h6 style={{ marginBottom: "1rem" }}>
              Stock Available :{" "}
              <i style={{ color: "green", fontWeight: "bold" }}>
                {product.stockQuantity}
              </i>
            </h6>

            <p className="release-date" style={{ marginBottom: "2rem" }}>
              <span>
                <h6>
                  product listed on :{" "}
                  <i> {new Date(product.releaseDate).toLocaleDateString()}</i>
                </h6>
              </span>
            </p>
          </div>
          <div
            className="update-button"
            style={{ display: "flex", gap: "1rem" }}
          >
            <button
              className="btn btn-primary"
              type="button"
              onClick={handleEditClick}
              style={{
                padding: "1rem 2rem",
                fontSize: "1rem",
                backgroundColor: "#007bff",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              Update
            </button>

            <button
              className="btn btn-primary"
              type="button"
              onClick={deleteProduct}
              style={{
                padding: "1rem 2rem",
                fontSize: "1rem",
                backgroundColor: "#dc3545",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Product;
