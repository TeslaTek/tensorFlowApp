import React from "react";
import { Toaster } from "react-hot-toast";
import { HandsDetector } from "./screens/tensor/HandsDetector";

function App() {
  return (
    <>
      <HandsDetector />
      <Toaster />
    </>
  )
}

export default App;
