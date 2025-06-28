import { NavLink } from 'react-router-dom';
import './NavButton.css';

function NavButton({ to, text }) {
  return (
    <li className="nav-item playheaven-nav-item">
      <NavLink
        to={to}
        className={({ isActive }) => `nav-link ${isActive ? 'active' : 'non-active'}`}
      >
        {text}
      </NavLink>
    </li>
  );
}

export default NavButton;
