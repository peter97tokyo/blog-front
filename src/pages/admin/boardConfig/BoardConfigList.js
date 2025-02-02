import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../../components/admin/Axios';
import Pagination from '../../../components/admin/Pagination';

function BoardConfigList({ itemsPerPage = 5 }) { 
    const [configs, setConfigs] = useState([]);        
    const [currentPage, setCurrentPage] = useState(1); 
    const navigate = useNavigate();

    // 데이터 가져오기
    useEffect(() => {
        const fetchConfigs = async () => {
            try {
                const response = await axios.get('/boardConfigs');
                setConfigs(response.data);
            } catch (error) {
                console.error('Error fetching configs:', error);
            }
        };
        fetchConfigs();
    }, []);

    // 페이지네이션 로직
    const totalPages = Math.ceil(configs.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentConfigs = configs.slice(indexOfFirstItem, indexOfLastItem);

    // 페이지 이동
    const handleSave = (id) => {
        if (id) {
            navigate(`/admin/boardConfig/form/${id}`);
        } else {
            navigate('/admin/boardConfig/form');
        }
    };

    return (
        <div className="admin-post-card">
            <h3><b>BOARD CONFIG</b></h3>
            <hr />
            <table className="table text-center width-full bg-charcoal">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>게시판 이름</th>
                        <th>사용여부</th>
                        <th>게시판 형태</th>
                        <th>게시판 카테고리</th>
                    </tr>
                </thead>
                <tbody>
                    {currentConfigs.length > 0 ? (
                        currentConfigs.map((config, index) => (
                            <tr key={config.id} className="table-row-hover" onClick={()=>handleSave(config.id)}>
                                <td>{indexOfFirstItem + index + 1}</td>
                                <td>{config.boardName}</td>
                                <td>{config.active ? '활성화' : '비활성화'}</td> 
                                <td>{config.boardType}</td>
                                <td>{config.boardCategory}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="5">No Board Configs Available</td>
                        </tr>
                    )}
                </tbody>
            </table>

            {/* 페이지네이션 */}
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />

            {/* 추가/삭제 버튼 */}
            <div className="d-flex justify-content-end mt-3">
                <button type="button" onClick={handleSave} className="btn btn-success">추가</button>
                <button type="button" className="btn btn-danger ms-3">삭제</button>
            </div>
        </div>
    );
}

export default BoardConfigList;
