import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../components/authcontext";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.css";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const SignInPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSignIn = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_BASE_URL}/api/users/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });
      const data = await response.json();
      if (response.ok) {
        await fetch(`${API_BASE_URL}/api/recommend/recommends`, {
          method: "GET",
        });
        login({
          token: data.token,
          username: username,
          userType: data.userType,
        });
        Swal.fire({
          icon: "success",
          title: "Login Berhasil!",
          text: "Selamat datang kembali!",
        }).then((result) => {
          if (data.userType === "admin") {
            navigate("/admin");
          } else {
            navigate("/");
          }
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Login Gagal!",
          text: data.error,
        });
      }
    } catch (error) {
      console.error("Error during login:", error);
      Swal.fire({
        icon: "error",
        title: "Server Error",
        text: "Terjadi kesalahan di server. Silakan coba lagi nanti.",
      });
    }
  };

  return (
    <div className="signin-page">
      <section className="section-signin">
        <h3>Masuk</h3>
        <p>Selamat datang kembali! Silahkan masuk ke akun anda.</p>
        <form className="form" onSubmit={handleSignIn}>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              placeholder="Username"
              className="input"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Kata Sandi</label>
            <input
              type="password"
              id="password"
              placeholder="Password"
              className="input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button type="submit" className="button">
            Masuk
          </button>
        </form>
        <p>
          Pengguna baru? <Link to="/signup">Daftar</Link>
        </p>
      </section>
    </div>
  );
};

export default SignInPage;
