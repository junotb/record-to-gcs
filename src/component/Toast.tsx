import { useEffect, useState } from "react";
import clsx from "clsx";

type ToastProps = {
  error?: string;
};

export const Toast = ({ error }: ToastProps) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (error) {
      setVisible(true);
      const timer = setTimeout(() => setVisible(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [error]);

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