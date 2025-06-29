import React, { useState } from "react";
import { FaGoogle, FaFacebookF, FaTwitter } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";
import { userLogin } from "../apis/user";
import useGlobalVars from "../UserContext";
import { useNavigate, Link } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const { updateUser } = useGlobalVars();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }

    try {
      const response = await userLogin({ Email: email, Password: password });

      if (response && response.token && response.user) {
        localStorage.setItem("token", response.token);
        localStorage.setItem("user", JSON.stringify(response.user));
        updateUser(response.user);
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
      <div className="card shadow p-4" style={{ width: "600px" }}>
        <img
          src="images/Logo.png"
          alt="Logo"
          className="mx-auto mb-3"
          style={{ width: "160px", height: "50px" }}
        />
        <h5 className="text-center mt-2">Welcome to Navomin Super</h5>
        <p className="text-center text-muted">Sign in to place orders...</p>

        {error && <div className="alert alert-danger">{error}</div>}

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

          <button type="submit" className="btn btn-primary w-100">
            Login
          </button>
        </form>

        <div className="text-center mt-2">
          <a href="#" className="text-decoration-none">
            Forgot Password?
          </a>
        </div>

        <div className="text-center mt-3">
          <small>Not registered yet?</small>{" "}
          <Link to="/signup" className="text-primary text-decoration-none">
            Sign Up
          </Link>
        </div>

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
