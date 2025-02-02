import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";

import BoardConfigList from './boardConfig/BoardConfigList'
import BoardConfigForm from './boardConfig/BoardConfigForm'
import BoardConfigDetail from './boardConfig/BoardConfigDetail'

function Code() {
  return (
      <main className="container my-5 admin">
            <Routes>
                <Route path="" element={<BoardConfigList/>} />
                <Route path="form" element={<BoardConfigForm/>} />
                <Route path="form/:id" element={<BoardConfigForm />} />
                <Route path="detail" element={<BoardConfigDetail/>} />
            </Routes>
      </main>
  )
}

export default Code;