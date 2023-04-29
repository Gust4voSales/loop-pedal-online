import { create } from "zustand";
import { subscribeWithSelector } from 'zustand/middleware'
import { BaseAudio, LoopAudio, STATUS, handleToggleRecordLoop, removeLoop, syncLoopAudiosWithBase } from "./LoopAudio";

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
  removeLoop: (id: string) => void
  audioCounter: number
  status: STATUS
  baseAudio: BaseAudio | null
  targetExpression: TARGETS_EXPRESSIONS
  setTargetExpression: (newExpression: TARGETS_EXPRESSIONS) => void
  isEditingLoopName: boolean // flag to indicate editing input is active, so don't trigger Space shortcut
  setIsEditingLoopName: (value: boolean) => void
  handleToggleRecordLoop: () => void
}

const useStore = create(
  subscribeWithSelector<Store>((set) => ({
    audios: [],
    removeLoop: removeLoop,
    audioCounter: 0,
    baseAudio: null,
    status: STATUS.idle,
    targetExpression: 'surprised',
    setTargetExpression: (newExpression) => set({ targetExpression: newExpression }),
    isEditingLoopName: false,
    setIsEditingLoopName: (value) => set({ isEditingLoopName: value }),
    handleToggleRecordLoop,
  }))
)

// whenever the audios are updated, sync them with the base audio
useStore.subscribe((state) => state.audios, syncLoopAudiosWithBase)

export default useStore