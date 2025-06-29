import React, { useState } from "react";
import { FaGoogle, FaFacebookF, FaTwitter } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";
import { ownerLogin } from "../apis/owner";
import { useUser } from "../userContext"; // Corrected import

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const { updateUser } = useUser();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const credentials = { Email: email, Password: password };
      const response = await ownerLogin(credentials);

      if (response?.Owner_ID) {
        updateUser(response);
        navigate("/dashboard"); // Redirect to admin dashboard
      } else {
        setErrorMsg("Invalid credentials. Please try again.");
      }
    } catch (err) {
      console.error("Login error:", err);
      setErrorMsg("Login failed. Please try again later.");
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="card shadow p-4" style={{ width: "600px" }}>
        <img
          src="/images/Logo.png"
          alt="Logo"
          className="mx-auto mb-3"
          style={{ width: "160px", height: "50px" }}
        />
        <h5 className="text-center mt-2">Welcome, Admin</h5>
        <p className="text-center text-muted">Sign in to manage Navomin Super</p>

        {errorMsg && (
          <div className="alert alert-danger text-center py-1">{errorMsg}</div>
        )}

        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <input
              type="email"
              className="form-control"
              placeholder="Admin Email"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              required
            />
          </div>
          <div className="mb-3">
            <input
              type="password"
              className="form-control"
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary w-100">
            Login
          </button>
        </form>

        <div className="text-center mt-4">
          <FaGoogle className="text-primary fs-4 mx-2" />
          <FaFacebookF className="text-primary fs-4 mx-2" />
          <FaTwitter className="text-primary fs-4 mx-2" />
        </div>
      </div>
    </div>
  );
};

export default Login;
