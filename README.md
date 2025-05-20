# Record To Webm

캔버스를 기반으로 웹캠 스트림을 녹화하고 다운로드할 수 있는 React 컴포넌트입니다.

## 주요 기능

- 🎬 웹캠 스트림을 캔버스로 실시간 렌더링
- ⏺️ 캔버스 영상 녹화 (WebM 형식)
- 📂 녹화된 영상 다운로드
- 🖼️ 녹화된 영상 미리보기
- 📱 반응형 UI

## 기술 스택

- **프레임워크**: Next.js 15.3.2
- **언어**: TypeScript
- **UI**: Tailwind CSS
- **상태 관리**: React Hooks
- **미디어 처리**: MediaRecorder API, Canvas API

## 프로젝트 구조

```
canvas-recorder/
├── src/
│   ├── component/
│   │   └── Card
│   │       └── Playback.tsx        # 재생 컴포넌트
│   │       └── Recorder.tsx        # 녹화 컴포넌트
│   └── hook/
│       └── useRecorder.ts      # 녹화 및 스트림 로직
├── public/
├── package.json
└── README.md
```

## 사용 방법

애플리케이션은 브라우저의 카메라/마이크 접근 권한이 필요합니다.
1. 녹화 시작 버튼 클릭 → 웹캠 스트림이 캔버스로 출력되고 녹화가 시작됩니다.
2. 녹화 중지 클릭 → 녹화가 종료되고 결과가 하단에 표시됩니다.
3. 파일 받기 버튼 클릭 → .webm 형식으로 영상 다운로드