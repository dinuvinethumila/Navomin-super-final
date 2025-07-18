import { useState, useEffect } from "react";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import { getAuthHeaders } from "../apis/utils.js";
import axios from "axios";
import { API_URL } from "../constant.js";
import useGlobalVars from "../UserContext";

const Profile = () => {
  // State to hold user profile data
  const [userData, setUserData] = useState({
    First_Name: "",
    Last_Name: "",
    Email: "",
    Phone_Number: "",
    Password: "", // password field for update only (not fetched)
  });

  const [message, setMessage] = useState(""); // success message
  const [error, setError] = useState("");     // error message

  const { updateUser } = useGlobalVars(); // function to update global user context

  // Fetch user profile data when component mounts
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(`${API_URL}/user/me`, {
          headers: getAuthHeaders(),
        });
        // Set user data, but exclude password for security
        setUserData({ ...response.data, Password: "" });
      } catch (err) {
        console.error(err);
        setError("Failed to load profile.");
      }
    };

    fetchProfile();
  }, []);

  // Update form values in state when input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
    setError("");
    setMessage("");
  };

  // Handle form submission to update profile
  const handleSubmit = async (e) => {
    e.preventDefault(); // prevent page reload
    setError("");
    setMessage("");

    try {
      const updateData = { ...userData };
      if (!updateData.Password) delete updateData.Password; // if password left blank, don't send

      await axios.put(`${API_URL}/user/me`, updateData, {
        headers: getAuthHeaders(),
      });

      // Save updated data in localStorage and global context
      localStorage.setItem("user", JSON.stringify(updateData));
      updateUser({ ...updateData, Password: "" });

      setMessage("Profile updated successfully!");
      setUserData((prev) => ({ ...prev, Password: "" })); // clear password input
    } catch (err) {
      console.error(err);
      setError("Failed to update profile.");
    }
  };

  return (
    <>
      <Navbar />
      <div className="container mt-5" style={{ maxWidth: 600 }}>
        <h2>Your Profile</h2>

        {/* Success or error messages */}
        {message && <div className="alert alert-success">{message}</div>}
        {error && <div className="alert alert-danger">{error}</div>}

        {/* Profile update form */}
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label>First Name</label>
            <input
              type="text"
              name="First_Name"
              className="form-control"
              value={userData.First_Name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label>Last Name</label>
            <input
              type="text"
              name="Last_Name"
              className="form-control"
              value={userData.Last_Name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label>Email</label>
            <input
              type="email"
              name="Email"
              className="form-control"
              value={userData.Email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label>Phone Number</label>
            <input
              type="text"
              name="Phone_Number"
              className="form-control"
              value={userData.Phone_Number}
              onChange={handleChange}
            />
          </div>

          <div className="mb-3">
            <label>Change Password (optional)</label>
            <input
              type="password"
              name="Password"
              className="form-control"
              value={userData.Password}
              onChange={handleChange}
              placeholder="Leave blank to keep current"
            />
          </div>

          {/* Submit button */}
          <button type="submit" className="btn btn-primary">
            Update Profile
          </button>
        </form>
      </div>
      <Footer />
    </>
  );
};

export default Profile;
