/* eslint-disable no-unused-vars */
import React, { useCallback } from "react";
import { FiMenu } from "react-icons/fi"; // Menu icon
import { FaShoppingCart, FaCog } from "react-icons/fa"; // Cart and Settings icons
import { useNavigate, useLocation } from "react-router-dom"; //For navigation and active route tracking
import useGlobalVars from "../UserContext";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  

  const {user, logoutUser} = useGlobalVars();
  // Navigate to a new path when a nav item is clicked
  const handleNavigation = useCallback(
    (path) => {
      navigate(path);
    },
    [navigate]
  );
 // Handles user logout
  const handleLogout = () => {
    logoutUser(); // Call the logout function from GlobalVars
  };

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
        <a
          className="navbar-brand fw-bold ms-3 d-flex align-items-center"
          href="/"
        >
          <img
            src="images/Logo.png"
            alt="Logo"
            className="me-2"
            style={{ width: "150px", height: "40px" }}
          />
        </a>

        {/* Navigation Links */}
        <div
          className="collapse navbar-collapse justify-content-center"
          id="navbarNav"
        >
          <ul className="navbar-nav">
            {[
              { name: "HOME", path: "/" },
              // { name: "Products", path: "/products" },
              { name: "PRE-ORDER BAKERY", path: "/preorderbakery" },
              { name: "MY ORDERS", path: "/myorders" },
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
          {user ? (
            <div className="d-flex align-items-center">
              {/* Profile Image */}
              <div
                className="position-relative d-flex align-items-center"
                onClick={() => handleNavigation("/profile")}
                style={{ cursor: "pointer" }}
              >
                <img
                  src={"https://i.imgur.com/GPee7gF.jpg"} //placeholder for profile pic
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

              {/*user Profile Info */}
              <div
                className="d-flex flex-column me-3"
                onClick={() => handleNavigation("/profile")}
                style={{ cursor: "pointer" }}
              >
                <span className="fw-bold">{user.First_Name}</span>
                <span className="text-success" style={{ fontSize: "12px" }}>
                  View profile
                </span>
              </div>

              

              {/* Logout Button */}
              <button
                className="btn btn-light text-danger border border-danger py-1"
                onClick={handleLogout}
              >
                Log out
              </button>
            </div>
          ) : (

            // If not logged in, show login button 
            <button
              className="btn btn-primary me-3 py-1"
              onClick={() => handleNavigation("/login")}
            >
              Login
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
