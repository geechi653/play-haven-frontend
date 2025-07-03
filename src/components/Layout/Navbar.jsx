import { Link, useLocation } from "react-router-dom";
import "./Navbar.css";
import { TbBooks } from "react-icons/tb";
import { IoCartOutline } from "react-icons/io5";
import { FaRegHeart } from "react-icons/fa6";
import { IoSearch } from "react-icons/io5";
import { useGlobalStore } from "../../hooks/useGlobalStore";
import { useNavigate } from "react-router-dom";
import { MdExpandMore } from "react-icons/md";
import { useState, useEffect } from "react";
import { fetchUserCart } from "../../utils/api";

function Navbar() {
  const { store, dispatch } = useGlobalStore();
  const isUserLoggedIn = store.user && store.user.isAuthenticated;
  const username = isUserLoggedIn ? store.user.username : null;
  const navigate = useNavigate();
  const [cartItemCount, setCartItemCount] = useState(0);

  // Fetch cart count on mount and when user changes
  useEffect(() => {
    const fetchCartCount = async () => {
      if (isUserLoggedIn && store.user.userId && store.user.token) {
        try {
          const cartItems = await fetchUserCart(store.user.userId, store.user.token);
          setCartItemCount(cartItems.length);
        } catch (error) {
          console.error('Failed to fetch cart count:', error);
          setCartItemCount(0);
        }
      } else {
        setCartItemCount(0);
      }
    };

    fetchCartCount();
  }, [isUserLoggedIn, store.user.userId, store.user.token]);

  // Listen for cart updates
  useEffect(() => {
    const handleCartUpdate = (event) => {
      const { action } = event.detail;
      if (action === 'add') {
        setCartItemCount(prev => prev + 1);
      } else if (action === 'remove') {
        setCartItemCount(prev => Math.max(0, prev - 1));
      }
    };

    const handleCartCleared = async () => {
      // Refetch cart count from server to ensure accuracy
      await syncCartCount();
    };

    const handleCartSync = async () => {
      // Force sync cart count from server
      await syncCartCount();
    };

    window.addEventListener('cartUpdated', handleCartUpdate);
    window.addEventListener('cartCleared', handleCartCleared);
    window.addEventListener('cartSync', handleCartSync);
    
    return () => {
      window.removeEventListener('cartUpdated', handleCartUpdate);
      window.removeEventListener('cartCleared', handleCartCleared);
      window.removeEventListener('cartSync', handleCartSync);
    };
  }, [isUserLoggedIn, store.user.userId, store.user.token]);

  // Function to sync cart count with server
  const syncCartCount = async () => {
    if (isUserLoggedIn && store.user.userId && store.user.token) {
      try {
        const cartItems = await fetchUserCart(store.user.userId, store.user.token);
        setCartItemCount(cartItems.length);
        console.log('[DEBUG] Cart count synced:', cartItems.length);
      } catch (error) {
        console.error('Failed to sync cart count:', error);
        setCartItemCount(0);
      }
    } else {
      setCartItemCount(0);
    }
  };

  const handleLogout = () => {
    dispatch({ type: "LOGOUT" });
    localStorage.removeItem("playheaven-store");
    setCartItemCount(0); // Reset cart count on logout
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
            src="/assets/play_haven_logo_small.svg"
            alt="Play Haven Logo"
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
                    className="playheaven-icon-btn text-decoration-none"
                    title="Wishlist"
                  >
                    <FaRegHeart />
                    {store.wishlist &&
                      store.wishlist.items &&
                      store.wishlist.items.length > 0 && (
                        <span className="wishlist-badge">
                          {store.wishlist.items.length}
                        </span>
                      )}
                  </Link>
                  <Link
                    to="/cart"
                    className="playheaven-icon-btn text-decoration-none"
                    title="Cart"
                  >
                    <IoCartOutline />
                    {isUserLoggedIn && cartItemCount > 0 && (
                        <span className="notification-badge">
                          {cartItemCount}
                        </span>
                      )}
                  </Link>
                  <Link
                    to="/library"
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
                          <span>
                            {" "}
                            <img
                              className="playheaven-avatar"
                              src="https://picsum.photos/id/203/150/250"
                              alt="image"
                            />
                          </span>
                          <span className="fw-bolder">
                            {username || "Profile"}
                          </span>
                          <span>
                            <MdExpandMore className="fs-5 fw-bolder" />
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
