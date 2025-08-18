import React from 'react';
import { X, Thermometer, Activity, Clock, AlertTriangle } from 'lucide-react';
import { useData } from '../contexts/DataContext';
import TrendChart from './TrendChart';

interface DetailModalProps {
  processId: string;
  onClose: () => void;
}

const DetailModal: React.FC<DetailModalProps> = ({ processId, onClose }) => {
  const { processData } = useData();
  const process = processData[processId];

  if (!process) return null;

  const processName = processId.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-2xl border border-gray-700 w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <div>
            <h2 className="text-2xl font-bold text-white">{processName}</h2>
            <div className="flex items-center space-x-2 mt-1">
              <div className={`w-3 h-3 rounded-full ${
                process.status === 'critical' ? 'bg-red-400' :
                process.status === 'warning' ? 'bg-yellow-400' : 'bg-green-400'
              }`}></div>
              <span className="text-sm text-gray-400 capitalize">{process.status}</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-gray-400" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-100px)]">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            {process.temperature && (
              <div className="bg-gray-700/50 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Thermometer className="w-5 h-5 text-red-400" />
                  <span className="text-gray-300 text-sm">Temperature</span>
                </div>
                <div className="text-2xl font-bold text-white">
                  {Math.round(process.temperature)}°C
                </div>
              </div>
            )}

            {process.efficiency && (
              <div className="bg-gray-700/50 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Activity className="w-5 h-5 text-green-400" />
                  <span className="text-gray-300 text-sm">Efficiency</span>
                </div>
                <div className="text-2xl font-bold text-white">
                  {Math.round(process.efficiency)}%
                </div>
              </div>
            )}

            {process.cycleCount && (
              <div className="bg-gray-700/50 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Clock className="w-5 h-5 text-blue-400" />
                  <span className="text-gray-300 text-sm">Cycle Count</span>
                </div>
                <div className="text-2xl font-bold text-white">
                  {process.cycleCount}
                </div>
              </div>
            )}

            {process.vibration && (
              <div className="bg-gray-700/50 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <AlertTriangle className="w-5 h-5 text-purple-400" />
                  <span className="text-gray-300 text-sm">Vibration</span>
                </div>
                <div className="text-2xl font-bold text-white">
                  {process.vibration.toFixed(1)} mm/s
                </div>
              </div>
            )}
          </div>

          {/* Trend Charts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <TrendChart
              title="Temperature Trend"
              data={process.temperatureHistory || []}
              color="rgb(239, 68, 68)"
              unit="°C"
              specification={{ min: 150, max: 250, target: 200 }}
            />
            <TrendChart
              title="Efficiency Trend"
              data={process.efficiencyHistory || []}
              color="rgb(34, 197, 94)"
              unit="%"
              specification={{ min: 85, max: 100, target: 95 }}
            />
          </div>

          {/* Alerts & Notifications */}
          <div className="bg-gray-700/50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-white mb-3">Recent Events</h3>
            <div className="space-y-2">
              <div className="flex items-center space-x-3 p-2 bg-yellow-500/10 border border-yellow-500/20 rounded">
                <AlertTriangle className="w-4 h-4 text-yellow-400" />
                <span className="text-sm text-gray-300">
                  Temperature approaching upper limit - 15:32
                </span>
              </div>
              <div className="flex items-center space-x-3 p-2 bg-blue-500/10 border border-blue-500/20 rounded">
                <Activity className="w-4 h-4 text-blue-400" />
                <span className="text-sm text-gray-300">
                  Maintenance cycle completed - 14:45
                </span>
              </div>
              <div className="flex items-center space-x-3 p-2 bg-green-500/10 border border-green-500/20 rounded">
                <Clock className="w-4 h-4 text-green-400" />
                <span className="text-sm text-gray-300">
                  Process efficiency optimized - 13:20
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailModal;