import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../../components/admin/Axios';

function CodeList() {
    const [parent, setParent] = useState(0);
    const [groupYn, setGroupYn] = useState('Y');
    const [codes, setCodes] = useState([]);
    const [expanded, setExpanded] = useState({}); // 각 코드의 열림 상태 관리

    const navigate = useNavigate();

    // 그룹 추가 시 호출
    const handleSave = (parent, groupYn, id) => {
        const queryParams = new URLSearchParams({ parent, groupYn }); 
        if (id) queryParams.append('id', id); 
        navigate(`/admin/code/form?${queryParams.toString()}`);
    };

    useEffect(() => {
        const fetchCodes = async () => {
            try {
                const response = await axios.get('/codes', {
                    params: {
                        parent: null,
                        groupYn: 'Y',
                    },
                });
                setCodes(response.data);
            } catch (error) {
                console.error('Error fetching codes:', error);
            }
        };

        fetchCodes();
    }, []);

    // 클릭 시 하위 코드 토글
    const handleExpandToggle = (parent, groupYn, id) => {
        setExpanded((prev) => ({
            ...prev,
            [id]: !prev[id], // 클릭한 코드의 열림/닫힘 상태 토글
        }));
        const queryParams = new URLSearchParams({ parent, groupYn }); 
        if (id) queryParams.append('id', id); 
        navigate(`/admin/code/form?${queryParams.toString()}`);
    };

    return (
        <aside className="col-md-4 mb-4">
            <div className="admin-sidebar mb-4">
                <h3><b>CODE</b></h3>
                <ul className="list-unstyled">
                    {codes.length > 0 ? (
                        codes.map((code, index) => {
                            const isExpanded = expanded[code.id];

                            return (
                                <li key={code.id} className="mb-2">
                                    <span className="d-flex justify-content-between align-items-center">
                                        <span
                                            onClick={() => handleExpandToggle(code.id, 'Y', code.id)}
                                            className={`fw-semibold ${isExpanded ? '' : 'text-decoration-underline'}`}
                                            style={{ cursor: 'pointer' }}
                                        >
                                            <b>
                                                {isExpanded ? '-' : '+'} {code.codeValue}
                                            </b>
                                        </span>
                                        <button
                                            type="button"
                                            className="btn btn-primary btn-sm ms-2"
                                            onClick={() => handleSave(code.id, 'Y', null)}
                                        >
                                            추가
                                        </button>
                                    </span>
                                    
                                    {/* 하위 코드가 있고 열려 있는 경우 */}
                                    {isExpanded && code.children && code.children.length > 0 && (
                                        <ul className="ms-4 list-unstyled">
                                            {code.children.map((child) => (
                                                <li key={child.id} className="mb-1">
                                                    <span
                                                        onClick={() => handleSave(code.id, 'N', child.id)}
                                                        style={{ cursor: 'pointer' }}
                                                    >
                                                        {child.codeValue}
                                                    </span>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </li>
                            );
                        })
                    ) : (
                        <li>코드가 없습니다.</li>
                    )}
                </ul>
                <button 
                    type="button" 
                    className="btn btn-primary width-full" 
                    onClick={() => handleSave(parent, groupYn, null)}
                >
                    그룹코드추가
                </button>
            </div>
        </aside>
    );
}

export default CodeList;
