import { useEffect, useState } from "react";
import clsx from "clsx";

type ToastProps = {
  error?: string | undefined;
  duration?: number; // 기본값: 3000ms
};

export const Toast = ({ error, duration = 3000 }: ToastProps) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (error) {
      setVisible(true);
      const timer = setTimeout(() => setVisible(false), duration);
      return () => clearTimeout(timer);
    }
  }, [error, duration]);

  return (
    <div
      className={clsx("fixed bottom-5 left-1/2 -translate-x-1/2 px-4 py-2 bg-red-500 text-white text-sm rounded-xl shadow-xl z-50 transition-opacity duration-300", {
        "opacity-100": visible,
        "opacity-0": !visible,
      })}
      role="alert"
    >
      {error}
    </div>
  );
};