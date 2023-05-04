import { create } from "zustand";
import { subscribeWithSelector } from 'zustand/middleware'
import { BaseAudio, LoopAudio, STATUS, handleToggleRecordLoop, restartLoops, removeLoop, syncLoopAudiosWithBase } from "./LoopAudio";

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
  targetExpression: TARGETS_EXPRESSIONS
  isEditingLoopName: boolean // flag to indicate editing input is active, so don't trigger Space shortcut
  removeLoop: (id: string) => void
  restartLoops: () => void
  setTargetExpression: (newExpression: TARGETS_EXPRESSIONS) => void
  setIsEditingLoopName: (value: boolean) => void
  handleToggleRecordLoop: () => void
}

const useStore = create(
  subscribeWithSelector<Store>((set) => ({
    audios: [],
    baseAudio: null,
    status: STATUS.idle,
    targetExpression: 'surprised',
    audioCounter: 0,
    isEditingLoopName: false,
    removeLoop: removeLoop,
    restartLoops: restartLoops,
    setTargetExpression: (newExpression) => set({ targetExpression: newExpression }),
    setIsEditingLoopName: (value) => set({ isEditingLoopName: value }),
    handleToggleRecordLoop,
  }))
)

// whenever the audios are updated, sync them with the base audio
useStore.subscribe((state) => state.audios, syncLoopAudiosWithBase)

export default useStore