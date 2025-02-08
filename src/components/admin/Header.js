import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import axios from './Axios'

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
            } catch (error) {
                if (error.response) {
                    const statusCode = error.response.status;
                    if(statusCode >= 400){
                        alert('권한이 없습니다.')
                        navigate('/admin/login');    
                    } else {
                        alert('알 수 없는 오류가 발생했습니다.');    
                        navigate('/admin/login');
                    }
                }else if (error.request) {
                    alert('서버 응답이 없습니다. 네트워크 상태를 확인해주세요.');
                    navigate('/admin/login');
                } else {
                    alert('알 수 없는 오류가 발생했습니다');    
                    navigate('/admin/login');
                }

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
                    <li><Link to="/admin/board">Board</Link></li>   
                    <li><Link to="/admin/boardConfig">BoardConfig</Link></li>   
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