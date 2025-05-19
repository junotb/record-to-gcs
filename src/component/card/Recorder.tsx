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
    <div className="flex flex-col gap-4 p-8">
      <h2 className="text-center font-bold">화면 녹화</h2>
      
      <div className="flex justify-center items-center w-80 h-80 sm:w-96 sm:h-96 bg-gray-100 rounded-xl shadow-xl">
        <canvas
          ref={canvasRef}
          className="w-full aspect-video rounded-xl" />
        <video ref={videoRef} muted playsInline className="hidden" />
      </div>

      <div className="text-center">
        {!isRecording ? (
          <button
            onClick={startRecording}
            className="px-4 py-2 bg-blue-500 text-white rounded-xl shadow-xl"
          >
            녹화 시작
          </button>
        ) : (
          <button
            onClick={stopRecording}
            className="px-4 py-2 bg-red-500 text-white rounded-xl shadow-xl"
          >
            녹화 중지
          </button>
        )}
      </div>
    </div>
  );
}