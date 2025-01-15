import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../authcontext";
import { FaPlus, FaUser } from "react-icons/fa";
import { jwtDecode } from "jwt-decode";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.css";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const SettingMenu = () => {
  const { username } = useAuth();
  const [token, setToken] = useState("");
  const [users, setUsers] = useState([]);
  const [uname, setUname] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [userType, setUserType] = useState("");

  const [country, setCountry] = useState("");
  const [province, setProvince] = useState("");
  const [regency, setRegency] = useState("");
  const [subdistrict, setSubdistrict] = useState("");
  const [village, setVillage] = useState("");
  const [road, setRoad] = useState("");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [userId, setUserId] = useState("");

  useEffect(() => {
    const authToken = localStorage.getItem("token");
    setToken(authToken);

    const decodedToken = decodeToken(authToken);
    if (decodedToken) {
      setUserId(decodedToken.userId);
    }
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

  const decodeToken = (token) => {
    try {
      return jwtDecode(token);
    } catch (error) {
      console.error("Error decoding token:", error);
      return null;
    }
  };

  useEffect(() => {
    if (userId !== "") {
      fetchProfile();
    }
  }, [userId]);

  const fetchProfile = async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/users/user/getuser/${userId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const userData = response.data;
      setUname(userData.username);
      setEmail(userData.email);
      setPhone(userData.no_hp);
      setUserType(userData.userType);
      const locationParts = userData.location.split(", ");
      setRoad(locationParts[0]);
      setVillage(locationParts[1]);
      setSubdistrict(locationParts[2]);
      setRegency(locationParts[3]);
      setProvince(locationParts[4]);
      setCountry(locationParts[5]);
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };

  const handleSave = async () => {
    if (password !== confirmPassword) {
      Swal.fire({
        icon: "error",
        title: "Password Tidak Cocok",
        text: "Password dan konfirmasi password tidak cocok.",
      });
      return;
    }

    const fullLocation = `${road}, ${village}, ${subdistrict}, ${regency}, ${province}, ${country}`;

    try {
      const response = await axios.put(
        `${API_BASE_URL}/api/users/${userId}`,
        {
          uname,
          email,
          no_hp: phone,
          userType,
          location: fullLocation,
          password,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPassword("");
      setConfirmPassword("");
      Swal.fire({
        icon: "success",
        title: "Update Berhasil",
        text: "Informasi akun berhasil diperbarui.",
        showConfirmButton: false,
        timer: 1000,
      });
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  const icons = {
    add: <FaPlus />,
  };

  return (
    <>
      <div className="main-content">
        <div className="header">
          <div className="search-bars"></div>
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
        <div className="container-profile">
          <div className="profile-image-content">
            <FaUser
              style={{
                fontSize: "2em",
                border: "1px solid white",
                borderRadius: "50%",
                height: "50px",
                width: "50px",
                padding: "5px",
              }}
            />
            <h6>{username}</h6>
            <p>{userType}</p>
          </div>

          <div className="settings-content">
            <div className="settings-form">
              <h3>Pengaturan Akun</h3>
              <h5>Informasi Pribadi</h5>
              <div className="form-groups">
                <label>Username</label>
                <input
                  type="text"
                  value={uname}
                  onChange={(e) => setUname(e.target.value)}
                  placeholder="Username"
                />
              </div>
              <div className="form-groups">
                <label>Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email"
                />
              </div>
              <div className="form-groups">
                <label>No. HP</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="No. HP"
                />
              </div>
              <div className="form-groups">
                <label>Tipe User</label>
                <input
                  type="text"
                  value={userType}
                  onChange={(e) => setUserType(e.target.value)}
                  placeholder="User Type"
                />
              </div>
              <div className="action-buttons">
                <button className="cancel-button">Cancel</button>
                <button className="save-button" onClick={handleSave}>
                  Update
                </button>
              </div>
            </div>

            <div className="settings-form">
              <h3>Pengaturan Password</h3>
              <h5>Informasi Password</h5>
              <div className="form-groups">
                <label>Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                />
              </div>
              <div className="form-groups">
                <label>Konfirmasi Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Konfirmasi Password"
                />
              </div>
              <div className="action-buttons">
                <button className="cancel-button">Cancel</button>
                <button className="save-button" onClick={handleSave}>
                  Update
                </button>
              </div>
            </div>
          </div>

          <div className="settings-content">
            <div className="settings-form">
              <h3>Pengaturan Lokasi</h3>
              <h5>Informasi Lokasi</h5>
              <div className="form-groups">
                <label>Negara</label>
                <input
                  type="text"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  placeholder="Negara"
                />
              </div>
              <div className="form-groups">
                <label>Provinsi</label>
                <input
                  type="text"
                  value={province}
                  onChange={(e) => setProvince(e.target.value)}
                  placeholder="Provinsi"
                />
              </div>
              <div className="form-groups">
                <label>Kabupaten</label>
                <input
                  type="text"
                  value={regency}
                  onChange={(e) => setRegency(e.target.value)}
                  placeholder="Kabupaten"
                />
              </div>
              <div className="form-groups">
                <label>Kecamatan</label>
                <input
                  type="text"
                  value={subdistrict}
                  onChange={(e) => setSubdistrict(e.target.value)}
                  placeholder="Kecamatan"
                />
              </div>
              <div className="form-groups">
                <label>Kelurahan</label>
                <input
                  type="text"
                  value={village}
                  onChange={(e) => setVillage(e.target.value)}
                  placeholder="Desa"
                />
              </div>
              <div className="form-groups">
                <label>Jalan</label>
                <input
                  type="text"
                  value={road}
                  onChange={(e) => setRoad(e.target.value)}
                  placeholder="Nama Jalan dan Nomor"
                />
              </div>
              <div className="action-buttons">
                <button className="cancel-button">Cancel</button>
                <button className="save-button" onClick={handleSave}>
                  Update
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SettingMenu;
