import { Outlet } from 'react-router-dom';
import Navbar from '../components/Layout/Navbar.jsx'
import Footer from '../components/Layout/Footer.jsx'
import NavButton from '../components/NavButton.jsx';

function RootLayout() {
  return (
    <div className='min-vh-100 d-flex flex-column'>
      <Navbar>
        <NavButton to ='/home' text='Home'/>
        <NavButton to ='/store' text='Store'/>
        <NavButton to ='/news' text='News'/>
        <NavButton to ='/about' text='About'/>
        <NavButton to ='/wishlist' text='Wishlist'/>
        <NavButton to ='/cart' text='Cart'/>
        <NavButton to ='/categories' text='Categories'/>
        <NavButton to ='/profile' text='Profile'/>
      </Navbar>
      
      <main className='flex-grow-1'>
        <Outlet />
      </main>
      

      <Footer/>
    </div>
  );
}

export default RootLayout;
