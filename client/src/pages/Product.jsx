import { useEffect, useState } from "react";
import { Row, Col, Button, Dropdown, Card, Image } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import { useParams } from "react-router-dom";
import {
  getCategoryById,
  getProductById,
  getProductCategoryById,
  getProductImageById,
  getProducts,
  getProductSizeById,
  getProductSize,
  getProductImage,
} from "../apis/products.js";
import { addACart, addToCartItem, getCartById,getCartItemById} from "../apis/cart.js";
import useGlobalVars from "../UserContext.jsx";
import axios from "axios";
import { API_URL } from "../constant.js";

const ProductPage = () => {
  const { id } = useParams();
  const { user } = useGlobalVars();

  const [quantity, setQuantity] = useState(1);
  const [mainImage, setMainImage] = useState(undefined);
  const [selectedSize, setSelectedSize] = useState(null);

  const [product, setProduct] = useState(null);
  const [productSize, setProductSize] = useState([]);
  const [productImage, setProductImage] = useState([]);
  const [productCategory, setProductCategory] = useState(null);
  const [category, setCategory] = useState(null);

  const [similarProducts, setSimilarProducts] = useState([]);
  const [similarProductSize, setSimilarProductSize] = useState([]);
  const [similarProductImage, setSimilarProductImage] = useState([]);

  const [cart, setCart] = useState(null);

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

  useEffect(() => {
    if (!id) return;

    getProductById(id).then(setProduct).catch(console.error);

    getProductSizeById(id)
      .then((sizes) => {
        setProductSize(sizes);
        if (sizes.length > 0) setSelectedSize(sizes[0]);
      })
      .catch(console.error);

    getProductImageById(id).then(setProductImage).catch(console.error);
  }, [id]);

  useEffect(() => {
    if (!product?.ProductCategory_ID) return;

    getProductCategoryById(product.ProductCategory_ID)
      .then(setProductCategory)
      .catch(console.error);
  }, [product]);

  useEffect(() => {
    if (!productCategory?.Category_ID) return;

    getCategoryById(productCategory.Category_ID)
      .then(setCategory)
      .catch(console.error);
  }, [productCategory]);

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
      // Quantity update
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

          <Col md={7}>
            <h3>{product?.Product_Name || "Loading..."}</h3>
            <p>Category: {category?.Category_Name || "Loading..."}</p>
            <h4 className="text-primary">
              Rs {selectedSize?.Price || productSize[0]?.Price || "0.00"}
            </h4>

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
                      setQuantity(1); // reset on size change
                    }}
                  >
                    {size.Size} ({size.Stock} left)
                  </Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </Dropdown>

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

            <p>{product?.Product_Description || "No description available."}</p>

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
