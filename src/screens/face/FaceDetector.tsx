import React, { useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";
import * as tf from "@tensorflow/tfjs-core";
import "@tensorflow/tfjs-converter";
import "@tensorflow/tfjs-backend-webgl";
import * as faceLandmarksDetection from "@tensorflow-models/face-landmarks-detection";
import "@mediapipe/hands";
import { ScreenContainer } from "../../components/screen/ScreenContainer";
import { WebcamBox } from "../../components/webcam/WebcamBox";
import toast from "react-hot-toast";
import { GestureContainer } from "./styles";
import { FaceGestureDraw } from "../../components/tensor/FaceGestureDraw";

export const FaceDetector = () => {
  const webcamComponent = useRef<Webcam | null>(null);
  const [faceFound, setFaceFound] = useState(false);
  const faceDetection = useRef<NodeJS.Timeout | null>(null);
  const [facePoints, setFacePoints] = useState<
    faceLandmarksDetection.Keypoint[] | undefined
  >(undefined);
  const [blanket, setBlanket] = useState(false);

  const toggleSwitch = () => {
    setBlanket(!blanket);
  };
  let detector: faceLandmarksDetection.FaceLandmarksDetector | undefined;

  const detectFaces = async () => {
    if (
      detector !== undefined &&
      webcamComponent.current !== undefined &&
      webcamComponent.current?.video !== null &&
      webcamComponent.current?.video !== undefined &&
      webcamComponent.current.video.readyState === 4
    ) {
      await detector
        .estimateFaces(webcamComponent.current?.video)
        .then((face) => {
          if (face.length > 0) {
            setFacePoints(face[0].keypoints);
          } else {
            setFacePoints(undefined);
          }
        })
        .catch((error) => {
          toast.error(`estimate face error: ${error}`);
          console.log(error);
          setFaceFound(true);
        });
    }
  };
  useEffect(() => {
    if (detector === undefined) {
      (async () => {
        const model = faceLandmarksDetection.SupportedModels.MediaPipeFaceMesh;
        const detectorConfig: faceLandmarksDetection.MediaPipeFaceMeshTfjsModelConfig =
          {
            runtime: "tfjs", // or 'mediapipe'
            maxFaces: 1,
            refineLandmarks: true,
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

        await faceLandmarksDetection
          .createDetector(model, detectorConfig)
          .then((faceDetector) => {
            toast.success("Detector started");
            // eslint-disable-next-line react-hooks/exhaustive-deps
            detector = faceDetector;
            toast.success("Starting face recognition");
            faceDetection.current = setInterval(detectFaces, 100);
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
    if (faceFound) {
      if (faceDetection.current !== null) {
        clearInterval(faceDetection.current);
        faceDetection.current = null;
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [faceFound]);

  return (
    <ScreenContainer switchAction={toggleSwitch}>
      <GestureContainer>
        <WebcamBox webcamRef={webcamComponent} />
        <FaceGestureDraw
          boxHeight="480px"
          boxWidth="480px"
          pointsList={facePoints}
          blanketOpacity={blanket}
        />
      </GestureContainer>
    </ScreenContainer>
  );
};
