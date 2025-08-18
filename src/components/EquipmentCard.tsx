import React from 'react';
import { Thermometer, Zap, Activity, Clock } from 'lucide-react';

interface EquipmentCardProps {
  equipment: any;
  isSelected: boolean;
  onClick: () => void;
}

const EquipmentCard: React.FC<EquipmentCardProps> = ({ equipment, isSelected, onClick }) => {
  const getStatusColor = () => {
    switch (equipment.status) {
      case 'critical': return 'border-red-500 bg-red-500/10';
      case 'warning': return 'border-yellow-500 bg-yellow-500/10';
      default: return 'border-green-500 bg-green-500/10';
    }
  };

  const getStatusText = () => {
    switch (equipment.status) {
      case 'critical': return 'Critical';
      case 'warning': return 'Warning';
      default: return 'Normal';
    }
  };

  return (
    <div
      className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 hover:scale-105 ${
        getStatusColor()
      } ${isSelected ? 'ring-2 ring-blue-400' : ''}`}
      onClick={onClick}
    >
      <div className="flex items-center justify-between mb-2">
        <h4 className="font-semibold text-white text-sm">{equipment.name}</h4>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          equipment.status === 'critical' ? 'bg-red-500/20 text-red-400' :
          equipment.status === 'warning' ? 'bg-yellow-500/20 text-yellow-400' :
          'bg-green-500/20 text-green-400'
        }`}>
          {getStatusText()}
        </span>
      </div>
      
      <div className="grid grid-cols-2 gap-2 text-xs">
        {equipment.temperature && (
          <div className="flex items-center space-x-1 text-gray-300">
            <Thermometer className="w-3 h-3" />
            <span>{Math.round(equipment.temperature)}°C</span>
            <span className="text-xs text-gray-500">(150-250)</span>
          </div>
        )}
        
        {equipment.efficiency && (
          <div className="flex items-center space-x-1 text-gray-300">
            <Activity className="w-3 h-3" />
            <span>{Math.round(equipment.efficiency)}%</span>
            <span className="text-xs text-gray-500">{"(>85%)"}</span>
          </div>
        )}
        
        {equipment.maintenance?.nextService && (
          <div className="flex items-center space-x-1 text-gray-300 col-span-2">
            <Clock className="w-3 h-3" />
            <span>Service in {equipment.maintenance.nextService} days</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default EquipmentCard;