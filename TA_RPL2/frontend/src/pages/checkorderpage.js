import React, { useState, useEffect } from "react";
import { FaSearch, FaSyncAlt } from "react-icons/fa";
import axios from "axios";
import { formatPrice, formatDateTime } from "../components/utils";
import { useAuth } from "../components/authcontext";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
const ITEMS_PER_PAGE = 5;

const CheckOrderPage = () => {
  const { token } = useAuth();
  const [orderID, setOrderID] = useState("");
  const [orders, setOrders] = useState([]);
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/orders`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setOrders(response.data.sort((a, b) => b.id - a.id));
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchOrders();
  }, [token]);

  const handleOrderSearch = async (e) => {
    e.preventDefault();
    try {
      if (orderID.trim() === "") return;

      setSearching(true);

      const response = await axios.get(
        `${API_BASE_URL}/api/orders/${orderID}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const order = response.data;
      setOrders(order ? [order] : []);
      setSearchError("");
    } catch (error) {
      console.error("Error searching orders:", error);
      setSearchError("Data pesanan tidak ditemukan.");
    } finally {
      setSearching(false);
    }
  };

  const handleReset = async () => {
    setOrderID("");
    setSearchError("");
    try {
      const response = await axios.get(`${API_BASE_URL}/api/orders`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setOrders(response.data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  const totalOrders = orders.length;
  const totalPages = Math.ceil(totalOrders / ITEMS_PER_PAGE);
  const indexOfLastOrder = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstOrder = indexOfLastOrder - ITEMS_PER_PAGE;
  const currentOrders = orders.slice(indexOfFirstOrder, indexOfLastOrder);

  const changePage = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <div className="check-order-page">
      <section className="order-search-section">
        <h3>Lacak Pesanan Kamu Dengan Nomor ID</h3>
        <p>
          Pesanan Kamu Tidak Terdaftar Meskipun Kamu Yakin Telah Memesan? Harap
          Tunggu 1-5 Menit. Tetapi Jika Pesanan Masih Belum Muncul, Kamu Bisa{" "}
          <a
            href="https://api.whatsapp.com/send?phone=6283808488686"
            target="_blank"
            rel="noopener noreferrer"
          >
            Hubungi Kami
          </a>
        </p>
        <form className="order-search-form" onSubmit={handleOrderSearch}>
          <input
            type="text"
            placeholder="Cari Berdasarkan Order ID..."
            value={orderID}
            onChange={(e) => setOrderID(e.target.value)}
          />
          <button type="submit" className="search-button">
            <FaSearch /> Cari
          </button>
          <button type="button" onClick={handleReset} className="reset-button">
            <FaSyncAlt />
            Reset
          </button>
        </form>
      </section>
      <section className="order-list-section">
        <h4>Pesanan Real-Time</h4>
        <p>
          Ini Adalah Pesanan Real-Time Dari Semua Pengguna. Informasi Yang
          Tersedia Mencakup Tanggal Pesanan, ID Pesanan, Nomor Ponsel, Harga,
          Dan Status.
        </p>
        {searching ? (
          <p>Mencari...</p>
        ) : (
          <>
            {searchError ? (
              <p>{searchError}</p>
            ) : (
              <div className="table-section">
                <table className="order-table">
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>User ID</th>
                      <th>Total</th>
                      <th>Status</th>
                      <th>Tanggal Pesanan</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentOrders.map((order) => (
                      <tr key={order.id}>
                        <td>{order.id}</td>
                        <td>{order.userId}</td>
                        <td>Rp {formatPrice(order.total)}</td>
                        <td>{order.status}</td>
                        <td>{formatDateTime(order.createdAt)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            {totalPages > 1 && (
              <div className="pagination">
                <span>Baris per Halaman: 5</span>
                <span>Total: {totalOrders} Pesanan</span>
                <div className="pagination-button">
                  {currentPage > 1 && (
                    <button onClick={handlePrevPage}>{"<"}</button>
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
                    <button onClick={handleNextPage}>{">"}</button>
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
};

export default CheckOrderPage;
