"use client";

import { FocusEvent, SyntheticEvent, useState } from "react";
import useToggle from "@src/hooks/useToggle";
import { SpeakerSimpleHigh, SpeakerSimpleSlash, TrashSimple } from "@phosphor-icons/react";
import { LoopAudio, STATUS } from "@stores/LoopAudio/LoopAudio";
import useLoopStore from "@stores/LoopAudio";

interface Props {
  audioLoop: LoopAudio;
}
export function AudioPlayerCard({ audioLoop }: Props) {
  const [status, removeLoop, setIsEditingLoopName] = useLoopStore((state) => [
    state.status,
    state.removeLoop,
    state.setIsEditingLoopName,
  ]);
  const [muted, toggleMuted] = useToggle(false);
  const [currentProgress, setCurrentProgress] = useState(0);

  const updateCurrentProgress = (e: SyntheticEvent<HTMLAudioElement, Event>) => {
    setCurrentProgress(e.currentTarget.currentTime);
  };

  const handleRemoveLoop = () => {
    removeLoop(audioLoop.id);
  };

  const handleFocusLoopNameInput = (e: FocusEvent<HTMLInputElement>) => {
    e.target.select(); // select all text
    setIsEditingLoopName(true); // set editingLoopName flag
  };

  return (
    <div className="w-60 flex p-2 bg-base-200 rounded-[var(--rounded-btn)] shadow-xl prose">
      <div className="w-full flex items-center gap-2">
        <button className={`btn btn-circle swap ${!muted && "swap-active"}`}>
          <SpeakerSimpleHigh size={32} onClick={toggleMuted} className="swap-on" />
          <SpeakerSimpleSlash size={32} onClick={toggleMuted} className="swap-off" />
        </button>

        <div className="w-full">
          <div className="flex gap-2 items-center">
            <input
              defaultValue={audioLoop.name}
              onFocus={handleFocusLoopNameInput}
              onBlur={() => setIsEditingLoopName(false)}
              className="input input-ghost px-1 h-6 w-full cursor-pointer focus:cursor-text"
            />
            <button
              data-tip="Remover loop"
              onClick={handleRemoveLoop}
              className="tooltip h-min w-min hover:text-error transition-colors"
              disabled={status !== STATUS.idle}
            >
              <TrashSimple size={18} weight="fill" />
            </button>
          </div>
          <progress className="progress progress-primary w-full" value={currentProgress} max={audioLoop.duration} />
        </div>
      </div>

      <audio src={audioLoop.audioURL} id={audioLoop.name} muted={muted} onTimeUpdate={updateCurrentProgress} />
    </div>
  );
}
