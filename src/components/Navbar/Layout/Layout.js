import Navbar from '../Navbar';
import { Outlet } from 'react-router-dom';
import './Layout.css';

const Layout = () => {
  return (
    <div className="layout-container">
      <div className="layout-navbar">
        <Navbar />
      </div>
      <main className="layout-content">
        <Outlet />
      </main>
      <footer className="layout-footer">
        © {new Date().getFullYear()} MyFurniture. All rights reserved.
      </footer>
    </div>
  );
};

export default Layout;
