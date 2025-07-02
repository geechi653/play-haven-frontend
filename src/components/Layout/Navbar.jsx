import { Link, useLocation } from "react-router-dom";
import "./Navbar.css";
import { TbBooks } from "react-icons/tb";
import { IoCartOutline } from "react-icons/io5";
import { FaRegHeart } from "react-icons/fa6";
import { IoSearch } from "react-icons/io5";
import { useGlobalStore } from "../../hooks/useGlobalStore";
import { useNavigate } from "react-router-dom";
import { MdExpandMore } from "react-icons/md";

function Navbar() {
  const { store, dispatch } = useGlobalStore();
  const isUserLoggedIn = store.user && store.user.isAuthenticated;
  const username = isUserLoggedIn ? store.user.username : null;
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch({ type: "LOGOUT" });
    localStorage.removeItem("playheaven-store");
    navigate("/home");
  };

  return (
    <nav className="playheaven-navbar navbar navbar-expand-lg navbar-dark sticky-top">
      <div className="container-fluid px-4 d-flex justify-content-between align-items-center">
        <Link
          to="/home"
          className="navbar-brand d-flex align-items-center text-decoration-none"
        >
          <img
            src="/assets/play_heaven_logo (2).svg"
            alt="Play Heaven Logo"
            className="playheaven-logo-img"
          />
        </Link>

        <button
          className="navbar-toggler playheaven-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <div className="d-flex align-items-center gap-4 navbar-left-links">
            {isUserLoggedIn && (
              <div className="d-flex gap-4">
                <Link to="/store" className="login-button">
                  STORE
                </Link>
                <Link to="/news" className="login-button">
                  NEWS
                </Link>
                <Link to="/about" className="login-button">
                  ABOUT
                </Link>
              </div>
            )}
          </div>
          <div className="d-flex gap-2 ms-auto align-items-center">
            {!isUserLoggedIn && (
              <div className="d-flex gap-4">
                <Link to="/store" className="login-button">
                  STORE
                </Link>
                <Link to="/news" className="login-button">
                  NEWS
                </Link>
                <Link to="/about" className="login-button">
                  ABOUT
                </Link>
                <Link to="/login" className="login-button">
                  LOGIN
                </Link>
                <Link to="/signup" className="signup-button">
                  SIGNUP
                </Link>
              </div>
            )}
            {isUserLoggedIn && (
              <>
                <div className="d-flex justify-content-center align-items-center">
                  <Link
                    to="/store"
                    className="playheaven-icon-btn text-decoration-none"
                    title="Search"
                  >
                    <IoSearch />
                  </Link>
                  <Link
                    to="/wishlist"
                    className="playheaven-icon-btn text-decoration-none position-relative"
                    title="Wishlist"
                  >
                    <FaRegHeart />
                    {store.wishlist && store.wishlist.items && store.wishlist.items.length > 0 && (
                      <span style={{
                        position: 'absolute',
                        bottom: -4,
                        left: '50%',
                        transform: 'translateX(-50%)',
                        background: '#ef4444',
                        color: 'white',
                        borderRadius: '8px',
                        fontSize: '0.7em',
                        padding: '0 4px',
                        minWidth: '16px',
                        textAlign: 'center',
                        lineHeight: '16px',
                        fontWeight: 700,
                        zIndex: 2
                      }}>{store.wishlist.items.length}</span>
                    )}
                  </Link>
                  <Link
                    to="/cart"
                    className="playheaven-icon-btn text-decoration-none"
                    title="Cart"
                  >
                    <IoCartOutline />
                  </Link>
                  <Link
                    to="/libraryPage"
                    className="playheaven-icon-btn playheaven-library-btn text-decoration-none"
                    title="Library"
                  >
                    <TbBooks />
                  </Link>
                </div>
                <div className="d-flex justify-content-center align-items-center gap-3">
                  <div className="nav-item dropdown">
                    <a
                      className="nav-link d-flex align-items-center"
                      data-bs-toggle="dropdown"
                      role="button"
                      aria-expanded="false"
                    >
                      <span className="btn playheaven-username fs-6">
                        <div className="d-flex justify-content-center align-items-center">
                          <span className="fw-bolder">
                            {username || "Profile"}
                          </span>
                          <span>
                            <MdExpandMore className="fs-5 ms-1 fw-bolder" />
                          </span>
                        </div>
                      </span>
                    </a>
                    <ul className="dropdown-menu">
                      <li>
                        <Link
                          className="dropdown-item text-white"
                          to="/profile"
                        >
                          My Profile
                        </Link>
                      </li>
                      <li>
                        <hr className="dropdown-divider" />
                      </li>
                      <li>
                        <Link
                          className="dropdown-item text-white"
                          to="#"
                          onClick={handleLogout}
                        >
                          Logout
                        </Link>
                      </li>
                    </ul>
                  </div>
                  <img
                    className="playheaven-avatar"
                    src="https://picsum.photos/id/203/150/250"
                    alt="image"
                  />
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
