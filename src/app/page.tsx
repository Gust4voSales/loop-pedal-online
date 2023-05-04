"use client";

import { MouseEvent, useState } from "react";
import { ExpressionDetectorCam } from "@components/ExpressionDetectorCam";
import { AudioPlayerCard } from "@src/components/AudioPlayerCard";
import useLoopsStore, { EXPRESSIONS } from "@stores/LoopAudio";
import { AudioRecorderCard } from "@components/AudioRecorderCard";
import { Info, ArrowClockwise, Webcam, WebcamSlash } from "@phosphor-icons/react";
import { Props as TargetExpression, TargetExpressionButton } from "@components/TargetExpressionButton";
import Image from "next/image";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import Logo from "../../public/LogoSmall.png";
import Title from "../../public/LogoTitle.png";
import BgWave from "../../public/BgWave.svg";
import { TooltipButton } from "@components/TooltipButton";
import { STATUS } from "@stores/LoopAudio/LoopAudio";

export default function Home() {
  const [status, loopAudios, targetExpression, restartLoops] = useLoopsStore((state) => [
    state.status,
    state.audios,
    state.targetExpression,
    state.restartLoops,
  ]);
  const [parent] = useAutoAnimate();
  const [showLoopPedal, setShowLoopPedal] = useState(false);
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

  const handleToggleExpressionDetector = (e: MouseEvent<HTMLButtonElement>) => {
    e.currentTarget.blur(); // blurring so that SHORTCUT actions (space) won't click this button
    setUseExpressionDetector(!useExpressionDetector);
  };

  if (!showLoopPedal)
    return (
      <div className="hero min-h-screen bg-base-200">
        <div className="hero-content flex-col lg:flex-row">
          <Image alt="Logo - LoopPedalOnline" src={Logo} className="w-80 h-auto" />

          <div className="max-w-md">
            <h1 className="text-5xl font-bold">LoopPedal Online</h1>
            <p className="py-6">
              Simulador de Loop Pedal com controle intuitivo através de expressões faciais capturadas pela webcam.
              Experimente agora e libere sua criatividade!
            </p>
            <button onClick={() => setShowLoopPedal(true)} className="btn btn-primary">
              Começar
            </button>
          </div>
        </div>
      </div>
    );

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex relative mt-4 items-center justify-center">
        <Image alt="Background Logo" src={BgWave} className="w-full h-auto animate-blur" />
        <Image
          alt="Logo - LoopPedalOnline"
          src={Title}
          onClick={() => setShowLoopPedal(false)}
          className="absolute w-auto h-full min-h-[80px] cursor-pointer"
        />
      </div>

      <div className="w-full max-w-5xl mx-auto p-4 mt-4 bg-base-300 rounded-[var(--rounded-box)] animate-fade-bottom">
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
                      {EXPRESSIONS.find((e) => e.id === targetExpression)?.text}
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

          <div ref={parent} className="w-full p-1 mx-auto flex gap-2 flex-wrap">
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

          <div className="absolute right-0 top-0 flex flex-col">
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
