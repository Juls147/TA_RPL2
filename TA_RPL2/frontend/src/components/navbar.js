import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaShoppingCart,
  FaUser,
  FaAngleUp,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import { useAuth } from "../components/authcontext";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.css";

const Navbar = () => {
  const { isLoggedIn, username, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isRotated, setIsRotated] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const navigate = useNavigate();

  const handleLogout = () => {
    Swal.fire({
      title: "Konfirmasi Logout",
      text: "Apakah Anda yakin ingin keluar?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Ya, Keluar",
      cancelButtonText: "Tidak",
    }).then((result) => {
      if (result.isConfirmed) {
        logout();
        navigate("/");
      }
    });
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
    setIsRotated(!isRotated);
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <div className="navbar">
      <Link to="/" className="navbar-logo">
        <div className="nav-toggle" onClick={toggleMenu}>
          <FaBars className="menu-icons" />
        </div>
        <h2>Huzi Store</h2>
      </Link>
      <div className={`nav-links ${menuOpen ? "active" : ""}`}>
        <FaTimes className="close-button" onClick={closeMenu} />
        <Link to="/" className="nav-link" onClick={closeMenu}>
          Beranda
        </Link>
        {isLoggedIn && (
          <Link to="/cek-pesanan" className="nav-link" onClick={closeMenu}>
            Cek Pesanan
          </Link>
        )}
        <Link to="/products" className="nav-link" onClick={closeMenu}>
          Produk
        </Link>
        <Link to="/about" className="nav-link" onClick={closeMenu}>
          Tentang
        </Link>
      </div>
      <div className="nav-actions">
        {isLoggedIn ? (
          <>
            <Link to="/cart" className="nav-link">
              <FaShoppingCart className="icon" />
            </Link>
            <div className="nav-profile">
              <FaUser className="profile-icon" />
              <p>{username}</p>
              <button
                className={`nav-dropdown-button ${isRotated ? "rotated" : ""}`}
                onClick={toggleDropdown}
              >
                <FaAngleUp />
              </button>
              {dropdownOpen && (
                <div className="nav-dropdown">
                  <Link to="/profile" className="nav-dropdown-link">
                    Profil
                  </Link>
                  <Link to="/inbox" className="nav-dropdown-link">
                    Pesan Masuk
                  </Link>
                  <button className="nav-dropdown-link" onClick={handleLogout}>
                    Keluar
                  </button>
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            <Link to="/signin" className="nav-link">
              <FaShoppingCart className="icon" />
            </Link>
            <Link to="/signin" className="nav-button">
              Masuk
            </Link>
            <Link to="/signup" className="nav-button">
              Daftar
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default Navbar;
