import { RefObject } from "react";
import Image from "next/image";
import clsx from "clsx";

interface RecorderProps {
  videoRef: RefObject<HTMLVideoElement | null>;
  isRecording: boolean;
  startRecording: () => void;
  stopRecording: () => void;
}

export function Recorder({ videoRef, isRecording, startRecording, stopRecording }: RecorderProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-center items-center w-80 min-h-80 sm:w-96 sm:min-h-96 rounded-xl shadow-xl">
        <video
          ref={videoRef}
          muted
          playsInline
          className={clsx("w-full aspect-auto rounded-xl", {
            "hidden": !isRecording,
          })}
        />
        {!isRecording && (
          <Image
            src="/video-camera-slash.svg"
            alt="No recorder"
            width={60}
            height={60}
          />
        )}
      </div>

      <div className="w-full h-12">
        {isRecording && (
          <button
            onClick={stopRecording}
            className="border px-4 py-2 w-full bg-white text-black rounded-xl shadow-xl"
          >
            녹화 중지
          </button>
        )}
        {!isRecording && (
          <button
            onClick={startRecording}
            className="border px-4 py-2 w-full bg-black text-white rounded-xl shadow-xl"
          >
            녹화 시작
          </button>
        )}
      </div>
    </div>
  );
}