import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ProductList, CategoryList } from "../components/productlist";
import { useAuth } from "../components/authcontext";
import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const LandingPage = () => {
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState(0);
  const [categories, setCategories] = useState([]);
  const [bestSellers, setBestSellers] = useState([]);
  const [recommendedProducts, setRecommendedProducts] = useState([]);
  const [categoryProducts, setCategoryProducts] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/category`);
        setCategories([{ id: 0, name: "Semua Produk" }, ...response.data]);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    const fetchBestSellers = async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/api/products/bestsellers`
        );
        setBestSellers(response.data);
      } catch (error) {
        console.error("Error fetching best sellers:", error);
        setBestSellers([]);
      }
    };

    const fetchRecommendedProducts = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/recommend`);
        setRecommendedProducts(response.data);
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching recommended products:", error);
        setRecommendedProducts([]);
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

    fetchCategories();
    fetchBestSellers();
    fetchRecommendedProducts();
    fetchCategoryProducts();
  }, [selectedCategory]);

  return (
    <div className="landing-page">
      <section className="hero-section">
        <h1 className="hero-title">Selamat Datang di Huzi Store</h1>
        <h3 className="hero-subtitle">
          Temukan produk terbaik dengan harga yang tidak ada duanya
        </h3>
        <button
          className="hero-button"
          onClick={() => navigate(isLoggedIn ? "/products" : "/signin")}
        >
          Beli Sekarang
        </button>
      </section>
      <section className="section best-sellers">
        <h3 className="section-title">Produk Terbaik</h3>
        <ProductList type="bestSellers" products={bestSellers.slice(0, 5)} />
      </section>
      {isLoggedIn && (
        <section className="section recommended">
          <h3 className="section-title">Produk Rekomendasi</h3>
          <ProductList type="recommended" products={recommendedProducts} />
        </section>
      )}
      <section className="section categories">
        <h3 className="section-title">Kategori</h3>
        <CategoryList
          categories={categories}
          handleCategoryClick={setSelectedCategory}
          selectedCategory={selectedCategory}
        />
      </section>
      <section className="section category-products">
        <h3 className="section-title">Kategori Produk</h3>
        <ProductList type="categories" products={categoryProducts} />
      </section>
    </div>
  );
};

export default LandingPage;
