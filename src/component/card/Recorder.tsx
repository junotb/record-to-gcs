"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRecorder } from "@/hook/useRecorder";

export function Recorder() {
  const { videoRef, canvasRef, isRecording, recordedUrl, initStream, startRecording, stopRecording } = useRecorder();

  useEffect(() => {
    initStream();
  }, [initStream]);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-center gap-8 h-full">
      <div className="flex flex-col gap-4">
        <h2 className="text-center font-bold">화면 녹화</h2>
        
        <div className="flex justify-center items-center w-80 h-80 sm:w-96 sm:h-96 bg-gray-100 rounded-xl shadow-xl">
          <canvas
            ref={canvasRef}
            className="w-full aspect-auto rounded-xl" />
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

      <div className="flex flex-col gap-4">
        <h2 className="text-center font-bold">녹화된 화면</h2>
        
        <div className="flex justify-center items-center w-80 h-80 sm:w-96 sm:h-96 bg-gray-100 rounded-xl shadow-xl">
          {recordedUrl && <video src={recordedUrl} controls className="w-full aspect-auto rounded-xl" />}
        </div>

        <div className="text-center">
          {recordedUrl ? (
            <Link
              href={recordedUrl ? recordedUrl : "#"}
              target="_blank"
              download="recording.webm"
              className="inline-block px-4 py-2 bg-blue-600 text-white rounded-xl shadow-xl"
            >
              파일 받기
            </Link>
          ) : (
            <button className="px-4 py-2 bg-red-500 text-white rounded-xl shadow-xl">
              파일 없음
            </button>
          )}
        </div>
      </div>
    </div>
  );
}