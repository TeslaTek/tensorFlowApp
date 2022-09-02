import React from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { FaceDetector } from "../screens/face/FaceDetector";
import { HandsDetector } from "../screens/hands/HandsDetector";
import { ObjectDetector } from "../screens/objects/ObjectDetector";
import { PoseDetector } from "../screens/pose/PoseDetector";

export const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/">
          <Route index element={<Navigate to="home" />} />
          <Route path="home" element={<HandsDetector />} />
          <Route path="face" element={<FaceDetector />} />
          <Route path="pose" element={<PoseDetector />} />
          <Route path="objects" element={<ObjectDetector />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};
