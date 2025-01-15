import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../authcontext";
import {
  AddCategoryOverlay,
  EditCategoryOverlay,
} from "../overlay/overlaycategory";
import { FaPlus, FaSearch, FaSyncAlt, FaUser } from "react-icons/fa";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.css";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
const ITEMS_PER_PAGE = 10;

const CategoryMenu = () => {
  const { username } = useAuth();
  const [token, setToken] = useState("");
  const [categories, setCategories] = useState([]);
  const [isAddOverlayVisible, setIsAddOverlayVisible] = useState(false);
  const [isEditOverlayVisible, setIsEditOverlayVisible] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const [editCategory, setEditCategory] = useState("");
  const [editedCategoryId, setEditedCategoryId] = useState(null);
  const [searchCategoryId, setSearchCategoryId] = useState("");
  const [searchedCategory, setSearchedCategory] = useState(null);
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
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [token]);

  const handleCategorySearch = async () => {
    try {
      if (!searchCategoryId.trim()) {
        return;
      }

      const response = await axios.get(
        `${API_BASE_URL}/api/category/${searchCategoryId}`
      );
      setSearchedCategory(response.data);
    } catch (error) {
      console.error("Error searching category:", error);
      setSearchedCategory(null);
    }
  };

  const resetSearch = () => {
    setSearchCategoryId("");
    setSearchedCategory(null);
  };

  const handleAddCategoryClick = () => {
    setIsAddOverlayVisible(true);
    setNewCategory("");
  };

  const handleCloseAddOverlay = () => {
    setIsAddOverlayVisible(false);
    setNewCategory("");
  };

  const handleSaveNewCategory = async () => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/category`,
        {
          name: newCategory,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setCategories([...categories, response.data]);
      setIsAddOverlayVisible(false);
      Swal.fire({
        icon: "success",
        title: "Kategori Ditambahkan",
        text: "Kategori baru berhasil ditambahkan.",
        showConfirmButton: false,
        timer: 1000,
      });
    } catch (error) {
      console.error("Error creating new category:", error);
    }
  };

  const handleEditCategory = (categoryId) => {
    const categoryToEdit = categories.find((cat) => cat.id === categoryId);
    if (categoryToEdit) {
      setEditCategory(categoryToEdit.name);
      setEditedCategoryId(categoryId);
      setIsEditOverlayVisible(true);
    }
  };

  const handleCloseEditOverlay = () => {
    setIsEditOverlayVisible(false);
    setEditCategory("");
    setEditedCategoryId(null);
  };

  const handleSaveEditedCategory = async () => {
    try {
      const response = await axios.put(
        `${API_BASE_URL}/api/category/${editedCategoryId}`,
        {
          name: editCategory,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.status === 200) {
        const updatedCategories = categories.map((cat) =>
          cat.id === editedCategoryId ? { ...cat, name: editCategory } : cat
        );
        setCategories(updatedCategories);
        setIsEditOverlayVisible(false);
        Swal.fire({
          icon: "success",
          title: "Kategori Diperbarui",
          text: "Kategori berhasil diperbarui.",
          showConfirmButton: false,
          timer: 1000,
        });
      } else {
        throw new Error("Gagal mengupdate kategori.");
      }
    } catch (error) {
      console.error("Error updating category:", error);
    }
  };

  const handleDeleteCategory = async (categoryId) => {
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
          `${API_BASE_URL}/api/category/${categoryId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (response.status === 200) {
          const updatedCategories = categories.filter(
            (category) => category.id !== categoryId
          );
          setCategories(updatedCategories);
          Swal.fire({
            icon: "success",
            title: "Kategori Dihapus",
            text: "Kategori berhasil dihapus.",
            showConfirmButton: false,
            timer: 1000,
          });
        } else {
          throw new Error("Gagal menghapus kategori.");
        }
      }
    } catch (error) {
      console.error("Error deleting category:", error);
    }
  };

  const totalPages = Math.ceil(categories.length / ITEMS_PER_PAGE);
  const paginatedCategories = categories.slice(
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
              placeholder="Cari Berdasarkan ID Kategori..."
              value={searchCategoryId}
              onChange={(e) => setSearchCategoryId(e.target.value)}
            />
            <button onClick={handleCategorySearch}>{icons.search} Cari</button>
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
          <button className="add-product" onClick={handleAddCategoryClick}>
            {icons.add} Tambah Kategori
          </button>
        </div>
        <div className="products">
          <h3>Kategori Produk</h3>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Nama Kategori</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {searchedCategory ? (
                <tr key={searchedCategory.id}>
                  <td>{searchedCategory.id}</td>
                  <td>{searchedCategory.name}</td>
                  <td>
                    <div className="table-button">
                      <button
                        className="edit-btn"
                        onClick={() => handleEditCategory(searchedCategory.id)}
                      >
                        Edit
                      </button>
                      <button
                        className="delete-btn"
                        onClick={() =>
                          handleDeleteCategory(searchedCategory.id)
                        }
                      >
                        Hapus
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedCategories.map((category) => (
                  <tr key={category.id}>
                    <td>{category.id}</td>
                    <td>{category.name}</td>
                    <td>
                      <div className="table-button">
                        <button
                          className="edit-btn"
                          onClick={() => handleEditCategory(category.id)}
                        >
                          Edit
                        </button>
                        <button
                          className="delete-btn"
                          onClick={() => handleDeleteCategory(category.id)}
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
              <span>Total: {categories.length} Kategori</span>
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
              <span>Total: {categories.length} Produk</span>
            </div>
          )}
        </div>
      </div>
      <AddCategoryOverlay
        isVisible={isAddOverlayVisible}
        onClose={handleCloseAddOverlay}
        onSave={handleSaveNewCategory}
        newCategory={newCategory}
        setCategory={setNewCategory}
      />

      <EditCategoryOverlay
        isVisible={isEditOverlayVisible}
        onClose={handleCloseEditOverlay}
        onSave={handleSaveEditedCategory}
        editCategory={editCategory}
        setEditCategory={setEditCategory}
      />
    </>
  );
};

export default CategoryMenu;
