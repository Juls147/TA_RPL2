import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../authcontext";
import { FaPlus, FaSearch, FaSyncAlt, FaUser } from "react-icons/fa";
import {
  AddOverlayProduct,
  EditOverlayProduct,
} from "../overlay/overlayproduct";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.css";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
const ITEMS_PER_PAGE = 10;

const ProductMenu = () => {
  const { username } = useAuth();
  const [token, setToken] = useState("");
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [isAddPopupVisible, setIsAddPopupVisible] = useState(false);
  const [isEditPopupVisible, setIsEditPopupVisible] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    price: 0,
    image: "",
    stock: 0,
    categoryId: "",
  });
  const [editedProduct, setEditedProduct] = useState({
    id: null,
    name: "",
    description: "",
    price: 0,
    image: "",
    stock: 0,
    categoryId: "",
  });
  const [searchProductId, setSearchProductId] = useState("");
  const [searchedProduct, setSearchedProduct] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const authToken = localStorage.getItem("token");
    setToken(authToken);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const categoriesResponse = await axios.get(
          `${API_BASE_URL}/api/category`
        );
        setCategories(categoriesResponse.data.sort((a, b) => a.id - b.id));

        const productsResponse = await axios.get(
          `${API_BASE_URL}/api/products`
        );
        setProducts(productsResponse.data.sort((a, b) => a.id - b.id));
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [token]);

  const handleProductSearch = async () => {
    try {
      if (!searchProductId.trim()) {
        return;
      }

      const response = await axios.get(
        `${API_BASE_URL}/api/products//${searchProductId}`
      );
      setSearchedProduct(response.data);
    } catch (error) {
      console.error("Error searching products:", error);
    }
  };

  const resetSearch = () => {
    setSearchProductId("");
    setSearchedProduct(null);
  };

  const handleAddProductClick = () => {
    setIsAddPopupVisible(true);
  };

  const handleCloseAddPopup = () => {
    setIsAddPopupVisible(false);
    setNewProduct({
      name: "",
      description: "",
      price: 0,
      image: "",
      categoryId: "",
    });
  };

  const handleSaveNewProduct = async () => {
    const formData = new FormData();
    formData.append("name", newProduct.name);
    formData.append("description", newProduct.description);
    formData.append("price", newProduct.price);
    formData.append("image", newProduct.image);
    formData.append("stock", newProduct.stock);
    formData.append("category", newProduct.categoryId);

    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/products`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setProducts([...products, response.data]);
      setIsAddPopupVisible(false);

      Swal.fire({
        icon: "success",
        title: "Produk Ditambahkan",
        text: "Produk telah berhasil ditambahkan.",
        showConfirmButton: false,
        timer: 1000,
      });

      setNewProduct({
        name: "",
        description: "",
        price: 0,
        image: "",
        categoryId: "",
      });
    } catch (error) {
      console.error("Error creating new product:", error);
    }
  };

  const handleEditProductClick = (product) => {
    setEditedProduct(product);
    setIsEditPopupVisible(true);
  };

  const handleCloseEditPopup = () => {
    setIsEditPopupVisible(false);
    setEditedProduct({
      id: null,
      name: "",
      description: "",
      price: 0,
      image: "",
      stock: 0,
      categoryId: "",
    });
  };

  const handleSaveEditedProduct = async () => {
    const formData = new FormData();
    formData.append("name", editedProduct.name);
    formData.append("description", editedProduct.description);
    formData.append("price", editedProduct.price);
    formData.append("stock", editedProduct.stock);
    formData.append("categoryId", editedProduct.categoryId);
    if (editedProduct.image instanceof File) {
      formData.append("image", editedProduct.image);
    }

    try {
      const response = await axios.put(
        `${API_BASE_URL}/api/products/${editedProduct.id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (response.status === 200) {
        const updatedProducts = products.map((product) =>
          product.id === editedProduct.id ? response.data : product
        );
        setProducts(updatedProducts);
        setIsEditPopupVisible(false);

        Swal.fire({
          icon: "success",
          title: "Produk Diperbarui",
          text: "Produk telah berhasil diperbarui.",
          showConfirmButton: false,
          timer: 1000,
        });

        setEditedProduct({
          id: null,
          name: "",
          description: "",
          price: 0,
          image: "",
          stock: 0,
          categoryId: "",
        });
      } else {
        throw new Error("Gagal mengupdate produk.");
      }
    } catch (error) {
      console.error("Error updating product:", error);
    }
  };

  const handleDeleteProduct = async (productId) => {
    try {
      const { isConfirmed } = await Swal.fire({
        icon: "warning",
        title: "Apakah Anda yakin?",
        text: "Anda tidak akan dapat mengembalikan ini!",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Ya, hapus!",
        cancelButtonText: "Batal",
      });

      if (isConfirmed) {
        const response = await axios.delete(
          `${API_BASE_URL}/api/products/${productId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (response.status === 200) {
          setProducts(products.filter((product) => product.id !== productId));

          Swal.fire({
            icon: "success",
            title: "Produk Dihapus",
            text: "Produk telah berhasil dihapus.",
            showConfirmButton: false,
            timer: 1000,
          });
        } else {
          throw new Error("Gagal menghapus produk.");
        }
      }
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  const totalPages = Math.ceil(products.length / ITEMS_PER_PAGE);
  const paginatedProducts = products.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const changePage = (page) => {
    setCurrentPage(page);
  };

  const icons = {
    add: <FaPlus />,
    search: <FaSearch />,
    reset: <FaSyncAlt />,
  };

  return (
    <>
      <div className="main-content">
        <div className="header">
          <div className="search-bars">
            <input
              type="text"
              placeholder="Cari Berdasarkan ID Produk..."
              value={searchProductId}
              onChange={(e) => setSearchProductId(e.target.value)}
            />
            <button onClick={handleProductSearch}>{icons.search} Cari</button>
            <button onClick={resetSearch}>{icons.reset} Reset</button>
          </div>
          <div className="user-info">
            <span className="username">{username}</span>
            <FaUser
              style={{
                fontSize: "2em",
                border: "1px solid white",
                borderRadius: "50%",
                height: "25px",
                width: "25px",
                padding: "2px",
              }}
            />
          </div>
        </div>
        <div className="filters">
          <div className="filters-button"></div>
          <button className="add-product" onClick={handleAddProductClick}>
            {icons.add} Tambah Produk
          </button>
        </div>
        <div className="products">
          <h3>Produk</h3>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Nama Produk</th>
                <th>Deskripsi</th>
                <th>Harga</th>
                <th>Gambar</th>
                <th>Stok</th>
                <th>Terjual</th>
                <th>Kategori</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {searchedProduct ? (
                <tr key={searchedProduct.id}>
                  <td>{searchedProduct.id}</td>
                  <td>{searchedProduct.name}</td>
                  <td>{searchedProduct.description}</td>
                  <td>Rp {searchedProduct.price.toLocaleString("id-ID")}</td>
                  <td>{searchedProduct.image}</td>
                  <td>{searchedProduct.stock}</td>
                  <td>{searchedProduct.sold}</td>
                  <td>
                    {
                      categories.find(
                        (cat) => cat.id === searchedProduct.categoryId
                      )?.name
                    }
                  </td>
                  <td>
                    <div className="table-button">
                      <button
                        className="edit-btn"
                        onClick={() =>
                          handleEditProductClick(searchedProduct.id)
                        }
                      >
                        Edit
                      </button>
                      <button
                        className="delete-btn"
                        onClick={() => handleDeleteProduct(searchedProduct.id)}
                      >
                        Hapus
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedProducts.map((product) => (
                  <tr key={product.id}>
                    <td>{product.id}</td>
                    <td>{product.name}</td>
                    <td>{product.description}</td>
                    <td>Rp {product.price.toLocaleString("id-ID")}</td>
                    <td>{product.image}</td>
                    <td>{product.stock}</td>
                    <td>{product.sold}</td>
                    <td>
                      {
                        categories.find((cat) => cat.id === product.categoryId)
                          ?.name
                      }
                    </td>
                    <td>
                      <div className="table-button">
                        <button
                          className="edit-btn"
                          onClick={() => handleEditProductClick(product)}
                        >
                          Edit
                        </button>
                        <button
                          className="delete-btn"
                          onClick={() => handleDeleteProduct(product.id)}
                        >
                          Hapus
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
          {totalPages > 1 ? (
            <div className="pagination">
              <span>Baris per Halaman: 10</span>
              <span>Total: {products.length} Produk</span>
              <div className="pagination-button">
                {currentPage > 1 && (
                  <button onClick={() => changePage(currentPage - 1)}>
                    {"<"}
                  </button>
                )}
                {Array.from({ length: totalPages }, (_, index) =>
                  index + 1 <= 3 ||
                  index + 1 === totalPages ||
                  (index + 1 >= currentPage - 1 &&
                    index + 1 <= currentPage + 1) ? (
                    <button
                      key={index + 1}
                      onClick={() => changePage(index + 1)}
                      className={currentPage === index + 1 ? "active" : ""}
                    >
                      {index + 1}
                    </button>
                  ) : index + 1 === 4 && totalPages > 4 ? (
                    <span key={index}>...</span>
                  ) : null
                )}
                {currentPage < totalPages && (
                  <button onClick={() => changePage(currentPage + 1)}>
                    {">"}
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="pagination">
              <span>Baris per Halaman: 10</span>
              <span>Total: {products.length} Produk</span>
            </div>
          )}
        </div>
      </div>
      <AddOverlayProduct
        isVisible={isAddPopupVisible}
        onClose={handleCloseAddPopup}
        onSave={handleSaveNewProduct}
        newProduct={newProduct}
        setNewProduct={setNewProduct}
        categories={categories}
      />
      <EditOverlayProduct
        isVisible={isEditPopupVisible}
        onClose={handleCloseEditPopup}
        onSave={handleSaveEditedProduct}
        editedProduct={editedProduct}
        setEditedProduct={setEditedProduct}
        categories={categories}
      />
    </>
  );
};

export default ProductMenu;
