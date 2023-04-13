import { AudioPlayerCard } from "@components/AudioPlayerCard";

export default function Home() {
  return (
    <div className="h-screen flex place-items-center place-content-center">
      <AudioPlayerCard
        audioLoop={{
          audioURL: "/HansZimmerHesaPirate.mp3",
          duration: 92,
          name: "The intro",
        }}
      />
    </div>
  );
}
