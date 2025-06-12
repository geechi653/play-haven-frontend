function Navbar({children}) {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white py-2 sticky-top shadow-sm">
      <div className="container">
        <a className="navbar-brand" href="#">
          <span className="text-primary fw-bold">
            {" "}Play Heaven Logo Hear{" "}
          </span>
        </a>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNavDropdown"
          aria-controls="navbarNavDropdown"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className='navbar-nav ms-auto mb-2 mb-lg-0'>
            {children}

          </ul>


        </div>
      </div>
    </nav>
  );
}

export default Navbar;
