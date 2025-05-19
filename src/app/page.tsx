"use client";

import { useEffect } from "react";
import { Recorder } from "@/component/card/Recorder";
import { Header } from "@/component/Header";
import { Playback } from "@/component/card/Playback";
import { useRecorder } from "@/hook/useRecorder";

export default function Home() {
  const { videoRef, canvasRef, isRecording, recordedUrl, initStream, startRecording, stopRecording } = useRecorder();

  useEffect(() => {
    initStream();
  }, [initStream]);
  
  return (
    <div className="flex flex-col items-center w-full h-full bg-white">
      <Header />
      <main className="flex flex-col justify-center items-center w-full h-full overflow-y-scroll">
        <div className="flex flex-col sm:flex-row items-center sm:justify-center gap-8 h-full">
          <Recorder
            videoRef={videoRef}
            canvasRef={canvasRef}
            isRecording={isRecording}
            startRecording={startRecording}
            stopRecording={stopRecording} />
          <Playback recordedUrl={recordedUrl} />
        </div>
      </main>
    </div>
  );
}