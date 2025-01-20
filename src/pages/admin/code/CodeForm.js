import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import axios from '../../../api/admin/axios';

function CodeForm() {
    const { search } = useLocation();
    const params = new URLSearchParams(search);
    const parentId = params.get('parentId') === null ? 0 : params.get('parentId');
    const groupYn = params.get('groupYn') === null ? 'Y' : params.get('groupYn');
    const [codeKey, setCodeKey] = useState('');
    const [codeValue, setCodeValue] = useState('');
    const [description, setDescription] = useState('');

    const summit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('/codes', {parentId, groupYn, codeKey, codeValue, description});
            if(response.data.status === "result.success"){
                alert('저장 성공하였습니다.')
            }else {
                alert('저장 실패하였습니다.')
            }
        } catch (error) {
            alert('저장 실패하였습니다.')
        }
    };
    return (
        <main className="col-md-10 mb-4">
            <div className="admin-post-card">
                <h2>CODE FORM</h2>
                <hr></hr>
                {/* 입력 폼 */}
                <form onSubmit={summit}>
                    <div className="mb-3">
                        <label htmlFor="codeType" className="form-label">키</label>
                        <input 
                        type="text" 
                        className="form-control" 
                        id="codeKey" 
                        name="codeKey" 
                        placeholder="키를 입력해주세요." 
                        value={codeKey}
                        onChange={(e) => setCodeKey(e.target.value)}
                         />
                        <div className="text-warning">그룹코드 예시&#41; result, 소속코드 예시&#41; result.success, result.fail </div>
                    </div>

                    <div className="mb-3">
                        <label htmlFor="codeValue" className="form-label">값</label>
                        <input 
                        type="text" 
                        className="form-control" 
                        id="codeValue" 
                        name="codeValue" 
                        placeholder="값을 입력해주세요." 
                        value={codeValue}
                        onChange={(e) => setCodeValue(e.target.value)}
                        />
                        <div className="text-warning">그룹코드 예시&#41; 결과, 소속코드 예시&#41; 성공하였습니다 또는 성공</div>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="description" className="form-label">설명</label>
                        <textarea 
                        className="form-control"
                        id="description"
                        name="description"
                        rows="3"
                        placeholder="설명을 입력해주세요."
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        ></textarea>
                    </div>
                    <div className="d-flex justify-content-end">
                        <button type="submit" className="btn btn-success me-3">저장</button>
                        <button type="button" className="btn btn-danger">취소</button>
                    </div>
                </form>
            </div>
        </main>
    )
  }

  export default CodeForm;
