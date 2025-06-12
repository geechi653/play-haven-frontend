import './Navbar.css';
import { TbBooks } from "react-icons/tb";
import { IoCartOutline } from "react-icons/io5";
import { FaRegHeart } from "react-icons/fa6";
import { IoSearch } from "react-icons/io5";

// function Navbar({children}) {
//   return (
//     <nav className="navbar navbar-expand-lg navbar-light bg-dark py-2 sticky-top shadow-sm">
//       <div className="container">
//         <a className="navbar-brand" href="#">
//           <span className="text-primary fw-bold text-white">
//             {" "}Play Heaven Logo Hear{" "}
//           </span>
//         </a>
//         <button
//           className="navbar-toggler"
//           type="button"
//           data-bs-toggle="collapse"
//           data-bs-target="#navbarNavDropdown"
//           aria-controls="navbarNavDropdown"
//           aria-expanded="false"
//           aria-label="Toggle navigation"
//         >
//           <span className="navbar-toggler-icon"></span>
//         </button>

//         <div className="collapse navbar-collapse" id="navbarSupportedContent">
//           <ul className='navbar-nav justify-content-center mb-2 mb-lg-0'>
//             {children}

//           </ul>

//         </div>
//       </div>
//     </nav>
//   );
// }

function Navbar() {
   return (
    <nav className="playheaven-navbar navbar navbar-expand-lg navbar-dark">
      <div className="container-fluid px-4">
        {/* Left Section - Logo */}
        <a className="navbar-brand d-flex align-items-center" href="#">
          <span className="playheaven-logo">Logo</span>
        </a>

        {/* Mobile Toggle Button */}
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

        {/* Collapsible Content */}
        <div className="collapse navbar-collapse" id="navbarNav">
          <div className="playheaven-nav-container d-flex w-100 align-items-center">
            {/* Left spacer */}
            <div className="flex-fill"></div>
            
            {/* Center Section - Navigation Links */}
            <div className="flex-fill d-flex justify-content-center">
              <ul className="navbar-nav">
                <li className="nav-item playheaven-nav-item">
                  <a className="nav-link playheaven-nav-link" href="#">Store</a>
                </li>
                <li className="nav-item playheaven-nav-item">
                  <a className="nav-link playheaven-nav-link" href="#">Categories</a>
                </li>
                <li className="nav-item playheaven-nav-item">
                  <a className="nav-link playheaven-nav-link" href="#">News</a>
                </li>
                <li className="nav-item playheaven-nav-item">
                  <a className="nav-link playheaven-nav-link" href="#">About</a>
                </li>
              </ul>
            </div>
            
            {/* Right Section - Icons and User */}
            <div className="flex-fill d-flex justify-content-end align-items-center">
              {/* Search Icon */}
              <button className="playheaven-icon-btn">
                <IoSearch />
              </button>
              
              {/* Heart/Wishlist Icon */}
              <button className="playheaven-icon-btn">
                <FaRegHeart />
              </button>
              
              {/* Shopping Cart Icon */}
              <button className="playheaven-icon-btn">
                <IoCartOutline />
              </button>
              
              {/* Library Icon */}
              <button className="playheaven-icon-btn playheaven-library-btn">
                <TbBooks />
              </button>
              
              {/* User Profile */}
              <div className="playheaven-user-profile d-flex align-items-center">
                <div className="playheaven-avatar"></div>
                <span className="playheaven-username">PlayerOne</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
