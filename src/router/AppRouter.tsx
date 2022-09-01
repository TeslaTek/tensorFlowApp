import React from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { FaceDetector } from "../screens/face/FaceDetector";
import { HandsDetector } from "../screens/hands/HandsDetector";

export const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/">
          <Route index element={<Navigate to="home" />} />
          <Route path="home" element={<HandsDetector />} />
          <Route path="face" element={<FaceDetector />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};
