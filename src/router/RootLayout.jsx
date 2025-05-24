import { Outlet } from 'react-router';

function RootLayout() {
  return (
    <div>
      {/* Define your layout here */}
      <Outlet />
    </div>
  );
}

export default RootLayout;
