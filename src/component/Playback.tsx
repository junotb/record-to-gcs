import Image from "next/image";
import Link from "next/link";

interface PlaybackProps {
  recordedUrl: string | null;
}

export function Playback({ recordedUrl }: PlaybackProps) {
  if (!recordedUrl) {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex justify-center items-center w-80 min-h-80 sm:w-96 sm:min-h-96 rounded-xl shadow-xl">
          <Image
            src="/video-camera-slash.svg"
            alt="No recording"
            width={60}
            height={60}
          />
        </div>

        <div className="border px-4 py-2 w-full bg-white text-center text-black rounded-xl shadow-xl">
          파일 없음
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-center items-center w-80 min-h-80 sm:w-96 sm:min-h-96 rounded-xl shadow-xl">
        <video
          src={recordedUrl}
          playsInline
          controls
          preload="auto"
          className="w-full aspect-auto rounded-xl"
        />
      </div>

      <div className="w-full h-12">
        <Link
          href={recordedUrl}
          target="_blank"
          rel="noopener noreferrer"
          download="recording.webm"
          className="inline-block border px-4 py-2 w-full bg-black text-center text-white rounded-xl shadow-xl"
        >
          파일 받기
        </Link>
      </div>
    </div>
  );
}