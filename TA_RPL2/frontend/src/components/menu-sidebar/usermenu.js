import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../authcontext";
import OverlayUser from "../overlay/overlayuser";
import { FaPlus, FaSearch, FaSyncAlt, FaUser } from "react-icons/fa";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.css";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
const ITEMS_PER_PAGE = 10;

const UserMenu = () => {
  const { username } = useAuth();
  const [token, setToken] = useState("");
  const [users, setUsers] = useState([]);
  const [isPopupVisibleUser, setIsPopupVisibleUser] = useState(false);
  const [newUser, setNewUser] = useState({
    username: "",
    email: "",
    no_hp: "",
    location: "",
    password: "",
    userType: "",
  });
  const [searchUserId, setSearchUserId] = useState("");
  const [searchedUser, setSearchedUser] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const authToken = localStorage.getItem("token");
    setToken(authToken);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (token) {
          const usersResponse = await axios.get(
            `${API_BASE_URL}/api/users/user/alluser`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          setUsers(usersResponse.data.sort((a, b) => a.id - b.id));
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [token]);

  const handleUserSearch = async () => {
    try {
      if (!searchUserId.trim()) {
        return;
      }

      const response = await axios.get(
        `${API_BASE_URL}/api/users/user/getuser/${searchUserId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log(response.data);
      setSearchedUser(response.data);
    } catch (error) {
      console.error("Error searching User:", error);
      setSearchedUser(null);
    }
  };

  const resetSearch = () => {
    setSearchUserId("");
    setSearchedUser(null);
  };

  const handleAddUserClick = () => {
    setIsPopupVisibleUser(true);
  };

  const handleCloseUser = () => {
    setIsPopupVisibleUser(false);
  };

  const handleSaveUser = async () => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/users/user/create`,
        {
          username: newUser.username,
          email: newUser.email,
          no_hp: newUser.no_hp,
          location: newUser.location,
          password: newUser.password,
          userType: newUser.userType,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setUsers([...users, response.data]);
      setIsPopupVisibleUser(false);
      setNewUser({
        username: "",
        email: "",
        no_hp: "",
        location: "",
        password: "",
        userType: "",
      });

      Swal.fire({
        icon: "success",
        title: "Berhasil",
        text: "Pengguna berhasil ditambahkan.",
        showConfirmButton: false,
        timer: 1000,
      });
    } catch (error) {
      console.error("Error creating new user:", error);
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      const { isConfirmed } = await Swal.fire({
        icon: "warning",
        title: "Apakah Anda yakin?",
        text: "Anda tidak akan dapat mengembalikannya!",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Ya, hapus!",
        cancelButtonText: "Batal",
      });

      if (isConfirmed) {
        const response = await axios.delete(
          `${API_BASE_URL}/api/users/${userId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (response.status === 200) {
          setUsers(users.filter((user) => user.id !== userId));

          Swal.fire({
            icon: "success",
            title: "Berhasil",
            text: "Pengguna berhasil dihapus.",
            showConfirmButton: false,
            timer: 1000,
          });
        } else {
          throw new Error("Gagal menghapus pengguna.");
        }
      }
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const totalPages = Math.ceil(users.length / ITEMS_PER_PAGE);
  const paginatedUsers = users.slice(
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
              placeholder="Cari Berdasarkan ID User..."
              value={searchUserId}
              onChange={(e) => setSearchUserId(e.target.value)}
            />
            <button onClick={handleUserSearch}>{icons.search} Cari</button>
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
          <button className="add-product" onClick={handleAddUserClick}>
            {icons.add} Tambah Akun
          </button>
        </div>
        <div className="user-list">
          <h3>Pengaturan Akun User</h3>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Nama</th>
                <th>Email</th>
                <th>No. HP</th>
                <th>Lokasi</th>
                <th>Tipe User</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {searchedUser ? (
                <tr key={searchedUser.id}>
                  <td>{searchedUser.id}</td>
                  <td>{searchedUser.username}</td>
                  <td>{searchedUser.email}</td>
                  <td>{searchedUser.no_hp || "n/A"}</td>
                  <td>{searchedUser.location || "n/A"}</td>
                  <td>{searchedUser.userType}</td>
                  <td>
                    <div className="table-button">
                      <button
                        className="delete-btn"
                        onClick={() => handleDeleteUser(searchedUser.id)}
                      >
                        Hapus
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedUsers.map((user) => (
                  <tr key={user.id}>
                    <td>{user.id}</td>
                    <td>{user.username}</td>
                    <td>{user.email}</td>
                    <td>{user.no_hp || "n/A"}</td>
                    <td>{user.location || "n/A"}</td>
                    <td>{user.userType}</td>
                    <td>
                      <div className="table-button">
                        <button
                          className="delete-btn"
                          onClick={() => handleDeleteUser(user.id)}
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
              <span>Total: {users.length} Pengguna</span>
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
              <span>Total: {users.length} Pengguna</span>
            </div>
          )}
        </div>
      </div>
      <OverlayUser
        isVisibleUser={isPopupVisibleUser}
        onCloseUser={handleCloseUser}
        onSaveUser={handleSaveUser}
        newUser={newUser}
        setNewUser={setNewUser}
      />
    </>
  );
};

export default UserMenu;
