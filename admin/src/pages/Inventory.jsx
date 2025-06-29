import { useEffect, useState } from "react";
import {
  addImage,
  addProduct,
  addSize,
  getCategory,
  getProductCategory,
  getProductSize,
  getStock,
  removeImage,
  removeProduct,
  removeSize,
  updateStock,
} from "../apis/products";

const topTabs = ["Stock Update", "Add Item", "Remove Item"];

const Inventory = () => {
  const [activeTopTab, setActiveTopTab] = useState("Stock Update");
  const [category, setCategory] = useState([]);
  const [productCategory, setProductCategory] = useState([]);
  const [products, setProducts] = useState([]);
  const [productSize, setProductSize] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedProductCategory, setSelectedProductCategory] = useState("");
  const [addingProduct, setAddingProduct] = useState({
    Product_ID: "",
    ProductCategory_ID: "",
    Product_Name: "",
    Product_Description: "",
    Stock: "",
    Image_Link: "",
  });
  const [sizes, setSizes] = useState([{ Size: "", Price: "", Stock: "" }]);

  // Fetch categories
  useEffect(() => {
    getCategory()
      .then(setCategory)
      .catch((err) => console.error("Category error:", err));
  }, []);

  // Fetch product categories
  useEffect(() => {
    getProductCategory()
      .then(setProductCategory)
      .catch((err) => console.error("ProductCategory error:", err));
  }, []);

  // Update ProductCategory_ID when selection changes
  useEffect(() => {
    setAddingProduct((prev) => ({
      ...prev,
      ProductCategory_ID: selectedProductCategory,
    }));
  }, [selectedProductCategory]);

  const searchStock = () => {
    getStock(selectedProductCategory)
      .then(setProducts)
      .catch((err) => console.error("Stock error:", err));
    getProductSize()
      .then(setProductSize)
      .catch((err) => console.error("Size error:", err));
  };

  // Update displayed productSize when stock/products load
  useEffect(() => {
    const updated = productSize.filter((size) =>
      products.some((p) => p.Product_ID === size.Product_ID)
    );
    setFilteredProducts(updated);
  }, [products, productSize]);

  const handleStockChange = () => {
    filteredProducts.forEach((product) => {
      updateStock(product.Size_ID, parseInt(product.Stock)).catch((err) => {
        console.error("Error updating stock:", err);
      });
    });
    alert("Stock updated successfully!");
  };

  const submitProduct = async (e) => {
    e.preventDefault();
    const {
      Product_ID,
      ProductCategory_ID,
      Product_Name,
      Product_Description,
      Image_Link,
    } = addingProduct;

  if (!Product_ID || !ProductCategory_ID || !Product_Name || !Image_Link || sizes.length === 0) {
      alert("Please fill in all required fields and at least one size.");
      return;
    }

    try {
      await addProduct(addingProduct);
      await addImage({ Product_ID, Image_Link });

       for (const s of sizes) {
        if (!s.Size || !s.Price || !s.Stock) continue;
        await addSize({
          Product_ID,
          Size: s.Size,
          Price: s.Price,
          Stock: s.Stock,
        });
      }


       alert("Product and sizes added successfully!");
      setAddingProduct({
        Product_ID: "",
        ProductCategory_ID: "",
        Product_Name: "",
        Product_Description: "",
        Image_Link: "",
      });
      setSizes([{ Size: "", Price: "", Stock: "" }]);
      searchStock();
    } catch (error) {
      console.error("Error adding product:", error);
      alert("Error adding product.");
    }
  };
      

  const submitRemoveProduct = async (Size_ID, Product_ID) => {
    try {
      await removeSize(Size_ID);
      await removeProduct(Product_ID);
      await removeImage(Product_ID);
      alert("Product removed successfully.");
      searchStock();
    } catch (error) {
      console.error("Remove error:", error);
      alert("Error removing product.");
    }
  };
  return (
    <div className="container-fluid p-4">
      {/* Top Tabs */}
      <div className="d-flex gap-4 mb-3">
        {topTabs.map((tab) => (
          <span
            key={tab}
            className={`pb-1 ${
              activeTopTab === tab
                ? "fw-bold text-primary border-bottom border-primary"
                : "text-muted"
            }`}
            style={{ cursor: "pointer" }}
            onClick={() => setActiveTopTab(tab)}
          >
            {tab}
          </span>
        ))}
      </div>

      <h2>Inventory</h2>

      {/* Filter */}
      <div className="card p-3 mb-4">
        <div className="row">
          <div className="col-md-4">
            <label>Select Category</label>
            <select
              className="form-select"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="">Select</option>
              {category.map((c) => (
                <option key={c.Category_ID} value={c.Category_ID}>
                  {c.Category_Name}
                </option>
              ))}
            </select>
          </div>

          <div className="col-md-4">
            <label>Select Product Category</label>
            <select
              className="form-select"
              value={selectedProductCategory}
              onChange={(e) => setSelectedProductCategory(e.target.value)}
            >
              <option value="">Select</option>
              {productCategory
                .filter((p) => p.Category_ID === Number(selectedCategory))
                .map((p) => (
                  <option key={p.ProductCategory_ID} value={p.ProductCategory_ID}>
                    {p.ProductCategory_Name}
                  </option>
                ))}
            </select>
          </div>

          {activeTopTab !== "Add Item" && (
            <div className="col-md-4 d-flex align-items-end">
              <button
                className="btn btn-primary"
                onClick={searchStock}
                disabled={!selectedCategory || !selectedProductCategory}
              >
                Search Inventory
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Stock Table */}
      {activeTopTab === "Stock Update" && (
        <div className="card p-3">
          <h5>Update Stock</h5>
          <div className="table-responsive">
            <table className="table table-bordered mt-2">
              <thead>
                <tr>
                  <th>Product ID</th>
                  <th>Name</th>
                  <th>Size</th>
                  <th>Stock</th>
                  <th>Price</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product) => {
                  const prod = products.find(
                    (p) => p.Product_ID === product.Product_ID
                  );
                  return (
                    <tr key={product.Size_ID}>
                      <td>{product.Product_ID}</td>
                      <td>{prod?.Product_Name || "Unknown"}</td>
                      <td>{product.Size}</td>
                      <td>
                        <input
                          type="number"
                          className="form-control"
                          value={product.Stock}
                          onChange={(e) => {
                            const value = e.target.value;
                            setFilteredProducts((prev) =>
                              prev.map((p) =>
                                p.Size_ID === product.Size_ID
                                  ? { ...p, Stock: value }
                                  : p
                              )
                            );
                          }}
                        />
                      </td>
                      <td>Rs. {product.Price}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <button className="btn btn-primary mt-3" onClick={handleStockChange}>
            Update Inventory
          </button>
        </div>
      )}
   {/* Add Item */}
      {activeTopTab === "Add Item" && (
        <div className="card p-4">
          <h5>Add New Product</h5>
          <form onSubmit={submitProduct}>
            <div className="row">
              <div className="col-md-6">
                <label>Product ID</label>
                <input
                  type="text"
                  className="form-control"
                  value={addingProduct.Product_ID}
                  onChange={(e) =>
                    setAddingProduct({ ...addingProduct, Product_ID: e.target.value })
                  }
                />
                <label className="mt-2">Product Name</label>
                <input
                  type="text"
                  className="form-control"
                  value={addingProduct.Product_Name}
                  onChange={(e) =>
                    setAddingProduct({ ...addingProduct, Product_Name: e.target.value })
                  }
                />
                <label className="mt-2">Description</label>
                <textarea
                  className="form-control"
                  rows="3"
                  value={addingProduct.Product_Description}
                  onChange={(e) =>
                    setAddingProduct({
                      ...addingProduct,
                      Product_Description: e.target.value,
                    })
                  }
                ></textarea>
                <label className="mt-2">Image URL</label>
                <input
                  type="text"
                  className="form-control"
                  value={addingProduct.Image_Link}
                  onChange={(e) =>
                    setAddingProduct({ ...addingProduct, Image_Link: e.target.value })
                  }
                />
              </div>

              <div className="col-md-6">
                <label className="fw-bold">Sizes</label>
                {sizes.map((s, index) => (
                  <div className="row mb-2" key={index}>
                    <div className="col">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Size"
                        value={s.Size}
                        onChange={(e) =>
                          setSizes((prev) =>
                            prev.map((item, i) =>
                              i === index ? { ...item, Size: e.target.value } : item
                            )
                          )
                        }
                      />
                    </div>
                    <div className="col">
                      <input
                        type="number"
                        className="form-control"
                        placeholder="Price"
                        value={s.Price}
                        onChange={(e) =>
                          setSizes((prev) =>
                            prev.map((item, i) =>
                              i === index ? { ...item, Price: e.target.value } : item
                            )
                          )
                        }
                      />
                    </div>
                    <div className="col">
                      <input
                        type="number"
                        className="form-control"
                        placeholder="Stock"
                        value={s.Stock}
                        onChange={(e) =>
                          setSizes((prev) =>
                            prev.map((item, i) =>
                              i === index ? { ...item, Stock: e.target.value } : item
                            )
                          )
                        }
                      />
                    </div>
                    <div className="col-auto">
                      <button
                        type="button"
                        className="btn btn-danger"
                        onClick={() =>
                          setSizes((prev) => prev.filter((_, i) => i !== index))
                        }
                      >
                        X
                      </button>
                    </div>
                  </div>
                ))}
                <button
                  type="button"
                  className="btn btn-secondary mt-2"
                  onClick={() => setSizes([...sizes, { Size: "", Price: "", Stock: "" }])}
                >
                  + Add Size
                </button>
              </div>
            </div>

            <button type="submit" className="btn btn-success mt-4">
              Add Product
            </button>
          </form>
        </div>
      )}

    

      {/* Remove Item */}
      {activeTopTab === "Remove Item" && (
        <div className="card p-3">
          <h5>Remove Products</h5>
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>Product ID</th>
                <th>Name</th>
                <th>Size</th>
                <th>Stock</th>
                <th>Price</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => {
                const prod = products.find(
                  (p) => p.Product_ID === product.Product_ID
                );
                return (
                  <tr key={product.Size_ID}>
                    <td>{product.Product_ID}</td>
                    <td>{prod?.Product_Name || "Unknown"}</td>
                    <td>{product.Size}</td>
                    <td>{product.Stock}</td>
                    <td>Rs. {product.Price}</td>
                    <td>
                      <button
                        className="btn btn-danger"
                        onClick={() =>
                          submitRemoveProduct(product.Size_ID, product.Product_ID)
                        }
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Inventory;
