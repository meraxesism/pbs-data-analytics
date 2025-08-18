import React, { createContext, useContext, useState, useEffect } from 'react';

interface Alert {
  id: string;
  title: string;
  message: string;
  severity: 'info' | 'warning' | 'critical';
  timestamp: number;
  acknowledged: boolean;
  processId?: string;
}

interface AlertContextType {
  alerts: Alert[];
  addAlert: (alert: Omit<Alert, 'id' | 'timestamp' | 'acknowledged'>) => void;
  dismissAlert: (id: string) => void;
  acknowledgeAlert: (id: string) => void;
}

const AlertContext = createContext<AlertContextType | undefined>(undefined);

export const AlertProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [alerts, setAlerts] = useState<Alert[]>([]);

  const addAlert = (alert: Omit<Alert, 'id' | 'timestamp' | 'acknowledged'>) => {
    const newAlert: Alert = {
      ...alert,
      id: Date.now().toString(),
      timestamp: Date.now(),
      acknowledged: false,
    };
    setAlerts(prev => [newAlert, ...prev].slice(0, 10)); // Keep only latest 10 alerts
  };

  const dismissAlert = (id: string) => {
    setAlerts(prev => prev.filter(alert => alert.id !== id));
  };

  const acknowledgeAlert = (id: string) => {
    setAlerts(prev => 
      prev.map(alert => 
        alert.id === id ? { ...alert, acknowledged: true } : alert
      )
    );
  };

  // Simulate incoming alerts
  useEffect(() => {
    const interval = setInterval(() => {
      const alertTypes = [
        {
          title: 'Temperature Warning',
          message: 'Oven temperature approaching upper limit',
          severity: 'warning' as const,
          processId: 'black-coat-oven'
        },
        {
          title: 'Maintenance Due',
          message: 'Scheduled maintenance required for coating line',
          severity: 'info' as const,
          processId: 'top-coat-line-1'
        },
        {
          title: 'Quality Alert',
          message: 'Coating thickness out of specification',
          severity: 'critical' as const,
          processId: 'ced-s'
        }
      ];

      if (Math.random() < 0.3) { // 30% chance every 10 seconds
        const alertType = alertTypes[Math.floor(Math.random() * alertTypes.length)];
        addAlert(alertType);
      }
    }, 10000); // Every 10 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <AlertContext.Provider value={{ alerts, addAlert, dismissAlert, acknowledgeAlert }}>
      {children}
    </AlertContext.Provider>
  );
};

export const useAlerts = () => {
  const context = useContext(AlertContext);
  if (context === undefined) {
    throw new Error('useAlerts must be used within an AlertProvider');
  }
  return context;
};