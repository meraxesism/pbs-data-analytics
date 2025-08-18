import React from 'react';
import { TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react';

interface CPKIndicatorProps {
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

const CPKIndicator: React.FC<CPKIndicatorProps> = ({ parameter, data, isSelected, onClick }) => {
  const cpk = data?.cpk || Math.random() * 0.5 + 1.0; // Random CPK between 1.0 and 1.5
  const cp = data?.cp || cpk + Math.random() * 0.2; // CP is usually slightly higher

  const getCPKStatus = () => {
    if (cpk >= 1.33) return {
      color: 'text-green-400',
      bg: 'bg-green-500/10',
      icon: <CheckCircle className="w-4 h-4" />,
      status: 'Capable'
    };
    if (cpk >= 1.0) return {
      color: 'text-yellow-400',
      bg: 'bg-yellow-500/10',
      icon: <AlertTriangle className="w-4 h-4" />,
      status: 'Marginal'
    };
    return {
      color: 'text-red-400',
      bg: 'bg-red-500/10',
      icon: <AlertTriangle className="w-4 h-4" />,
      status: 'Not Capable'
    };
  };

  const status = getCPKStatus();

  return (
    <div
      className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
        status.bg
      } ${
        isSelected
          ? 'border-blue-400 ring-2 ring-blue-400/50'
          : 'border-gray-600 hover:border-gray-500'
      }`}
      onClick={onClick}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-1">
            <span className="text-white font-medium text-sm">{parameter.name}</span>
            <span className={`${status.color}`}>{status.icon}</span>
          </div>
          
          <div className="grid grid-cols-3 gap-4 text-xs">
            <div>
              <span className="text-gray-400">Cpk</span>
              <div className={`font-bold ${status.color}`}>
                {cpk.toFixed(2)}
              </div>
            </div>
            <div>
              <span className="text-gray-400">Cp</span>
              <div className="font-bold text-gray-300">
                {cp.toFixed(2)}
              </div>
            </div>
            <div>
              <span className="text-gray-400">Status</span>
              <div className={`font-bold ${status.color}`}>
                {status.status}
              </div>
            </div>
          </div>
        </div>

        <div className="ml-4">
          <div className="w-16 h-2 bg-gray-700 rounded-full">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                cpk >= 1.33 ? 'bg-green-400' : cpk >= 1.0 ? 'bg-yellow-400' : 'bg-red-400'
              }`}
              style={{ width: `${Math.min((cpk / 2) * 100, 100)}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CPKIndicator;