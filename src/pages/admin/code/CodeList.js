import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../../components/admin/axios';

function CodeList() {
    const [parent, setParent] = useState(0);
    const [groupYn, setGroupYn] = useState('Y');
    const [codes, setCodes] = useState([]);
    const [expanded, setExpanded] = useState({}); // 각 코드의 열림 상태 관리

    const navigate = useNavigate();

    // 그룹 추가 시 호출
    const handleSave = (parent, groupYn) => {
        navigate(`/admin/code/form?parent=${parent}&groupYn=${groupYn}`);
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
    const handleExpandToggle = (id) => {
        setExpanded((prev) => ({
            ...prev,
            [id]: !prev[id], // 클릭한 코드의 열림/닫힘 상태 토글
        }));
    };

    return (
        <aside className="col-md-4 mb-4">
            <div className="admin-sidebar mb-4">
                <div className="d-flex justify-content-between align-items-center">
                    <h3>CODE</h3>
                    <button 
                        type="button" 
                        className="btn btn-light" 
                        onClick={() => handleSave(parent, groupYn)}
                    >
                        그룹코드추가
                    </button>
                </div>
                <ul style={{ listStyleType: 'none', padding: 0 }}>
                    {codes.length > 0 ? (
                        codes.map((code, index) => {
                            const isExpanded = expanded[code.id];

                            return (
                                <li key={code.id} style={{ marginBottom: '10px' }}>
                                    <span
                                        onClick={() => handleExpandToggle(code.id)}
                                        style={{
                                            cursor: 'pointer',
                                            fontWeight: 'bold',
                                            display: 'inline-block',
                                            marginRight: '10px',
                                        }}
                                    >
                                        {code.groupYn === 'Y' && (isExpanded ? '-' : '+')}
                                    </span>
                                    <span>{code.codeValue}</span>
                                    <button
                                        type="button"
                                        className="btn btn-sm btn-light ml-2"
                                        onClick={() => handleSave(code.id, 'Y')}
                                        style={{ marginLeft: '10px' }}
                                    >
                                        하위 그룹 추가
                                    </button>
                                    {/* 하위 코드가 있고 열려 있는 경우 */}
                                    {isExpanded && code.children && code.children.length > 0 && (
                                        <ul
                                            style={{
                                                marginLeft: '30px',
                                                listStyleType: 'decimal',
                                                padding: 0,
                                            }}
                                        >
                                            {code.children.map((child) => (
                                                <li key={child.id}>
                                                    <span>{child.codeValue}</span>
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
            </div>
        </aside>
    );
}

export default CodeList;
