import React, { useState, useEffect } from "react";
import { FaTrashAlt, FaPlus, FaMinus } from "react-icons/fa";
import axios from "axios";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.css";
import { formatPrice } from "../components/utils";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [orderPlaced, setOrderPlaced] = useState(false);

  useEffect(() => {
    fetchCartItems();
  }, []);

  const fetchCartItems = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${API_BASE_URL}/api/cart`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCartItems(response.data.items);
    } catch (error) {
      console.error("Error fetching cart items:", error);
    }
  };

  const updateCartItemQuantity = async (id, newQuantity, stock) => {
    const token = localStorage.getItem("token");

    if (newQuantity > stock) {
      Swal.fire({
        icon: "warning",
        title: "Stok Tidak Cukup",
        text: "Jumlah produk yang diminta melebihi stok yang tersedia.",
      });
      return;
    }

    if (newQuantity === 0) {
      removeFromCart(id);
      return;
    }

    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/cart/updateQuantity`,
        { id, quantity: newQuantity },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const updatedItems = cartItems.map((item) =>
        item.id === id ? { ...item, quantity: response.data.quantity } : item
      );
      setCartItems(updatedItems);
    } catch (error) {
      console.error("Error updating cart item quantity:", error);
    }
  };

  const removeFromCart = async (id) => {
    const token = localStorage.getItem("token");
    try {
      await axios.post(
        `${API_BASE_URL}/api/cart/remove`,
        { id },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const updatedItems = cartItems.filter((item) => item.id !== id);
      setCartItems(updatedItems);

      const removedItem = cartItems.find((item) => item.id === id);
      Swal.fire({
        position: "top-end",
        html: `<span style="font-size: 14px; font-family: 'Poppins', sans-serif;">${removedItem.product.name} berhasil dihapus dari keranjang.</span>`,
        showConfirmButton: false,
        timer: 1000,
      });
    } catch (error) {
      console.error("Error removing cart item:", error);
    }
  };

  useEffect(() => {
    const total = cartItems.reduce(
      (acc, item) =>
        item.selected ? acc + item.product.price * item.quantity : acc,
      0
    );
    setTotalPrice(total);
  }, [cartItems]);

  const placeOrder = async () => {
    const token = localStorage.getItem("token");
    const selectedItems = cartItems.filter((item) => item.selected);

    if (selectedItems.length === 0) {
      Swal.fire({
        icon: "warning",
        title: "Peringatan",
        text: "Silakan pilih setidaknya satu item untuk memesan.",
      });
      return;
    }

    for (const item of selectedItems) {
      if (item.quantity > item.product.stock) {
        Swal.fire({
          icon: "warning",
          title: "Stok Tidak Cukup",
          text: `Stok produk ${item.product.name} tidak mencukupi. Tersedia: ${item.product.stock}, diminta: ${item.quantity}.`,
        });
        return;
      }
    }

    if (selectedItems.length === 0) {
      Swal.fire({
        icon: "warning",
        title: "Peringatan",
        text: "Silakan pilih setidaknya satu item untuk memesan.",
      });
      return;
    }

    try {
      const orderResponse = await axios.post(
        `${API_BASE_URL}/api/orders/`,
        { items: selectedItems },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const paymentResponse = await axios.post(
        `${API_BASE_URL}/api/payment`,
        { orderId: orderResponse.data.id },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const redirectUrl = paymentResponse.data.redirect_url;
      if (redirectUrl) {
        window.open(redirectUrl, "_blank");
      } else {
        console.error("Redirect URL is undefined");
      }

      setOrderPlaced(true);
    } catch (error) {
      console.error("Error placing order:", error);
    }
  };

  const handleSelectAll = (e) => {
    const selected = e.target.checked;
    const updatedItems = cartItems.map((item) => ({ ...item, selected }));
    setCartItems(updatedItems);
  };

  const handleSelectItem = (id) => {
    const updatedItems = cartItems.map((item) =>
      item.id === id ? { ...item, selected: !item.selected } : item
    );
    setCartItems(updatedItems);
  };

  return (
    <section className="section-cartpage">
      <div className="cartpage-border">
        <h3>Keranjang Belanja</h3>
        <div className="cart-content">
          <div className="cart-items">
            <div className="cart-item-all">
              <input
                type="checkbox"
                id="select-all"
                checked={cartItems.every((item) => item.selected)}
                onChange={handleSelectAll}
              />
              <label htmlFor="select-all" className="custom-checkbox"></label>
              <h5>Pilih Semua</h5>
            </div>
            {cartItems.map((item) => (
              <div key={item.id} className="cart-item">
                <div className="product-item">
                  <input
                    type="checkbox"
                    id={`checkbox-${item.id}`}
                    checked={item.selected}
                    onChange={() => handleSelectItem(item.id)}
                  />
                  <label
                    htmlFor={`checkbox-${item.id}`}
                    className="custom-checkbox"
                  ></label>
                </div>
                <div className="cart-edit">
                  <div className="cart-item-product">
                    <h5>{item.product.name}</h5>
                    <p>{item.product.description}</p>
                  </div>
                  <div className="cart-items-edit">
                    <p>Harga: Rp {formatPrice(parseInt(item.product.price))}</p>
                    <div className="cart-item-edit">
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="cart-item-edit-button"
                      >
                        <FaTrashAlt />
                      </button>
                      <div className="cart-item-edit-quantity">
                        <button
                          onClick={() =>
                            updateCartItemQuantity(
                              item.id,
                              item.quantity - 1,
                              item.product.stock
                            )
                          }
                        >
                          <FaMinus />
                        </button>
                        <p>{item.quantity}</p>
                        <button
                          onClick={() =>
                            updateCartItemQuantity(
                              item.id,
                              item.quantity + 1,
                              item.product.stock
                            )
                          }
                        >
                          <FaPlus />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="summary">
            <h5>Ringkasan Belanja</h5>
            <p>Total Harga: Rp {formatPrice(parseInt(totalPrice))}</p>
            <button onClick={placeOrder}>Beli</button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CartPage;
