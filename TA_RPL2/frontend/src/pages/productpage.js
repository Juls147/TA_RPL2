import React, { useState, useEffect } from "react";
import { ProductList } from "../components/productlist";
import { FaSyncAlt } from "react-icons/fa";
import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const ProductPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(0);
  const [searchResults, setSearchResults] = useState([]);
  const [categories, setCategories] = useState([]);
  const [categoryProducts, setCategoryProducts] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/category`);
        setCategories([{ id: 0, name: "Semua Produk" }, ...response.data]);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    const fetchCategoryProducts = async () => {
      try {
        let url = `${API_BASE_URL}/api/products`;
        if (selectedCategory !== 0) {
          url = `${API_BASE_URL}/api/products/category/${selectedCategory}`;
        }
        const response = await axios.get(url);
        setCategoryProducts(response.data);
      } catch (error) {
        console.error("Error fetching category products:", error);
        setCategoryProducts([]);
      }
    };

    const handleSearch = async () => {
      try {
        let url = `${API_BASE_URL}/api/products/search`;
        const params = {
          query: searchQuery,
          category: selectedCategory !== 0 ? selectedCategory : undefined,
        };
        const response = await axios.get(url, { params });
        setSearchResults(response.data);

        if (response.data.length === 0) {
          setErrorMessage(
            "Produk tidak ditemukan. Silakan pilih kategori lain atau coba lagi nanti."
          );
        } else {
          setErrorMessage("");
        }
      } catch (error) {
        console.error("Error searching products:", error);
        setSearchResults([]);
        setErrorMessage(
          "Terjadi kesalahan saat mencari produk. Silakan coba lagi nanti."
        );
      }
    };

    if (searchQuery === "") {
      fetchCategoryProducts();
    } else {
      handleSearch();
    }

    fetchCategories();
  }, [selectedCategory, searchQuery]);

  const resetFilters = () => {
    setSearchQuery("");
    setSelectedCategory(0);
    setSearchResults([]);
    setErrorMessage("");
  };

  const icons = {
    reset: <FaSyncAlt />,
  };

  return (
    <div className="product-page">
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
          <button className="nav-button" onClick={resetFilters}>
            {icons.reset} Reset
          </button>
        </div>
      </section>
      <h3>Semua Produk</h3>
      {errorMessage ? (
        <p>{errorMessage}</p>
      ) : (
        <ProductList
          type="categories"
          products={searchResults.length > 0 ? searchResults : categoryProducts}
          searchResults={searchResults}
        />
      )}
    </div>
  );
};

export default ProductPage;
