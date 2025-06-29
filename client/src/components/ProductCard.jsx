import React from "react";

const styles = {
  card: {
    width: "100%",
    height: "350px",
    display: "flex",
    flexDirection: "column",
    border: "1px solid #ddd",
    borderRadius: "6px",
    overflow: "hidden",
    boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
    backgroundColor: "white",
  },
  image: {
    height: "200px",
    width: "100%",
    objectFit: "cover",
  },
  body: {
    padding: "12px",
    display: "flex",
    flexDirection: "column",
    flexGrow: 1,
  },
  title: {
    fontSize: "1.1rem",
    marginBottom: "6px",
    fontWeight: 600,
    flexShrink: 0,
  },
  price: {
    marginTop: "auto",
    fontWeight: "bold",
    fontSize: "1rem",
    color: "#007bff", // bootstrap primary color
  },
};

const ProductCard = ({ product, price, image }) => (
  <div style={styles.card}>
    <img src={image} alt={product.Product_Name} style={styles.image} />
    <div style={styles.body}>
      <h5 style={styles.title}>{product.Product_Name}</h5>
      <p style={styles.price}>Price: {price}</p>
    </div>
  </div>
);

export default ProductCard;
