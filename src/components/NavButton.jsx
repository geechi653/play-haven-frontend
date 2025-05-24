import { NavLink } from 'react-router';
import './NavButton.css';

function NavButton({ to, text }) {
  return (
    <>
      <NavLink
        to={to}
        className={({ isActive }) => `${isActive ? 'active' : 'non-active'}`}
      >
        {text}
      </NavLink>
    </>
  );
}

export default NavButton;
