import React, { useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";
import * as tf from "@tensorflow/tfjs-core";
import "@tensorflow/tfjs-converter";
import "@tensorflow/tfjs-backend-webgl";
import * as poseDetection from "@tensorflow-models/pose-detection";
import "@mediapipe/hands";
import { ScreenContainer } from "../../components/screen/ScreenContainer";
import { WebcamBox } from "../../components/webcam/WebcamBox";
import toast from "react-hot-toast";
import { GestureContainer } from "./styles";
import { PoseGestureDraw } from "../../components/tensor/PoseGestureDraw";

export const PoseDetector = () => {
  const webcamComponent = useRef<Webcam | null>(null);
  const [poseFound, setposeFound] = useState(false);
  const poseDetectionInterval = useRef<NodeJS.Timeout | null>(null);
  const [posePoints, setPosePoints] = useState<
    poseDetection.Keypoint[] | undefined
  >(undefined);
  const [blanket, setBlanket] = useState(false);

  const toggleSwitch = () => {
    setBlanket(!blanket);
  };
  let detector: poseDetection.PoseDetector | undefined;

  const detectFaces = async () => {
    if (
      detector !== undefined &&
      webcamComponent.current !== undefined &&
      webcamComponent.current?.video !== null &&
      webcamComponent.current?.video !== undefined &&
      webcamComponent.current.video.readyState === 4
    ) {
      await detector
        .estimatePoses(webcamComponent.current?.video)
        .then((pose) => {
          if (pose.length > 0) {
            setPosePoints(pose[0].keypoints);
          } else {
            setPosePoints(undefined);
          }
        })
        .catch((error) => {
          toast.error(`estimate face error: ${error}`);
          console.log(error);
          setposeFound(true);
        });
    }
  };
  useEffect(() => {
    if (detector === undefined) {
      (async () => {
        const model = poseDetection.SupportedModels.BlazePose;
        const config: poseDetection.BlazePoseTfjsModelConfig = {
          runtime: "tfjs",
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

        await poseDetection
          .createDetector(model, config)
          .then((poseDetector) => {
            toast.success("Detector started");
            // eslint-disable-next-line react-hooks/exhaustive-deps
            detector = poseDetector;
            toast.success("Starting pose recognition");
            poseDetectionInterval.current = setInterval(detectFaces, 100);
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
    if (poseFound) {
      if (poseDetectionInterval.current !== null) {
        clearInterval(poseDetectionInterval.current);
        poseDetectionInterval.current = null;
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [poseFound]);

  return (
    <ScreenContainer switchAction={toggleSwitch}>
      <GestureContainer>
        <WebcamBox webcamRef={webcamComponent} />
        <PoseGestureDraw
          boxHeight="480px"
          boxWidth="480px"
          pointsList={posePoints}
          blanketOpacity={blanket}
        />
      </GestureContainer>
    </ScreenContainer>
  );
};
