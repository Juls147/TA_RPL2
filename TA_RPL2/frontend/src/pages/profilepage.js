import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaUserGear, FaUserXmark, FaUser } from "react-icons/fa6";
import axios from "axios";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.css";
import { jwtDecode } from "jwt-decode";
import { useAuth } from "../components/authcontext";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const ProfilePage = () => {
  const [activeMenu, setActiveMenu] = useState("accountSettings");
  const [userData, setUserData] = useState({
    username: "",
    email: "",
    phone: "",
    location: "",
    password: "",
    confirmPassword: "",
    userType: "",
    userId: "",
  });
  const navigate = useNavigate();
  const { token } = useAuth();

  useEffect(() => {
    if (token) {
      const decodedToken = jwtDecode(token);
      setUserData((prevState) => ({
        ...prevState,
        userId: decodedToken.userId,
      }));
    }
  }, [token]);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/api/users/user/getuser/${userData.userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = response.data;
        setUserData((prevState) => ({
          ...prevState,
          username: data.username,
          email: data.email,
          phone: data.no_hp,
          location: data.location,
          userType: data.userType,
        }));
      } catch (error) {
        console.error("Error fetching user profile:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Terjadi kesalahan saat mengambil data profil.",
          showConfirmButton: false,
          timer: 1500,
        });
      }
    };

    if (userData.userId) {
      fetchUserProfile();
    }
  }, [userData.userId, token]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSave = async () => {
    if (userData.password !== userData.confirmPassword) {
      Swal.fire({
        icon: "error",
        title: "Passwords do not match",
        text: "Password dan konfirmasi password tidak cocok.",
        showConfirmButton: false,
        timer: 1500,
      });
      return;
    }

    try {
      await axios.put(
        `${API_BASE_URL}/api/users/${userData.userId}`,
        {
          username: userData.username,
          email: userData.email,
          no_hp: userData.phone,
          location: userData.location,
          password: userData.password,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setUserData((prevState) => ({
        ...prevState,
        password: "",
        confirmPassword: "",
      }));

      Swal.fire({
        icon: "success",
        title: "Perubahan Berhasil Disimpan",
        text: "Perubahan informasi akun berhasil disimpan.",
        showConfirmButton: false,
        timer: 1500,
      });
    } catch (error) {
      console.error("Error updating user:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Terjadi kesalahan saat menyimpan perubahan.",
        showConfirmButton: false,
        timer: 1500,
      });
    }
  };

  const handleDeleteUser = async () => {
    try {
      const result = await Swal.fire({
        icon: "warning",
        title: "Hapus Akun",
        text: "Apakah Anda yakin ingin menghapus akun ini?",
        showCancelButton: true,
        confirmButtonText: "Hapus",
        cancelButtonText: "Batal",
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
      });
      if (result.isConfirmed) {
        await axios.delete(`${API_BASE_URL}/api/users/${userData.userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        await Swal.fire({
          icon: "success",
          title: "Akun Berhasil Dihapus",
          text: "Akun berhasil dihapus.",
          showConfirmButton: false,
          timer: 1500,
        });
        navigate("/");
        window.location.reload();
      } else {
        await Swal.fire({
          icon: "info",
          title: "Dibatalkan",
          text: "Penghapusan akun dibatalkan.",
          showConfirmButton: false,
          timer: 1500,
        });
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Terjadi kesalahan saat menghapus akun.",
        showConfirmButton: false,
        timer: 1500,
      });
    }
  };

  const renderAccountSettings = () => (
    <div className="container-profile">
      <div className="settings-content">
        <div className="settings-form">
          <h3>Pengaturan Akun</h3>
          <h5>Informasi Pribadi</h5>
          <div className="form-group">
            <label>Username</label>
            <input
              type="text"
              name="username"
              value={userData.username}
              onChange={handleInputChange}
              placeholder="Username"
            />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={userData.email}
              onChange={handleInputChange}
              placeholder="Email"
            />
          </div>
          <div className="form-group">
            <label>No. HP</label>
            <input
              type="tel"
              name="phone"
              value={userData.phone}
              onChange={handleInputChange}
              placeholder="No. HP"
            />
          </div>
          <div className="form-group">
            <label>Lokasi</label>
            <input
              type="text"
              name="location"
              value={userData.location}
              onChange={handleInputChange}
              placeholder="Lokasi"
            />
          </div>
          <div className="action-buttons">
            <button className="cancel-button">Cancel</button>
            <button className="save-button" onClick={handleSave}>
              Save
            </button>
          </div>
        </div>

        <div className="settings-form">
          <h3>Pengaturan Password</h3>
          <h5>Informasi Password</h5>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={userData.password}
              onChange={handleInputChange}
              placeholder="Password"
            />
          </div>
          <div className="form-group">
            <label>Konfirmasi Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={userData.confirmPassword}
              onChange={handleInputChange}
              placeholder="Konfirmasi Password"
            />
          </div>
          <div className="action-buttons">
            <button className="cancel-button">Cancel</button>
            <button className="save-button" onClick={handleSave}>
              Save
            </button>
          </div>
        </div>
      </div>

      <div className="profile-image-content">
        <FaUser className="profile-icons" />
        <h6>{userData.username}</h6>
        <p>{userData.userType}</p>
      </div>
    </div>
  );

  return (
    <div className="profile-page">
      <div className="profile-page-section">
        <div className="settings-menu">
          <h4>Pengaturan</h4>
          <ul>
            <li
              className={activeMenu === "accountSettings" ? "active" : ""}
              onClick={() => setActiveMenu("accountSettings")}
            >
              <FaUserGear />
              Pengaturan Akun
            </li>
            <li className="delete-user" onClick={handleDeleteUser}>
              <FaUserXmark />
              Hapus Akun
            </li>
          </ul>
        </div>
        <div className="profile-details">
          {activeMenu === "accountSettings" && renderAccountSettings()}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
