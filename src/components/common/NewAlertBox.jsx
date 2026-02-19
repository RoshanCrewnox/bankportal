import React, { useContext } from "react";
import ReactDOM from "react-dom";
import "./AlertBox.css";
import { HelpCircle, CheckCircle, XCircle } from "lucide-react";
import { ThemeContext } from "./ThemeContext";
import { useLocation } from "react-router-dom";

const AlertIcon = ({ type }) => {
  switch (type) {
    case 'success':
      return <CheckCircle size={50} className="icon-success" />;
    case 'error':
      return <XCircle size={50} className="icon-error" />;
    case 'confirm':
    default:
      return <HelpCircle size={50} className="icon-help" />;
  }
};

const NewAlertBox = ({
  title,
  message,
  onConfirm,
  onCancel,
  showAlert,
  type = 'confirm',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  showCancelButton = true,
}) => {
  const param = useLocation();
  const { theme } = useContext(ThemeContext);
  if (!showAlert) return null;

  return ReactDOM.createPortal(
    <div className="alert-overlay z-[10001]">
      <div className={`alert-box ${theme === "light" ? "bg-white text-gray-800" : "bg-[#2F3349] text-white"}`}>
        <div className="alert-icon">
          <AlertIcon type={type} />
        </div>
        <h2 className={`alert-title ${theme === "light" ? "text-gray-900" : "text-white"}`}>{title}</h2>
        <p className={`alert-message ${theme === "light" ? "text-gray-600" : "text-gray-300"}`}>{message}</p>
        <div className="alert-buttons">
          {showCancelButton && (
            <button className="btn-cancel" onClick={onCancel}>
              {cancelText}
            </button>
          )}
          <button className="btn-confirm" onClick={onConfirm}>
            {confirmText}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default NewAlertBox;
