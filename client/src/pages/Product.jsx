import { useEffect, useState } from "react";
import { Row, Col, Button, Dropdown, Card, Image } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import { useParams } from "react-router-dom";

// Import necessary product and cart API functions
import {
  getCategoryById,
  getProductById,
  getProductCategoryById,
  getProductImageById,
  getProductSizeById,
  getProducts,
  getProductSize,
  getProductImage,
} from "../apis/products.js";

import {
  addACart,
  addToCartItem,
  getCartById,
  getCartItemById,
} from "../apis/cart.js";

import useGlobalVars from "../UserContext.jsx";
import axios from "axios";
import { API_URL } from "../constant.js";

const ProductPage = () => {
  const { id } = useParams(); // Get product ID from route parameters
  const { user } = useGlobalVars(); // Get current logged-in user

  // State declarations
  const [quantity, setQuantity] = useState(1); // Quantity to order
  const [mainImage, setMainImage] = useState(undefined); // Selected image to show
  const [selectedSize, setSelectedSize] = useState(null); // Selected size variant

  const [product, setProduct] = useState(null); // Product details
  const [productSize, setProductSize] = useState([]); // Size variants
  const [productImage, setProductImage] = useState([]); // Images for product
  const [productCategory, setProductCategory] = useState(null); // Product category info
  const [category, setCategory] = useState(null); // Actual category (e.g., Normal, Pre Order)

  const [similarProducts, setSimilarProducts] = useState([]); // For future use: similar items
  const [similarProductSize, setSimilarProductSize] = useState([]);
  const [similarProductImage, setSimilarProductImage] = useState([]);

  const [cart, setCart] = useState(null); // User's active cart

  // Fetch or create cart for user
  useEffect(() => {
    if (!user?.User_ID) return;

    async function fetchOrCreateCart() {
      try {
        let carts = await getCartById(user.User_ID);
        if (!Array.isArray(carts)) carts = carts ? [carts] : [];

        let activeCart = carts.find((c) => c.IS_ACTIVE === 1);

        if (!activeCart) {
          await addACart({ User_ID: user.User_ID });
          const newCarts = await getCartById(user.User_ID);
          activeCart = Array.isArray(newCarts)
            ? newCarts.find((c) => c.IS_ACTIVE === 1)
            : newCarts;
        }

        setCart(activeCart || null);
      } catch (error) {
        console.error("Error fetching or creating cart:", error);
        setCart(null);
      }
    }

    fetchOrCreateCart();
  }, [user]);

  // Fetch main product details
  useEffect(() => {
    if (!id) return;

    getProductById(id).then(setProduct).catch(console.error);

    getProductSizeById(id)
      .then((sizes) => {
        setProductSize(sizes);
        if (sizes.length > 0) setSelectedSize(sizes[0]); // Auto-select first size
      })
      .catch(console.error);

    getProductImageById(id).then(setProductImage).catch(console.error);
  }, [id]);

  // Fetch product-category relationship
  useEffect(() => {
    if (!product?.ProductCategory_ID) return;

    getProductCategoryById(product.ProductCategory_ID)
      .then(setProductCategory)
      .catch(console.error);
  }, [product]);

  // Fetch actual category like "Normal", "Pre Order"
  useEffect(() => {
    if (!productCategory?.Category_ID) return;

    getCategoryById(productCategory.Category_ID)
      .then(setCategory)
      .catch(console.error);
  }, [productCategory]);

  // Handle increasing or decreasing quantity with stock check
  const handleQuantityChange = (action) => {
    setQuantity((q) => {
      if (action === "increase") {
        if (selectedSize && q < selectedSize.Stock) {
          return q + 1;
        } else {
          alert("Quantity exceeds available stock.");
          return q;
        }
      } else {
        return q > 1 ? q - 1 : q;
      }
    });
  };

  // Add selected product with size and quantity to cart
  const handleAddToCart = async () => {
    if (!user) {
      alert("Please log in to add items to the cart.");
      return;
    }
    if (!cart) {
      alert("Your cart is not ready yet. Please try again.");
      return;
    }
    if (!selectedSize) {
      alert("Please select a product size.");
      return;
    }

    try {
      const existingItems = await getCartItemById(cart.Cart_ID);

      const existingItem = existingItems.find(
        (item) =>
          item.Product_ID === product.Product_ID &&
          item.Size_ID === selectedSize.Size_ID
      );

      const currentInCart = existingItem ? existingItem.Quantity : 0;
      const totalRequested = currentInCart + quantity;

      if (totalRequested > selectedSize.Stock) {
        alert(
          `Only ${selectedSize.Stock} in stock. You already have ${currentInCart} in your cart.`
        );
        return;
      }

      if (existingItem) {
        // Update existing item quantity in cart
        const updatedItem = {
          Cart_ID: cart.Cart_ID,
          Product_ID: product.Product_ID,
          Size_ID: selectedSize.Size_ID,
          Quantity: totalRequested,
          Category_ID: category?.Category_ID,
        };

        await axios.put(
          `${API_URL}/cartItem/${existingItem.Cart_Item_ID}`,
          updatedItem
        );

        alert("Cart updated successfully!");
      } else {
        // Add new item to cart
        const newItem = {
          Cart_ID: cart.Cart_ID,
          Product_ID: product.Product_ID,
          Size_ID: selectedSize.Size_ID,
          Quantity: quantity,
          Category_ID: category?.Category_ID,
        };

        await addToCartItem(newItem);
        alert("Item added to cart!");
      }
    } catch (err) {
      console.error("Error adding/updating product in cart:", err);
      alert("Failed to update cart.");
    }
  };

  return (
    <>
      <Navbar />
      <div className="container mt-4">
        <Row>
          {/* Left: Image previews */}
          <Col md={5}>
            <Row>
              <Col xs={3} className="d-flex flex-column align-items-center">
                {productImage.map((img, idx) => (
                  <Image
                    key={idx}
                    src={img.Image_Link}
                    className="mb-2 cursor-pointer"
                    thumbnail
                    onClick={() => setMainImage(img.Image_Link)}
                    alt={`Thumbnail ${idx + 1}`}
                  />
                ))}
              </Col>
              <Col xs={9}>
                <Image
                  src={mainImage || productImage[0]?.Image_Link}
                  width="800"
                  height="820"
                  alt="Main product"
                  className="img-fluid"
                />
              </Col>
            </Row>
          </Col>

          {/* Right: Product Info */}
          <Col md={7}>
            <h3>{product?.Product_Name || "Loading..."}</h3>
            <p>Category: {category?.Category_Name || "Loading..."}</p>
            <h4 className="text-primary">
              Rs {selectedSize?.Price || productSize[0]?.Price || "0.00"}
            </h4>

            {/* Dropdown for selecting size */}
            <Dropdown className="mb-3">
              <Dropdown.Toggle variant="secondary">
                {selectedSize
                  ? `${selectedSize.Size} (${selectedSize.Stock} left)`
                  : "Choose size"}
              </Dropdown.Toggle>
              <Dropdown.Menu>
                {productSize.map((size, idx) => (
                  <Dropdown.Item
                    key={idx}
                    onClick={() => {
                      setSelectedSize(size);
                      setQuantity(1); // reset quantity on size change
                    }}
                  >
                    {size.Size} ({size.Stock} left)
                  </Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </Dropdown>

            {/* Quantity changer */}
            <div className="mb-3">
              <Button
                variant="outline-secondary"
                onClick={() => handleQuantityChange("decrease")}
              >
                -
              </Button>
              <span className="mx-2">{quantity}</span>
              <Button
                variant="outline-secondary"
                onClick={() => handleQuantityChange("increase")}
              >
                +
              </Button>
              <span className="ms-2 text-muted">
                (Max: {selectedSize?.Stock || 0})
              </span>
            </div>

            {/* Product description */}
            <p>{product?.Product_Description || "No description available."}</p>

            {/* Add to cart button (only if user & selection is valid) */}
            {user && cart && selectedSize && (
              <Button
                variant="primary"
                className="w-100"
                onClick={handleAddToCart}
              >
                Add to Cart
              </Button>
            )}
          </Col>
        </Row>

        {/* Related products section (not yet populated) */}
        <h5 className="mt-5 mb-4">Related Products</h5>
        <Row>
          {similarProducts.map((item) => {
            const size = similarProductSize.find(
              (s) => s.Product_ID === item.Product_ID
            );
            const image = similarProductImage.find(
              (img) => img.Product_ID === item.Product_ID
            )?.Image_Link;

            return (
              <Col sm={3} key={item.Product_ID}>
                <Card>
                  <Card.Img variant="top" src={image} width="250" height="280" />
                  <Card.Body>
                    <Card.Title>{item.Product_Name}</Card.Title>
                    <Card.Text>{size?.Size || "N/A"}</Card.Text>
                    <Card.Text>Rs: {size?.Price || "0.00"}</Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            );
          })}
        </Row>
      </div>
      <Footer />
    </>
  );
};

export default ProductPage;
