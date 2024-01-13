import { useState, useEffect, createContext, useContext, FC } from "react";
import { createPortal } from "react-dom";

import { BsInfoCircle, BsCheckCircle, BsXCircle } from "react-icons/bs";

type ToastTypes = "info" | "success" | "error";
const colors: { [key in ToastTypes]: string } = {
  info: "bg-cyan-300/75",
  success: "bg-green-300/75",
  error: "bg-red-400/75",
};
const Icon: FC<{ type: ToastTypes; size: number }> = (props) => {
  const { type, size } = props;
  const icons: { [key in ToastTypes]: JSX.Element } = {
    info: <BsInfoCircle size={size} />,
    success: <BsCheckCircle size={size} />,
    error: <BsXCircle size={size} />,
  };
  return icons[type];
};

const ToastContext = createContext(({}: { text: string; type?: ToastTypes }) => {});

// トーストを起動したいときはこれをimportして、返り値を使う。
export const useToast = () => {
  return useContext(ToastContext);
};

// トーストを使いたいコンポーネントをこれで囲む。
export const ToastProvider: FC<{ children: React.ReactNode }> = ({ children }) => {
  const [showable, setShowable] = useState(false);
  const [toastText, setToastText] = useState("");
  const [toastType, setToastType] = useState<ToastTypes>("info");
  const [body, setBody] = useState<HTMLElement | null>(null);

  const showToast = ({ text, type = "info" }: { text: string; type?: ToastTypes }) => {
    setToastText(text);
    setToastType(type);
    setShowable(true);
    setTimeout(() => {
      setShowable(false);
    }, 2800);
  };

  useEffect(() => {
    setBody(document.body);
  }, []);

  return !body ? (
    ""
  ) : (
    <ToastContext.Provider value={showToast}>
      {children}
      {createPortal(
        <Toast visible={showable} toastType={toastType}>
          {toastText}
        </Toast>,
        body
      )}
    </ToastContext.Provider>
  );
};

const Toast: FC<{ visible: boolean; toastType: ToastTypes; children: React.ReactNode }> = (
  props
) => {
  const { visible, toastType, children } = props;
  const display = visible ? "block" : "hidden";
  const color = colors[toastType];

  return (
    <div
      id="toast"
      className={["fixed bottom-28 right-4 rounded-md animate-fade", color, display].join(" ")}
    >
      <div className="p-1 flex justify-start items-center">
        <div className="h-full w-auto p-2">
          <Icon type={toastType} size={36} />
        </div>
        <div className="pl-2 pr-1 w-48">{children}</div>
      </div>
    </div>
  );
};
