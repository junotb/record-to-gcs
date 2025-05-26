import Image from "next/image";
import Link from "next/link";

interface PlaybackProps {
  recordedUrl: string | null;
}

export function Playback({ recordedUrl }: PlaybackProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-center items-center w-80 min-h-80 sm:w-96 sm:min-h-96 rounded-xl shadow-xl">
        {recordedUrl ? (
          <video
            src={recordedUrl}
            playsInline
            controls
            preload="auto"
            className="w-full aspect-auto rounded-xl"
          />
        ) : (
          <Image
            src="/video-camera-slash.svg"
            alt="No recording"
            width={60}
            height={60}
          />
        )}
      </div>

      {recordedUrl ? (
        <Link
          href={recordedUrl ? recordedUrl : "#"}
          target="_blank"
          rel="noopener noreferrer"
          download="recording.webm"
          className="inline-block px-4 py-2 border bg-black text-center text-white rounded-xl shadow-xl"
        >
          파일 받기
        </Link>
      ) : (
        <button className="px-4 py-2 border text-center text-black rounded-xl shadow-xl">
          파일 없음
        </button>
      )}
    </div>
  );
}