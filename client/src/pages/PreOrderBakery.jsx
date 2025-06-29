import { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import {
  getCategory,
  getProductCategory,
  getProductImage,
  getProducts,
  getProductSize,
} from "../apis/products.js";
import { addACart, addToCartItem, getCartById } from "../apis/cart.js";
import useGlobalVars from "../UserContext.jsx";

const PreOrderBakery = () => {
  const { user } = useGlobalVars();

  const [product, setProduct] = useState([]);
  const [productSize, setProductSize] = useState([]);
  const [productImage, setProductImage] = useState([]);
  const [productCategory, setProductCategory] = useState([]);
  const [category, setCategory] = useState([]);
  const [cart, setCart] = useState(null);
  const [quantities, setQuantities] = useState({});

  useEffect(() => {
    getCategory().then(setCategory).catch(console.error);
    getProductCategory().then(setProductCategory).catch(console.error);
  }, []);

  useEffect(() => {
    if (!productCategory.length || !category.length) return;

    const fetchData = async () => {
      try {
        const [products, sizes, images] = await Promise.all([
          getProducts(),
          getProductSize(),
          getProductImage(),
        ]);

        const filteredProducts = products.filter((prod) => {
          const pCat = productCategory.find(
            (p) => p.ProductCategory_ID === prod.ProductCategory_ID
          );
          const cat = category.find(
            (c) =>
              c.Category_ID === pCat?.Category_ID &&
              c.Category_Name === "Pre Order"
          );
          return pCat && cat;
        });

        setProduct(filteredProducts);
        setProductSize(sizes);
        setProductImage(images);
      } catch (error) {
        console.error("Error fetching product data:", error);
      }
    };

    fetchData();
  }, [productCategory, category]);

  useEffect(() => {
    if (!user?.User_ID) return;

    const fetchCart = async () => {
      try {
        const carts = await getCartById(user.User_ID);
        let activeCart = Array.isArray(carts)
          ? carts.find((c) => c.IS_ACTIVE === 1)
          : null;

        if (!activeCart) {
          await addACart({ User_ID: user.User_ID });
          const newCarts = await getCartById(user.User_ID);
          activeCart = Array.isArray(newCarts)
            ? newCarts.find((c) => c.IS_ACTIVE === 1)
            : null;
        }

        setCart(activeCart || null);
      } catch (error) {
        console.error("Error fetching/creating cart:", error);
      }
    };

    fetchCart();
  }, [user]);

  useEffect(() => {
    if (product.length > 0) {
      const initialQuantities = product.reduce((acc, item) => {
        acc[item.Product_ID] = 1;
        return acc;
      }, {});
      setQuantities(initialQuantities);
    }
  }, [product]);

  const handleQuantityChange = (id, change) => {
    setQuantities((prev) => ({
      ...prev,
      [id]: Math.max(1, prev[id] + change),
    }));
  };

  const handleAddToCart = (item) => {
    if (!user || !cart) {
      alert("User not logged in or cart not ready.");
      return;
    }

    const size = productSize.find((s) => s.Product_ID === item.Product_ID);
    const pCat = productCategory.find(
      (p) => p.ProductCategory_ID === item.ProductCategory_ID
    );
    const cat = category.find(
      (c) => c.Category_ID === pCat?.Category_ID && c.Category_Name === "Pre Order"
    );

    if (!size || !cat) {
      alert("Product size or category not found.");
      return;
    }

    const cartItem = {
      Cart_ID: cart.Cart_ID,
      Product_ID: item.Product_ID,
      Size_ID: size.Size_ID,
      Quantity: quantities[item.Product_ID],
      Category_ID: cat.Category_ID,
    };

    addToCartItem(cartItem)
      .then(() => alert("Item added to cart!"))
      .catch((error) => {
        console.error("Error adding to cart:", error);
        alert("Failed to add to cart.");
      });
  };

  return (
    <>
      <Navbar />
      <h2 className="m-4 fw-bold">Pre Order Bakery Products</h2>

      <div className="border rounded p-4 shadow-sm m-2 mx-4">
        <div className="container m-2">
          <div className="row g-4">
            {product.map((item) => (
              <div key={item.Product_ID} className="col-md-6">
                <div className="card shadow-sm border-0">
                  <div className="row g-0 align-items-center">
                    <div className="col-4 text-center">
                      <img
                        src={
                          productImage.find(
                            (img) => img.Product_ID === item.Product_ID
                          )?.Image_Link
                        }
                        alt={item.Product_Name}
                        className="img-fluid rounded"
                        style={{ width: "180px", height: "130px" }}
                      />
                    </div>
                    <div className="col-8">
                      <div className="card-body">
                        <h5 className="card-title">{item.Product_Name}</h5>
                        <p className="card-text text-muted">
                          {item.Product_Description}
                        </p>
                        <p className="card-text fw-semibold">
                          Price: Rs.{
                            productSize.find(
                              (size) => size.Product_ID === item.Product_ID
                            )?.Price
                          }
                        </p>
                        <div className="d-flex align-items-center">
                          <button
                            onClick={() => handleQuantityChange(item.Product_ID, -1)}
                            className="btn btn-primary btn-sm"
                          >
                            -
                          </button>
                          <input
                            type="text"
                            className="form-control text-center mx-2"
                            style={{ width: "50px" }}
                            value={quantities[item.Product_ID]}
                            readOnly
                          />
                          <button
                            onClick={() => handleQuantityChange(item.Product_ID, 1)}
                            className="btn btn-primary btn-sm"
                          >
                            +
                          </button>
                          <button
                            className="btn btn-primary btn-sm ms-3"
                            onClick={() => handleAddToCart(item)}
                          >
                            Add to Cart
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default PreOrderBakery;