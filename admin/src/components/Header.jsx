// Import logout icon from react-icons
import { FiLogOut } from "react-icons/fi";

// Import user context to access user info and logout function
import { useUser } from "../userContext";

const Header = () => {
  // Destructure user object and logout function from global user context
  const { user, logoutUser } = useUser();

  // Function to handle logout action
  const handleLogout = () => {
    logoutUser(); // Trigger logout functionality
  };

  return (
    // Main header container, aligned to the right side
    <div className="d-flex flex-column justify-content-end m-2 px-4">
      <div className="d-flex justify-content-end m-2 px-4">
        {/* If a user is logged in, show the logout button */}
        {user && (
          <button
            className="btn btn-light text-danger border"
            onClick={handleLogout}
          >
            <FiLogOut className="me-1" /> {/* Logout icon */}
            Log out
          </button>
        )}
      </div>

      {/* Light gray underline to visually separate the header from content */}
      <div
        className="bg-light"
        style={{ borderBottom: "1px solid #dee2e6" }}
      ></div>
    </div>
  );
};

// Export the Header component so it can be used in other parts of the app
export default Header;
