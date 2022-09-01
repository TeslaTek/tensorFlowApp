import React, { useEffect, useRef, useState } from "react";
import * as faceLandmarksDetection from "@tensorflow-models/face-landmarks-detection";
import { FullParentContainer, StyledCanvas } from "./styles";

interface GestureProps {
  boxWidth: string;
  boxHeight: string;
  pointsList: faceLandmarksDetection.Keypoint[] | undefined;
}
export const FaceGestureDraw = ({
  boxHeight,
  boxWidth,
  pointsList,
}: GestureProps) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const ContainerProps = { parentW: boxWidth, parentH: boxHeight };
  const [ctx, setCtx] = useState<CanvasRenderingContext2D | null | undefined>(
    undefined
  );

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

      // Loop through landmarks and draw em
      for (let i = 0; i < landmarks.length; i++) {
        // Get x point
        if (landmarks[i].name) {
          const x = Math.round(landmarks[i].x) / 1.6;
          // Get y point
          const y = Math.round(landmarks[i].y) / 3.2;
          // Start drawing
          ctx.beginPath();
          ctx.arc(x, y, 1, 1, 3 * Math.PI, false);

          // Set line color

          ctx.fillStyle = "gold";

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
      <StyledCanvas parentH={boxHeight} parentW={boxWidth} ref={canvasRef} />
    </FullParentContainer>
  );
};
