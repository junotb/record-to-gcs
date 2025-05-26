"use client";

import { Header } from "@/component/Header";
import { Playback } from "@/component/Playback";
import { Recorder } from "@/component/Recorder";
import { Toast } from "@/component/Toast";
import { useRecorder } from "@/hook/useRecorder";

export default function Home() {
  const { videoRef, isRecording, recordedUrl, error, startRecording, stopRecording } = useRecorder();
  
  return (
    <div className="flex flex-col items-center w-full h-full bg-white">
      <Header />
      <main className="flex flex-col justify-center items-center w-full h-full overflow-y-scroll">
        <div className="flex flex-col sm:flex-row items-center sm:justify-center gap-8 h-full">
          <div className="flex flex-col gap-4 p-4">
            <h2 className="text-center text-xl font-bold">Record</h2>
            <Recorder
              videoRef={videoRef}
              isRecording={isRecording}
              startRecording={startRecording}
              stopRecording={stopRecording}
            />
          </div>
          <div className="flex flex-col gap-4 p-4">
            <h2 className="text-center text-xl font-bold">Playback</h2>
            <Playback
              recordedUrl={recordedUrl}
            />
          </div>
        </div>
      </main>
      <Toast
        error={error}
      />
    </div>
  );
}