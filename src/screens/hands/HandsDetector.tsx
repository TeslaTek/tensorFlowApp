import React, { useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";
import * as tf from "@tensorflow/tfjs-core";
import "@tensorflow/tfjs-converter";
import "@tensorflow/tfjs-backend-webgl";
import * as handPoseDetection from "@tensorflow-models/hand-pose-detection";
import "@mediapipe/hands";
import { ScreenContainer } from "../../components/screen/ScreenContainer";
import { WebcamBox } from "../../components/webcam/WebcamBox";
import toast from "react-hot-toast";
import { GestureContainer } from "./styles";
import { HandGestureDraw } from "../../components/tensor/HandGestureDraw";

export const HandsDetector = () => {
  const webcamComponent = useRef<Webcam | null>(null);
  const [handFound, setHandFound] = useState(false);
  const handDetection = useRef<NodeJS.Timeout | null>(null);
  const [handsPoints, setHandsPoints] = useState<
    handPoseDetection.Keypoint[] | undefined
  >(undefined);

  let detector: handPoseDetection.HandDetector | undefined;

  const detectHands = async () => {
    if (
      detector !== undefined &&
      webcamComponent.current !== undefined &&
      webcamComponent.current?.video !== null &&
      webcamComponent.current?.video !== undefined &&
      webcamComponent.current.video.readyState === 4
    ) {
      await detector
        .estimateHands(webcamComponent.current?.video)
        .then((hands) => {
          if (hands.length > 0) {
            setHandsPoints(hands[0].keypoints);
          } else {
            setHandsPoints(undefined);
          }
        })
        .catch((error) => {
          toast.error(`estimate hand error: ${error}`);
          console.log(error);
          setHandFound(true);
        });
    }
  };
  useEffect(() => {
    if (detector === undefined) {
      (async () => {
        const model = handPoseDetection.SupportedModels.MediaPipeHands;
        const detectorConfig:
          | handPoseDetection.MediaPipeHandsTfjsModelConfig
          | handPoseDetection.MediaPipeHandsMediaPipeModelConfig = {
          runtime: "tfjs", // or 'mediapipe'
          modelType: "lite",
          maxHands: 2,
        };
        await tf
          .ready()
          .then(async () => {
            await tf.setBackend("webgl").catch((error) => {
              console.log("backend error: ", error);
            });
          })
          .catch((error) => {
            console.log("tf error: ", error);
          });

        await handPoseDetection
          .createDetector(model, detectorConfig)
          .then((handDetector) => {
            toast.success("Detector started");
            // eslint-disable-next-line react-hooks/exhaustive-deps
            detector = handDetector;
            toast.success("Start searching hands");
            handDetection.current = setInterval(detectHands, 100);
          })
          .catch((error) => {
            toast.error(`Tensor Problems: ${error} `);
            console.log(error);
          });
      })();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (handFound) {
      if (handDetection.current !== null) {
        clearInterval(handDetection.current);
        handDetection.current = null;
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [handFound]);

  return (
    <ScreenContainer>
      <GestureContainer>
        <WebcamBox webcamRef={webcamComponent} />
        <HandGestureDraw
          boxHeight="480px"
          boxWidth="480px"
          pointsList={handsPoints}
        />
      </GestureContainer>
    </ScreenContainer>
  );
};
