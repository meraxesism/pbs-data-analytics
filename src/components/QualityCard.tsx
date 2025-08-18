import React from 'react';
import { TrendingUp, TrendingDown, AlertTriangle, CheckCircle } from 'lucide-react';

interface QualityCardProps {
  parameter: {
    id: string;
    name: string;
    unit: string;
    target: number;
    tolerance: number;
  };
  data: any;
  isSelected: boolean;
  onClick: () => void;
}

const QualityCard: React.FC<QualityCardProps> = ({ parameter, data, isSelected, onClick }) => {
  const cpk = data?.cpk || 1.2;
  const currentValue = data?.currentValue || parameter.target;
  const trend = data?.trend || 'stable';

  const getCPKStatus = () => {
    if (cpk >= 1.33) return { color: 'text-green-400', bg: 'bg-green-500/20', border: 'border-green-500/30' };
    if (cpk >= 1.0) return { color: 'text-yellow-400', bg: 'bg-yellow-500/20', border: 'border-yellow-500/30' };
    return { color: 'text-red-400', bg: 'bg-red-500/20', border: 'border-red-500/30' };
  };

  const status = getCPKStatus();

  const getTrendIcon = () => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-4 h-4 text-green-400" />;
      case 'down':
        return <TrendingDown className="w-4 h-4 text-red-400" />;
      default:
        return <CheckCircle className="w-4 h-4 text-blue-400" />;
    }
  };

  return (
    <div
      className={`p-6 rounded-xl border-2 cursor-pointer transition-all duration-200 hover:scale-105 ${
        status.bg
      } ${status.border} ${isSelected ? 'ring-2 ring-blue-400' : ''}`}
      onClick={onClick}
    >
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-semibold text-white">{parameter.name}</h4>
        {getTrendIcon()}
      </div>
      
      <div className="space-y-3">
        <div>
          <div className="flex justify-between items-center text-sm text-gray-300">
            <span>Current</span>
            <span>Target</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xl font-bold text-white">
              {currentValue.toFixed(1)} {parameter.unit}
            </span>
            <span className="text-lg text-gray-400">
              {parameter.target} {parameter.unit}
            </span>
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-300">Process Capability</span>
            <span className={`text-sm font-medium ${status.color}`}>
              {cpk >= 1.33 ? 'Capable' : cpk >= 1.0 ? 'Marginal' : 'Not Capable'}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-400">Cpk</span>
            <span className={`text-lg font-bold ${status.color}`}>
              {cpk.toFixed(2)}
            </span>
          </div>
        </div>

        {/* Progress bar for CPK */}
        <div className="w-full bg-gray-700 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all duration-300 ${
              cpk >= 1.33 ? 'bg-green-400' : cpk >= 1.0 ? 'bg-yellow-400' : 'bg-red-400'
            }`}
            style={{ width: `${Math.min(cpk / 2 * 100, 100)}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default QualityCard;