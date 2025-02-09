import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from '../../../components/admin/Axios';

function BoardForm() {
  const { id } = useParams(); // 수정 시 URL에 id가 전달됨
  const navigate = useNavigate();

  const [board, setBoard] = useState({
    title: '',
    content: '',
    writer: '',
    category: '',
    thumbnail: '',
    attachments: [],
    isVisible: true,
  });

  const editorRef = useRef(null);

  // 에디터 생성 및 기존 게시글 불러오기
  useEffect(() => {
    if (editorRef.current) return; // 이미 초기화되었으면 중복 실행 방지

    const oEditors = [];
    if (
      window.nhn &&
      window.nhn.husky &&
      window.nhn.husky.EZCreator &&
      typeof window.nhn.husky.EZCreator.createInIFrame === 'function'
    ) {
      window.nhn.husky.EZCreator.createInIFrame({
        oAppRef: oEditors,
        elPlaceHolder: 'smarteditor', // 에디터가 붙을 대상 element의 id
        sSkinURI: process.env.PUBLIC_URL + '/smarteditor/SmartEditor2Skin.html',
        fCreator: 'createSEditor2'
        ,htParams : {
          bUseToolbar : true,				// 툴바 사용 여부 (true:사용/ false:사용하지 않음)
          bUseVerticalResizer : true,		// 입력창 크기 조절바 사용 여부 (true:사용/ false:사용하지 않음)
          bUseModeChanger : true,			// 모드 탭(Editor | HTML | TEXT) 사용 여부 (true:사용/ false:사용하지 않음)
          //bSkipXssFilter : true,		// client-side xss filter 무시 여부 (true:사용하지 않음 / 그외:사용)
          //aAdditionalFontList : aAdditionalFontSet,		// 추가 글꼴 목록
          fOnBeforeUnload : function(){
            //alert("완료!");
          },
          I18N_LOCALE : 'ko_KR'
        }, //boolean
        
      });
      editorRef.current = oEditors;
    }

    // 수정 모드일 경우, 기존 게시글 데이터를 불러옴
    if (id) {
      const fetchBoard = async () => {
        try {
          const response = await axios.get(`/boards/${id}`);
          const data = response.data;
          setBoard({
            ...data,
            attachments: [],
          });
        } catch (error) {
          console.error('Error fetching board:', error);
        }
      };
      fetchBoard();
    }
  }, [id]);

  // 일반 입력 필드 처리 (제어형 컴포넌트 부분은 그대로 유지)
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
    setBoard((prev) => ({
      ...prev,
      attachments: Array.from(files),
    }));
  };

  // 폼 제출 시 에디터 내용 동기화 및 데이터 전송
  const handleSubmit = async (e) => {
    e.preventDefault();

    // 파일 업로드 처리 (생략된 부분은 기존 코드와 동일)
    let uploadedUrls = [];
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
        uploadedUrls = uploadResponse.data;
      } catch (error) {
        console.error('File upload failed:', error);
        alert('파일 업로드에 실패하였습니다.');
        return;
      }
    }

    const boardData = { ...board, attachments: uploadedUrls };
    if (id) {
      boardData.id = id;
    }

    // SmartEditor2의 내부 내용을 textarea로 동기화
    if (
      editorRef &&
      editorRef.current &&
      editorRef.current.getById &&
      typeof editorRef.current.getById["smarteditor"].exec === 'function'
    ) {
      editorRef.current.getById["smarteditor"].exec("UPDATE_CONTENTS_FIELD", []); // 이걸로 변경하니까 작동하네
    }
    const content = document.getElementById("smarteditor").value;
    boardData.content = content;

    try {
      const response = await axios.post('/boards', boardData);
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
        <div className="mb-3">
          <span className="textarea-group-text">내용</span>
          {/* 
              SmartEditor2가 기존 textarea를 대체하므로, 
              React의 제어형 컴포넌트 방식(value/onChange) 대신 초기값만 지정하는 것이 좋습니다.
          */}
          <textarea
            name="content"
            id="smarteditor"
            defaultValue={board.content} // 초기값만 지정
            placeholder="게시글 내용을 입력하세요."
            className="form-control"
            
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
