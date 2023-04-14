"use client";

import { useEffect, useRef, useState } from "react";
import * as faceapi from "face-api.js";
import useLoopsStore from "@stores/LoopAudio";

export function ExpressionDetectorCam() {
  const handleToggleRecordLoop = useLoopsStore((state) => state.handleToggleRecordLoop);
  const targetExpression = "surprised";
  const [lastExpression, setLastExpression] = useState("");
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const intervalDetection = useRef<NodeJS.Timer | null>(null);

  useEffect(() => {
    const loadModels = async () => {
      const MODEL_URL = "/face-api-models";

      Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
        faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL),
      ]).then(startVideo);
    };
    console.log("Load models");
    loadModels();
  }, []);

  const startVideo = () => {
    navigator.mediaDevices
      .getUserMedia({ video: {} })
      .then((stream) => {
        let video = videoRef.current!;
        video.srcObject = stream;
        video.play();
      })
      .catch((err) => {
        console.error("error:", err);
      });
  };

  useEffect(() => {
    if (intervalDetection.current) clearInterval(intervalDetection.current);

    detectExpressions();

    return () => {
      if (intervalDetection.current) clearInterval(intervalDetection.current);
    };
  }, [videoRef.current]);

  // sets intervalTimer that keeps detecting expressions
  const detectExpressions = () => {
    if (!videoRef.current) return;

    intervalDetection.current = setInterval(async () => {
      const detections = await faceapi
        .detectAllFaces(videoRef.current!, new faceapi.TinyFaceDetectorOptions())
        .withFaceExpressions();

      if (detections.length > 0) {
        const currentExpression = detections[0].expressions.asSortedArray()[0].expression;

        console.log(currentExpression);

        if (currentExpression === targetExpression) {
          handleToggleRecordLoop();
        }

        setLastExpression(currentExpression);
      }
    }, 100);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", width: "fit-content" }}>
      <video ref={videoRef} height={300} width={300} style={{ margin: 0 }} muted />
      <h2 style={{ margin: 0 }}>{lastExpression}</h2>
    </div>
  );
}
