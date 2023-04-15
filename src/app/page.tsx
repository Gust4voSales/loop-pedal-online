"use client";

import { useState } from "react";
import { ExpressionDetectorCam } from "@components/ExpressionDetectorCam";
import { AudioPlayerCard } from "@src/components/AudioPlayerCard";
import useLoopsStore from "@stores/LoopAudio";
import { STATUS } from "@stores/LoopAudio/LoopAudio";
import { AudioRecorderCard } from "@components/AudioRecorderCard";
import { Info } from "@phosphor-icons/react";

export default function Home() {
  const loopsAudioStore = useLoopsStore();

  const [useExpressionDetector, setUseExpressionDetector] = useState(false);

  return (
    <div className="w-full max-w-5xl mx-auto p-4 mt-4 bg-base-300 rounded-[var(--rounded-box)]">
      <div className="flex flex-col gap-4 items-center w-full">
        <AudioRecorderCard />

        <div className="divider">
          <div className="prose">
            <h3>LOOPS</h3>
          </div>
        </div>

        <div className="w-full p-1 mx-auto flex gap-2 flex-wrap">
          {loopsAudioStore.audios.map((loop) => (
            <AudioPlayerCard audioLoop={loop} key={loop.name} />
          ))}

          {loopsAudioStore.audios.length === 0 && (
            <div className="alert shadow-lg ">
              <div className="prose mx-auto">
                <Info size={24} weight="fill" />
                <span>Nenhum loop gravado ainda.</span>
              </div>
            </div>
          )}
        </div>

        {/* <button onClick={() => setUseExpressionDetector(!useExpressionDetector)} className="btn w-min">
        WEBCAM
      </button> */}

        {useExpressionDetector && <ExpressionDetectorCam />}
      </div>
    </div>
  );
}
