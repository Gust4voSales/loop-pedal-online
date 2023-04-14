"use client";

import { useState } from "react";
import { ExpressionDetectorCam } from "@components/ExpressionDetectorCam";
import { AudioPlayerCard } from "@src/components/AudioPlayerCard";
import useLoopsStore from "@stores/LoopAudio";

export interface LoopAudio {
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
  const loopsAudioStore = useLoopsStore();

  const [useExpressionDetector, setUseExpressionDetector] = useState(false);

  function parseStatus(status: STATUS) {
    if (status === STATUS.idle) return "INATIVO";
    if (status === STATUS.waiting) return "ESPERANDO";
    if (status === STATUS.recording) return "GRAVANDO";
  }

  return (
    <div className="prose">
      <h1>{parseStatus(loopsAudioStore.status)}</h1>
      <button onClick={loopsAudioStore.handleToggleRecordLoop} className="btn">
        RECORD
      </button>
      <div>
        {loopsAudioStore.audios.map((loop) => (
          <AudioPlayerCard audioLoop={loop} key={loop.name} />
        ))}

        <button onClick={() => setUseExpressionDetector(!useExpressionDetector)} className="btn">
          CONTROLE POR WEBCAM
        </button>

        {useExpressionDetector && <ExpressionDetectorCam />}
      </div>
    </div>
  );
}
