import React, { useEffect, useRef, useState } from "react";
import * as faceLandmarksDetection from "@tensorflow-models/face-landmarks-detection";
import { FullParentContainer, StyledCanvas } from "./styles";

interface GestureProps {
  boxWidth: string;
  boxHeight: string;
  pointsList: faceLandmarksDetection.Keypoint[] | undefined;
  blanketOpacity: boolean;
}
export const FaceGestureDraw = ({
  boxHeight,
  boxWidth,
  pointsList,
  blanketOpacity,
}: GestureProps) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const ContainerProps = {
    parentW: boxWidth,
    parentH: boxHeight,
    bkgOpacity: blanketOpacity,
  };
  const [ctx, setCtx] = useState<CanvasRenderingContext2D | null | undefined>(
    undefined
  );
  interface IFaceZones {
    faceOval: number[];
    leftEye: number[];
    rightEye: number[];
    leftEyeBrow: number[];
    rightEyeBrow: number[];
    lips: number[];
    nose: number[];
  }
  const faceZones: IFaceZones = {
    faceOval: [
      10, 338, 297, 332, 284, 251, 389, 356, 454, 323, 361, 288, 397, 365, 379,
      378, 400, 377, 152, 148, 176, 149, 150, 136, 172, 58, 132, 93, 234, 127,
      162, 21, 54, 103, 67, 109, 10,
    ],
    leftEye: [
      464, 414, 286, 258, 257, 259, 260, 467, 359, 255, 339, 254, 253, 252, 256,
      341, 463, 362, 398, 384, 385, 386, 387, 388, 466, 263, 249, 390, 373, 374,
      380, 381, 382, 362,
    ],
    rightEye: [
      243, 190, 56, 28, 27, 29, 30, 247, 130, 25, 110, 24, 23, 22, 26, 112, 243,
      133, 173, 157, 158, 159, 160, 161, 246, 33, 7, 163, 144, 145, 153, 154,
      155, 133,
    ],
    lips: [
      57, 185, 40, 39, 37, 0, 267, 269, 270, 409, 287, 375, 321, 405, 314, 17,
      84, 181, 91, 146, 57, 61, 76, 62, 78, 191, 80, 81, 82, 13, 312, 311, 310,
      415, 308, 292, 291, 306, 292, 324, 318, 402, 317, 14, 87, 178, 88, 95, 78,
      62,
    ],
    nose: [
      2, 326, 328, 290, 392, 439, 278, 279, 420, 399, 351, 168, 122, 174, 198,
      49, 48, 219, 166, 60, 99, 97, 2, 94, 370, 462, 250, 309, 438, 344, 440,
      275, 4, 45, 220, 115, 218, 79, 20, 242, 141, 94, 1, 4, 5, 6, 168,
    ],
    leftEyeBrow: [336, 296, 334, 293, 300, 276, 283, 282, 295, 285, 336],
    rightEyeBrow: [107, 66, 105, 63, 70, 46, 53, 52, 65, 55, 107],
  };

  const drawHand = (
    predictions: faceLandmarksDetection.Keypoint[],
    ctx: CanvasRenderingContext2D | null
  ) => {
    // Check if we have predictions
    if (predictions.length > 0 && ctx !== null) {
      // Loop through each prediction

      // Grab landmarks
      const landmarks = predictions;
      if (canvasRef.current) {
        ctx.clearRect(
          0,
          0,
          canvasRef.current?.width,
          canvasRef.current?.height
        );
      }

      // Loop through face inputs
      for (let j = 0; j < Object.keys(faceZones).length; j++) {
        let zone = Object.keys(faceZones)[j] as keyof IFaceZones;
        //  Loop through pairs of joints
        for (let k = 0; k < faceZones[zone].length - 1; k++) {
          // Get pairs of joints
          const firstJointIndex = faceZones[zone][k];
          const secondJointIndex = faceZones[zone][k + 1];
          if (
            firstJointIndex < landmarks.length &&
            secondJointIndex < landmarks.length
          ) {
            // Draw path
            ctx.beginPath();
            ctx.moveTo(
              Math.round(landmarks[firstJointIndex].x) / 1.6,
              Math.round(landmarks[firstJointIndex].y) / 3.19
            );
            ctx.lineTo(
              Math.round(landmarks[secondJointIndex].x) / 1.6,
              Math.round(landmarks[secondJointIndex].y) / 3.19
            );
            ctx.strokeStyle = "white";
            ctx.lineWidth = 1;
            ctx.stroke();
          } else {
            console.log(
              "fuera de rango: ",
              firstJointIndex,
              "  ",
              secondJointIndex
            );
          }
        }
      }
    }
  };
  useEffect(() => {
    if (canvasRef.current !== null) {
      setCtx(canvasRef.current.getContext("2d"));
    }
  }, []);

  useEffect(() => {
    if (pointsList && ctx !== undefined) {
      drawHand(pointsList, ctx);
    } else {
      if (ctx !== null && ctx !== undefined && canvasRef.current) {
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pointsList]);

  return (
    <FullParentContainer {...ContainerProps}>
      <StyledCanvas
        parentH={boxHeight}
        parentW={boxWidth}
        ref={canvasRef}
        mirrored
      />
    </FullParentContainer>
  );
};
