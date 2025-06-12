import { Outlet } from 'react-router';
import Navbar from '../components/Layout/Navbar.jsx'
import Footer from '../components/Layout/Footer.jsx'
import NavButton from '../components/NavButton.jsx';

function RootLayout() {
  return (
    <div className='min-vh-100 d-flex flex-column'>
      <Navbar>
        <NavButton to ='/store' text='Store'/>
        <NavButton to ='/categories' text='Categories'/>
        <NavButton to ='/news' text='News'/>
        <NavButton to ='/about' text='About'/>
      </Navbar>
      
      <main className='flex-grow-1'>
        <Outlet />
      </main>
      

      <Footer/>
    </div>
  );
}

export default RootLayout;
