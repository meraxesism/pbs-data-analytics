import React, { useState } from 'react';
import { useData } from '../contexts/DataContext';
import QualityCard from './QualityCard';
import ControlChart from './ControlChart';
import CPKIndicator from './CPKIndicator';
import { BarChart3, TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react';

const QualityScreen: React.FC = () => {
  const { processData, qualityData } = useData();
  const [selectedParameter, setSelectedParameter] = useState<string>('coating-thickness');

  const qualityParameters = [
    { id: 'coating-thickness', name: 'Coating Thickness', unit: 'μm', target: 25, tolerance: 2 },
    { id: 'cure-temperature', name: 'Cure Temperature', unit: '°C', target: 180, tolerance: 5 },
    { id: 'humidity', name: 'Humidity', unit: '%RH', target: 45, tolerance: 10 },
    { id: 'cure-time', name: 'Cure Time', unit: 'min', target: 20, tolerance: 2 },
    { id: 'adhesion', name: 'Adhesion', unit: 'MPa', target: 15, tolerance: 2 },
    { id: 'gloss-level', name: 'Gloss Level', unit: 'GU', target: 85, tolerance: 5 },
  ];

  const getOverallQualityStatus = () => {
    const inControl = qualityParameters.filter(p => qualityData[p.id]?.cpk >= 1.33).length;
    const total = qualityParameters.length;
    return { inControl, total, percentage: Math.round((inControl / total) * 100) };
  };

  const qualityStatus = getOverallQualityStatus();

  return (
    <div className="p-6 space-y-6 bg-gray-900 min-h-screen">
      {/* Quality Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-green-500/20 border border-green-500/30 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-400 text-sm font-medium">In Control</p>
              <p className="text-2xl font-bold text-white mt-1">{qualityStatus.inControl}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-400" />
          </div>
        </div>

        <div className="bg-purple-500/20 border border-purple-500/30 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-400 text-sm font-medium">Overall CPK</p>
              <p className="text-2xl font-bold text-white mt-1">1.45</p>
            </div>
            <TrendingUp className="w-8 h-8 text-purple-400" />
          </div>
        </div>

        <div className="bg-blue-500/20 border border-blue-500/30 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-400 text-sm font-medium">Quality Score</p>
              <p className="text-2xl font-bold text-white mt-1">{qualityStatus.percentage}%</p>
            </div>
            <BarChart3 className="w-8 h-8 text-blue-400" />
          </div>
        </div>

        <div className="bg-yellow-500/20 border border-yellow-500/30 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-400 text-sm font-medium">Out of Control</p>
              <p className="text-2xl font-bold text-white mt-1">
                {qualityParameters.length - qualityStatus.inControl}
              </p>
            </div>
            <AlertTriangle className="w-8 h-8 text-yellow-400" />
          </div>
        </div>
      </div>

      {/* Quality Parameters Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {qualityParameters.map((param) => (
          <QualityCard
            key={param.id}
            parameter={param}
            data={qualityData[param.id]}
            isSelected={selectedParameter === param.id}
            onClick={() => setSelectedParameter(param.id)}
          />
        ))}
      </div>

      {/* Detailed Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-0">
        {/* Control Chart */}
        <div className="bg-gray-800 rounded-xl border border-gray-700 p-6 min-h-0">
          <h3 className="text-xl font-bold text-white mb-4">
            {qualityParameters.find(p => p.id === selectedParameter)?.name} Control Chart
          </h3>
          <div className="max-h-80 overflow-y-auto">
            <ControlChart
              parameter={qualityParameters.find(p => p.id === selectedParameter)!}
              data={qualityData[selectedParameter]}
            />
          </div>
        </div>

        {/* CPK Analysis */}
        <div className="bg-gray-800 rounded-xl border border-gray-700 p-6 min-h-0">
          <h3 className="text-xl font-bold text-white mb-4">Process Capability Analysis</h3>
          <div className="space-y-4 max-h-80 overflow-y-auto">
            {qualityParameters.map((param) => (
              <CPKIndicator
                key={param.id}
                parameter={param}
                data={qualityData[param.id]}
                isSelected={selectedParameter === param.id}
                onClick={() => setSelectedParameter(param.id)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QualityScreen;