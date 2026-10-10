import { useEffect, useState } from 'react';
import { CheckCircle2, XCircle, AlertCircle, X } from 'lucide-react';

export type AlertType = 'success' | 'error' | 'warning';

interface AlertProps {
  type: AlertType;
  message: string;
  onClose?: () => void;
  autoClose?: boolean;
  duration?: number;
}

export default function Alert({ type, message, onClose, autoClose = true, duration = 4000 }: AlertProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (autoClose) {
      const timer = setTimeout(() => {
        setVisible(false);
        onClose?.();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [autoClose, duration, onClose]);

  if (!visible) return null;

  const styles = {
    success: { bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-800', icon: CheckCircle2 },
    error: { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-800', icon: XCircle },
    warning: { bg: 'bg-orange-50', border: 'border-orange-200', text: 'text-orange-800', icon: AlertCircle },
  };

  const style = styles[type];
  const Icon = style.icon;

  return (
    <div className={`flex items-start gap-3 px-4 py-3 rounded-xl border ${style.bg} ${style.border} animate-slide-down`}>
      <Icon className={`w-5 h-5 flex-shrink-0 mt-0.5 ${style.text}`} />
      <p className={`text-sm flex-1 ${style.text}`}>{message}</p>
      {onClose && (
        <button onClick={() => { setVisible(false); onClose(); }} className={`${style.text} hover:opacity-70`}>
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
