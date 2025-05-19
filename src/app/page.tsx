import { Recorder } from "@/component/card/Recorder";
import { Header } from "@/component/Header";

export default function Home() {
  return (
    <div className="flex flex-col items-center w-full h-full bg-white">
      <Header />
      <main className="flex flex-col justify-center items-center w-full h-full">
        <Recorder />
      </main>
    </div>
  );
}