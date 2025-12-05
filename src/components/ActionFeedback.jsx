import React, { useState, useCallback, useEffect } from 'react';
import { X, CheckCircle, AlertCircle, Info, Clock, History } from 'lucide-react';

/**
 * Notification Component - Auto-dismiss toast notifications
 */
export const Notification = ({ id, type, message, onClose, duration = 3000 }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  const bgColor =
    {
      success: 'bg-green-50 border border-green-200',
      error: 'bg-red-50 border border-red-200',
      warning: 'bg-amber-50 border border-amber-200',
      info: 'bg-blue-50 border border-blue-200',
    }[type] || 'bg-gray-50 border border-gray-200';

  const iconColor =
    {
      success: 'text-green-600',
      error: 'text-red-600',
      warning: 'text-amber-600',
      info: 'text-blue-600',
    }[type] || 'text-gray-600';

  const textColor =
    {
      success: 'text-green-800',
      error: 'text-red-800',
      warning: 'text-amber-800',
      info: 'text-blue-800',
    }[type] || 'text-gray-800';

  const Icon = type === 'success' ? CheckCircle : type === 'error' ? AlertCircle : Info;

  return (
    <div className={`${bgColor} rounded-lg shadow-lg p-4 flex items-start gap-3 animate-slideIn`}>
      <Icon size={20} className={iconColor} />
      <div className="flex-1">
        <p className={`text-sm font-semibold ${textColor}`}>{message}</p>
      </div>
      <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
        <X size={18} />
      </button>
    </div>
  );
};

/**
 * Confirmation Dialog Component
 */
export const ConfirmationDialog = ({
  isOpen,
  title,
  message,
  actionLabel,
  onConfirm,
  onCancel,
  isDangerous = false,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50 animate-fadeIn"
      style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
    >
      <div
        className="max-w-md w-full mx-4 p-6 animate-slideUp"
        style={{
          backgroundColor: 'var(--bg-white)',
          borderRadius: 'var(--radius-md)',
          boxShadow: 'var(--shadow-xl)',
        }}
      >
        {/* Header */}
        <div className="flex items-start gap-3 mb-4">
          {isDangerous ? (
            <div
              className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center"
              style={{ backgroundColor: '#FEE2E2' }}
            >
              <AlertCircle size={20} style={{ color: '#DC2626' }} />
            </div>
          ) : (
            <div
              className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center"
              style={{ backgroundColor: 'var(--bg-persona)' }}
            >
              <Info size={20} style={{ color: 'var(--primary-blue)' }} />
            </div>
          )}
          <h2
            style={{
              fontSize: 'var(--font-size-lg)',
              fontWeight: 'var(--font-weight-bold)',
              color: 'var(--gray-text-dark)',
            }}
          >
            {title}
          </h2>
        </div>

        {/* Message */}
        <p
          className="mb-6 leading-relaxed"
          style={{
            fontSize: 'var(--font-size-base)',
            color: 'var(--gray-text-dark)',
            lineHeight: '1.6',
          }}
        >
          {message}
        </p>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2.5 transition-colors"
            style={{
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--gray-border)',
              color: 'var(--gray-text-dark)',
              fontWeight: 'var(--font-weight-semibold)',
              backgroundColor: 'var(--bg-white)',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--gray-light)')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'var(--bg-white)')}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-2.5 transition-opacity"
            style={{
              borderRadius: 'var(--radius-sm)',
              fontWeight: 'var(--font-weight-semibold)',
              color: 'var(--bg-white)',
              backgroundColor: isDangerous ? '#DC2626' : 'var(--primary-blue)',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.9')}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
          >
            {actionLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

/**
 * Recent Actions Log Component
 */
export const RecentActionsLog = ({ actions, isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-end justify-end z-50 animate-fadeIn">
      <div className="bg-white h-full w-full max-w-md shadow-2xl flex flex-col animate-slideLeft">
        {/* Header */}
        <div
          className="flex items-center justify-between p-4"
          style={{
            borderBottom: '1px solid var(--gray-border)',
            backgroundColor: 'var(--primary-navy)',
          }}
        >
          <div className="flex items-center gap-2">
            <History size={20} className="text-white" />
            <h2 className="text-lg font-bold text-white">Recent Actions</h2>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Actions List */}
        <div className="flex-1 overflow-y-auto">
          {actions.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-500 text-center">No recent actions</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {[...actions].reverse().map((action, index) => (
                <div
                  key={index}
                  className="p-4 transition-colors"
                  style={{ borderLeft: '3px solid transparent' }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--gray-light)';
                    e.currentTarget.style.borderLeftColor = 'var(--primary-blue)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.borderLeftColor = 'transparent';
                  }}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900 text-sm">{action.title}</p>
                      <p className="text-xs text-gray-600 mt-1">{action.description}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <Clock size={12} className="text-gray-400" />
                        <p className="text-xs text-gray-500">{action.timestamp}</p>
                      </div>
                    </div>
                    <div
                      className={`flex-shrink-0 w-2 h-2 rounded-full mt-1 ${
                        action.status === 'success'
                          ? 'bg-green-500'
                          : action.status === 'error'
                            ? 'bg-red-500'
                            : action.status === 'warning'
                              ? 'bg-amber-500'
                              : 'bg-blue-500'
                      }`}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-4 bg-gray-50">
          <p className="text-xs text-gray-600 text-center">Showing last {actions.length} actions</p>
        </div>
      </div>
    </div>
  );
};

/**
 * Hook for managing notifications
 */
export const useNotifications = () => {
  const [notifications, setNotifications] = useState([]);

  const addNotification = useCallback((message, type = 'info', duration = 3000) => {
    const id = Date.now();
    setNotifications((prev) => [...prev, { id, message, type }]);
    return id;
  }, []);

  const removeNotification = useCallback((id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const success = useCallback(
    (message) => addNotification(message, 'success', 3000),
    [addNotification]
  );
  const error = useCallback(
    (message) => addNotification(message, 'error', 4000),
    [addNotification]
  );
  const warning = useCallback(
    (message) => addNotification(message, 'warning', 3500),
    [addNotification]
  );
  const info = useCallback((message) => addNotification(message, 'info', 3000), [addNotification]);

  return {
    notifications,
    addNotification,
    removeNotification,
    success,
    error,
    warning,
    info,
  };
};

/**
 * Hook for managing recent actions log
 */
export const useActionLog = (maxActions = 50) => {
  const [actions, setActions] = useState([]);

  const addAction = useCallback(
    (title, description, status = 'info') => {
      const timestamp = new Date().toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });

      setActions((prev) =>
        [{ title, description, timestamp, status }, ...prev].slice(0, maxActions)
      );
    },
    [maxActions]
  );

  const clearActions = useCallback(() => {
    setActions([]);
  }, []);

  return {
    actions,
    addAction,
    clearActions,
  };
};

/**
 * Notification Container - Renders all active notifications
 */
export const NotificationContainer = ({ notifications, onRemove }) => {
  return (
    <div className="fixed top-4 right-4 z-40 space-y-3 max-w-sm">
      {notifications.map((notif) => (
        <Notification
          key={notif.id}
          id={notif.id}
          type={notif.type}
          message={notif.message}
          onClose={() => onRemove(notif.id)}
        />
      ))}
    </div>
  );
};
