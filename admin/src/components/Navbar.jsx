import React, { useCallback } from "react";
import { FiMenu } from "react-icons/fi";
import { FaShoppingCart, FaCog } from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const user = {
    name: "Amanda",
    profilePic: "images/profile.jpg",
    isLoggedIn: false,
  };

  const handleNavigation = useCallback((path) => {
    navigate(path);
  }, [navigate]);

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm py-2 px-3">
      <div className="container-fluid">
        {/* Toggle Button */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <FiMenu className="fs-3" />
        </button>

        {/* Logo */}
        <a className="navbar-brand fw-bold ms-3 d-flex align-items-center" href="/">
          <img
            src="images/Logo.png"
            alt="Logo"
            className="me-2"
            style={{ width: "140px", height: "60px" }}
          />
        </a>

        {/* Navigation Links */}
        <div className="collapse navbar-collapse justify-content-center" id="navbarNav">
          <ul className="navbar-nav">
            {[
              { name: "Home", path: "/" },
              { name: "Products", path: "/product" },
              { name: "Pre-Order Bakery", path: "/preorderbakery" },
              { name: "My Orders", path: "/myorders" },
            ].map((item) => (
              <li className="nav-item" key={item.path}>
                <button
                  className={`nav-link fw-semibold border-0 bg-transparent ${
                    location.pathname === item.path
                      ? "text-primary border-bottom border-primary fw-bold"
                      : ""
                  }`}
                  onClick={() => handleNavigation(item.path)}
                  style={{ cursor: "pointer" }}
                >
                  {item.name}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* User & Cart Section */}
        <div className="d-flex align-items-center">
          {user.isLoggedIn ? (
            <div className="d-flex align-items-center">
              {/* Profile Image */}
              <div
                className="position-relative d-flex align-items-center"
                onClick={() => handleNavigation("/profile")}
                style={{ cursor: "pointer" }}
              >
                <img
                  src={user.profilePic}
                  alt="Profile"
                  className="rounded-circle me-2"
                  style={{ width: "40px", height: "40px" }}
                />
                <span
                  className="position-absolute"
                  style={{
                    width: "12px",
                    height: "12px",
                    backgroundColor: "red",
                    borderRadius: "50%",
                    bottom: "2px",
                    right: "5px",
                    border: "2px solid white",
                  }}
                ></span>
              </div>

              {/* Profile Info */}
              <div
                className="d-flex flex-column me-3"
                onClick={() => handleNavigation("/profile")}
                style={{ cursor: "pointer" }}
              >
                <span className="fw-bold">{user.name}</span>
                <span className="text-success" style={{ fontSize: "12px" }}>
                  View profile
                </span>
              </div>

              {/* Settings Icon */}
              <button className="btn me-2" onClick={() => handleNavigation("/settings")}>
                <FaCog className="fs-5 text-dark" />
              </button>

              {/* Logout Button */}
              <button className="btn btn-light text-danger border border-danger py-1">
                Log out
              </button>
            </div>
          ) : (
            <button
              className="btn btn-primary me-3 py-1"
              onClick={() => handleNavigation("/login")}
            >
              Login/Signup
            </button>
          )}

          {/* Cart Icon */}
          <div
            className="position-relative"
            style={{ cursor: "pointer" }}
            onClick={() => handleNavigation("/shoppingcart")}
          >
            <FaShoppingCart
              className={`fs-4 ms-3 ${
                location.pathname === "/shoppingcart"
                  ? "text-primary fw-bold"
                  : "text-dark"
              }`}
            />
            
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
