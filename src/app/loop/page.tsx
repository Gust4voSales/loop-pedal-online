"use client";

import { MouseEvent, useEffect, useState } from "react";
import Image from "next/image";
import { ExpressionDetectorCam } from "@components/ExpressionDetectorCam";
import { AudioPlayerCard } from "@src/components/AudioPlayerCard";
import useLoopsStore, { EXPRESSIONS } from "@stores/LoopAudio";
import { AudioRecorderCard } from "@components/AudioRecorderCard";
import { Info, ArrowClockwise, Webcam, WebcamSlash } from "@phosphor-icons/react";
import { Props as TargetExpression, TargetExpressionButton } from "@components/TargetExpressionButton";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import Title from "@public/LogoTitle.png";
import BgWave from "@public/BgWave.svg";
import { TooltipButton } from "@components/TooltipButton";
import { STATUS } from "@stores/LoopAudio/LoopAudio";
import Link from "next/link";

export default function Loop() {
  const [status, loopAudios, targetExpression, restartLoops] = useLoopsStore((state) => [
    state.status,
    state.audios,
    state.targetExpression,
    state.restartLoops,
  ]);
  const [parent] = useAutoAnimate();
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

  // focusing tab resets playing audio, but baseAudio was not being reset
  // to prevent the bug, restart all loops on focus
  useEffect(() => {
    window.addEventListener("focus", restartLoops);

    return () => {
      window.removeEventListener("focus", restartLoops);
    };
  }, []);

  const handleToggleExpressionDetector = (e: MouseEvent<HTMLButtonElement>) => {
    e.currentTarget.blur(); // blurring so that SHORTCUT actions (space) won't click this button
    setUseExpressionDetector(!useExpressionDetector);
  };

  return (
    <div className="min-h-screen flex flex-col items-center gap-4">
      <div className="flex relative mt-4 items-center justify-center min-h-[120px]">
        <Image alt="Background Logo" src={BgWave} className="w-full h-auto animate-blur" priority />
        <Link href="/" className="absolute w-auto h-full min-h-[120px] ">
          <Image alt="Logo - LoopPedalOnline" src={Title} className="w-full h-full" />
        </Link>
      </div>

      <div className="w-full max-w-5xl p-4 m-4 bg-base-300 rounded-[--rounded-box] max-lg:w-[calc(100%-theme(spacing.4))] animate-fade-bottom">
        <div className="relative flex flex-col gap-4 items-center w-full max-[360px]:items-start">
          <div className="flex gap-5 flex-col md:flex-row">
            {useExpressionDetector && <ExpressionDetectorCam />}

            <div>
              <AudioRecorderCard />

              {useExpressionDetector && (
                <div className="mt-1 flex flex-col items-center">
                  <div className="divider my-0 text-xs">ou</div>

                  <span>
                    Expressão de{" "}
                    <span className="font-semibold uppercase">
                      {EXPRESSIONS.find((e) => e.id === targetExpression)?.text}
                    </span>
                  </span>
                  <div className="flex gap-1">
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
              <h3 className="gradient-text">LOOPS</h3>
            </div>
          </div>

          <div ref={parent} className="w-full p-1 mx-auto flex gap-2 flex-wrap max-lg:justify-center max-lg:gap-4">
            {loopAudios.map((loop) => (
              <AudioPlayerCard audioLoop={loop} key={loop.name} />
            ))}

            {loopAudios.length === 0 && (
              <div className="alert shadow-lg ">
                <div className="prose mx-auto">
                  <Info size={24} weight="fill" />
                  <span>Nenhum loop gravado ainda.</span>
                </div>
              </div>
            )}
          </div>

          <div className="absolute right-0 max-sm:-right-2 top-0 flex flex-col">
            <TooltipButton
              onClick={handleToggleExpressionDetector}
              className={`btn btn-ghost btn-circle swap ${!useExpressionDetector && "swap-active"}`}
              tooltip="Ativar webcam"
            >
              <Webcam size={24} weight="fill" className="swap-on" />
              <WebcamSlash size={24} weight="fill" className="swap-off" />
            </TooltipButton>

            {loopAudios.length > 0 && (
              <TooltipButton
                onClick={restartLoops}
                className="btn btn-ghost btn-circle"
                tooltip="Reiniciar loops"
                disabled={status !== STATUS.idle}
              >
                <ArrowClockwise size={24} weight="fill" />
              </TooltipButton>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
