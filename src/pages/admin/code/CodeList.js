import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function CodeList() {
    const [parentId, setParentId] = useState(0);
    const [groupYn, setGroupYn] = useState('Y');
    
    const navigate = useNavigate();
    
    const save = (parentId, groupYn) => {
        navigate(`/admin/code/form?parentId=${parentId}&groupYn=${groupYn}`); // '/login' 경로로 리디렉션
    };
    
    return (
        <aside className="col-md-2 mb-4">
            <div className="admin-sidebar mb-4">
                <h3>CODE</h3>
                <ul>
                    <li>Category 1</li>
                    <li>Category 2</li>
                    <li>Category 3</li>
                </ul>
                <div className="d-flex">
                    <button 
                        type="button" 
                        className="btn btn-light" 
                        onClick={() => save(parentId, groupYn)} // Call save directly
                    >
                        그룹코드추가
                    </button>
                </div>
            </div>
        </aside>
    );
}

export default CodeList;
