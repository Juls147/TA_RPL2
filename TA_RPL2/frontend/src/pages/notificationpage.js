import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaTrashAlt } from "react-icons/fa";
import Swal from "sweetalert2";
import { useAuth } from "../components/authcontext";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
const ITEMS_PER_PAGE = 10;

const NotificationPage = () => {
  const { token, username } = useAuth();
  const [messages, setMessages] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/api/messages/message/${username}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setMessages(response.data.sort((a, b) => b.id - a.id));
      } catch (error) {
        console.error("Error fetching messages:", error.response);
        if (error.response && error.response.status === 400) {
          Swal.fire("Error!", "Invalid Token. Please log in again.", "error");
        } else {
          Swal.fire("Error!", "Failed to fetch messages.", "error");
        }
      }
    };

    fetchMessages();
  }, [token, username]);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/api/messages/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setMessages(messages.filter((message) => message.id !== id));
      Swal.fire("Deleted!", "Message has been deleted.", "success");
    } catch (error) {
      console.error("Error deleting message:", error);
      Swal.fire("Error!", "Failed to delete message.", "error");
    }
  };

  const totalPages = Math.ceil(messages.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE + 1;
  const paginatedMessages = messages.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const changePage = (page) => {
    setCurrentPage(page);
  };

  const icons = {
    delete: <FaTrashAlt />,
  };

  return (
    <div className="notification-page">
      <div className="notification-page-border">
        <h3>Pesan Masuk</h3>
        <p>
          Selamat datang di kotak masuk Anda! Di sini, Anda dapat melihat semua
          pesan yang telah Anda terima. Jelajahi riwayat pesan Anda dengan
          mudah.
        </p>
        <div className="notification-table-container">
          <table className="notification-table">
            <thead>
              <tr>
                <th>No</th>
                <th>Pengirim</th>
                <th>Judul</th>
                <th>Deskripsi</th>
                <th>Tanggal Penerima</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {paginatedMessages.map((message, index) => (
                <tr key={message.id}>
                  <td>{startIndex + index}</td>
                  <td>HuziStore</td>
                  <td>{message.title}</td>
                  <td>{message.description}</td>
                  <td>{formatDate(message.receivedAt)}</td>
                  <td>
                    <button onClick={() => handleDelete(message.id)}>
                      {icons.delete}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="pagination">
          <span>Baris per Halaman: 10</span>
          <span>Total: {messages.length} Pesan</span>
          <div className="pagination-button">
            {currentPage > 1 && (
              <button onClick={() => changePage(currentPage - 1)}>{"<"}</button>
            )}
            {Array.from({ length: totalPages }, (_, index) =>
              index + 1 <= 3 ||
              index + 1 === totalPages ||
              (index + 1 >= currentPage - 1 && index + 1 <= currentPage + 1) ? (
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
              <button onClick={() => changePage(currentPage + 1)}>{">"}</button>
            )}
          </div>
        </div>
      </div>
    </div>
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

export default NotificationPage;
