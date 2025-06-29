import { FaEnvelope } from "react-icons/fa";

const Footer = () => (
  <footer className="bg-light text-center p-4 mt-5">
    <img
      src="/images/Logo.png"
      alt="Logo"
      className="mb-3"
      style={{ height: "80px" }}
    />

    <h4 className="fw-bold">Subscribe to our newsletter</h4>

    <div className="d-flex justify-content-center my-3">
      <div className="input-group mb-3 w-50">
        <span className="input-group-text">
          <FaEnvelope />
        </span>
        <input
          type="text"
          className="form-control"
          placeholder="Input Your Email"
          aria-label="Input Your Email"
          aria-describedby="button-addon2"
        />
        <button className="btn btn-primary" type="button" id="button-addon2">
          Subscribe
        </button>
      </div>
    </div>

    <div className="container w-25">
      <div className="row mt-4">
        <div className="col-md-6">
          <h5 className="fw-bold">Product</h5>
          <p>Features</p>
          <p>Pricing</p>
        </div>
        <div className="col-md-6">
          <h5 className="fw-bold">Company</h5>
          <p>About us</p>
          <p>Contact us</p>
        </div>
      </div>
    </div>

    <div className="mt-4">
      <small className="text-dark fs-6">
        © 2024 Brand, Inc. • 
        <a href="#" className="text-dark text-decoration-none"> Privacy</a> • 
        <a href="#" className="text-dark text-decoration-none"> Terms</a> • 
        <a href="#" className="text-dark text-decoration-none"> Sitemap</a>
      </small>
    </div>
  </footer>
);

export default Footer;
