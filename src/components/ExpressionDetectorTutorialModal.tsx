"use client";

import { Question, X } from "@phosphor-icons/react";
import useToggle from "@src/hooks/useToggle";
import { useState } from "react";
import ReactModal from "react-modal";
import Image from "next/image";
import step1 from "@src/assets/step1.png";
import step2 from "@src/assets/step2.png";
import step3 from "@src/assets/step3.png";
import step4 from "@src/assets/step4.png";
import { TooltipButton } from "./TooltipButton";

const steps = [
  {
    text: `1. Comece permitindo acesso à sua webcam ou câmera.\nOBS: A detecção de expressões demanda mais recursos, o que pode causar travamentos em celulares e outros dispositivos mais limitados.`,
    img: step1,
  },
  {
    text: "2. É onde fica a expressão atual que está sendo detectada.\nProcure um ambiente com boa iluminação e mantenha apenas um rosto na webcam. Faça a expressão alvo para começar a gravar.",
    img: step2,
  },
  {
    text: "3. O emoji de ❌ é mostrado enquanto nenhuma face está sendo indetificada.\n4. Você pode escolher a expressão alvo (😮 ou 😀) para iniciar a gravação ou salvar o loop.",
    img: step3,
  },
  {
    text: "Quando a expressão alvo é detectada o loop imediatamente começará a ser gravado. Retome outra expressão (😐 por exemplo) enquanto grava o novo audio e volte a realizar a expressão alvo quando desejar que o loop seja salvo.",
    img: step4,
  },
];
export function ExpressionDetectorTutorialModal() {
  const [isOpen, toggleOpen] = useToggle(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const currentStep = steps[currentStepIndex];

  function handleChangeStep(increase: -1 | 1) {
    if (currentStepIndex === steps.length - 1 && increase === 1) {
      // finished tutorial and reset
      toggleOpen();
      setCurrentStepIndex(0);
    } else {
      setCurrentStepIndex((oldState) => oldState + increase); // increase
    }
  }

  const OVERLAY_COLOR = "#2a303cb6";
  // Change default Modal styles
  ReactModal.defaultStyles = {
    ...ReactModal.defaultStyles,
    content: {
      position: "absolute",
      top: "30%",
      left: "50%",
      translate: "-50% -30%",
      width: "fit-content",
      height: "fit-content",
    },
    overlay: {
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: OVERLAY_COLOR,
    },
  };
  return (
    <div>
      <TooltipButton onClick={toggleOpen} tooltip="Ajuda" className="btn btn-ghost btn-circle">
        <Question size={24} weight="regular" />
      </TooltipButton>

      <ReactModal isOpen={isOpen} onRequestClose={toggleOpen}>
        <div
          className={`relative w-screen max-w-xl min-h-16 p-4 bg-base-200 rounded-[--rounded-box] border-base-300 border-8 shadow-md`}
        >
          <button
            onClick={toggleOpen}
            className="btn btn-outline btn-error btn-circle absolute top-0 right-0 border-none"
          >
            <X size={24} weight="regular" />
          </button>

          <div className="flex flex-col w-full gap-6">
            <div className="prose mr-8">
              <h2 className="text-accent">Como utilizar o detector de expressões</h2>
            </div>

            <div className="flex flex-col gap-4">
              <Image
                src={currentStep.img}
                alt={`Foto explicativa do passo ${currentStepIndex + 1}`}
                className="bg-base-200 rounded-[--rounded-box] border-black border-2"
                unoptimized
              />

              <div className="prose whitespace-pre-line min-h-[120px]">
                <span>{currentStep.text}</span>
              </div>
            </div>

            <div className="flex justify-between w-full gap-4 max-[380px]:flex-col items-center">
              <div className="btn-group">
                {steps.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentStepIndex(i)}
                    className={`btn btn-sm ${currentStepIndex === i ? "btn-accent" : ""}`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>

              <div className="btn-group">
                <button
                  onClick={() => handleChangeStep(-1)}
                  disabled={currentStepIndex === 0}
                  className="btn btn-outline btn-accent btn-sm"
                >
                  Anterior
                </button>
                <button onClick={() => handleChangeStep(1)} className="btn btn-outline btn-accent btn-sm">
                  {currentStepIndex === steps.length - 1 ? "Finalizar" : "Próximo"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </ReactModal>
    </div>
  );
}
