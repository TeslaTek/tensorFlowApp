import React, { useEffect, useRef, useState } from "react";
import * as cocoSsd from "@tensorflow-models/coco-ssd";
import { FullParentContainer, StyledCanvas } from "./styles";

interface GestureProps {
  boxWidth: string;
  boxHeight: string;
  pointsList: cocoSsd.DetectedObject[] | undefined;
  blanketOpacity: boolean;
}
export const ObjectDetectedDraw = ({
  boxHeight,
  boxWidth,
  pointsList,
  blanketOpacity,
}: GestureProps) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const canvasRef2 = useRef<HTMLCanvasElement | null>(null);
  const ContainerProps = {
    parentW: boxWidth,
    parentH: boxHeight,
    bkgOpacity: blanketOpacity,
  };
  const [ctx, setCtx] = useState<CanvasRenderingContext2D | null | undefined>(
    undefined
  );
  const [ctx2, setCtx2] = useState<CanvasRenderingContext2D | null | undefined>(
    undefined
  );

  const drawHand = (
    predictions: cocoSsd.DetectedObject[],
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
      if (ctx2 !== null && ctx2 !== undefined && canvasRef2.current) {
        ctx2.clearRect(
          0,
          0,
          canvasRef2.current.width,
          canvasRef2.current.height
        );
      }

      // Loop through landmarks and draw em
      for (let i = 0; i < landmarks.length; i++) {
        // Get x point
        const x = Math.round(landmarks[i].bbox[0]) / 1.6;
        // Get y point
        const y = Math.round(landmarks[i].bbox[1]) / 3.2;

        const width = landmarks[i].bbox[2];
        const height = landmarks[i].bbox[3];
        // Start drawing
        ctx.beginPath();

        ctx.rect(x, y, width / 1.6, height / 3.2);
        ctx.strokeStyle = blanketOpacity ? "white" : "#0d6efd";
        ctx.stroke();

        if (
          ctx2 !== undefined &&
          ctx2 !== null &&
          canvasRef2.current?.width !== undefined
        ) {
          ctx2.fillStyle = blanketOpacity ? "white" : "#0d6efd";
          ctx2.font = "15px Arial";
          ctx2.fillText(
            landmarks[i].class,
            canvasRef2.current?.width - (x + width / 2),
            y - 5
          );
        }
      }
    }
  };
  useEffect(() => {
    if (canvasRef.current !== null) {
      setCtx(canvasRef.current.getContext("2d"));
    }
    if (canvasRef2.current !== null) {
      setCtx2(canvasRef2.current.getContext("2d"));
    }
  }, []);

  useEffect(() => {
    if (pointsList && ctx !== undefined) {
      drawHand(pointsList, ctx);
    } else {
      if (ctx !== null && ctx !== undefined && canvasRef.current) {
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      }
      if (ctx2 !== null && ctx2 !== undefined && canvasRef2.current) {
        ctx2.clearRect(
          0,
          0,
          canvasRef2.current.width,
          canvasRef2.current.height
        );
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
      <StyledCanvas parentH={boxHeight} parentW={boxWidth} ref={canvasRef2} />
    </FullParentContainer>
  );
};
