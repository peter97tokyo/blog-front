import React from "react";
import { Routes, Route } from "react-router-dom";

import BoardList from './board/BoardList'
import BoardForm from './board/BoardForm'

function Code() {
  return (
      <main className="container my-5 admin">
            <Routes>
                <Route path="" element={<BoardList/>} />
                <Route path="form" element={<BoardForm/>} />
                <Route path="form/:id" element={<BoardForm />} />
                
            </Routes>
      </main>
  )
}

export default Code;