import React from 'react';
import { Link, useLocation } from 'react-router-dom';

function Footer() {
    const location = useLocation();
    const isAdminLogin = location.pathname.startsWith("/admin/login"); 
    return (
        <>
          {isAdminLogin ? 
          <></>: 
          <footer className="admin-footer">
            <p>&copy; 2025 My Colorful Blog. All rights reserved.</p>
          </footer>
          }
      </>
    )
}


export default Footer