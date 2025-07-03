import { createBrowserRouter } from 'react-router-dom';
import RootLayout from './RootLayout.jsx';
import ErrorPage from './ErrorPage.jsx';
import Home from '../pages/home/Home.jsx';
import About from '../pages/about/About.jsx';
import Store from '../pages/store/Store.jsx';
import Profile from '../pages/profile/Profile.jsx';
import Wishlist from '../pages/wishlist/Wishlist.jsx';
import Library from '../pages/libraryPage/Library.jsx';
import GameInfo from '../pages/gameinfo/GameInfo.jsx';
import Cart from '../pages/cart/Cart.jsx';
import News from '../pages/news/News.jsx';
import Categories from '../pages/categories/Categories.jsx';
import SignUp from '../pages/signup/SignUp.jsx';
import Login from '../pages/login/Login.jsx';

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
      { path: '/news', element: <News /> },
      { path: '/categories', element: <Categories /> },
      { path: '/wishlist', element: <Wishlist /> },
      { path: '/library', element: <Library /> },
      { path: '/gameinfo/:gameId', element: <GameInfo /> },
      { path: '/cart', element: <Cart /> },
      { path: '/signup', element: <SignUp /> },
      { path: '/login', element: <Login /> },
      // Catch-all route to redirect to home
      { path: '*', element: <Home /> },
    ],
  },
]);
