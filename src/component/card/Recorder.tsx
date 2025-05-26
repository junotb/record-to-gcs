import { RefObject } from "react";

interface RecorderProps {
  videoRef: RefObject<HTMLVideoElement | null>;
  canvasRef: RefObject<HTMLCanvasElement | null>;
  isInitialized: boolean;
  isRecording: boolean;
  startRecording: () => void;
  stopRecording: () => void;
}

export function Recorder({ videoRef, canvasRef, isInitialized, isRecording, startRecording, stopRecording }: RecorderProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-center items-center w-80 min-h-[20rem] sm:w-96 sm:min-h-[24rem] rounded-xl shadow-xl">
        <div className="inline-block w-full">
          <canvas
            ref={canvasRef}
            className="block w-full aspect-auto rounded-xl" />
          <video ref={videoRef} muted playsInline className="hidden w-full aspect-auto rounded-xl" />
        </div>
      </div>

      <div className="w-full h-12">
        {!isInitialized && (
          <div className="px-4 py-2 w-full text-center text-black">초기화 중...</div>
        )}
        {isInitialized && !isRecording && (
          <button
            onClick={startRecording}
            className="border px-4 py-2 w-full bg-black text-white rounded-xl shadow-xl"
          >
            녹화 시작
          </button>
        )}
        {isInitialized && isRecording && (
          <button
            onClick={stopRecording}
            className="border px-4 py-2 w-full bg-white text-black rounded-xl shadow-xl"
          >
            녹화 중지
          </button>
        )}
      </div>
    </div>
  );
}