/* eslint-disable react/prop-types */

const styles = {
    // Overall card container style
  card: {
    width: "100%",    // Full width of parent
    height: "350px",  // Fixed height
    display: "flex", // Use flexbox layout
    flexDirection: "column", // Stack children vertically
    border: "1px solid #ddd",  // Light gray border
    borderRadius: "6px", // Slightly rounded corners
    overflow: "hidden",  // Clip overflowing child content
    boxShadow: "0 2px 6px rgba(0,0,0,0.1)", // Subtle shadow
    backgroundColor: "white",
  },
  image: {
    height: "200px",
    width: "100%",
    objectFit: "cover", // Crop and scale image to fill container
  },
  body: {
    padding: "12px", // Inner spacing
    display: "flex",
    flexDirection: "column",
    flexGrow: 1, // Allow it to grow to fill space
  },
  title: {
    fontSize: "1.1rem",
    marginBottom: "6px",
    fontWeight: 600,
    flexShrink: 0,  // Prevent shrinking when container is tight
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
