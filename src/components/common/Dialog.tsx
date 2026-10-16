import React, { useEffect, useRef } from "react";
import { Icon } from "./Icon";

interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  sheetOnMobile?: boolean;
}

export const Dialog: React.FC<DialogProps> = ({
  isOpen,
  onClose,
  title,
  children,
  sheetOnMobile = false,
}) => {
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.classList.add("is-locked");

    // Focus first focusable element
    const focusable = dialogRef.current?.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    if (focusable && focusable.length > 0) {
      focusable[0].focus();
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.classList.remove("is-locked");
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="dialog-backdrop"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="presentation"
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="dialog-title"
        className={`dialog ${sheetOnMobile ? "is-sheet" : ""}`}
      >
        <button
          type="button"
          className="icon-btn dialog-close"
          onClick={onClose}
          aria-label="Close dialog"
        >
          <Icon name="close" size={20} aria-hidden="true" />
        </button>
        <h2 id="dialog-title">{title}</h2>
        {children}
      </div>
    </div>
  );
};
