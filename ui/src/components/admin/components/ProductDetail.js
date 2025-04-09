import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const ProductDetails = () => {
  const { id } = useParams(); // Get the product ID from the URL
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`http://localhost:8000/shop/api/products/${id}/`) // Fetch product details using ID
      .then((response) => {
        setProduct(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching product details:", error);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return <h2 className="text-center my-5">Loading...</h2>;
  }

  if (!product) {
    return <h2 className="text-center my-5">Product not found</h2>;
  }

  return (
    <div className="container my-5">
      <div className="row">
        {/* Product Image */}
        <div className="col-md-6">
          <img
            src={product.image}
            alt={product.name}
            className="img-fluid rounded shadow"
            style={{ maxWidth: "100%", height: "auto" }}
          />
        </div>

        {/* Product Details */}
        <div className="col-md-6">
          <h1 className="mb-4">{product.name}</h1>
          <p className="text-muted">{product.description}</p>
          <p>
            <strong>Price:</strong>{" "}
            <span className="text-success fs-4">${product.price}</span>
          </p>
          <p>
            <strong>Quantity:</strong>{" "}
            <span className="text-primary">{product.quantity}</span>
          </p>

          {/* Action Buttons */}
          <div className="d-flex gap-3 mt-4">
            <button className="btn btn-primary btn-lg">Add to Cart</button>
            <button className="btn btn-outline-secondary btn-lg">Go Back</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
