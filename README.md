# Record To Webm

캔버스를 기반으로 웹캠 스트림을 녹화하고 다운로드할 수 있는 React 컴포넌트입니다.

## 주요 기능

- 웹캠 스트림을 <video> 태그에 실시간 출력
- MediaRecorder API를 사용하여 WebM 비디오로 녹화
- 녹화된 비디오 미리보기 및 다운로드
- 비디오 유효성 검사 기능 포함

## 기술 스택

- **프레임워크**: Next.js 15.3.2
- **언어**: TypeScript
- **스타일**: Tailwind CSS
- **미디어 처리**: MediaRecorder API, MediaDevices API
- **상태 관리**: React Hooks

## 프로젝트 구조

```
record-to-webm/
├── src/
│   ├── component/
│   │   └── Card/
│   │       ├── Playback.tsx        # 녹화 결과 재생 컴포넌트
│   │       └── Recorder.tsx        # UI 및 녹화 트리거
│   └── hook/
│       └── useRecorder.ts          # 미디어 스트림 및 녹화 관리 훅
├── public/
├── package.json
└── README.md
```

## 사용 방법

애플리케이션은 브라우저의 카메라/마이크 접근 권한이 필요합니다.
1. 카메라/마이크 권한 허용 → 앱 시작 시 브라우저가 권한을 요청합니다. 거부 시 녹화가 제한됩니다.
2. 녹화 시작 버튼 클릭 → 웹캠 스트림이 캔버스로 출력되고 녹화가 시작됩니다.
3. 녹화 중지 클릭 → 녹화가 종료되고 결과가 하단에 표시됩니다.
4. 파일 받기 버튼 클릭 → .webm 형식으로 영상 다운로드

## 브라우저 지원 및 제한 사항

MediaRecorder API는 브라우저별 지원 차이가 존재합니다.

|브라우저|지원 상태|비고|
|---|---|---|
|Chrome|✅ 지원|안정적|
|Firefox|✅ 지원|안정적|
|Edge(Chromium)|✅ 지원|안정적|
|Safari|❌ 미지원 또는 제한|MediaRecorder 또는 video/webm 인코딩 미지원|
|iOS 브라우저|❌ 미지원|MediaRecorder 전반 미지원|

## 향후 계획: MediaRecorder 대체 방안

Safari 및 iOS 환경 등에서의 호환성 문제를 해결하기 위해 다음과 같은 방안을 고려 중입니다:
- RTCPeerConnection 기반 미디어 캡처
MediaRecorder 대신 WebRTC의 RTCPeerConnection을 사용하여 미디어 스트림을 가공하고,
서버 또는 클라이언트에서 직접 캡처 및 저장하는 방식으로 확장 가능성을 확보할 수 있습니다.
- 이 방식은 브라우저 간 스트리밍을 기반으로 하여 Safari 환경에서도 비교적 안정적인 지원이 가능합니다.
