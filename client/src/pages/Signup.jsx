import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Container, Row, Col, Form, Button, Alert, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { userRegister } from "../apis/user";

const SignUp = () => {
  const navigate = useNavigate();

  // Initial state for the form fields
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
  });

  // State to manage error, success messages, and loading status
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  // Handles input changes for all form fields
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");      // Clear previous error when user types
    setSuccess("");    // Clear previous success message
  };

  // Handles form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation: check all fields
    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.email ||
      !formData.phoneNumber ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      setError("Please fill all the fields.");
      return;
    }

    // Check password match
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    // Construct payload to send to API
    const userPayload = {
      First_Name: formData.firstName,
      Last_Name: formData.lastName,
      Email: formData.email,
      Phone_Number: formData.phoneNumber,
      Password: formData.password,
    };

    setLoading(true);
    try {
      const response = await userRegister(userPayload);

      if (response) {
        setSuccess("Account created successfully! Redirecting to login...");
        // Redirect after a short delay
        setTimeout(() => navigate("/login"), 2000);
      } else {
        setError("Registration failed. Please try again.");
      }
    } catch (err) {
      console.error(err);
      setError("Server error. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="vh-100 d-flex flex-column justify-content-center align-items-center">
      {/* Logo */}
      <img
        src="images/Logo.png"
        alt="Logo"
        className="mx-auto mb-3"
        style={{ width: "160px", height: "50px" }}
      />

      {/* Top-right Login button */}
      <div className="position-absolute top-0 end-0 m-3">
        <Button variant="outline-primary" onClick={() => navigate("/login")}>
          Login
        </Button>
      </div>

      {/* Title & Subtext */}
      <h4 className="fw-bold mt-3">Create a new Account!</h4>
      <p className="text-muted">Sign up to access exclusive features.</p>

      {/* Error or Success message */}
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}

      {/* Signup form */}
      <Form className="w-75" onSubmit={handleSubmit}>
        {/* Name fields */}
        <Row className="mb-3">
          <Col md={6}>
            <Form.Label>First Name</Form.Label>
            <Form.Control
              type="text"
              name="firstName"
              placeholder="Dinuvi"
              value={formData.firstName}
              onChange={handleChange}
            />
          </Col>
          <Col md={6}>
            <Form.Label>Last Name</Form.Label>
            <Form.Control
              type="text"
              name="lastName"
              placeholder="Nethumila"
              value={formData.lastName}
              onChange={handleChange}
            />
          </Col>
        </Row>

        {/* Email & Phone */}
        <Row className="mb-3">
          <Col md={6}>
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              name="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
            />
          </Col>
          <Col md={6}>
            <Form.Label>Phone Number</Form.Label>
            <Form.Control
              type="text"
              name="phoneNumber"
              placeholder="+94"
              value={formData.phoneNumber}
              onChange={handleChange}
            />
          </Col>
        </Row>

        {/* Password fields */}
        <Row className="mb-3">
          <Col md={6}>
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
            />
          </Col>
          <Col md={6}>
            <Form.Label>Confirm Password</Form.Label>
            <Form.Control
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
            />
          </Col>
        </Row>

        {/* Submit button */}
        <div className="text-center mt-4">
          <Button variant="primary" size="lg" type="submit" disabled={loading}>
            {loading ? <Spinner animation="border" size="sm" /> : "Create Account"}
          </Button>
        </div>

        {/* Placeholder for social login icons (not active) */}
        <div className="text-center mt-3">
          {/* Icons removed as per instruction */}
        </div>
      </Form>

      {/* Footer note */}
      <p className="text-muted mt-4">
        Made with <span className="fw-bold">Visily</span>
      </p>
    </Container>
  );
};

export default SignUp;
