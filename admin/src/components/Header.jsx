import { FiLogOut } from "react-icons/fi";
import { useUser } from "../userContext";

const Header = () => {
  const {user, logoutUser} = useUser(); // Import global user state and functions

  const handleLogout = () => {
    logoutUser(); // Call the logout function from GlobalVars
  };
  return (
    <div className="d-flex flex-column justify-content-end m-2 px-4">
      <div className="d-flex justify-content-end m-2 px-4">
        {user && (
          <button
            className="btn btn-light text-danger border"
            onClick={handleLogout}
          >
            <FiLogOut className="me-1" /> Log out
          </button>
        )}
      </div>
      {/* underline */}
      <div
        className="bg-light"
        style={{ borderBottom: "1px solid #dee2e6" }}
      ></div>
    </div>
  );
};

export default Header;
