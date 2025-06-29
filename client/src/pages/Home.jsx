import { useEffect, useState } from "react";
import { FiSearch } from "react-icons/fi";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import ProductCard from "../components/ProductCard.jsx";
import {
  getProductImage,
  getProducts,
  getProductSize,
  getCategory,
  getProductCategory,
} from "../apis/products.js";
import { Link } from "react-router-dom";

const ITEMS_PER_PAGE = 12;

const HomePage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [products, setProducts] = useState([]);
  const [productSize, setProductSize] = useState([]);
  const [productImage, setProductImage] = useState([]);
  const [categories, setCategories] = useState([]);
  const [productCategories, setProductCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProductCategory, setSelectedProductCategory] = useState("all");
  const [sortOption, setSortOption] = useState("default");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          prods,
          sizes,
          images,
          cats,
          prodCats,
        ] = await Promise.all([
          getProducts(),
          getProductSize(),
          getProductImage(),
          getCategory(),
          getProductCategory(),
        ]);

        setProducts(prods);
        setProductSize(sizes);
        setProductImage(images);
        setCategories(cats);
        setProductCategories(prodCats);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const filteredProducts = products.filter((product) => {
    const categoryMatches =
      selectedProductCategory === "all" || product.ProductCategory_ID === Number(selectedProductCategory);

    const searchMatches = product.Product_Name.toLowerCase().includes(searchTerm.toLowerCase());

    return categoryMatches && searchMatches;
  });

  const sortedProducts = filteredProducts.slice();
  if (sortOption === "price-asc") {
    sortedProducts.sort((a, b) => {
      const aPrice = productSize
        .filter((size) => size.Product_ID === a.Product_ID)
        .reduce((min, size) => {
          const price = Number(size.Price);
          if (isNaN(price)) return min;
          return price < min ? price : min;
        }, Infinity);
      const bPrice = productSize
        .filter((size) => size.Product_ID === b.Product_ID)
        .reduce((min, size) => {
          const price = Number(size.Price);
          if (isNaN(price)) return min;
          return price < min ? price : min;
        }, Infinity);
      return aPrice - bPrice;
    });
  } else if (sortOption === "price-desc") {
    sortedProducts.sort((a, b) => {
      const aPrice = productSize
        .filter((size) => size.Product_ID === a.Product_ID)
        .reduce((min, size) => {
          const price = Number(size.Price);
          if (isNaN(price)) return min;
          return price < min ? price : min;
        }, Infinity);
      const bPrice = productSize
        .filter((size) => size.Product_ID === b.Product_ID)
        .reduce((min, size) => {
          const price = Number(size.Price);
          if (isNaN(price)) return min;
          return price < min ? price : min;
        }, Infinity);
      return bPrice - aPrice;
    });
  } else if (sortOption === "name-asc") {
    sortedProducts.sort((a, b) => a.Product_Name.localeCompare(b.Product_Name));
  } else if (sortOption === "name-desc") {
    sortedProducts.sort((a, b) => b.Product_Name.localeCompare(a.Product_Name));
  }

  const totalPages = Math.ceil(sortedProducts.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const selectedProducts = sortedProducts.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const nextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };
  const prevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleProductCategoryChange = (e) => {
    setSelectedProductCategory(e.target.value);
    setCurrentPage(1);
  };

  const handleSortChange = (e) => {
    setSortOption(e.target.value);
  };

  return (
    <div>
      <Navbar />
      <div className="container mt-4">
        <h2 className="fw-bold">Featured Products</h2>

        {/* Filters */}
        <div className="sticky-top bg-white py-3">
          <div className="row mb-3">
            <div className="col-md-4">
              <div className="input-group">
                <span className="input-group-text">
                  <FiSearch />
                </span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search for products..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                />
              </div>
            </div>

            <div className="col-md-4">
              <select
                className="form-select"
                value={selectedProductCategory}
                onChange={handleProductCategoryChange}
              >
                <option value="all">All Product Categories</option>
                {productCategories.map((prodCat) => (
                  <option key={prodCat.ProductCategory_ID} value={prodCat.ProductCategory_ID}>
                    {prodCat.ProductCategory_Name}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-md-4">
              <select
                className="form-select"
                value={sortOption}
                onChange={handleSortChange}
              >
                <option value="default">Sort By</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="name-asc">Name: A to Z</option>
                <option value="name-desc">Name: Z to A</option>
              </select>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="row g-4 mt-3">
          {selectedProducts.map((product) => {
            const sizesForProduct = productSize.filter(
              (size) => size.Product_ID === product.Product_ID
            );
            const minPrice = sizesForProduct.reduce((min, size) => {
              const price = Number(size.Price);
              if (isNaN(price)) return min;
              return price < min ? price : min;
            }, Infinity);
            const priceToShow = minPrice === Infinity ? 0 : minPrice;

            const image = productImage.find(
              (img) => img.Product_ID === product.Product_ID
            )?.Image_Link;

            return (
              <div key={product.Product_ID} className="col-md-3">
                <Link
                  to={`/product/${product.Product_ID}`}
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  <ProductCard
                    product={product}
                    price={`Rs.${priceToShow.toFixed(2)}`}
                    image={image || "images/default.jpg"}
                  />
                </Link>
              </div>
            );
          })}
        </div>

        {/* Pagination */}
        <div className="d-flex justify-content-center mt-4">
          <button
            className="btn btn-primary me-2"
            onClick={prevPage}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <span className="align-self-center">
            {currentPage} of {totalPages}
          </span>
          <button
            className="btn btn-primary ms-2"
            onClick={nextPage}
            disabled={currentPage === totalPages || totalPages === 0}
          >
            Next
          </button>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default HomePage;
