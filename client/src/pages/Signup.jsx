import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Container, Row, Col, Form, Button, Alert, Spinner } from "react-bootstrap";
import { FaFacebook, FaTwitter, FaGoogle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { userRegister } from "../apis/user";

const SignUp = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
    setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

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

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

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
        setTimeout(() => navigate("/login"), 2000);
      } else {
        setError("Registration failed. Please try again.");
      }
    } catch (err) {
      setError("Server error. Please try again later.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="vh-100 d-flex flex-column justify-content-center align-items-center">
      <img
        src="images/Logo.png"
        alt="Logo"
        className="mx-auto mb-3"
        style={{ width: "160px", height: "50px" }}
      />

      <div className="position-absolute top-0 end-0 m-3">
        <Button variant="outline-primary" onClick={() => navigate("/login")}>
          Login
        </Button>
      </div>

      <h4 className="fw-bold mt-3">Create a new Account!</h4>
      <p className="text-muted">Sign up to access exclusive features.</p>

      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}

      <Form className="w-75" onSubmit={handleSubmit}>
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

        <div className="text-center mt-4">
          <Button variant="primary" size="lg" type="submit" disabled={loading}>
            {loading ? <Spinner animation="border" size="sm" /> : "Create Account"}
          </Button>
        </div>

        <div className="text-center mt-3">
          <FaFacebook size={24} className="me-3 text-primary" />
          <FaTwitter size={24} className="me-3 text-info" />
          <FaGoogle size={24} className="text-danger" />
        </div>
      </Form>

      <p className="text-muted mt-4">
        Made with <span className="fw-bold">Visily</span>
      </p>
    </Container>
  );
};

export default SignUp;
