// App.js
import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";


import Header from './components/user/Header'
import AdminHeader from './components/admin/Header'
import Home from './components/user/Home'

import AdminLogin from './pages/admin/Login'
import AdminHome from './components/admin/Home'
import Code from './pages/admin/Code'
import Board from './pages/admin/Board'
import BoardConfig from './pages/admin/BoardConfig'


import Footer from './components/user/Footer'
import AdminFooter from './components/admin/Footer'

function Rayout() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");  

  useEffect(() => {
    const body = document.body;
    if (location.pathname.startsWith("/admin")) {
      body.classList.add("admin");
    } else {
      body.classList.remove("admin");
    }
    // clean-up function으로 클래스가 중복 추가되는 것을 방지
    return () => {
      body.classList.remove("admin");
    };
  }, [location.pathname]);

  return <>
    {/* 헤더 */}
    {isAdminRoute ? <AdminHeader /> : <Header />}
    {/* 메인 콘텐츠 */}
    <Routes>
      <Route path="/" element={<Home />} />
      
      
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin" element={<AdminHome />} />
      <Route path="/admin/code/*" element={<Code />} />
      <Route path="/admin/board/*" element={<Board />} />
      <Route path="/admin/boardConfig/*" element={<BoardConfig />} />
      
    </Routes>
    {/* 푸터 */}
    {isAdminRoute ? <AdminFooter /> : <Footer />}
  </>
}

function App() {
  return (
      <Router>
        <Rayout></Rayout>
      </Router>
    
  );
}

export default App;
