// LoopAudio Logic

import { toast } from "react-hot-toast";
import useStore from ".";

export interface LoopAudio {
  id: string
  name: string;
  audioURL: string;
  duration: number; // seconds
}
export interface BaseAudio extends Omit<LoopAudio, 'name' | 'id'> {
  element: HTMLAudioElement
}
export enum STATUS {
  idle,
  recording,
  waiting,
}

// VARIABLES
let mediaRecorder: MediaRecorder

const COMMAND_DELAY = 1000;
let disabled = false


// --LoopPedal logic START--
function temporarilyDisableCommands() {
  disabled = true

  setTimeout(() => {
    disabled = false
  }, COMMAND_DELAY);
}

export async function handleToggleRecordLoop() {
  const state = useStore.getState()
  const setState = useStore.setState

  if (disabled) return;

  if (state.status === STATUS.idle) {
    const currentTime = state.baseAudio?.element.currentTime ?? 0;
    const maxDuration = state.baseAudio?.duration ?? 0

    temporarilyDisableCommands();

    if (mediaRecorder && currentTime > 0)
      setState({
        status: STATUS.waiting
      })

    // schedule the recording when the baseAudio starts looping (when baseAudio is not set, it schedules for now)
    setTimeout(recordAudio, (maxDuration - currentTime) * 1000);
  } else if (state.status === STATUS.recording) {
    temporarilyDisableCommands();

    stopRecording();
  }
  // waiting --> called when waiting, then do nothing
}

function recordAudio() {
  const state = useStore.getState()
  const setState = useStore.setState

  navigator.mediaDevices
    .getUserMedia({
      video: false,
      audio: {
        echoCancellation: false, // prevent playing audios from interfering
        noiseSuppression: true, // TODO add as option
      },
    })
    .then((stream) => {
      setState({
        status: STATUS.recording
      })

      mediaRecorder = new MediaRecorder(stream);

      const startTime = new Date().getTime();
      mediaRecorder.start();

      let audioChunks: Blob[] = [];
      mediaRecorder.ondataavailable = (e) => {
        audioChunks.push(e.data);
      };

      mediaRecorder.onstop = async (e) => {
        const duration = ((new Date().getTime() - startTime) / 1000) % 60;
        const audioURL = URL.createObjectURL(new Blob(audioChunks, { type: mediaRecorder.mimeType }));
        const audioName = `AUDIO - ${state.audioCounter + 1}`

        const newState = {
          ...state,
          status: STATUS.idle,
          audios: [...state.audios, { audioURL, duration, name: audioName, id: audioName }],
          audioCounter: state.audioCounter + 1,
          disabled: true, // temporarily disable future commands
        }

        if (!state.baseAudio) {
          const baseAudio = new Audio(audioURL)
          baseAudio.muted = true
          baseAudio.loop = true
          baseAudio.play()

          // element needs to be added to the dom, so that we can remove (if the user wants) it later
          document.getElementsByTagName('body')[0].appendChild(baseAudio)

          setState(() => ({
            ...newState,
            baseAudio: { audioURL, duration, element: baseAudio },
          }))
        } else {
          setState(() => ({
            ...newState
          }))
        }
      }

      // schedule stopRecording when there is a baseAudio (max duration is baseAudio's duration)
      if (state.baseAudio) {
        const currentTime = state.baseAudio.element?.currentTime;

        setTimeout(() => {
          stopRecording();
        }, (state.baseAudio.duration - currentTime) * 1000);
      }
    })
    .catch((err) => {
      console.log(err)
      toast.error("Ocorreu algum problema ao tentar gravar o loop. Assegure-se de que a pemissão foi concedida.")
    });
}

function stopRecording() {
  if (mediaRecorder!.state !== "recording") return;

  mediaRecorder?.stop();
  mediaRecorder?.stream.getTracks().forEach((track) => {
    track.stop();
  });
}
// --LoopPedal logic END--

// LoopAudio syncronization
const loopAudios = () => {
  useStore.getState().audios.forEach((audio) => {
    const audioEl = document.getElementById(audio.name) as HTMLAudioElement | null;

    if (audioEl) {
      audioEl.currentTime = 0;
      audioEl.play();
    }
  });
};
export function syncLoopAudiosWithBase() {
  const baseAudio = useStore.getState().baseAudio

  baseAudio?.element.removeEventListener("playing", loopAudios);
  baseAudio?.element.addEventListener("playing", loopAudios);
}

// Loops functions
export function removeLoop(id: string) {
  const state = useStore.getState()

  if (state.audios.length > 1) {
    useStore.setState({
      audios: state.audios.filter(loop => loop.id !== id)
    })
  } else { // last audio being removed
    state.baseAudio?.element.remove()

    useStore.setState({
      audios: [],
      audioCounter: 0,
      baseAudio: null // if the last loop's been removed, remove the baseAudio as well
    })
  }

}

export function restartLoops() {
  const baseAudio = useStore.getState().baseAudio
  if (baseAudio)
    baseAudio.element.currentTime = 0
} 