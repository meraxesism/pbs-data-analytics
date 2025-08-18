import React, { useState } from 'react';
import Header from './components/Header';
import ProcessFlow from './components/ProcessFlow';
import MaintenanceScreen from './components/MaintenanceScreen';
import QualityScreen from './components/QualityScreen';
import AlertPanel from './components/AlertPanel';
import { AlertProvider } from './contexts/AlertContext';
import { DataProvider } from './contexts/DataContext';

function App() {
  const [activeScreen, setActiveScreen] = useState<'overview' | 'maintenance' | 'quality'>('overview');

  const renderScreen = () => {
    switch (activeScreen) {
      case 'maintenance':
        return <MaintenanceScreen />;
      case 'quality':
        return <QualityScreen />;
      default:
        return <ProcessFlow />;
    }
  };

  return (
    <AlertProvider>
      <DataProvider>
        <div className="min-h-screen bg-gray-900 text-white">
          <Header activeScreen={activeScreen} setActiveScreen={setActiveScreen} />
          <main className="relative">
            {renderScreen()}
            <AlertPanel />
          </main>
        </div>
      </DataProvider>
    </AlertProvider>
  );
}

export default App;