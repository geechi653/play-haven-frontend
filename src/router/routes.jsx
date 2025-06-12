import { createBrowserRouter } from 'react-router';
import RootLayout from './RootLayout.jsx';
import ErrorPage from './ErrorPage.jsx';
import Home from '../pages/home/Home.jsx';
import About from '../pages/about/About.jsx';
import Store from '../pages/store/Store.jsx';


export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />, // Layout wrapping the nested routes
    errorElement: <ErrorPage />, // Fallback for routing errors when not valid route
    children: [
      // Define individual routes for the application
      { index: true, element: <Home /> },
      { path: '/home', element: <Home /> },
      { path: '/about', element: <About /> },
      { path: '/store', element: <Store /> },
      { path: '/profile', element: <Profile /> },
      { path: '/wishlist', element: <Wishlist /> },
      { path: '/libraryPage', element: <Library /> },
      { path: '/gameinfo', element: <GameInfo /> },
      { path: '/cart', element: <Cart /> }

    ],
  },
]);
