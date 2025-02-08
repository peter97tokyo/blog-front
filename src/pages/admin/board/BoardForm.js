import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from '../../../components/admin/Axios';

function BoardForm() {
  const { id } = useParams(); // 수정 시 URL에 id가 전달됨
  const navigate = useNavigate();

  // board 상태: 파일 업로드의 경우 attachments는 File 객체 배열로 관리합니다.
  const [board, setBoard] = useState({
    title: '',
    content: '',
    writer: '',
    category: '',
    thumbnail: '',
    attachments: [], // 파일 객체들을 저장
    isVisible: true,
  });

  // id가 있는 경우 기존 게시글 불러오기 (수정)
  useEffect(() => {
    if (id) {
      const fetchBoard = async () => {
        try {
          const response = await axios.get(`/board/${id}`);
          const data = response.data;
          // 이미 업로드된 첨부파일은 문자열 배열(예: URL)로 내려올 수 있음
          setBoard({
            ...data,
            // 첨부파일은 File 객체가 아닌 URL 문자열로 관리됩니다.
            // 수정 시, 별도 파일 선택 없이 기존 URL들을 표시할 수도 있습니다.
            // 여기서는 간단하게 빈 배열로 초기화합니다.
            attachments: [],
          });
        } catch (error) {
          console.error('Error fetching board:', error);
        }
      };
      fetchBoard();
    }
  }, [id]);

  // 일반 입력 필드 처리
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBoard((prev) => ({
      ...prev,
      [name]: name === 'isVisible' ? (value === 'true') : value,
    }));
  };

  // 파일 선택 처리
  const handleFileChange = (e) => {
    const files = e.target.files;
    // FileList를 배열로 변환하여 저장
    setBoard((prev) => ({
      ...prev,
      attachments: Array.from(files),
    }));
  };

  // 제출 처리: 파일 업로드 후 board 데이터를 저장합니다.
  const handleSubmit = async (e) => {
    e.preventDefault();

    let uploadedUrls = [];
    // 파일이 선택되었으면 파일 업로드 처리
    if (board.attachments && board.attachments.length > 0) {
      const formData = new FormData();
      board.attachments.forEach((file) => {
        formData.append('files', file);
      });
      try {
        const uploadResponse = await axios.post('/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        // 예를 들어, 업로드 API가 파일 URL 배열을 반환한다고 가정합니다.
        uploadedUrls = uploadResponse.data;
      } catch (error) {
        console.error('File upload failed:', error);
        alert('파일 업로드에 실패하였습니다.');
        return;
      }
    }

    // board 데이터에 업로드된 파일 URL을 할당합니다.
    const boardData = {
      ...board,
      attachments: uploadedUrls,
    };

    try {
      let response;
      if (id) {
        response = await axios.post(`/boards/${id}`, boardData);
      } else {
        response = await axios.post('/boards', boardData);
      }
      if (response.status === 200 || response.status === 201) {
        alert('저장 성공하였습니다.');
        navigate('/admin/board');
      }
    } catch (error) {
      console.error('Error saving board:', error);
      alert('저장 실패하였습니다.');
    }
  };

  return (
    <div className="admin-post-card">
      <h2><b>BOARD FORM</b></h2>
      <hr />
      <form onSubmit={handleSubmit}>
        {/* 제목 입력 */}
        <div className="input-group mb-3">
          <span className="input-group-text">제목</span>
          <input
            type="text"
            name="title"
            value={board.title}
            onChange={handleInputChange}
            placeholder="게시글 제목을 입력하세요."
            className="form-control"
            required
          />
        </div>

        {/* 작성자 입력 */}
        <div className="input-group mb-3">
          <span className="input-group-text">작성자</span>
          <input
            type="text"
            name="writer"
            value={board.writer}
            onChange={handleInputChange}
            placeholder="작성자를 입력하세요."
            className="form-control"
            required
          />
        </div>

        {/* 카테고리 입력 */}
        <div className="input-group mb-3">
          <span className="input-group-text">카테고리</span>
          <input
            type="text"
            name="category"
            value={board.category}
            onChange={handleInputChange}
            placeholder="카테고리를 입력하세요."
            className="form-control"
            required
          />
        </div>

        {/* 내용 입력 */}
        <div className="input-group mb-3">
          <span className="input-group-text">내용</span>
          <textarea
            name="content"
            value={board.content}
            onChange={handleInputChange}
            placeholder="게시글 내용을 입력하세요."
            className="form-control"
            required
          ></textarea>
        </div>

        {/* 썸네일 URL 입력 */}
        <div className="input-group mb-3">
          <span className="input-group-text">썸네일 URL</span>
          <input
            type="text"
            name="thumbnail"
            value={board.thumbnail}
            onChange={handleInputChange}
            placeholder="썸네일 URL을 입력하세요."
            className="form-control"
          />
        </div>

        {/* 첨부파일 업로드 */}
        <div className="input-group mb-3">
          <span className="input-group-text">첨부파일 업로드</span>
          <input
            type="file"
            name="attachments"
            multiple
            onChange={handleFileChange}
            className="form-control"
          />
        </div>

        {/* 노출 여부 */}
        <div className="input-group mb-3">
          <span className="input-group-text">노출 여부</span>
          <select 
            className="form-select" 
            name="isVisible"
            value={board.isVisible} 
            onChange={handleInputChange}
          >
            <option value="true">노출</option>
            <option value="false">비노출</option>
          </select>
        </div>

        {/* 저장, 취소 버튼 */}
        <div className="d-flex justify-content-end">
          <button type="submit" className="btn btn-success">저장</button>
          <button type="button" className="btn btn-danger ms-3" onClick={() => navigate('/admin/board')}>
            취소
          </button>
        </div>
      </form>
    </div>
  );
}

export default BoardForm;
