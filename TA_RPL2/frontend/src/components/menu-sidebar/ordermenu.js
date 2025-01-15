import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../authcontext";
import { FaSearch, FaSyncAlt, FaUser } from "react-icons/fa";
import EditOrderOverlay from "../overlay/overlayorder";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.css";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
const ITEMS_PER_PAGE = 10;

const OrderMenu = () => {
  const { username } = useAuth();
  const [token, setToken] = useState("");
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [order, setOrder] = useState([]);
  const [isEditOverlayVisible, setIsEditOverlayVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [searchOrderId, setSearchOrderId] = useState("");
  const [searchedOrder, setSearchedOrder] = useState(null);
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

        if (token) {
          const orderResponse = await axios.get(
            `${API_BASE_URL}/api/orders/allorder`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          setOrder(orderResponse.data.sort((a, b) => b.id - a.id));
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [token]);

  const handleOrderSearch = async () => {
    try {
      if (!searchOrderId.trim()) {
        return;
      }

      const response = await axios.get(
        `${API_BASE_URL}/api/orders/${searchOrderId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setSearchedOrder(response.data);
    } catch (error) {
      console.error("Error searching Order:", error);
      setSearchedOrder(null);
    }
  };

  const resetSearch = () => {
    setSearchOrderId("");
    setSearchedOrder(null);
  };

  const handleDeleteOrder = async (orderId) => {
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
        await axios.delete(`${API_BASE_URL}/api/orders/${orderId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const orderResponse = await axios.get(
          `${API_BASE_URL}/api/orders/allorder`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setOrder(orderResponse.data.sort((a, b) => a.id - b.id));
        Swal.fire({
          icon: "success",
          title: "Pesanan Dihapus",
          text: "Pesanan berhasil dihapus.",
          showConfirmButton: false,
          timer: 1000,
        });
      }
    } catch (error) {
      console.error("Error deleting order:", error);
    }
  };

  const handleEditOrderClick = (order) => {
    setSelectedOrder(order);
    setIsEditOverlayVisible(true);
  };

  const handleCloseEditOverlay = () => {
    setIsEditOverlayVisible(false);
    setSelectedOrder(null);
  };

  const handleSaveEditOrder = async () => {
    try {
      await axios.put(
        `${API_BASE_URL}/api/orders/${selectedOrder.id}`,
        {
          status: selectedOrder.status,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const orderResponse = await axios.get(
        `${API_BASE_URL}/api/orders/allorder`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setOrder(orderResponse.data.sort((a, b) => b.id - a.id));

      if (selectedOrder.status.toUpperCase() === "ARRIVED") {
        await axios.post(
          `${API_BASE_URL}/api/messages/arrived/${selectedOrder.id}`, // Menggunakan orderId sebagai parameter URL
          {},
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      }

      setIsEditOverlayVisible(false);
      setSelectedOrder(null);

      Swal.fire({
        icon: "success",
        title: "Pesanan Diperbarui",
        text: "Pesanan berhasil diperbarui.",
        showConfirmButton: false,
        timer: 1000,
      });
    } catch (error) {
      console.error("Error updating order:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Terjadi kesalahan saat memperbarui pesanan.",
        showConfirmButton: false,
        timer: 1500,
      });
    }
  };

  const totalPages = Math.ceil(order.length / ITEMS_PER_PAGE);
  const paginatedOrder = order.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const changePage = (page) => {
    setCurrentPage(page);
  };

  const icons = {
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
              placeholder="Cari Berdasarkan ID Pesanan..."
              value={searchOrderId}
              onChange={(e) => setSearchOrderId(e.target.value)}
            />
            <button onClick={handleOrderSearch}>{icons.search} Cari</button>
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
        <div className="user-list">
          <h3>Pesanan</h3>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>User ID</th>
                <th>Total</th>
                <th>Status</th>
                <th>Tanggal Pesanan</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {searchedOrder ? (
                <tr key={searchedOrder.id}>
                  <td>{searchedOrder.id}</td>
                  <td>{searchedOrder.userId}</td>
                  <td>Rp {searchedOrder.total.toLocaleString("id-ID")}</td>
                  <td>{searchedOrder.status}</td>
                  <td>{formatDate(searchedOrder.createdAt)}</td>
                  <td>
                    <div className="table-button">
                      <button
                        className="edit-btn"
                        onClick={() => handleEditOrderClick(searchedOrder.id)}
                      >
                        Edit
                      </button>
                      <button
                        className="delete-btn"
                        onClick={() => handleDeleteOrder(searchedOrder.id)}
                      >
                        Hapus
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedOrder.map((order) => (
                  <tr key={order.id}>
                    <td>{order.id}</td>
                    <td>{order.userId}</td>
                    <td>Rp {order.total.toLocaleString("id-ID")}</td>
                    <td>{order.status}</td>
                    <td>{formatDate(order.createdAt)}</td>
                    <td>
                      <div className="table-button">
                        <button
                          className="edit-btn"
                          onClick={() => handleEditOrderClick(order)}
                        >
                          Edit
                        </button>
                        <button
                          className="delete-btn"
                          onClick={() => handleDeleteOrder(order.id)}
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
              <span>Total: {order.length} Pesanan</span>
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
              <span>Total: {order.length} Pesanan</span>
            </div>
          )}
        </div>
      </div>
      {isEditOverlayVisible && (
        <EditOrderOverlay
          isVisible={isEditOverlayVisible}
          onClose={handleCloseEditOverlay}
          onSave={handleSaveEditOrder}
          order={selectedOrder}
          setOrder={setSelectedOrder}
        />
      )}
    </>
  );
};

const formatDate = (isoDate) => {
  const date = new Date(isoDate);
  const options = {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "numeric",
    minute: "numeric",
    hour12: false,
  };
  return date.toLocaleDateString("en-US", options).replace(",", ",");
};

export default OrderMenu;
