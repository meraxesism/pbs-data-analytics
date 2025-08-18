import React from 'react';
import { Activity, Settings, Wrench, BarChart3, Layout, Info } from 'lucide-react';

interface HeaderProps {
  activeScreen: 'overview' | 'maintenance' | 'quality';
  setActiveScreen: (screen: 'overview' | 'maintenance' | 'quality') => void;
}

const Header: React.FC<HeaderProps> = ({ activeScreen, setActiveScreen }) => {
  const currentTime = new Date().toLocaleTimeString();

  const getInfoContent = () => {
    switch (activeScreen) {
      case 'overview':
        return `Process Flow Overview Information:
• Click on any process node to view detailed parameters
• Green: Normal operation (within specifications)
• Yellow: Warning (approaching limits)
• Red: Critical (out of specification or fault)
• Temperature specifications: 150-250°C for ovens
• Efficiency shows percentage of time running within spec
• Real-time updates every 5 seconds`;
      case 'maintenance':
        return `Maintenance Monitoring Information:
• Temperature specifications: Ovens 180±10°C, Lines 25±5°C
• Vibration limits: <3.0 mm/s normal, >5.0 mm/s critical
• Efficiency shows uptime percentage in current shift
• Cycle count tracks production cycles completed
• Service intervals based on operating hours
• Critical alerts require immediate attention`;
      case 'quality':
        return `Quality Parameter Information:
• Coating Thickness: 25±2 μm specification
• Cure Temperature: 180±5°C specification
• Humidity: 45±10% RH specification
• Cpk >1.33 indicates capable process
• Control charts show real-time SPC monitoring
• Out of control points require investigation
• Trend analysis helps predict quality issues`;
      default:
        return 'Dashboard information';
    }
  };

  const [showInfo, setShowInfo] = React.useState(false);
  return (
    <header className="bg-gray-800 border-b border-gray-700 px-6 py-4 relative">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Activity className="w-8 h-8 text-blue-400" />
            <h1 className="text-2xl font-bold text-white">Paint Shop Monitor</h1>
          </div>
          <div className="flex items-center space-x-1 bg-green-500/20 px-3 py-1 rounded-full">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-green-400 text-sm font-medium">LIVE</span>
          </div>
        </div>

        <div className="flex items-center space-x-6">
          <nav className="flex space-x-2">
            <button
              onClick={() => setActiveScreen('overview')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                activeScreen === 'overview'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
              }`}
            >
              <Layout className="w-5 h-5" />
              <span>Overview</span>
            </button>
            <button
              onClick={() => setActiveScreen('maintenance')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                activeScreen === 'maintenance'
                  ? 'bg-orange-600 text-white'
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
              }`}
            >
              <Wrench className="w-5 h-5" />
              <span>Maintenance</span>
            </button>
            <button
              onClick={() => setActiveScreen('quality')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                activeScreen === 'quality'
                  ? 'bg-purple-600 text-white'
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
              }`}
            >
              <BarChart3 className="w-5 h-5" />
              <span>Quality</span>
            </button>
          </nav>

          <div className="flex items-center space-x-4 text-gray-300">
            <button
              onClick={() => setShowInfo(!showInfo)}
              className="p-2 hover:bg-gray-700 rounded-lg transition-colors relative"
              title="Information"
            >
              <Info className="w-5 h-5 text-blue-400" />
            </button>
            <div className="text-sm">
              <span className="font-bold text-blue-400">Developed by Nitesh Tiwari</span>
            </div>
            <span className="text-lg font-mono">{currentTime}</span>
            <button className="p-2 hover:bg-gray-700 rounded-lg transition-colors">
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Info Panel */}
      {showInfo && (
        <div className="absolute top-full right-6 mt-2 w-96 bg-gray-800 border border-gray-600 rounded-lg shadow-xl z-50 p-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-white font-semibold">Information</h4>
            <button
              onClick={() => setShowInfo(false)}
              className="text-gray-400 hover:text-white"
            >
              ×
            </button>
          </div>
          <div className="text-sm text-gray-300 whitespace-pre-line">
            {getInfoContent()}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;