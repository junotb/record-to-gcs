import { useRef, useState } from "react";

export function useRecorder() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const frameIdRef = useRef<number | null>(null);

  const [isInitialized, setIsInitialized] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordedUrl, setRecordedUrl] = useState<string | null>(null);

  const initStream = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
    if (!stream) {
      console.error("비디오/오디오 스트림을 가져올 수 없습니다.");
      return;
    }

    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (!video || !canvas) return;

    video.srcObject = stream;
    await video.play();

    const { videoWidth, videoHeight } = video;

    canvas.width = videoWidth;
    canvas.height = videoHeight;

    canvas.style.width = "100%";
    canvas.style.height = `${videoHeight / videoWidth * 100}%`;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const draw = () => {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      frameIdRef.current = requestAnimationFrame(draw);
    }

    draw();

    setIsInitialized(true);

    return () => {
      if (frameIdRef.current !== null) {
        cancelAnimationFrame(frameIdRef.current);
        frameIdRef.current = null;
      }
    };
  };

  // 녹화 시작
  const startRecording = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // MediaRecorder의 MIME 타입 설정
    const isWebmSupported = MediaRecorder.isTypeSupported("video/webm");

    try {
      const videoStream = canvas.captureStream();
      const audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      if (!videoStream || !audioStream) {
        console.error("비디오 또는 오디오 스트림을 가져올 수 없습니다.");
        return;
      }

      // 비디오와 오디오 스트림을 결합
      const combinedStream = new MediaStream([
        ...videoStream.getVideoTracks(),
        ...audioStream.getAudioTracks()
      ]);
      
      const mediaRecorder = new MediaRecorder(combinedStream, isWebmSupported ? { mimeType: "video/webm" } : undefined);

      const chunks: Blob[] = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) chunks.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, isWebmSupported ? { type: "video/webm" } : undefined);
        const url = URL.createObjectURL(blob);

        // 이전 녹화 URL이 있다면 해제
        if (recordedUrl) {
          URL.revokeObjectURL(recordedUrl);
        }

        setRecordedUrl(url);

        // 비디오와 오디오 스트림을 정리
        videoStream.getTracks().forEach((track) => track.stop());
        audioStream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      mediaRecorderRef.current = mediaRecorder;
      setIsRecording(true);
    } catch (error) {
      console.error("오디오 장치에 접근할 수 없습니다. 오디오 권한을 확인해주세요: ", error);
    }
  };

  const stopRecording = () => {
    const mediaRecorder = mediaRecorderRef.current;
    if (!mediaRecorder) return;

    mediaRecorder.stop();
    setIsRecording(false);
  };

  return {
    videoRef,
    canvasRef,
    isInitialized,
    isRecording,
    recordedUrl,
    initStream,
    startRecording,
    stopRecording,
  };
}