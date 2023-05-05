import Image from "next/image";
import Link from "next/link";
import Logo from "@public/LogoSmall.png";

export default function Home() {
  return (
    <div className="hero min-h-screen bg-base-200 overflow-hidden">
      <div className="hero-content flex-col lg:flex-row">
        <Image alt="Logo - LoopPedalOnline" src={Logo} className="w-80 h-auto animate-slide-top" priority />

        <div className="max-w-md animate-slide-bottom">
          <h1 className="text-5xl font-bold gradient-text">LoopPedal Online</h1>
          <p className="py-6">
            Simulador de Loop Pedal com controle intuitivo através de expressões faciais capturadas pela webcam.
            Experimente agora e libere sua criatividade!
          </p>
          <Link href="/loop" className="btn btn-primary">
            Começar
          </Link>
        </div>
      </div>
    </div>
  );
}
