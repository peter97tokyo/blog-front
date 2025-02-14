import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';  // useParams 추가
import axios from '../../../components/admin/Axios';

function BoardConfigForm() {
    const { id } = useParams();  // URL의 id 값 받기
    const navigate = useNavigate();
    const [codes, setCodes] = useState([]);
    
    const [boardConfigs, setBoardConfigs] = useState({
        boardName: '',
        isActive: '',
        blockedExtensions: '',
        boardType: '',
        boardCategory: '',
    });

    useEffect(() => {
        const fetchBoardConfig = async () => {
            if (id) { // id가 있을 때만 데이터 가져오기
                try {
                    const response = await axios.get(`/boardConfigs/${id}`);
                    setBoardConfigs((prevBoardConfigs) => ({
                        ...prevBoardConfigs,
                        ...response.data,
                    }));
                } catch (error) {
                    console.error('Error fetching board config:', error);
                }
            }

            try {
                const response = await axios.get('/codes/children/board');
                const childrenList = response.data.content || response.data;
                setCodes(childrenList);
            } catch (error) {
                console.error('Error fetching board config:', error);
            }
        };

        fetchBoardConfig();
    }, [id]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setBoardConfigs((prevBoardConfigs) => ({
            ...prevBoardConfigs,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('/boardConfigs', boardConfigs);    // id 없으면 추가
            if (response.status === 200 || response.status === 201) {
                alert('저장 성공하였습니다.');
                navigate('/admin/boardConfig');
            }
        } catch (error) {
            console.error('Error saving board config:', error);
            alert('저장 실패하였습니다.');
        }
    };

    const handleDelete = async (e) => {
        if (window.confirm('정말로 삭제하시겠습니까?')) {
            try {
                const response = await axios.delete(`/boardConfigs/${id}`);
                if (response.status === 204) {
                    alert('삭제가 완료되었습니다.');
                    navigate('/admin/boardConfig');
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
        <div className="admin-post-card">
            <h2><b>BOARD CONFIG FORM</b></h2>
            <hr />
            <form onSubmit={handleSubmit}>
                <div className="input-group mb-3">
                    <span className="input-group-text">게시판 이름</span>
                    <input 
                        type="text" 
                        name="boardName" 
                        value={boardConfigs.boardName} 
                        onChange={handleInputChange} 
                        placeholder="게시판 이름을 입력해주세요." 
                        className="form-control"
                        required
                    />
                </div>
                <div className="input-group mb-3">
                    <span className="input-group-text">사용여부</span>
                    <select 
                        name="active" 
                        value={boardConfigs.active ? 'true' : 'false'} 
                        onChange={(e) =>
                            setBoardConfigs((prev) => ({
                                ...prev,
                                active: e.target.value === 'true',  // 문자열 'true' → Boolean true
                            }))
                        }
                        className="form-select"
                    >
                        <option value="true">활성화</option>
                        <option value="false">비활성화</option>
                    </select>
                </div>
                <div className="input-group">
                    <span className="input-group-text">차단 확장자</span>
                    <textarea 
                        className="form-control" 
                        name="blockedExtensions" 
                        value={boardConfigs.blockedExtensions} 
                        onChange={handleInputChange} 
                    ></textarea>
                </div>
                <div className="text-warning mb-3">
                    예시) sh,java,php,py
                </div>
                <div className="input-group mb-3">
                    <span className="input-group-text">게시판 형태</span>
                    <select 
                        className="form-select" 
                        name="boardType" 
                        value={boardConfigs.boardType} 
                        onChange={handleInputChange}
                    >
                        {codes.map((code)=>(
                            <option value={code.codeValue}>{code.description}</option>
                        ))}
                    </select>
                </div>
                <div className="input-group">
                    <span className="input-group-text">게시판 카테고리</span>
                    <input 
                        type="text" 
                        name="boardCategory" 
                        value={boardConfigs.boardCategory} 
                        onChange={handleInputChange} 
                        placeholder="게시판 카테고리를 입력해주세요." 
                        className="form-control"
                        required
                    />
                </div>
                <div className="text-warning mb-3">
                    예시) 공지사항 &gt; notice
                </div>
                <div className="d-flex justify-content-end">
                    <button type="submit" className="btn btn-success">저장</button>
                    { id ? <button type="button" className="btn btn-danger ms-3" onClick={() => handleDelete()}>삭제</button> : <></>}
                    
                    <button type="button" className="btn btn-danger ms-3" onClick={() => navigate('/admin/boardConfig')}>취소</button>
                </div>
            </form>
        </div>
    );
}

export default BoardConfigForm;
