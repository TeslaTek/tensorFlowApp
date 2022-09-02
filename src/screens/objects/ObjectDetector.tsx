import React, { useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";
import * as tf from "@tensorflow/tfjs-core";
import "@tensorflow/tfjs-converter";
import "@tensorflow/tfjs-backend-webgl";
import "@tensorflow/tfjs-backend-cpu";
import * as cocoSsd from "@tensorflow-models/coco-ssd";
import "@mediapipe/hands";
import { ScreenContainer } from "../../components/screen/ScreenContainer";
import { WebcamBox } from "../../components/webcam/WebcamBox";
import toast from "react-hot-toast";
import { GestureContainer } from "./styles";
import { ObjectDetectedDraw } from "../../components/tensor/ObjectsDetectedDraw";

export const ObjectDetector = () => {
  const webcamComponent = useRef<Webcam | null>(null);
  const [objectFound, setObjectFound] = useState(false);
  const objectDetection = useRef<NodeJS.Timeout | null>(null);
  const [objectPoints, setObjectsPoints] = useState<
    cocoSsd.DetectedObject[] | undefined
  >(undefined);
  const [blanket, setBlanket] = useState(false);

  const toggleSwitch = () => {
    setBlanket(!blanket);
  };
  let detector: cocoSsd.ObjectDetection | undefined;

  const detectFaces = async () => {
    if (
      detector !== undefined &&
      webcamComponent.current !== undefined &&
      webcamComponent.current?.video !== null &&
      webcamComponent.current?.video !== undefined &&
      webcamComponent.current.video.readyState === 4
    ) {
      await detector
        .detect(webcamComponent.current?.video)
        .then((objects) => {
          if (objects.length > 0) {
            setObjectsPoints(objects);
          } else {
            setObjectsPoints(undefined);
          }
        })
        .catch((error) => {
          toast.error(`estimate face error: ${error}`);
          console.log(error);
          setObjectFound(true);
        });
    }
  };
  useEffect(() => {
    if (detector === undefined) {
      (async () => {
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
        const config: cocoSsd.ModelConfig = {
          base: "mobilenet_v2",
        };
        await cocoSsd
          .load(config)
          .then((poseDetector) => {
            toast.success("Detector started");
            // eslint-disable-next-line react-hooks/exhaustive-deps
            detector = poseDetector;
            toast.success("Starting objects recognition");
            objectDetection.current = setInterval(detectFaces, 100);
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
    if (objectFound) {
      if (objectDetection.current !== null) {
        clearInterval(objectDetection.current);
        objectDetection.current = null;
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [objectFound]);

  return (
    <ScreenContainer switchAction={toggleSwitch}>
      <GestureContainer>
        <WebcamBox webcamRef={webcamComponent} />
        <ObjectDetectedDraw
          boxHeight="480px"
          boxWidth="480px"
          pointsList={objectPoints}
          blanketOpacity={blanket}
        />
      </GestureContainer>
    </ScreenContainer>
  );
};
