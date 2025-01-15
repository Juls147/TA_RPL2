import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../components/authcontext";
import { MdDashboard, MdCategory } from "react-icons/md";
import {
  FaBox,
  FaThumbsUp,
  FaShoppingCart,
  FaUser,
  FaCog,
  FaSignOutAlt,
} from "react-icons/fa";
import DashboardMenu from "../components/menu-sidebar/dashboardmenu";
import CategoryMenu from "../components/menu-sidebar/categorymenu";
import ProductMenu from "../components/menu-sidebar/productmenu";
import OrderMenu from "../components/menu-sidebar/ordermenu";
import UserMenu from "../components/menu-sidebar/usermenu";
import SettingMenu from "../components/menu-sidebar/settingmenu";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.css";

const AdminPage = () => {
  const { logout } = useAuth();
  const [activeMenu, setActiveMenu] = useState("dasbor");

  const navigate = useNavigate();

  const handleMenuClick = (menu) => setActiveMenu(menu);

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
        window.location.reload();
      }
    });
  };

  const icons = {
    dasbor: <MdDashboard />,
    kategori: <MdCategory />,
    produk: <FaBox />,
    rekomen: <FaThumbsUp />,
    pesanan: <FaShoppingCart />,
    pengguna: <FaUser />,
    pengaturan: <FaCog />,
    logout: <FaSignOutAlt style={{ transform: "rotate(180deg)" }} />,
  };

  return (
    <div className="container-adminpage">
      <div className="sidebar">
        <div className="sidebar-menu">
          <h3>Huzi Store</h3>
          {[
            "dasbor",
            "kategori",
            "produk",
            "pesanan",
            "pengguna",
            "pengaturan",
          ].map((menu) => (
            <div
              key={menu}
              className={`menu-item ${activeMenu === menu ? "active" : ""}`}
              onClick={() => handleMenuClick(menu)}
            >
              {icons[menu]} {menu.charAt(0).toUpperCase() + menu.slice(1)}
            </div>
          ))}
        </div>
        <button className="button-logout" onClick={handleLogout}>
          {icons.logout} Keluar
        </button>
      </div>

      {activeMenu === "dasbor" && (
        <>
          <DashboardMenu />
        </>
      )}

      {activeMenu === "kategori" && (
        <>
          <CategoryMenu />
        </>
      )}

      {activeMenu === "produk" && (
        <>
          <ProductMenu />
        </>
      )}

      {activeMenu === "pesanan" && (
        <>
          <OrderMenu />
        </>
      )}

      {activeMenu === "pengguna" && (
        <>
          <UserMenu />
        </>
      )}

      {activeMenu === "pengaturan" && (
        <>
          <SettingMenu />
        </>
      )}
    </div>
  );
};

export default AdminPage;
