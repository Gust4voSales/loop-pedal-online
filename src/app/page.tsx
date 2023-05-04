import Image from "next/image";
import Logo from "@public/LogoSmall.png";
import Link from "next/link";

export default function Home() {
  return (
    <div className="hero min-h-screen bg-base-200">
      <div className="hero-content flex-col lg:flex-row">
        <Image alt="Logo - LoopPedalOnline" src={Logo} className="w-80 h-auto" />

        <div className="max-w-md">
          <h1 className="text-5xl font-bold">LoopPedal Online</h1>
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
