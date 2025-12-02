import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle, AlertTriangle, X, Info } from 'lucide-react';

const ToastContext = createContext();

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within ToastProvider');
    }
    return context;
};

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);

    const addToast = useCallback((message, type = 'info', duration = 3000) => {
        const id = Date.now();
        setToasts(prev => [...prev, { id, message, type, duration }]);

        if (duration > 0) {
            setTimeout(() => {
                removeToast(id);
            }, duration);
        }
    }, []);

    const removeToast = useCallback((id) => {
        setToasts(prev => prev.filter(toast => toast.id !== id));
    }, []);

    const success = useCallback((message, duration) => addToast(message, 'success', duration), [addToast]);
    const error = useCallback((message, duration) => addToast(message, 'error', duration), [addToast]);
    const warning = useCallback((message, duration) => addToast(message, 'warning', duration), [addToast]);
    const info = useCallback((message, duration) => addToast(message, 'info', duration), [addToast]);

    return (
        <ToastContext.Provider value={{ success, error, warning, info }}>
            {children}
            <ToastContainer toasts={toasts} onRemove={removeToast} />
        </ToastContext.Provider>
    );
};

const ToastContainer = ({ toasts, onRemove }) => {
    return (
        <div className="fixed top-4 right-4 z-50 space-y-2 max-w-md">
            {toasts.map(toast => (
                <Toast key={toast.id} toast={toast} onClose={() => onRemove(toast.id)} />
            ))}
        </div>
    );
};

const Toast = ({ toast, onClose }) => {
    const { message, type } = toast;

    const config = {
        success: {
            icon: CheckCircle,
            bgColor: '#F0FDF4',
            borderColor: '#86EFAC',
            textColor: '#166534',
            iconColor: '#059669',
        },
        error: {
            icon: AlertTriangle,
            bgColor: '#FEE2E2',
            borderColor: '#FCA5A5',
            textColor: '#991B1B',
            iconColor: '#DC2626',
        },
        warning: {
            icon: AlertTriangle,
            bgColor: '#FEF3C7',
            borderColor: '#FCD34D',
            textColor: '#78350F',
            iconColor: '#D97706',
        },
        info: {
            icon: Info,
            bgColor: 'var(--bg-persona)',
            borderColor: 'var(--primary-blue)',
            textColor: 'var(--primary-blue-dark)',
            iconColor: 'var(--primary-blue)',
        },
    };

    const { icon: Icon, bgColor, borderColor, textColor, iconColor } = config[type];

    return (
        <div
            className="p-4 flex items-start gap-3 min-w-[300px] animate-slide-in"
            role="alert"
            style={{
                backgroundColor: bgColor,
                border: `1px solid ${borderColor}`,
                borderRadius: 'var(--radius-sm)',
                boxShadow: 'var(--shadow-lg)'
            }}
        >
            <Icon size={20} className="flex-shrink-0 mt-0.5" style={{ color: iconColor }} />
            <p className="flex-1" style={{ color: textColor, fontSize: 'var(--font-size-base)', fontWeight: 'var(--font-weight-medium)' }}>{message}</p>
            <button
                onClick={onClose}
                className="hover:opacity-70 transition-opacity flex-shrink-0"
                aria-label="Close notification"
                style={{ color: textColor }}
            >
                <X size={16} />
            </button>
        </div>
    );
};

export default ToastProvider;
