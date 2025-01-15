import React from "react";
import { Link } from "react-router-dom";
import { FaFacebook, FaInstagram, FaWhatsapp } from "react-icons/fa";
import { FaEnvelope, FaLocationDot, FaPhone } from "react-icons/fa6";
import { useAuth } from "../components/authcontext";

const Footer = () => {
  const { isLoggedIn } = useAuth();

  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-logo">
          <h3>Huzi Store</h3>
          <p>
            Huzi Store adalah toko kelontong digital yang menyediakan kebutuhan
            sehari-hari, top-up game, saldo e-wallet, pulsa, paket data, serta
            bensin dan pelumas dengan layanan pengiriman cepat dan promosi
            menarik.
          </p>
        </div>
        <div className="footer-menu">
          <h5>Menu</h5>
          <Link to="/" className="footer-link">
            Beranda
          </Link>
          {isLoggedIn && (
            <Link to="/cek-pesanan" className="footer-link">
              Cek Pesanan
            </Link>
          )}
          <Link to="/products" className="footer-link">
            Produk
          </Link>
          <Link to="/about" className="footer-link">
            Tentang
          </Link>
        </div>
        <div className="footer-sosial">
          <h5>Sosial</h5>
          <a
            className="footer-link"
            href="https://www.facebook.com/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaFacebook />
            Facebook
          </a>
          <a
            className="footer-link"
            href="https://www.instagram.com/huzhiend/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaInstagram />
            Instagram
          </a>
          <a
            className="footer-link"
            href="https://api.whatsapp.com/send?phone=6283808488686"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaWhatsapp />
            Whatsapp
          </a>
        </div>
        <div className="footer-sosial">
          <h5>Kontak</h5>
          <a
            className="footer-link"
            href="mailto:huzistore@gmail.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaEnvelope />
            Email: huzistore@gmail.com
          </a>

          <a
            className="footer-link"
            href="https://www.google.com/maps/search/?api=1&query=Jl.%20Jomblo%20Itu%20Sudah%20Pasti%20No.%20123"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaLocationDot />
            Lokasi: Jl. Jomblo Itu Sudah Pasti No. 123
          </a>

          <a
            className="footer-link"
            href="https://api.whatsapp.com/send?phone=6283808488686"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaPhone />
            Telp: +62-838-0848-8686
          </a>
        </div>
      </div>
      <div className="footers">
        <p>&copy; 2024 Huzi Store. All rights reserved.</p>
        <p>Contact us: huzistore@gmail.com</p>
      </div>
    </footer>
  );
};

export default Footer;
