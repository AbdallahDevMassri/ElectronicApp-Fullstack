import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useAuth0 } from "@auth0/auth0-react";

const UpdateProduct = () => {
  const { id } = useParams();
  const { getAccessTokenSilently } = useAuth0();

  const [product, setProduct] = useState({});
  const [image, setImage] = useState(null);
  const [updateProduct, setUpdateProduct] = useState({
    id: null,
    name: "",
    description: "",
    brand: "",
    price: "",
    category: "",
    releaseDate: "",
    productAvailable: false,
    stockQuantity: "",
  });

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const token = await getAccessTokenSilently();
        const response = await axios.get(
          `http://localhost:8080/api/product/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setProduct(response.data);
        setUpdateProduct(response.data);

        if (response.data.imageName) {
          const imageResp = await axios.get(
            `http://localhost:8080/api/product/${id}/image`,
            {
              responseType: "blob",
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          const file = new File([imageResp.data], response.data.imageName, {
            type: imageResp.data.type,
          });
          setImage(file);
        }
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };

    fetchProduct();
  }, [id, getAccessTokenSilently]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdateProduct((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = await getAccessTokenSilently();

      const formData = new FormData();
      if (image) {
        formData.append("imageFile", image);
      }
      formData.append(
        "product",
        new Blob([JSON.stringify(updateProduct)], {
          type: "application/json",
        })
      );

      await axios.put(`http://localhost:8080/api/product/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Product updated successfully!");
    } catch (error) {
      console.error("Error updating product:", error);
      alert("Failed to update product. Please try again.");
    }
  };

  return (
    <div className="update-product-container">
      <div className="center-container" style={{ marginTop: "7rem" }}>
        <h1>Update Product</h1>
        <form className="row g-3 pt-1" onSubmit={handleSubmit}>
          {/* Name */}
          <div className="col-md-6">
            <label className="form-label">
              <h6>Name</h6>
            </label>
            <input
              type="text"
              className="form-control"
              value={updateProduct.name}
              onChange={handleChange}
              name="name"
              required
            />
          </div>

          {/* Brand */}
          <div className="col-md-6">
            <label className="form-label">
              <h6>Brand</h6>
            </label>
            <input
              type="text"
              name="brand"
              className="form-control"
              value={updateProduct.brand}
              onChange={handleChange}
            />
          </div>

          {/* Description */}
          <div className="col-12">
            <label className="form-label">
              <h6>Description</h6>
            </label>
            <input
              type="text"
              className="form-control"
              name="description"
              value={updateProduct.description}
              onChange={handleChange}
            />
          </div>

          {/* Price */}
          <div className="col-5">
            <label className="form-label">
              <h6>Price</h6>
            </label>
            <input
              type="number"
              className="form-control"
              name="price"
              value={updateProduct.price}
              onChange={handleChange}
              required
            />
          </div>

          {/* Category */}
          <div className="col-md-6">
            <label className="form-label">
              <h6>Category</h6>
            </label>
            <select
              className="form-select"
              value={updateProduct.category}
              onChange={handleChange}
              name="category"
              required
            >
              <option value="">Select category</option>
              <option value="laptop">Laptop</option>
              <option value="headphone">Headphone</option>
              <option value="mobile">Mobile</option>
              <option value="electronics">Electronics</option>
              <option value="toys">Toys</option>
              <option value="fashion">Fashion</option>
            </select>
          </div>

          {/* Stock Quantity */}
          <div className="col-md-4">
            <label className="form-label">
              <h6>Stock Quantity</h6>
            </label>
            <input
              type="number"
              className="form-control"
              name="stockQuantity"
              value={updateProduct.stockQuantity}
              onChange={handleChange}
            />
          </div>

          {/* Image Upload */}
          <div className="col-md-8">
            <label className="form-label">
              <h6>Image</h6>
            </label>
            {image && (
              <img
                src={URL.createObjectURL(image)}
                alt="Current"
                style={{
                  width: "100%",
                  height: "180px",
                  objectFit: "cover",
                  marginBottom: "0.5rem",
                }}
              />
            )}
            <input
              className="form-control"
              type="file"
              onChange={handleImageChange}
              name="imageFile"
              accept="image/*"
            />
          </div>

          {/* Availability */}
          <div className="col-12">
            <div className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                name="productAvailable"
                checked={updateProduct.productAvailable}
                onChange={(e) =>
                  setUpdateProduct((prev) => ({
                    ...prev,
                    productAvailable: e.target.checked,
                  }))
                }
              />
              <label className="form-check-label">Product Available</label>
            </div>
          </div>

          {/* Submit */}
          <div className="col-12">
            <button type="submit" className="btn btn-primary">
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateProduct;
// This code is for a React component that allows users to update product details.
