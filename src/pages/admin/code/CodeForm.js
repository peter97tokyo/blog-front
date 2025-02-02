import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from '../../../components/admin/Axios';

function CodeForm() {
    const { search } = useLocation();
    const params = new URLSearchParams(search);
    const id = Number(params.get('id'));
    const parent = params.get('parent') === null ? 0 : Number(params.get('parent'));
    const groupYn = params.get('groupYn') === null ? 'Y' : params.get('groupYn');

    const [code, setCode] = useState({
        codeKey: '',
        codeValue: '',
        description: '',
        groupYn: groupYn,
        parent: parent,
    });

    const navigate = useNavigate();

    useEffect(() => {
        const fetchCodes = async () => {
            if (id) { // id가 있을 때만 데이터를 가져옴
                try {
                    const response = await axios.get(`/codes/${id}`);
                    setCode((prevCode) => ({
                        ...prevCode,
                        ...response.data, // 기존 상태에 API에서 가져온 데이터를 병합
                    }));
                } catch (error) {
                    console.error('Error fetching codes:', error);
                }
            } else {
                setCode({
                    codeKey: '',
                    codeValue: '',
                    description: '',
                    groupYn: groupYn,
                    parent: parent,
                });
            }
        };

        fetchCodes();
    }, [id]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCode((prevCode) => ({
            ...prevCode,
            [name]: value, // name 속성을 기반으로 동적으로 값 변경
        }));
    };

    const summit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`/codes?parent=${parent}`, code);
            const statusCode = response.status; 
            if(statusCode === 200){
                alert('저장 성공하였습니다.');
                window.location.reload(); // 새로고침
            }
        } catch (error) {
            if (error.response) {
              const statusCode = error.response.status;
              switch (statusCode) {
                case 400:
                  alert('잘못된 요청입니다. 입력을 확인해주세요.');
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

    const handleDelete = async () => {
        if (window.confirm('정말로 삭제하시겠습니까?')) {
            try {
                const response = await axios.delete(`/codes/${id}`);
                if (response.status === 204) {
                    alert('삭제가 완료되었습니다.');
                    window.location.href = '/admin/code' 
                } else {
                    alert('삭제 실패하였습니다.');
                }
            } catch (error) {
                console.error('Error deleting code:', error);
                alert('삭제 중 오류가 발생했습니다.');
            }
        }
    };

    return (
        <main className="col-md-8 mb-4">
            <div className="admin-post-card">
                <h2><b>CODE FORM</b></h2>
                <hr />
                {/* 입력 폼 */}
                <form onSubmit={summit}>
                    <div className="mb-3">
                        <label htmlFor="codeKey" className="form-label">키</label>
                        <input 
                            type="text" 
                            className="form-control" 
                            id="codeKey" 
                            name="codeKey" 
                            placeholder="키를 입력해주세요." 
                            value={code.codeKey}
                            onChange={handleInputChange}
                        />
                        <div className="text-warning">
                            그룹코드 예시) result, 소속코드 예시) result.success, result.fail
                        </div>
                    </div>

                    <div className="mb-3">
                        <label htmlFor="codeValue" className="form-label">값</label>
                        <input 
                            type="text" 
                            className="form-control" 
                            id="codeValue" 
                            name="codeValue" 
                            placeholder="값을 입력해주세요." 
                            value={code.codeValue}
                            onChange={handleInputChange}
                        />
                        <div className="text-warning">
                            그룹코드 예시) 결과, 소속코드 예시) 성공하였습니다.
                        </div>
                    </div>

                    <div className="mb-3">
                        <label htmlFor="description" className="form-label">설명</label>
                        <textarea 
                            className="form-control"
                            id="description"
                            name="description"
                            rows="3"
                            placeholder="설명을 입력해주세요."
                            value={code.description}
                            onChange={handleInputChange}
                        ></textarea>
                    </div>
                    <div className="d-flex justify-content-end">
                        <button type="submit" className="btn btn-success">저장</button>
                        {id !== 0 && id && ( 
                            <button 
                                type="button" 
                                className="btn btn-danger ms-3" 
                                onClick={handleDelete}
                            >
                                삭제
                            </button>
                        )}
                    </div>
                </form>
            </div>
        </main>
    );
}

export default CodeForm;
