import React, { useState } from 'react';
import { useData } from '../contexts/DataContext';
import EquipmentCard from './EquipmentCard';
import TrendChart from './TrendChart';
import { Wrench, Activity, AlertCircle, Clock } from 'lucide-react';

const MaintenanceScreen: React.FC = () => {
  const { processData, maintenanceData } = useData();
  const [selectedEquipment, setSelectedEquipment] = useState<string | null>(null);

  const equipmentList = Object.keys(processData).map(key => ({
    id: key,
    name: key.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
    ...processData[key],
    maintenance: maintenanceData[key]
  }));

  const criticalEquipment = equipmentList.filter(eq => eq.status === 'critical');
  const warningEquipment = equipmentList.filter(eq => eq.status === 'warning');

  return (
    <div className="p-6 space-y-6 bg-gray-900 min-h-screen">
      {/* Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-green-500/20 border border-green-500/30 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-400 text-sm font-medium">Normal Operation</p>
              <p className="text-2xl font-bold text-white mt-1">
                {equipmentList.filter(eq => eq.status === 'normal').length}
              </p>
            </div>
            <Activity className="w-8 h-8 text-green-400" />
          </div>
        </div>

        <div className="bg-yellow-500/20 border border-yellow-500/30 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-400 text-sm font-medium">Warnings</p>
              <p className="text-2xl font-bold text-white mt-1">{warningEquipment.length}</p>
            </div>
            <AlertCircle className="w-8 h-8 text-yellow-400" />
          </div>
        </div>

        <div className="bg-red-500/20 border border-red-500/30 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-400 text-sm font-medium">Critical Issues</p>
              <p className="text-2xl font-bold text-white mt-1">{criticalEquipment.length}</p>
            </div>
            <AlertCircle className="w-8 h-8 text-red-400" />
          </div>
        </div>

        <div className="bg-blue-500/20 border border-blue-500/30 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-400 text-sm font-medium">Maintenance Due</p>
              <p className="text-2xl font-bold text-white mt-1">3</p>
            </div>
            <Clock className="w-8 h-8 text-blue-400" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Equipment List */}
        <div className="lg:col-span-1">
          <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
            <div className="flex items-center space-x-2 mb-4">
              <Wrench className="w-6 h-6 text-orange-400" />
              <h3 className="text-xl font-bold text-white">Equipment Status</h3>
            </div>
            
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {equipmentList.map((equipment) => (
                <EquipmentCard
                  key={equipment.id}
                  equipment={equipment}
                  isSelected={selectedEquipment === equipment.id}
                  onClick={() => setSelectedEquipment(equipment.id)}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Trend Charts */}
        <div className="lg:col-span-2 min-h-0">
          <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
            <h3 className="text-xl font-bold text-white mb-4">
              {selectedEquipment 
                ? `${selectedEquipment.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())} Trends`
                : 'Overall System Trends'
              }
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
              <TrendChart
                title="Temperature"
                data={selectedEquipment ? processData[selectedEquipment]?.temperatureHistory : []}
                color="rgb(239, 68, 68)"
                unit="°C"
                specification={{ min: 150, max: 250, target: 200 }}
              />
              <TrendChart
                title="Vibration"
                data={selectedEquipment ? processData[selectedEquipment]?.vibrationHistory : []}
                color="rgb(59, 130, 246)"
                unit="mm/s"
                specification={{ min: 0, max: 3.0, target: 1.5 }}
              />
              <TrendChart
                title="Cycle Count"
                data={selectedEquipment ? processData[selectedEquipment]?.cycleHistory : []}
                color="rgb(34, 197, 94)"
                unit="cycles"
              />
              <TrendChart
                title="Efficiency"
                data={selectedEquipment ? processData[selectedEquipment]?.efficiencyHistory : []}
                color="rgb(168, 85, 247)"
                unit="%"
                specification={{ min: 85, max: 100, target: 95 }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MaintenanceScreen;