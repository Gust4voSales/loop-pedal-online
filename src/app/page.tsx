"use client";

import { useEffect, useState } from "react";

let maxTime = 0;
export default function Home() {
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  // const [audios, setAudios] = useState<HTMLAudioElement[]>([]);
  const [baseAudio, setBaseAudio] = useState<string | null>(null);
  const [audios, setAudios] = useState<string[]>([]);
  const [status, setStatus] = useState("idle");

  useEffect(() => {
    if (baseAudio === null) return;

    const baseAudioEl = document.getElementById("base-audio") as HTMLAudioElement;
    baseAudioEl.addEventListener("playing", () => {
      audios.forEach((audio) => {
        console.log(audio, "play");
        const audioEl = document.getElementById(audio) as HTMLAudioElement;
        audioEl.currentTime = 0;
        audioEl.play();
      });
    });

    return () => {
      console.log("remove");
    };
  }, [baseAudio, audios]);

  function handleRecordAudio() {
    const baseAudioEl = document.getElementById("base-audio") as HTMLAudioElement | null;
    const currentTime = baseAudioEl?.currentTime ?? 0;

    setStatus("waiting");
    setTimeout(() => {
      setStatus("recording");

      recordAudio();
    }, (maxTime - currentTime) * 1000);
  }

  function recordAudio() {
    navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
      const mediaRecorderInstance = new MediaRecorder(stream);

      const start = new Date().getTime();
      mediaRecorderInstance.start();

      if (baseAudio !== null) {
        const currentTime = (document.getElementById("base-audio") as HTMLAudioElement).currentTime;
        console.log("Tempo pra terminar", maxTime - currentTime);

        setTimeout(() => {
          stopRecording(mediaRecorderInstance);
        }, (maxTime - currentTime) * 1000);
      }

      let audioChunks: Blob[] = [];
      mediaRecorderInstance.ondataavailable = (e) => {
        audioChunks.push(e.data);
      };

      mediaRecorderInstance.onstop = async (e) => {
        if (baseAudio === null) {
          maxTime = ((new Date().getTime() - start) / 1000) % 60;
        }

        const audioBlob = new Blob(audioChunks);
        const audioUrl = URL.createObjectURL(audioBlob);
        // const audio = new Audio(audioUrl);
        // audio.loop = true;
        // audio.play();
        // setAudios([...audios, audio]);
        if (baseAudio === null) setBaseAudio(audioUrl);
        setAudios([...audios, audioUrl]);
      };

      setMediaRecorder(mediaRecorderInstance);
    });
  }

  function stopRecording(mediaRecorder: MediaRecorder | null) {
    if (mediaRecorder?.state !== "recording") return;

    mediaRecorder.stop();
    mediaRecorder.stream.getTracks().forEach((track) => {
      track.stop();
    });
    setStatus("idle");
  }

  return (
    <div>
      <div>{status}</div>
      <button onClick={handleRecordAudio}>PLAY</button>
      <button onClick={() => stopRecording(mediaRecorder)}>STOP</button>
      <div>
        {audios.map((loop) => (
          <audio id={loop} src={loop} controls key={loop} />
        ))}

        <div style={{ background: "blue" }}>
          {baseAudio && <audio id="base-audio" src={baseAudio} controls muted loop autoPlay />}
        </div>
      </div>
    </div>
  );
}
