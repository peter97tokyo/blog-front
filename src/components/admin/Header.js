import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import axios from './axios'

import 'bootstrap/dist/css/bootstrap.min.css';
import '../../styles/components/admin/global.css';

function Header(){
    const location = useLocation();
    const navigate = useNavigate();
    const isAdminLogin = location.pathname.startsWith("/admin/login");  
    useEffect(() => {
        const fetchAdminData = async () => {
            try {
                const token = localStorage.getItem('jwt');
                const response = await axios.get('/users/dashboard', {
                    headers: {
                        Authorization: `Bearer ${token}`, // 토큰 포함
                    },
                });
                if(response.data === "jwt.nothing" || response.data === "jwt.user"){
                    alert('권한이 없습니다.')
                    navigate('/admin/login');    
                }
            } catch (error) {
                alert('권한이 없습니다.')
                navigate('/admin/login'); // '/login' 경로로 리디렉션

            }
        };

        fetchAdminData();
    }, []);
    return(
        <>
            {isAdminLogin ? 
            <></>: 
            <header className="admin-header">
                <div className="container d-flex justify-content-between align-items-center">
                <nav>
                    <ul className="admin-nav-list">
                    <li><Link to="/admin">Home</Link></li>
                    <li><Link to="/admin/code">Code</Link></li>
                    <li></li>
                    </ul>
                </nav>
                <h1 className="admin-logo">ADMIN</h1>
                </div>
            </header> 
            }
        </>
    )
}

export default Header