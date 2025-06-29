import { Outlet } from 'react-router-dom';
import Navbar from '../components/Layout/Navbar.jsx';
import Footer from '../components/Layout/Footer.jsx';

function RootLayout() {
  return (
    <div className='min-vh-100 d-flex flex-column'>
      <Navbar />
      <main className='flex-grow-1'>
        <Outlet />
      </main>
      <Footer/>
    </div>
  );
}

export default RootLayout;
