import React from 'react';
import { AlertTriangle, X, CheckCircle } from 'lucide-react';
import { useAlerts } from '../contexts/AlertContext';

const AlertPanel: React.FC = () => {
  const { alerts, dismissAlert, acknowledgeAlert } = useAlerts();

  if (alerts.length === 0) return null;

  return (
    <div className="fixed top-20 right-6 z-40 w-80 space-y-2">
      {alerts.map((alert) => (
        <div
          key={alert.id}
          className={`p-4 rounded-lg border-l-4 shadow-lg transition-all duration-300 ${
            alert.severity === 'critical'
              ? 'bg-red-900/90 border-red-500 backdrop-blur-sm'
              : alert.severity === 'warning'
              ? 'bg-yellow-900/90 border-yellow-500 backdrop-blur-sm'
              : 'bg-blue-900/90 border-blue-500 backdrop-blur-sm'
          }`}
        >
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-3">
              <AlertTriangle
                className={`w-5 h-5 mt-0.5 ${
                  alert.severity === 'critical'
                    ? 'text-red-400'
                    : alert.severity === 'warning'
                    ? 'text-yellow-400'
                    : 'text-blue-400'
                }`}
              />
              <div>
                <h4 className="font-semibold text-white text-sm">{alert.title}</h4>
                <p className="text-gray-300 text-xs mt-1">{alert.message}</p>
                <p className="text-gray-400 text-xs mt-1">
                  {new Date(alert.timestamp).toLocaleTimeString()}
                </p>
              </div>
            </div>
            <button
              onClick={() => dismissAlert(alert.id)}
              className="p-1 hover:bg-white/10 rounded transition-colors"
            >
              <X className="w-4 h-4 text-gray-400" />
            </button>
          </div>

          {!alert.acknowledged && (
            <div className="flex space-x-2 mt-3">
              <button
                onClick={() => acknowledgeAlert(alert.id)}
                className="flex items-center space-x-1 px-3 py-1 bg-green-600 hover:bg-green-700 rounded text-white text-xs font-medium transition-colors"
              >
                <CheckCircle className="w-3 h-3" />
                <span>Acknowledge</span>
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default AlertPanel;