import React from "react";
import { Routes, Route } from "react-router-dom";

import BoardConfigList from './boardConfig/BoardConfigList'
import BoardConfigForm from './boardConfig/BoardConfigForm'

function Code() {
  return (
      <main className="container my-5 admin">
            <Routes>
                <Route path="" element={<BoardConfigList/>} />
                <Route path="form" element={<BoardConfigForm/>} />
                <Route path="form/:id" element={<BoardConfigForm />} />
                
            </Routes>
      </main>
  )
}

export default Code;