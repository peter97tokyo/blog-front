import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";

import CodeList from './code/CodeList'
import CodeForm from './code/CodeForm'
import CodeDetail from './code/CodeDetail'

function Code() {
  return (
      <main className="container my-5 admin">

            <section className="row">
                {/* 사이드바 */}
                <CodeList/>
                <Routes>
                    <Route path="" element={<CodeForm/>} />
                    <Route path="form" element={<CodeForm/>} />
                    <Route path="detail" element={<CodeDetail/>} />
                </Routes>
            </section>
      </main>
  )
}

export default Code;