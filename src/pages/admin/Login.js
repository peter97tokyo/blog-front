import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import axios from '../../components/admin/axios';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState('');
  const navigate = useNavigate();
  
  
  const handleLogin = async (e) => {

      e.preventDefault();
      try {
          const response = await axios.post('/users/login', { username, password });
    
          const { token } = response.data;
          localStorage.setItem('jwt', token);
          if(response.data.status === "user.login"){
            navigate('/admin');    
          }else{
            alert('로그인 실패')
          }
      } catch (error) {
        setStatus(error.response?.data?.status || '로그인 실패');
      }
  };
  return (
    <div className="container d-flex align-items-center justify-content-center min-vh-100">
      <main className="card shadow-sm p-4 w-100 bg-charcoal" style={{ maxWidth: '400px' }}>
        <div className="text-center mb-4">
          <h1 className="h3 fw-bold">로그인</h1>
        </div>
        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <label htmlFor="username" className="form-label">
              아이디
            </label>
            <input
              id="username"
              name="username"
              className="form-control"
              placeholder="아이디를 입력하세요"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label">
              비밀번호
            </label>
            <input
              type="password"
              id="password"
              name="password"
              className="form-control"
              placeholder="비밀번호를 입력하세요"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}

            />
          </div>
          <button type="submit" className="btn btn-primary w-100">
            로그인
          </button>
        </form>
      </main>
    </div>
  );
};

export default Login;
