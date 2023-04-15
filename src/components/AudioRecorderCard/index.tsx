"use client";

import { useEffect, useState } from "react";
import useLoopsStore from "@stores/LoopAudio";
import { Hourglass, Microphone, Stop } from "@phosphor-icons/react";
import { STATUS } from "@stores/LoopAudio/LoopAudio";
import cx from "classnames";

const ButtonIcon = ({ status }: { status: STATUS }) => {
  if (status === STATUS.idle) return <Microphone size={32} weight="fill" />;
  if (status === STATUS.waiting) return <Hourglass size={32} weight="fill" className="animate-spin-slow" />;
  return <Stop size={32} weight="fill" className="animate-pulse-fast fill-red-500" />;
};

export function AudioRecorderCard() {
  const [status, baseAudio, handleToggleRecordLoop] = useLoopsStore((state) => [
    state.status,
    state.baseAudio,
    state.handleToggleRecordLoop,
  ]);
  const [baseAudioProgress, setCurrentProgress] = useState(0);

  useEffect(() => {
    if (!baseAudio) return;

    baseAudio.element.addEventListener("timeupdate", updateBaseAudioProgress);

    return () => {
      baseAudio?.element.removeEventListener("timeupdate", updateBaseAudioProgress);
    };
  }, [baseAudio]);

  const updateBaseAudioProgress = () => {
    setCurrentProgress(baseAudio?.element.currentTime ?? 0);
  };

  function parseStatus(status: STATUS) {
    if (status === STATUS.idle) return "Gravar loop";
    if (status === STATUS.waiting) return "ESPERANDO...";
    if (status === STATUS.recording) return "GRAVANDO...";
  }

  return (
    <div className="flex w-fit flex-col items-center">
      <div
        className={cx(
          "w-60 flex p-2 rounded-[var(--rounded-btn)] shadow-xl prose",
          { "bg-base-200": status === STATUS.idle },
          { "bg-neutral": status === STATUS.waiting },
          { "bg-primary": status === STATUS.recording }
        )}
      >
        <div className="w-full h-14 flex items-center gap-2">
          <button onClick={handleToggleRecordLoop} className="btn btn-circle">
            <ButtonIcon status={status} />
          </button>

          <div className="w-full">
            <h4
              className={cx(
                "m-0 text-base-content",
                { "text-primary-content": status === STATUS.recording },
                { "text-neutral-content": status === STATUS.waiting }
              )}
            >
              {parseStatus(status)}
            </h4>

            {baseAudio && status === STATUS.waiting && (
              <progress
                className="progress progress-primary bg-base-100 w-full"
                value={baseAudio.duration - baseAudioProgress} // inversed progress
                max={baseAudio.duration}
              />
            )}

            {baseAudio && status === STATUS.recording && (
              <progress
                className="progress progress-secondary w-full"
                value={baseAudioProgress}
                max={baseAudio.duration}
              />
            )}
          </div>
        </div>
      </div>
      <span>
        Pressione <kbd className="kbd kbd-sm">espaço</kbd> para iniciar
      </span>
    </div>
  );
}
