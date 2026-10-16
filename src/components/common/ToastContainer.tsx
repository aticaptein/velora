import React from "react";
import { Link } from "react-router-dom";
import { useFavorites } from "../../context/FavoritesContext";
import { Icon } from "./Icon";

export const ToastContainer: React.FC = () => {
  const { toasts, dismissToast } = useFavorites();

  if (toasts.length === 0) return null;

  return (
    <div className="toaster" role="region" aria-label="Notifications" aria-live="polite">
      {toasts.map((toast) => (
        <div key={toast.id} className="toast" role="status">
          <Icon name="check" size={18} aria-hidden="true" />
          <span>{toast.message}</span>
          {toast.actionUrl && toast.actionLabel && (
            <Link
              to={toast.actionUrl}
              onClick={() => dismissToast(toast.id)}
            >
              {toast.actionLabel}
            </Link>
          )}
          <button
            type="button"
            className="icon-btn"
            style={{ width: 28, height: 28, marginLeft: toast.actionUrl ? "0.4rem" : "auto" }}
            onClick={() => dismissToast(toast.id)}
            aria-label="Dismiss notification"
          >
            <Icon name="close" size={14} aria-hidden="true" />
          </button>
        </div>
      ))}
    </div>
  );
};
