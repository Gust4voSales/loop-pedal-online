"use client";

import useToggle from "@src/hooks/useToggle";
import { LoopAudio } from "@app/page";
import { SpeakerSimpleHigh, SpeakerSimpleSlash } from "@phosphor-icons/react";
import { SyntheticEvent, useState } from "react";

interface Props {
  audioLoop: LoopAudio;
}
export function AudioPlayerCard({ audioLoop }: Props) {
  const [muted, toggleMuted] = useToggle(false);
  const [currentProgress, setCurrentProgress] = useState(0);

  const updateCurrentProgress = (e: SyntheticEvent<HTMLAudioElement, Event>) => {
    setCurrentProgress(e.currentTarget.currentTime);
  };

  return (
    <div className="w-fit flex p-2 bg-base-100 rounded-[var(--rounded-btn)] shadow-xl prose">
      <div className="flex items-center gap-2">
        <button className={`btn btn-circle swap ${!muted && "swap-active"}`}>
          <SpeakerSimpleHigh size={32} onClick={toggleMuted} className="swap-on" />
          <SpeakerSimpleSlash size={32} onClick={toggleMuted} className="swap-off" />
        </button>

        <div>
          <h4 className="m-0">{audioLoop.name}</h4>
          <progress className="progress progress-primary w-56" value={currentProgress} max={audioLoop.duration} />
        </div>
      </div>

      {/* TODO: remove autoplay later (it will be controlled by baseAudio) */}
      <audio src={audioLoop.audioURL} id={audioLoop.name} muted={muted} onTimeUpdate={updateCurrentProgress} />
    </div>
  );
}
