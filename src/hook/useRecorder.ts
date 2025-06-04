"use client";

import { useEffect, useRef, useState } from "react";

export function useRecorder() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  
  const [isRecording, setIsRecording] = useState(false);
  const [recordedUrl, setRecordedUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  /**
   * @returns boolean
   * 브라우저가 MediaRecorder API를 지원하는지 확인합니다.
   */
  const checkMediaRecorderSupported = (): boolean => {
    if (typeof MediaRecorder === "undefined" || !MediaRecorder.isTypeSupported("video/webm")) {
      setError("이 브라우저는 MediaRecorder API를 지원하지 않습니다. Chrome, Firefox, Edge 등 다른 브라우저를 사용해주세요.");
      return false;
    }
    return true;
  };

  /**
   * @returns Promise<boolean>
   * 사용자의 마이크와 카메라 권한을 확인합니다.
   */
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

  /**
   * @returns void
   * 녹화 중인 상태를 초기화하고, 비디오 요소와 미디어 레코더를 정리합니다.
   */
  const startRecording = async () => {
    // 이미 녹화 중이면 아무 작업도 하지 않음
    if (isRecording) {
      setError("이미 녹화 중입니다.");
      return;
    };

    // 녹화 상태 초기화
    chunksRef.current = [];
    setRecordedUrl(null);
    setError(null);

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
      
      // 미디어 레코더 생성
      const mediaRecorder = new MediaRecorder(stream, { mimeType: "video/webm" });

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        // Blob 생성 및 URL 생성
        const blob = new Blob(chunksRef.current, { type: "video/webm" });
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

  useEffect(() => {
    if (!isRecording) return;
    if (!videoRef.current) return;

    const video = videoRef.current;
    const stream = mediaRecorderRef.current?.stream;

    if (stream && video.srcObject !== stream) {
      video.srcObject = stream;
      video.play();
    }
  }, [isRecording]);

  /**
   * @returns void
   * 녹화를 중지하고, 녹화된 비디오 URL을 반환합니다.
   */
  const stopRecording = () => {
    // 녹화 중이 아닐 때는 아무 작업도 하지 않음
    if (!isRecording) return;

    const mediaRecorder = mediaRecorderRef.current;
    if (!mediaRecorder) return;

    mediaRecorder.stop();
    setIsRecording(false);
  };

  /**
   * @param blob Blob
   * @returns Promise<boolean>
   * 녹화된 비디오 파일의 유효성을 검사합니다.
   * - duration이 0보다 크면 유효한 비디오로 간주합니다.
   * - 에러가 발생하거나 duration이 0이면 유효하지 않은 비디오로 간주합니다.
   */
  const validateRecording = (blob: Blob): Promise<{ isValid: boolean, errorMessage?: string }> => {
    return new Promise((resolve) => {
      const video = document.createElement('video');
      const url = URL.createObjectURL(blob);
  
      video.preload = 'metadata';
      video.src = url;
  
      const timeout = setTimeout(() => {
        cleanup();
        resolve({
          isValid: false,
          errorMessage: "비디오 메타데이터를 가져오는 데 시간이 너무 오래 걸립니다."
        });
      }, 5000); // 5초 안에 metadata가 안 뜨면 문제
  
      const cleanup = () => {
        clearTimeout(timeout);
        URL.revokeObjectURL(url);
        video.remove();
      };
  
      video.onloadedmetadata = () => {
        cleanup();
        const duration = video.duration;
        const isValid = duration > 0;
        // duration이 0보다 크면 유효한 비디오로 간주
        resolve({
          isValid,
          errorMessage: isValid ? undefined : "비디오 파일의 길이에 문제가 있습니다."
        });
      };
  
      video.onerror = () => {
        cleanup();
        resolve({
          isValid: false,
          errorMessage: "비디오 파일에 문제가 있습니다."
        });
      };
  
      document.body.appendChild(video); // 일부 브라우저에서 필요할 수 있음
    });
  };
  
  useEffect(() => {
    if (!recordedUrl) return;

    const validate = async () => {
      setError(null);
      const response = await fetch(recordedUrl);
      const blob = await response.blob();
      const { isValid, errorMessage } = await validateRecording(blob);
      if (!isValid) {
        setError(errorMessage || "비디오 파일이 유효하지 않습니다.");
        setRecordedUrl(null); // 유효하지 않은 경우 URL 초기화
      }
    };

    validate();
  }, [recordedUrl]);

  useEffect(() => {
    // 강제 종료 방지
    const handleBeforeUnload = () => {
      const mediaRecorder = mediaRecorderRef.current;
      if (!mediaRecorder) return;

      if (mediaRecorder.state === "recording") {
        mediaRecorder.stop(); // 강제 종료 방지
      }
    };
  
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, []);  

  return {
    videoRef,
    isRecording,
    recordedUrl,
    error,
    startRecording,
    stopRecording,
  };
}