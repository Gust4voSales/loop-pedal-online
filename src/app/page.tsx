"use client";

import { useState } from "react";
import { ExpressionDetectorCam } from "@components/ExpressionDetectorCam";
import { AudioPlayerCard } from "@src/components/AudioPlayerCard";
import useLoopsStore, { EXPRESSIONS } from "@stores/LoopAudio";
import { AudioRecorderCard } from "@components/AudioRecorderCard";
import { Info, Webcam, WebcamSlash } from "@phosphor-icons/react";
import { Props as TargetExpression, TargetExpressionButton } from "@components/TargetExpressionButton";

export default function Home() {
  const loopsAudioStore = useLoopsStore();

  const [useExpressionDetector, setUseExpressionDetector] = useState(false);
  const targetsExpressions: TargetExpression[] = [
    {
      expression: "surprised",
      emoji: "😮",
    },
    {
      expression: "happy",
      emoji: "😀",
    },
  ];

  return (
    <div className="w-full max-w-5xl mx-auto p-4 mt-4 bg-base-300 rounded-[var(--rounded-box)]">
      <div className="relative flex flex-col gap-4 items-center w-full">
        <div className="flex gap-5">
          {useExpressionDetector && <ExpressionDetectorCam />}

          <div>
            <AudioRecorderCard />

            {useExpressionDetector && (
              <div className="mt-1 flex flex-col items-center">
                <div className="divider my-0 text-xs">ou</div>

                <span>
                  Expressão de{" "}
                  <span className="font-semibold uppercase">
                    {EXPRESSIONS.find((e) => e.id === loopsAudioStore.targetExpression)?.text}
                  </span>
                </span>
                <div className="flex">
                  {targetsExpressions.map((target) => (
                    <TargetExpressionButton
                      key={target.expression}
                      expression={target.expression}
                      emoji={target.emoji}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

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

        <div className="tooltip absolute right-0 top-0" data-tip="Ativar webcam">
          <button
            onClick={() => setUseExpressionDetector(!useExpressionDetector)}
            className={`btn btn-ghost btn-circle  swap ${!useExpressionDetector && "swap-active"}`}
          >
            <Webcam size={24} weight="fill" className="swap-on" />
            <WebcamSlash size={24} weight="fill" className="swap-off" />
          </button>
        </div>
      </div>
    </div>
  );
}
