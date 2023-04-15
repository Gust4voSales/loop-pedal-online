"use client";

import { useState } from "react";
import { ExpressionDetectorCam } from "@components/ExpressionDetectorCam";
import { AudioPlayerCard } from "@src/components/AudioPlayerCard";
import useLoopsStore from "@stores/LoopAudio";
import { STATUS } from "@stores/LoopAudio/LoopAudio";
import { AudioRecorderCard } from "@components/AudioRecorderCard";

export default function Home() {
  const loopsAudioStore = useLoopsStore();

  const [useExpressionDetector, setUseExpressionDetector] = useState(false);

  return (
    <div className="prose flex flex-col gap-4">
      <AudioRecorderCard />
      {loopsAudioStore.audios.map((loop) => (
        <AudioPlayerCard audioLoop={loop} key={loop.name} />
      ))}

      <button onClick={() => setUseExpressionDetector(!useExpressionDetector)} className="btn">
        CONTROLE POR WEBCAM
      </button>

      {useExpressionDetector && <ExpressionDetectorCam />}
    </div>
  );
}
