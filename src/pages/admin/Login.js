import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import axios from '../../components/admin/Axios';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  
  
  const handleLogin = async (e) => {

      e.preventDefault();
      try {
        const response = await axios.post('/users/login', { username, password });
        const { token } = response.data;
        const statusCode = response.status; 
        if(statusCode === 200){
          localStorage.setItem('jwt', token);
          navigate('/admin');
        }
      } catch (error) {
        if (error.response) {
          const statusCode = error.response.status;
          switch (statusCode) {
            case 400:
              alert('잘못된 요청입니다. 입력을 확인해주세요.');
              break;
            case 401:
              alert('아이디 또는 비밀번호가 올바르지 않습니다.');
              break;
            case 403:
              alert('접근 권한이 없습니다.');
              break;
            case 404:
              alert('존재하지 않는 계정입니다.');
              break;
            case 500:
              alert('서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
              break;
            default:
              alert(`알 수 없는 오류가 발생했습니다. (Error Code: ${statusCode})`);
          }
        } 
        else if (error.request) {
          alert('서버 응답이 없습니다. 네트워크 상태를 확인해주세요.');
        } else {
          alert(`오류가 발생했습니다: ${error.message}`);
        }
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
