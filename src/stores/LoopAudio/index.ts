import { create } from "zustand";
import { subscribeWithSelector } from 'zustand/middleware'
import { BaseAudio, LoopAudio, STATUS, handleToggleRecordLoop, syncLoopAudiosWithBase } from "./LoopAudio";

export type Store = {
  audios: LoopAudio[]
  status: STATUS
  baseAudio: BaseAudio | null
  disabled: boolean
  handleToggleRecordLoop: () => void
}

const initialState = {
  audios: [],
  baseAudio: null,
  status: STATUS.idle,
  disabled: false,
  handleToggleRecordLoop,
}

const useStore = create(
  subscribeWithSelector<Store>(
    () => (initialState)
  )
)

// whenever the audios are updated, sync them with the base audio
useStore.subscribe((state) => state.audios, syncLoopAudiosWithBase)

export default useStore