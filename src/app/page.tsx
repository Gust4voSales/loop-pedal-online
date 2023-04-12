"use client";

import { useEffect, useRef, useState } from "react";
import ExpressionDetectorCam from "./components/ExpressionDetectorCam";

interface LoopAudio {
  name: string;
  audioURL: string;
  duration: number; // seconds
}

enum STATUS {
  idle,
  recording,
  waiting,
}

export default function Home() {
  const mediaRecorder = useRef<MediaRecorder | null>(null);

  const [audios, setAudios] = useState<LoopAudio[]>([]);
  const [baseAudio, setBaseAudio] = useState<LoopAudio | null>(null);
  const baseAudioRef = useRef<HTMLAudioElement | null>(null);

  const [useExpressionDetector, setUseExpressionDetector] = useState(false);
  const [status, setStatus] = useState<STATUS>(STATUS.idle);

  const COMMAND_DELAY = 1000;
  const [disabled, setDisabled] = useState(false);

  const loopAudios = () => {
    audios.forEach((audio) => {
      const audioEl = document.getElementById(audio.name) as HTMLAudioElement;
      audioEl.currentTime = 0;
      audioEl.play();
    });
  };

  // LOOP audios controlled by baseAudio
  useEffect(() => {
    if (!baseAudioRef.current) return;

    baseAudioRef.current.addEventListener("playing", loopAudios);

    return () => {
      baseAudioRef.current?.removeEventListener("playing", loopAudios);
    };
  }, [baseAudioRef.current, audios]);

  // prevent the user from calling the same command (ExpressionIdentifier can call recording multiple times)
  function temporarilyDisableCommands() {
    setDisabled(true);

    setTimeout(() => {
      setDisabled(false);
    }, COMMAND_DELAY);
  }

  async function handleToggleRecordLoop() {
    if (disabled) return;

    if (status === STATUS.idle) {
      const currentTime = baseAudioRef.current?.currentTime ?? 0;

      temporarilyDisableCommands();

      setStatus(STATUS.waiting);

      // schedule the recording when the baseAudio starts looping (when baseAudio is not set, it schedules for now)
      setTimeout(() => {
        setStatus(STATUS.recording);
        recordAudio();
      }, ((baseAudio?.duration ?? 0) - currentTime) * 1000);
    } else if (status === STATUS.recording) {
      temporarilyDisableCommands();

      stopRecording();
    }
    // waiting --> called when waiting, then do nothing
  }

  function recordAudio() {
    navigator.mediaDevices
      .getUserMedia({
        audio: {
          echoCancellation: false, // prevent playng audios from interfering
          noiseSuppression: true, // TODO add as option
        },
      })
      .then((stream) => {
        const mediaRecorderInstance = new MediaRecorder(stream);

        const startTime = new Date().getTime();
        mediaRecorderInstance.start();

        let audioChunks: Blob[] = [];
        mediaRecorderInstance.ondataavailable = (e) => {
          audioChunks.push(e.data);
        };

        mediaRecorderInstance.onstop = async (e) => {
          const duration = ((new Date().getTime() - startTime) / 1000) % 60;
          const audioURL = URL.createObjectURL(new Blob(audioChunks, { type: mediaRecorderInstance.mimeType }));

          if (!baseAudio) setBaseAudio({ audioURL, duration, name: "BASE" });
          setAudios([...audios, { audioURL, duration, name: `AUDIO-${audios.length + 1}` }]);
        };

        // schedule stopRecording when there is a baseAudio (max duration is baseAudio's duration)
        if (baseAudio && baseAudioRef.current) {
          const currentTime = baseAudioRef.current!.currentTime;

          setTimeout(() => {
            stopRecording();
          }, (baseAudio.duration - currentTime) * 1000);
        }

        mediaRecorder.current = mediaRecorderInstance;
      })
      .catch(() => {
        alert("Não foi possível acessar o microfone. Garanta a permissão antes.");
        setStatus(STATUS.idle);
      });
  }

  function stopRecording() {
    if (mediaRecorder.current!.state !== "recording") return;

    mediaRecorder.current?.stop();
    mediaRecorder.current?.stream.getTracks().forEach((track) => {
      track.stop();
    });
    setStatus(STATUS.idle);
  }

  function parseStatus(status: STATUS) {
    if (status === STATUS.idle) return "INATIVO";
    if (status === STATUS.waiting) return "ESPERANDO";
    if (status === STATUS.recording) return "GRAVANDO";
  }

  return (
    <div>
      <h1>{parseStatus(status)}</h1>
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

        {useExpressionDetector && <ExpressionDetectorCam onExpressionMatch={handleToggleRecordLoop} />}
      </div>
    </div>
  );
}
