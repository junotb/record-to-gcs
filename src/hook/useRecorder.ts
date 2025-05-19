import { useRef, useState } from "react";

export function useRecorder() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const frameIdRef = useRef<number | null>(null);

  const [isRecording, setIsRecording] = useState(false);
  const [recordedUrl, setRecordedUrl] = useState<string | null>(null);

  const initStream = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });

    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (!video || !canvas) return;

    video.srcObject = stream;
    await video.play();

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const draw = () => {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      frameIdRef.current = requestAnimationFrame(draw); // Store the frame ID
    }

    draw();

    // Cleanup function to cancel the animation frame
    return () => {
      if (frameIdRef.current !== null) {
        cancelAnimationFrame(frameIdRef.current);
        frameIdRef.current = null;
      }
    };
  };

  const startRecording = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const stream = canvas.captureStream();
    const mediaRecorder = new MediaRecorder(stream, { mimeType: "video/webm" });
    const chunks: Blob[] = [];

    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) chunks.push(event.data);
    };

    mediaRecorder.onstop = () => {
      const blob = new Blob(chunks, { type: "video/webm" });
      const url = URL.createObjectURL(blob);
      setRecordedUrl(url);
    };

    mediaRecorder.start();
    mediaRecorderRef.current = mediaRecorder;
    setIsRecording(true);
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setIsRecording(false);

    const video = videoRef.current;
    if (!video) return;

    const stream = video.srcObject as MediaStream | null;
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      video.srcObject = null;
    }
  };

  return {
    videoRef,
    canvasRef,
    isRecording,
    recordedUrl,
    initStream,
    startRecording,
    stopRecording,
  };
}