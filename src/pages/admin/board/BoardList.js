import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../../components/admin/Axios';
import Pagination from '../../../components/admin/Pagination';

function BoardList({ itemsPerPage = 5 }) {
  const [board, setBoard] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();

  // Board 리스트 가져오기
  useEffect(() => {
    const fetchBoard = async () => {
      try {
        const response = await axios.get('/boards');
        // 백엔드가 페이징을 지원한다면 response.data.content 사용, 아니면 그냥 response.data
        const boardList = response.data.content || response.data;
        setBoard(boardList);
      } catch (error) {
        console.error('Error fetching board:', error);
      }
    };
    fetchBoard();
  }, []);

  // 페이지네이션 계산
  const totalPages = Math.ceil(board.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentBoard = Array.isArray(board) ? board.slice(indexOfFirstItem, indexOfLastItem) : [];

  // 행 클릭 시 수정 페이지로 이동
  const handleDetail = (id) => {
    navigate(`/admin/board/form/${id}`);
  };

  // 추가 버튼 클릭 시 새 게시글 작성 페이지로 이동
  const handleSave = () => {
    navigate('/admin/board/form');
  };

  return (
    <div className="admin-post-card">
      <h3><b>BOARD LIST</b></h3>
      <hr />
      <table className="table text-center width-full bg-charcoal">
        <thead>
          <tr>
            <th>#</th>
            <th>제목</th>
            <th>작성자</th>
            <th>카테고리</th>
            <th>작성일</th>
            <th>노출 여부</th>
          </tr>
        </thead>
        <tbody>
          {currentBoard.length > 0 ? (
            currentBoard.map((board, index) => (
              <tr key={board.id} className="table-row-hover" onClick={() => handleDetail(board.id)}>
                <td>{indexOfFirstItem + index + 1}</td>
                <td>{board.title}</td>
                <td>{board.writer}</td>
                <td>{board.category}</td>
                <td>{board.createdAt ? new Date(board.createdAt).toLocaleString() : '-'}</td>
                <td>{board.isVisible ? '노출' : '비노출'}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6">게시글이 없습니다.</td>
            </tr>
          )}
        </tbody>
      </table>

      {/* 페이지네이션 컴포넌트 */}
      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />

      {/* 추가 / 삭제 버튼 */}
      <div className="d-flex justify-content-end mt-3">
        <button type="button" onClick={handleSave} className="btn btn-success">추가</button>
        <button type="button" className="btn btn-danger ms-3">삭제</button>
      </div>
    </div>
  );
}

export default BoardList;
