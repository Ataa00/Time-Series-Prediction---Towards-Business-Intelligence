import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import Main from "./Components/Main/Main";
import Home from "./Components/Home/Home";

const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/main" element={<Main />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
