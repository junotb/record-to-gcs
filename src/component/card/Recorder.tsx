import { RefObject } from "react";

interface RecorderProps {
  videoRef: RefObject<HTMLVideoElement | null>;
  canvasRef: RefObject<HTMLCanvasElement | null>;
  isRecording: boolean;
  startRecording: () => void;
  stopRecording: () => void;
}

export function Recorder({ videoRef, canvasRef, isRecording, startRecording, stopRecording }: RecorderProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-center items-center w-80 h-80 sm:w-96 sm:h-96 rounded-xl shadow-xl">
        <canvas
          ref={canvasRef}
          className="w-full aspect-video rounded-xl" />
        <video ref={videoRef} muted playsInline className="hidden" />
      </div>

      {!isRecording ? (
        <button
          onClick={startRecording}
          className="px-4 py-2 border bg-black text-white rounded-xl shadow-xl"
        >
          녹화 시작
        </button>
      ) : (
        <button
          onClick={stopRecording}
          className="px-4 py-2 border text-black rounded-xl shadow-xl"
        >
          녹화 중지
        </button>
      )}
    </div>
  );
}