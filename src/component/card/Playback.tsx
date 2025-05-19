import Link from "next/link";

interface PlaybackProps {
  recordedUrl: string | null;
}

export function Playback({ recordedUrl }: PlaybackProps) {
  return (
    <div className="flex flex-col gap-4 p-8">
      <h2 className="text-center font-bold">녹화된 화면</h2>
      
      <div className="flex justify-center items-center w-80 h-80 sm:w-96 sm:h-96 bg-gray-100 rounded-xl shadow-xl">
        {recordedUrl && <video src={recordedUrl} controls className="w-full aspect-auto rounded-xl" />}
      </div>

      <div className="text-center">
        {recordedUrl ? (
          <Link
            href={recordedUrl ? recordedUrl : "#"}
            target="_blank"
            rel="noopener noreferrer"
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
  );
}