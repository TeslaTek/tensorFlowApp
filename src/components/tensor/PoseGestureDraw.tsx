import React, { useEffect, useRef, useState } from "react";
import * as poseDetection from "@tensorflow-models/pose-detection";
import { FullParentContainer, StyledCanvas } from "./styles";

interface GestureProps {
  boxWidth: string;
  boxHeight: string;
  pointsList: poseDetection.Keypoint[] | undefined;
  blanketOpacity: boolean;
}
export const PoseGestureDraw = ({
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

  interface IPoseFigures {
    body: number[];
    face: number[];
    leftArm: number[];
    rightArm: number[];
    leftLeg: number[];
    rightLeg: number[];
  }
  const poseFigures: IPoseFigures = {
    body: [11, 12, 24, 23, 11],
    face: [1, 2, 3, 7, 9, 10, 8, 6, 5, 4, 1, 0, 4],
    leftArm: [11, 13, 15, 17, 19, 21, 15],
    rightArm: [12, 14, 16, 18, 20, 22, 16],
    leftLeg: [23, 25, 27, 31, 29, 27],
    rightLeg: [24, 26, 28, 32, 30, 28],
  };

  const drawHand = (
    predictions: poseDetection.Keypoint[],
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
      // Loop through fingers
      for (let j = 0; j < Object.keys(poseFigures).length; j++) {
        let figure = Object.keys(poseFigures)[j] as keyof IPoseFigures;
        //  Loop through pairs of joints
        for (let k = 0; k < poseFigures[figure].length - 1; k++) {
          // Get pairs of joints
          const firstJointIndex = poseFigures[figure][k];
          const secondJointIndex = poseFigures[figure][k + 1];

          // Draw path
          ctx.beginPath();
          ctx.moveTo(
            Math.round(landmarks[firstJointIndex].x) / 1.6,
            Math.round(landmarks[firstJointIndex].y) / 3.2
          );
          ctx.lineTo(
            Math.round(landmarks[secondJointIndex].x) / 1.6,
            Math.round(landmarks[secondJointIndex].y) / 3.2
          );
          ctx.strokeStyle = "white";
          ctx.lineWidth = 2;
          ctx.stroke();
        }
      }

      // Loop through landmarks and draw em
      for (let i = 0; i < landmarks.length; i++) {
        if (i !== 1 && i !== 3 && i !== 4 && i !== 6 && i !== 8 && i !== 7) {
          // Get x point
          const x = Math.round(landmarks[i].x) / 1.6;
          // Get y point
          const y = Math.round(landmarks[i].y) / 3.2;
          // Start drawing
          ctx.beginPath();

          ctx.arc(x, y, i === 5 || i === 2 ? 3 : 2, 0, 2 * Math.PI);
          ctx.fillStyle = i === 5 || i === 2 ? "white" : "gold";
          ctx.fill();
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
