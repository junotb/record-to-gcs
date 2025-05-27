"use client";

import { useRef, useState } from "react";

export function useRecorder() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);

  const [isRecording, setIsRecording] = useState(false);
  const [recordedUrl, setRecordedUrl] = useState<string | undefined>(undefined);
  const [error, setError] = useState<string | undefined>(undefined);

  // MediaRecorder가 지원되는지 확인하는 함수
  const checkMediaRecorderSupported = (): boolean => {
    if (typeof MediaRecorder === "undefined" || !MediaRecorder.isTypeSupported("video/webm")) {
      setError("이 브라우저는 MediaRecorder API를 지원하지 않습니다. Chrome, Firefox, Edge 등 다른 브라우저를 사용해주세요.");
      return false;
    }
    return true;
  };

  // 마이크와 카메라 권한 확인
  const hasMediaPermission = async (): Promise<boolean> => {
    try {
      const microphone = await navigator.permissions.query({ name: "microphone" as PermissionName });
      const camera = await navigator.permissions.query({ name: "camera" as PermissionName });

      if (microphone.state === "denied" || camera.state === "denied") {
        setError("마이크 또는 카메라 권한이 거부되어 있습니다.");
        return false;
      }

      return true;
    } catch {
      // Permissions API 미지원 시 fallback
      return true;
    }
  };

  const startRecording = async () => {
    // 이미 녹화 중이면 아무 작업도 하지 않음
    if (isRecording) {
      setError("이미 녹화 중입니다.");
      return;
    };

    // MediaRecorder 지원 여부 확인
    const isMediaRecorderSupported = checkMediaRecorderSupported();
    if (!isMediaRecorderSupported) return;

    // 미디어 권한 확인
    const permissionGranted = await hasMediaPermission();
    if (!permissionGranted) return;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });

      if (!stream) {
        setError("미디어 스트림을 가져올 수 없습니다.");
        return;
      }

      // 비디오 요소에 스트림 설정
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      
      // 미디어 레코더 생성
      const mediaRecorder = new MediaRecorder(stream, { mimeType: "video/webm" });

      const chunks: Blob[] = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) chunks.push(event.data);
      };

      mediaRecorder.onstop = () => {
        // Blob 생성 및 URL 생성
        const blob = new Blob(chunks, { type: "video/webm" });
        const url = URL.createObjectURL(blob);

        // 이전 녹화 URL이 있다면 해제
        if (recordedUrl) {
          URL.revokeObjectURL(recordedUrl);
        }

        setRecordedUrl(url);

        // 비디오와 오디오 스트림을 정리
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      mediaRecorderRef.current = mediaRecorder;
      setIsRecording(true);
    } catch (error) {
      console.error(error);
      setError("오디오 장치에 접근할 수 없습니다. 오디오 권한을 확인해주세요: ");
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
    isRecording,
    recordedUrl,
    error,
    startRecording,
    stopRecording,
  };
}