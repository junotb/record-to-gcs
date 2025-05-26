import Image from "next/image";
import { RefObject } from "react";

interface RecorderProps {
  videoRef: RefObject<HTMLVideoElement | null>;
  isRecording: boolean;
  startRecording: () => void;
  stopRecording: () => void;
}

export function Recorder({ videoRef, isRecording, startRecording, stopRecording }: RecorderProps) {
  if (!isRecording) {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex justify-center items-center w-80 min-h-80 sm:w-96 sm:min-h-96 rounded-xl shadow-xl">
          <Image
            src="/video-camera-slash.svg"
            alt="No recording"
            width={60}
            height={60}
          />
        </div>

        <div className="w-full h-12">
          <button
            onClick={startRecording}
            className="border px-4 py-2 w-full bg-black text-white rounded-xl shadow-xl"
          >
            녹화 시작
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-center items-center w-80 min-h-[20rem] sm:w-96 sm:min-h-[24rem] rounded-xl shadow-xl">
        <div className="inline-block w-full">
          <video
            ref={videoRef}
            muted
            playsInline
            autoPlay
            className="w-full aspect-auto rounded-xl"
          />
        </div>
      </div>

      <div className="w-full h-12">
        <button
          onClick={stopRecording}
          className="border px-4 py-2 w-full bg-white text-black rounded-xl shadow-xl"
        >
          녹화 중지
        </button>
      </div>
    </div>
  );
}