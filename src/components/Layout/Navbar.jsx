 import { Link } from 'react-router';
import './Navbar.css';
import { TbBooks } from "react-icons/tb";
import { IoCartOutline } from "react-icons/io5";
import { FaRegHeart } from "react-icons/fa6";
import { IoSearch } from "react-icons/io5";


function Navbar() {
  return (
    <nav className="playheaven-navbar navbar navbar-expand-lg navbar-dark">
      <div className="container-fluid px-4">

        <a className="navbar-brand d-flex align-items-center" href="home">
          <span className="playheaven-logo">Logo</span>
        </a>

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
          <div className="playheaven-nav-container d-flex w-100 align-items-center">

            <div className="flex-fill"></div>
            
            <div className="flex-fill d-flex justify-content-center">
              <ul className="navbar-nav">
                <li className="nav-item playheaven-nav-item">
                  <a className="nav-link playheaven-nav-link" href="store">Store</a>
                </li>
                <li className="nav-item playheaven-nav-item">
                  <a className="nav-link playheaven-nav-link" href="categories">Categories</a>
                </li>
                <li className="nav-item playheaven-nav-item">
                  <a className="nav-link playheaven-nav-link" href="news">News</a>
                </li>
                <li className="nav-item playheaven-nav-item">
                  <a className="nav-link playheaven-nav-link" href="about">About</a>
                </li>
              </ul>
            </div>
            
            <div className="flex-fill d-flex justify-content-end align-items-center">
              <Link to="/store" className="playheaven-icon-btn text-decoration-none">
                <IoSearch />
              </Link>
              
              <Link to="/wishlist" className="playheaven-icon-btn text-decoration-none">
                <FaRegHeart />
              </Link>
              
              <Link to="/cart" className="playheaven-icon-btn text-decoration-none">
                <IoCartOutline />
              </Link>
              
              <Link to="/libraryPage" className="playheaven-icon-btn playheaven-library-btn text-decoration-none">
                <TbBooks />
              </Link>
              
              <Link to="/profile" className="playheaven-user-profile d-flex align-items-center text-decoration-none">
                <div className="playheaven-avatar"></div>
                <span className="playheaven-username">PlayerOne</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
