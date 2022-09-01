import React, { useEffect, useRef, useState } from "react";
import * as handPoseDetection from "@tensorflow-models/hand-pose-detection";
import { FullParentContainer, StyledCanvas } from "./styles";

interface GestureProps {
  boxWidth: string;
  boxHeight: string;
  pointsList: handPoseDetection.Keypoint[] | undefined;
  blanketOpacity: boolean;
}
export const HandGestureDraw = ({
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

  interface IFingerJoints {
    thumb: number[];
    indexFinger: number[];
    middleFinger: number[];
    ringFinger: number[];
    pinky: number[];
  }
  const fingerJoints = {
    thumb: [0, 1, 2, 3, 4],
    indexFinger: [0, 5, 6, 7, 8],
    middleFinger: [0, 9, 10, 11, 12],
    ringFinger: [0, 13, 14, 15, 16],
    pinky: [0, 17, 18, 19, 20],
  };

  // Infinity Gauntlet Style
  const style = [
    { color: "yellow", size: 8 },
    { color: "gold", size: 3 },
    { color: "green", size: 5 },
    { color: "gold", size: 3 },
    { color: "gold", size: 3 },
    { color: "purple", size: 5 },
    { color: "gold", size: 3 },
    { color: "gold", size: 3 },
    { color: "gold", size: 3 },
    { color: "blue", size: 5 },
    { color: "gold", size: 3 },
    { color: "gold", size: 3 },
    { color: "gold", size: 3 },
    { color: "red", size: 5 },
    { color: "gold", size: 3 },
    { color: "gold", size: 3 },
    { color: "gold", size: 3 },
    { color: "orange", size: 5 },
    { color: "gold", size: 3 },
    { color: "gold", size: 3 },
    { color: "gold", size: 3 },
  ];

  const drawHand = (
    predictions: handPoseDetection.Keypoint[],
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
      for (let j = 0; j < Object.keys(fingerJoints).length; j++) {
        let finger = Object.keys(fingerJoints)[j] as keyof IFingerJoints;
        //  Loop through pairs of joints
        for (let k = 0; k < fingerJoints[finger].length - 1; k++) {
          // Get pairs of joints
          const firstJointIndex = fingerJoints[finger][k];
          const secondJointIndex = fingerJoints[finger][k + 1];

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
          ctx.strokeStyle = "plum";
          ctx.lineWidth = 2;
          ctx.stroke();
        }
      }

      // Loop through landmarks and draw em
      for (let i = 0; i < landmarks.length; i++) {
        // Get x point
        const x = Math.round(landmarks[i].x) / 1.6;
        // Get y point
        const y = Math.round(landmarks[i].y) / 3.2;
        // Start drawing
        ctx.beginPath();
        ctx.arc(x, y, style[i]["size"], 1, 3 * Math.PI, false);

        // Set line color
        ctx.fillStyle = style[i]["color"];
        ctx.fill();
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
      <StyledCanvas parentH={boxHeight} parentW={boxWidth} ref={canvasRef} />
    </FullParentContainer>
  );
};
