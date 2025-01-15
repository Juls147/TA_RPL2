import React, { useEffect, useState } from "react";
import { useAuth } from "../components/authcontext";
import { FaPlus } from "react-icons/fa";
import axios from "axios";
import { formatPrice } from "./utils";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.css";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const ProductCard = ({ product, isLoggedIn, addToCart }) => {
  const handleAddToCartClick = () => {
    if (!isLoggedIn) {
      Swal.fire({
        icon: "warning",
        title: "Harap Login",
        text: "Anda harus login terlebih dahulu untuk menambahkan produk ke keranjang.",
        confirmButtonText: "OK",
        confirmButtonColor: "#d33",
      });
      return;
    }

    if (product.stock === 0) {
      Swal.fire({
        icon: "warning",
        title: "Stok Habis",
        text: `Stok produk ${product.name} habis.`,
        confirmButtonText: "OK",
        confirmButtonColor: "#d33",
      });
    } else {
      addToCart(product.id, product.name);
    }
  };

  return (
    <div className="product-card">
      <img
        crossOrigin="anonymous"
        src={`${API_BASE_URL}${product.image}`}
        alt={product.name}
        className="product-image"
      />
      <p className="product-name">{product.name}</p>
      <p className="product-price">Rp {formatPrice(parseInt(product.price))}</p>
      <p className="product-stock">Stok : {product.stock}</p>
      <button onClick={handleAddToCartClick} className="add-to-cart">
        <FaPlus />
        Tambah
      </button>
    </div>
  );
};

const ProductList = ({ type, products, searchResults }) => {
  const { isLoggedIn } = useAuth();

  const addToCart = async (productId, productName) => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `${API_BASE_URL}/api/cart`,
        { productId, quantity: 1 },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      Swal.fire({
        position: "top-end",
        html: `<span style="font-size: 14px; font-family: 'Poppins', sans-serif;">${productName} ditambahkan ke keranjang.</span>`,
        showConfirmButton: false,
        timer: 1000,
      });
    } catch (error) {
      console.error("Error adding product to cart:", error);
    }
  };

  const renderProducts = (products) => {
    if (!Array.isArray(products) || products.length === 0) {
      return (
        <p className="no-products">
          Produk tidak ditemukan. Silakan pilih kategori lain atau coba lagi
          nanti.
        </p>
      );
    }
    return (
      <div className="products-grid">
        {products.map((product) => (
          <ProductCard
            key={`product-${product.id}`}
            product={product}
            isLoggedIn={isLoggedIn}
            addToCart={addToCart}
          />
        ))}
      </div>
    );
  };

  if (searchResults && searchResults.length > 0) {
    return renderProducts(searchResults);
  }

  return renderProducts(products);
};

const CategoryList = ({
  categories,
  handleCategoryClick,
  selectedCategory,
}) => {
  if (!Array.isArray(categories)) {
    return null;
  }
  return (
    <div className="category-buttons">
      {categories.map((category) => (
        <button
          key={`category-${category.id}`}
          onClick={() => handleCategoryClick(category.id)}
          className={`category-button ${
            selectedCategory === category.id ? "active" : ""
          }`}
        >
          {category.name}
        </button>
      ))}
    </div>
  );
};

const ProductComponent = () => {
  const { isLoggedIn } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(0);
  const [searchResults, setSearchResults] = useState([]);
  const [categories, setCategories] = useState([]);
  const [categoryProducts, setCategoryProducts] = useState([]);

  useEffect(() => {
    const fetchCategoriesAndProducts = async () => {
      try {
        const categoryResponse = await axios.get(
          `${API_BASE_URL}/api/category`
        );
        setCategories([
          { id: 0, name: "Semua Produk" },
          ...categoryResponse.data,
        ]);

        let productUrl = `${API_BASE_URL}/api/products`;
        if (selectedCategory !== 0) {
          productUrl = `${API_BASE_URL}/api/products/category/${selectedCategory}`;
        }
        const productResponse = await axios.get(productUrl);
        setCategoryProducts(productResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
        setCategoryProducts([]);
      }
    };

    const fetchSearchResults = async () => {
      try {
        const searchResponse = await axios.get(
          `${API_BASE_URL}/api/products/name/${searchQuery}`
        );
        setSearchResults(searchResponse.data);
      } catch (error) {
        console.error("Error searching products:", error);
        setSearchResults([]);
      }
    };

    if (searchQuery === "") {
      fetchCategoriesAndProducts();
    } else {
      fetchSearchResults();
    }
  }, [selectedCategory, searchQuery]);

  return (
    <div>
      <section className="section-search-filter-bar">
        <div className="category-dropdown">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(parseInt(e.target.value))}
            className="dropdown"
          >
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
        <div className="search-bar-container">
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-bar"
          />
          <button
            className="nav-button"
            onClick={() => setSearchQuery(searchQuery)}
          >
            Search
          </button>
        </div>
      </section>
      <h3>Semua Produk</h3>
      <ProductList
        type="categories"
        products={searchResults.length > 0 ? searchResults : categoryProducts}
        searchResults={searchResults}
      />
    </div>
  );
};

export { ProductList, CategoryList, ProductComponent };

export default ProductList;
