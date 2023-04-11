"use client";

import { useEffect, useRef, useState } from "react";
import ExpressionDetectorCam from "./components/ExpressionDetectorCam";

interface LoopAudio {
  name: string;
  audioURL: string;
  duration: number; // seconds
}
export default function Home() {
  // const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const [audios, setAudios] = useState<LoopAudio[]>([]);
  const [baseAudio, setBaseAudio] = useState<LoopAudio | null>(null);
  const baseAudioRef = useRef<HTMLAudioElement | null>(null);
  const [useExpressionDetector, setUseExpressionDetector] = useState(false);
  const [status, setStatus] = useState("idle");
  const [disabled, setDisabled] = useState(false);

  const loopAudios = () => {
    audios.forEach((audio) => {
      // console.log(audio.name, "play");
      const audioEl = document.getElementById(audio.name) as HTMLAudioElement;
      audioEl.currentTime = 0;
      audioEl.play();
    });
  };

  // TODO: focus resets playing (with sound) audios
  useEffect(() => {
    if (!baseAudioRef.current) return;

    baseAudioRef.current.addEventListener("playing", loopAudios);

    return () => {
      baseAudioRef.current?.removeEventListener("playing", loopAudios);
    };
  }, [baseAudioRef.current, audios]);

  async function handleToggleRecordLoop() {
    if (disabled) return;
    console.log("status ", status);
    if (status === "idle") {
      const currentTime = baseAudioRef.current?.currentTime ?? 0;

      setDisabled(true);
      setTimeout(() => {
        setDisabled(false);
      }, 1000);
      setStatus("waiting");
      setTimeout(() => {
        setStatus("recording");
        recordAudio();
      }, ((baseAudio?.duration ?? 0) - currentTime) * 1000);
    } else if (status === "recording") {
      setDisabled(true);

      setTimeout(() => {
        setDisabled(false);
      }, 1000);
      stopRecording();
    }
    // waiting --> called when waiting, then do nothing
  }

  function recordAudio() {
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        const mediaRecorderInstance = new MediaRecorder(stream);

        const startTime = new Date().getTime();
        mediaRecorderInstance.start();

        // schedule stopRecording
        if (baseAudio && baseAudioRef.current) {
          const currentTime = baseAudioRef.current!.currentTime;

          setTimeout(() => {
            stopRecording();
          }, (baseAudio.duration - currentTime) * 1000);
        }

        let audioChunks: Blob[] = [];
        mediaRecorderInstance.ondataavailable = (e) => {
          audioChunks.push(e.data);
        };

        mediaRecorderInstance.onstop = async (e) => {
          const duration = ((new Date().getTime() - startTime) / 1000) % 60;
          const audioURL = URL.createObjectURL(new Blob(audioChunks));

          if (!baseAudio) setBaseAudio({ audioURL, duration, name: "BASE" });
          setAudios([...audios, { audioURL, duration, name: `AUDIO-${audios.length + 1}` }]);
        };

        // setMediaRecorder(mediaRecorderInstance);
        mediaRecorder.current = mediaRecorderInstance;
      })
      .catch(() => {
        alert("Não foi possível acessar o microfone. Garanta a permissão antes.");
        setStatus("idle");
      });
  }

  // function stopRecording(mediaRecorder: MediaRecorder | null) {
  function stopRecording() {
    console.log("stop?", mediaRecorder.current?.state);
    if (mediaRecorder.current?.state !== "recording") return;

    mediaRecorder.current?.stop();
    mediaRecorder.current?.stream.getTracks().forEach((track) => {
      track.stop();
    });
    setStatus("idle");
  }

  return (
    <div>
      <h1>{status}</h1>
      <button onClick={handleToggleRecordLoop}>RECORD</button>
      <div>
        {audios.map((loop) => (
          <div style={{ display: "flex", flexDirection: "column" }} key={loop.name}>
            <span>{loop.name}</span>
            <audio id={loop.name} src={loop.audioURL} controls />
          </div>
        ))}

        <div style={{ background: "blue" }}>
          {baseAudio && (
            <div>
              <span>{baseAudio.duration}</span>
              <audio ref={baseAudioRef} src={baseAudio.audioURL} controls muted loop autoPlay />
            </div>
          )}
        </div>

        <button onClick={() => setUseExpressionDetector(!useExpressionDetector)}>CONTROLE POR WEBCAM</button>

        {useExpressionDetector && <ExpressionDetectorCam onExpressionMatch={handleToggleRecordLoop} status={status} />}
      </div>
    </div>
  );
}
