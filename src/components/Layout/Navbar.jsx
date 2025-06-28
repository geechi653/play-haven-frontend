import { Link, useLocation } from "react-router-dom";
import "./Navbar.css";
import { TbBooks } from "react-icons/tb";
import { IoCartOutline } from "react-icons/io5";
import { FaRegHeart } from "react-icons/fa6";
import { IoSearch } from "react-icons/io5";

function Navbar() {
  const location = useLocation();
  const isSignUpPage = location.pathname === "/signup";
  const isLoginPage = location.pathname === "/login";

  return (
    <nav className="playheaven-navbar navbar navbar-expand-lg navbar-dark sticky-top">
      <div className="container-fluid px-4">
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
          <div
            className={`playheaven-nav-container d-flex w-100 ${
              isSignUpPage || isLoginPage
                ? "justify-content-end"
                : "justify-content-start"
            }`}
          >
            <ul className="navbar-nav d-flex">
              <li className="nav-item playheaven-nav-item">
                <Link className="nav-link playheaven-nav-link" to="/store">
                  Store
                </Link>
              </li>
              <li className="nav-item playheaven-nav-item">
                <Link className="nav-link playheaven-nav-link" to="/news">
                  News
                </Link>
              </li>
              <li className="nav-item playheaven-nav-item">
                <Link className="nav-link playheaven-nav-link" to="/about">
                  About
                </Link>
              </li>
            </ul>

            {!isSignUpPage && !isLoginPage && (
              <div className="flex-fill d-flex justify-content-end align-items-center">
                <Link
                  to="/store"
                  className="playheaven-icon-btn text-decoration-none"
                  data-bs-toggle="tooltip"
                  data-bs-placement="bottom"
                  title="Search"
                >
                  <IoSearch />
                </Link>
                <Link
                  to="/wishlist"
                  className="playheaven-icon-btn text-decoration-none"
                  data-bs-toggle="tooltip"
                  data-bs-placement="bottom"
                  title="Wishlist"
                >
                  <FaRegHeart />
                </Link>

                <Link
                  to="/cart"
                  className="playheaven-icon-btn text-decoration-none"
                  data-bs-toggle="tooltip"
                  data-bs-placement="bottom"
                  title="Cart"
                >
                  <IoCartOutline />
                </Link>

                <Link
                  to="/libraryPage"
                  className="playheaven-icon-btn playheaven-library-btn text-decoration-none"
                  data-bs-toggle="tooltip"
                  data-bs-placement="bottom"
                  title="Library"
                >
                  <TbBooks />
                </Link>

                <div className="nav-item dropdown">
                  <a
                    className="nav-link dropdown-toggle d-flex align-items-center"
                    data-bs-toggle="dropdown"
                    role="button"
                    aria-expanded="false"
                  >
                    <div className="playheaven-avatar"></div>
                    <span className="playheaven-username">PlayerOne</span>
                  </a>
                  <ul className="dropdown-menu">
                    <li>
                      <Link className="dropdown-item" to="/profile">
                        My Profile
                      </Link>
                    </li>
                    <li>
                      <hr className="dropdown-divider" />
                    </li>
                    <li>
                      <Link className="dropdown-item" to="#">
                        Logout
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
