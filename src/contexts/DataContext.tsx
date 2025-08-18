import React, { createContext, useContext, useState, useEffect } from 'react';

interface ProcessData {
  [key: string]: {
    status: 'normal' | 'warning' | 'critical';
    temperature?: number;
    efficiency?: number;
    cycleCount?: number;
    vibration?: number;
    temperatureHistory?: number[];
    efficiencyHistory?: number[];
    cycleHistory?: number[];
    vibrationHistory?: number[];
  };
}

interface MaintenanceData {
  [key: string]: {
    nextService: number;
    lastMaintenance: string;
    totalHours: number;
  };
}

interface QualityData {
  [key: string]: {
    cpk: number;
    cp: number;
    currentValue: number;
    trend: 'up' | 'down' | 'stable';
    measurements?: Array<{ value: number; timestamp: number }>;
  };
}

interface DataContextType {
  processData: ProcessData;
  maintenanceData: MaintenanceData;
  qualityData: QualityData;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [processData, setProcessData] = useState<ProcessData>({});
  const [maintenanceData, setMaintenanceData] = useState<MaintenanceData>({});
  const [qualityData, setQualityData] = useState<QualityData>({});

  // Initialize data
  useEffect(() => {
    const processes = [
      // Right side - Initial processing
      'biw-storage', 'prewash', 'pretreatment', 'electrocoat-line', 'electrocoat-oven',
      'roof-ditch', 'melt-sheet', 'jig-dejig', 'sealant-line-1',
      
      // Main horizontal flow (right to left)
      'mb-polishing-1', 'mb-polishing-2', 'mb-polishing-3', 'mb-polishing-4', 'mb-polishing-5',
      'wax-booth', 'bc-oven', 'bc-booth', 'polishing',
      'top-coat-oven-top', 'top-coat-booth-top', 'top-coat-oven-middle', 'top-coat-booth-middle',
      'surfacer-oven', 'surfacer', 'color-change-bank', 'wet-sanding', 'dry-sanding',
      'under-body-oven', 'under-body',
      
      // Left side - Final stages & storage
      'cont-room', 'paint-mix-room', 'painted-bodies-storage', 'rp-bodies-wet-sanding', 'painted-bodies-assy'
    ];

    const initialProcessData: ProcessData = {};
    const initialMaintenanceData: MaintenanceData = {};
    
    processes.forEach(process => {
      const statuses = ['normal', 'warning', 'critical'];
      const randomStatus = statuses[Math.floor(Math.random() * 3)] as 'normal' | 'warning' | 'critical';
      
      initialProcessData[process] = {
        status: process === 'ced-s' ? 'critical' : randomStatus,
        temperature: 150 + Math.random() * 100,
        efficiency: 80 + Math.random() * 20,
        cycleCount: Math.floor(Math.random() * 1000),
        vibration: Math.random() * 5,
        temperatureHistory: Array.from({ length: 20 }, () => 150 + Math.random() * 50),
        efficiencyHistory: Array.from({ length: 20 }, () => 80 + Math.random() * 20),
        cycleHistory: Array.from({ length: 20 }, (_, i) => i * 10 + Math.random() * 20),
        vibrationHistory: Array.from({ length: 20 }, () => Math.random() * 5),
      };

      initialMaintenanceData[process] = {
        nextService: Math.floor(Math.random() * 30) + 1,
        lastMaintenance: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        totalHours: Math.floor(Math.random() * 8760),
      };
    });

    const qualityParams = [
      'coating-thickness', 'cure-temperature', 'humidity', 'cure-time', 'adhesion', 'gloss-level'
    ];

    const initialQualityData: QualityData = {};
    qualityParams.forEach(param => {
      initialQualityData[param] = {
        cpk: 1.0 + Math.random() * 0.8, // CPK between 1.0 and 1.8
        cp: 1.2 + Math.random() * 0.6, // CP slightly higher
        currentValue: 20 + Math.random() * 10,
        trend: ['up', 'down', 'stable'][Math.floor(Math.random() * 3)] as 'up' | 'down' | 'stable',
        measurements: Array.from({ length: 25 }, (_, i) => ({
          value: 20 + Math.random() * 10,
          timestamp: Date.now() - (24 - i) * 60000,
        })),
      };
    });

    setProcessData(initialProcessData);
    setMaintenanceData(initialMaintenanceData);
    setQualityData(initialQualityData);
  }, []);

  // Simulate real-time data updates
  useEffect(() => {
    const interval = setInterval(() => {
      setProcessData(prev => {
        const updated = { ...prev };
        Object.keys(updated).forEach(key => {
          // Update temperature
          if (updated[key].temperature) {
            updated[key] = {
              ...updated[key],
              temperature: Math.max(100, Math.min(300, updated[key].temperature! + (Math.random() - 0.5) * 5)),
            };
          }
          
          // Update efficiency
          if (updated[key].efficiency) {
            updated[key] = {
              ...updated[key],
              efficiency: Math.max(60, Math.min(100, updated[key].efficiency! + (Math.random() - 0.5) * 2)),
            };
          }
        });
        return updated;
      });

      setQualityData(prev => {
        const updated = { ...prev };
        Object.keys(updated).forEach(key => {
          updated[key] = {
            ...updated[key],
            currentValue: Math.max(15, Math.min(35, updated[key].currentValue + (Math.random() - 0.5) * 2)),
          };
        });
        return updated;
      });
    }, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <DataContext.Provider value={{ processData, maintenanceData, qualityData }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};