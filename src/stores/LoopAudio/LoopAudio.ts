// LoopAudio Logic

import useStore from ".";

export interface LoopAudio {
  name: string;
  audioURL: string;
  duration: number; // seconds
}
export interface BaseAudio extends LoopAudio {
  element: HTMLAudioElement
}
export enum STATUS {
  idle,
  recording,
  waiting,
}

const COMMAND_DELAY = 1000;
let mediaRecorder: MediaRecorder

function temporarilyDisableCommands() {
  const setState = useStore.setState

  setState({
    disabled: true
  })

  setTimeout(() => {
    setState({
      disabled: false
    })
  }, COMMAND_DELAY);
}

const loopAudios = () => {
  useStore.getState().audios.forEach((audio) => {
    const audioEl = document.getElementById(audio.name) as HTMLAudioElement | null;

    if (audioEl) {
      audioEl.currentTime = 0;
      audioEl.play();
    }
  });
};

function recordAudio() {
  const state = useStore.getState()
  const setState = useStore.setState

  navigator.mediaDevices
    .getUserMedia({
      audio: {
        echoCancellation: false, // prevent playng audios from interfering
        noiseSuppression: true, // TODO add as option
      },
    })
    .then((stream) => {
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

        if (!state.baseAudio) {
          const baseAudio = new Audio(audioURL)
          baseAudio.muted = true
          baseAudio.loop = true
          baseAudio.play()

          setState((state) => ({
            ...state,
            status: STATUS.idle,
            baseAudio: { audioURL, duration, name: "BASE", element: baseAudio },
            audios: [...state.audios, { audioURL, duration, name: `AUDIO-${state.audios.length + 1}` }]
          }))
        } else {
          setState((state) => ({
            ...state,
            status: STATUS.idle,
            audios: [...state.audios, { audioURL, duration, name: `AUDIO-${state.audios.length + 1}` }]
          }))
        }
      }

      // schedule stopRecording when there is a baseAudio (max duration is baseAudio's duration)
      if (state.baseAudio) {
        const currentTime = state.baseAudio.element?.currentTime;

        setTimeout(() => {
          stopRecording();
        }, (state.baseAudio!.duration - currentTime) * 1000);
      }
    })
    .catch(() => {
      alert("Não foi possível acessar o microfone. Garanta a permissão antes.");
      // setError
    });
}

function stopRecording() {
  if (mediaRecorder!.state !== "recording") return;

  mediaRecorder?.stop();
  mediaRecorder?.stream.getTracks().forEach((track) => {
    track.stop();
  });
}

export function syncLoopAudiosWithBase() {
  const baseAudio = useStore.getState().baseAudio

  baseAudio?.element.removeEventListener("playing", loopAudios);
  baseAudio?.element.addEventListener("playing", loopAudios);
}

export async function handleToggleRecordLoop() {
  const state = useStore.getState()
  const setState = useStore.setState

  if (state.disabled) return;

  if (state.status === STATUS.idle) {
    const currentTime = state.baseAudio?.element.currentTime ?? 0;
    const maxDuration = state.baseAudio?.duration ?? 0

    temporarilyDisableCommands();

    setState({
      status: STATUS.waiting
    })

    // schedule the recording when the baseAudio starts looping (when baseAudio is not set, it schedules for now)
    setTimeout(() => {
      setState({
        status: STATUS.recording
      })

      recordAudio();
    }, (maxDuration - currentTime) * 1000);
  } else if (state.status === STATUS.recording) {
    temporarilyDisableCommands();

    stopRecording();
  }
  // waiting --> called when waiting, then do nothing
}