import React, { useState } from "react";
import { FaGoogle, FaFacebookF, FaTwitter } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";
import { userLogin } from "../apis/user";
import useGlobalVars from "../UserContext";
import { useNavigate, Link } from "react-router-dom";

const Login = () => {
    // State variables for email, password, and error handling
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const { updateUser } = useGlobalVars();
  const navigate = useNavigate();

  // Handle form submission and login
  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    // Check if both fields are filled
    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }

    try {
        // Call login API with email and password
      const response = await userLogin({ Email: email, Password: password });
  // If login is successful and returns token & user
      if (response && response.token && response.user) {
         // Save token and user data in localStorage
        localStorage.setItem("token", response.token);
        localStorage.setItem("user", JSON.stringify(response.user));

            // Update global user state
        updateUser(response.user);

         // Redirect to homepage
        navigate("/");
      } else {
        setError("Invalid credentials, please try again.");
      }
    } catch (err) {
      console.error("Login failed:", err);
      setError("Login failed. Please check your network or try again later.");
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
       {/* Login card */}
      <div className="card shadow p-4" style={{ width: "600px" }}>
          
                 {/* Logo */}
        <img
          src="images/Logo.png"
          alt="Logo"
          className="mx-auto mb-3"
          style={{ width: "160px", height: "50px" }}
        />

          {/* Heading */}
        <h5 className="text-center mt-2">Welcome to Navomin Super</h5>
        <p className="text-center text-muted">Sign in to place orders...</p>
   {/* Error message */}
        {error && <div className="alert alert-danger">{error}</div>}
 {/* Login form */}
        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <input
              type="email"
              className="form-control"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />
          </div>
          <div className="mb-3">
            <input
              type="password"
              className="form-control"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
          </div>
      {/* Submit button */}

          <button type="submit" className="btn btn-primary w-100">
            Login
          </button>
        </form>
     {/* Forgot password link */}
        <div className="text-center mt-2">
          <a href="#" className="text-decoration-none">
            Forgot Password?
          </a>
        </div>

     {/* Signup link */}
        <div className="text-center mt-3">
          <small>Not registered yet?</small>{" "}
          <Link to="/signup" className="text-primary text-decoration-none">
            Sign Up
          </Link>
        </div>
  {/* Social login icons */}
        <div className="d-flex justify-content-center gap-3 mt-4">
          <FaGoogle className="text-primary fs-4 cursor-pointer" />
          <FaFacebookF className="text-primary fs-4 cursor-pointer" />
          <FaTwitter className="text-primary fs-4 cursor-pointer" />
        </div>
      </div>
    </div>
  );
};

export default Login;
