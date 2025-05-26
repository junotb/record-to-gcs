"use client";

import { useRef, useState } from "react";

export function useRecorder() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const frameIdRef = useRef<number | null>(null);

  const [isRecording, setIsRecording] = useState(false);
  const [recordedUrl, setRecordedUrl] = useState<string | null>(null);

  // 마이크와 카메라 권한 확인
  const hasMediaPermission = async (): Promise<boolean> => {
    try {
      const microphone = await navigator.permissions.query({ name: "microphone" as PermissionName });
      const camera = await navigator.permissions.query({ name: "camera" as PermissionName });

      if (microphone.state === "denied" || camera.state === "denied") {
        console.error("마이크 또는 카메라 권한이 거부되어 있습니다.");
        return false;
      }

      return true;
    } catch {
      // Permissions API 미지원 시 fallback
      return true;
    }
  };

  const initStream = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });

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
  };

  // 녹화 시작
  const startRecording = async () => {
    // 이미 녹화 중이면 아무 작업도 하지 않음
    if (isRecording) return;

    // 권한 확인
    const permissionGranted = await hasMediaPermission();
    if (!permissionGranted) return;

    // 스트림 초기화
    await initStream();

    const canvas = canvasRef.current;
    if (!canvas) return;

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
      
      // 미디어 레코더 생성
      const mediaRecorderMimeType = MediaRecorder.isTypeSupported("video/webm") ? { mimeType: "video/webm" } : undefined;
      const mediaRecorder = new MediaRecorder(combinedStream, mediaRecorderMimeType);

      const chunks: Blob[] = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) chunks.push(event.data);
      };

      mediaRecorder.onstop = () => {
        // Blob 생성 및 URL 생성
        const blobType = MediaRecorder.isTypeSupported("video/webm") ? { type: "video/webm" } : undefined;
        const blob = new Blob(chunks, blobType);
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
    // 녹화 중이 아닐 때는 아무 작업도 하지 않음
    if (!isRecording) return;

    const mediaRecorder = mediaRecorderRef.current;
    if (!mediaRecorder) return;

    mediaRecorder.stop();
    setIsRecording(false);
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