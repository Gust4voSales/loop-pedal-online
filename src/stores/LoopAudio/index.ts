import { create } from "zustand";
import { subscribeWithSelector } from 'zustand/middleware'
import { BaseAudio, LoopAudio, STATUS, handleToggleRecordLoop, syncLoopAudiosWithBase } from "./LoopAudio";

export type TARGETS_EXPRESSIONS = 'surprised' | 'happy'

export const EXPRESSIONS: { id: TARGETS_EXPRESSIONS, text: string }[] = [
  {
    id: 'surprised',
    text: 'surpresa'
  },
  {
    id: 'happy',
    text: 'felicidade'
  }
]

export type Store = {
  audios: LoopAudio[]
  audioCounter: number
  status: STATUS
  baseAudio: BaseAudio | null
  disabled: boolean
  targetExpression: TARGETS_EXPRESSIONS
  setTargetExpression: (newExpression: TARGETS_EXPRESSIONS) => void
  handleToggleRecordLoop: () => void
}

const useStore = create(
  subscribeWithSelector<Store>((set) => ({
    audios: [],
    audioCounter: 0,
    baseAudio: null,
    status: STATUS.idle,
    disabled: false,
    targetExpression: 'surprised',
    setTargetExpression: (newExpression) => set({ targetExpression: newExpression }),
    handleToggleRecordLoop,
  }))
)

// whenever the audios are updated, sync them with the base audio
useStore.subscribe((state) => state.audios, syncLoopAudiosWithBase)

export default useStore