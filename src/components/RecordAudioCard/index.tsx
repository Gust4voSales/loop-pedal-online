"use client";

import { Microphone, Stop } from "@phosphor-icons/react";
import useToggle from "@src/hooks/useToggle";

export function RecordAudioCard() {
  const [toggle, handleToggle] = useToggle();

  return (
    <div className="flex flex-col items-center">
      <div
        className={`w-60 flex p-2 ${
          toggle ? "bg-base-200" : "bg-primary"
        } rounded-[var(--rounded-btn)] shadow-xl prose`}
      >
        <div className="w-full flex items-center gap-2">
          <button className="btn btn-circle">
            {toggle ? (
              <Microphone size={32} weight="fill" onClick={handleToggle} />
            ) : (
              <Stop size={32} onClick={handleToggle} weight="fill" className="animate-pulse-fast fill-red-500" />
            )}
          </button>

          <div className="w-full">
            <h4 className="m-0">Gravar</h4>
            <progress
              className={`progress ${toggle ? "progress-primary" : "progress-secondary"} w-full`}
              value={10}
              max={100}
            />
          </div>
        </div>
      </div>
      <span>
        Pressione <kbd className="kbd kbd-sm">espaço</kbd> para iniciar
      </span>
    </div>
  );
}
