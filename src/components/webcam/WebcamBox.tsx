import React from "react";
import Webcam from "react-webcam";
import { CameraContainer } from "./styles";

interface WebcamProps {
  webcamRef: React.MutableRefObject<Webcam | null>;
}
export const WebcamBox = ({ webcamRef }: WebcamProps) => {
  const videoConstraints = {
    width: 480,
    height: 480,
    facingMode: "user",
  };
  return (
    <CameraContainer>
      <Webcam
        audio={false}
        height={videoConstraints.height}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        width={videoConstraints.width}
        videoConstraints={videoConstraints}
        style={{ borderRadius: 16 }}
        mirrored
      />
    </CameraContainer>
  );
};
