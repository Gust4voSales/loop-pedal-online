"use client";

import { SyntheticEvent, useState } from "react";
import useToggle from "@src/hooks/useToggle";
import { SpeakerSimpleHigh, SpeakerSimpleSlash } from "@phosphor-icons/react";
import { LoopAudio } from "@stores/LoopAudio/LoopAudio";

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
    <div className="w-60 flex p-2 bg-base-200 rounded-[var(--rounded-btn)] shadow-xl prose">
      <div className="w-full flex items-center gap-2">
        <button className={`btn btn-circle swap ${!muted && "swap-active"}`}>
          <SpeakerSimpleHigh size={32} onClick={toggleMuted} className="swap-on" />
          <SpeakerSimpleSlash size={32} onClick={toggleMuted} className="swap-off" />
        </button>

        <div className="w-full">
          <h4 className="m-0">{audioLoop.name}</h4>
          <progress
            className="progress progress-primary w-full"
            value={Math.ceil(currentProgress)}
            max={audioLoop.duration}
          />
        </div>
      </div>

      <audio src={audioLoop.audioURL} id={audioLoop.name} muted={muted} onTimeUpdate={updateCurrentProgress} />
    </div>
  );
}
