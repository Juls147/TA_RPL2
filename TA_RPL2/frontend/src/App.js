import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Outlet,
} from "react-router-dom";
import { Helmet } from "react-helmet";
import LandingPage from "./pages/landingpage";
import CheckOrderPage from "./pages/checkorderpage";
import ProductsPage from "./pages/productpage";
import AboutPage from "./pages/aboutpage";
import SignInPage from "./pages/signinpage";
import SignUpPage from "./pages/signuppage";
import CartPage from "./pages/cartpage";
import ProfilePage from "./pages/profilepage";
import NotificationPage from "./pages/notificationpage";
import AdminPage from "./pages/adminpage";
import Navbar from "./components/navbar";
import Footer from "./components/footer";
import { CartProvider } from "./components/cartcontext";
import { AuthProvider } from "./components/authcontext";
import GlobalStyle from "./styles/globalstyle";

const App = () => {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <GlobalStyle />
          <Routes>
            <Route path="/" element={<LayoutWithNavAndFooter />}>
              <Route index element={<LandingPage />} />
              <Route path="cek-pesanan" element={<CheckOrderPage />} />
              <Route path="products" element={<ProductsPage />} />
              <Route path="about" element={<AboutPage />} />
              <Route path="cart" element={<CartPage />} />
              <Route path="profile" element={<ProfilePage />} />
              <Route path="inbox" element={<NotificationPage />} />
            </Route>
            <Route path="/signin" element={<SignInPage />} />
            <Route path="/signup" element={<SignUpPage />} />
            <Route path="/admin" element={<AdminPage />} />
          </Routes>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
};

const LayoutWithNavAndFooter = () => (
  <>
    <Helmet>
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap"
      />
    </Helmet>
    <Navbar />
    <Outlet />
    <Footer />
  </>
);

export default App;
