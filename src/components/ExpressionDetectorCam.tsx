"use client";

import { useEffect, useRef, useState } from "react";
import * as faceapi from "face-api.js";
import useLoopsStore from "@stores/LoopAudio";
import cx from "classnames";
import { STATUS } from "@stores/LoopAudio/LoopAudio";

export function ExpressionDetectorCam() {
  const EXPRESSIONS_EMOJIS = {
    "": "...",
    neutral: "😐",
    happy: "😀",
    sad: "☹",
    angry: "😠",
    fearful: "😨",
    disgusted: "🤢",
    surprised: "😮",
  };

  const [status, targetExpression, handleToggleRecordLoop] = useLoopsStore((state) => [
    state.status,
    state.targetExpression,
    state.handleToggleRecordLoop,
  ]);
  const [lastExpression, setLastExpression] = useState("");
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const camMediaStream = useRef<MediaStream | null>(null);
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

  // cleanup function for webcam usage
  useEffect(() => {
    return () => {
      camMediaStream.current?.getTracks().forEach((track) => {
        track.stop();
      });
    };
  }, [camMediaStream]);

  const startVideo = () => {
    navigator.mediaDevices
      .getUserMedia({ video: {} })
      .then((stream) => {
        camMediaStream.current = stream;
        let video = videoRef.current!;
        video.srcObject = stream;
        video.play();
      })
      .catch((err) => {
        console.error("error:", err);
        alert(err);
      });
  };

  useEffect(() => {
    if (intervalDetection.current) clearInterval(intervalDetection.current);

    detectExpressions();

    return () => {
      if (intervalDetection.current) clearInterval(intervalDetection.current);
    };
  }, [videoRef.current, targetExpression]);

  // sets intervalTimer that keeps detecting expressions
  const detectExpressions = () => {
    if (!videoRef.current) return;

    intervalDetection.current = setInterval(async () => {
      const detections = await faceapi
        .detectAllFaces(videoRef.current!, new faceapi.TinyFaceDetectorOptions())
        .withFaceExpressions();

      if (detections.length > 0) {
        const currentExpression = detections[0].expressions.asSortedArray()[0].expression;

        // console.log(currentExpression);

        if (currentExpression === targetExpression) {
          handleToggleRecordLoop();
        }

        setLastExpression(currentExpression);
      }
    }, 100);
  };
  0;
  return (
    <div className="relative">
      <video
        ref={videoRef}
        className={cx("w-60 h-auto rounded-[--rounded-box] border-2", {
          "border-primary": status === STATUS.recording,
          "border-transparent": status !== STATUS.recording,
        })}
        muted
      />
      <span className="absolute bottom-1 left-1/2 -translate-x-1/2 text-3xl">
        {EXPRESSIONS_EMOJIS[lastExpression as keyof typeof EXPRESSIONS_EMOJIS]}
      </span>
    </div>
  );
}
