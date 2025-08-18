import React, { useMemo } from 'react';

interface TrendChartProps {
  title: string;
  data: number[];
  color: string;
  unit: string;
  specification?: { min: number; max: number; target?: number };
}

const TrendChart: React.FC<TrendChartProps> = ({ title, data, color, unit, specification }) => {
  const chartData = useMemo(() => {
    if (!data || data.length === 0) {
      // Generate sample data if none provided
      return Array.from({ length: 20 }, (_, i) => Math.sin(i / 3) * 10 + 50 + Math.random() * 5);
    }
    return data.slice(-20); // Show last 20 points
  }, [data]);

  const dataMax = Math.max(...chartData);
  const dataMin = Math.min(...chartData);
  
  // Include specification limits in scale calculation
  const maxValue = specification ? Math.max(dataMax, specification.max) : dataMax;
  const minValue = specification ? Math.min(dataMin, specification.min) : dataMin;
  const range = maxValue - minValue || 1;

  const pathData = chartData
    .map((value, index) => {
      const x = (index / (chartData.length - 1)) * 280;
      const y = 80 - ((value - minValue) / range) * 60;
      return `${index === 0 ? 'M' : 'L'} ${x + 20} ${y + 20}`;
    })
    .join(' ');

  return (
    <div className="bg-gray-700/50 rounded-lg p-4">
      <div className="flex justify-between items-center mb-3">
        <h4 className="text-white font-medium">{title}</h4>
        <div className="text-right">
          <span className="text-sm text-gray-400">
            {chartData[chartData.length - 1]?.toFixed(1)} {unit}
          </span>
          {specification && (
            <div className="text-xs text-gray-500">
              Spec: {specification.min}-{specification.max} {unit}
            </div>
          )}
        </div>
      </div>
      
      <svg className="w-full h-24" viewBox="0 0 320 120">
        {/* Grid lines */}
        <defs>
          <pattern id={`grid-${title}`} width="40" height="20" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 20" fill="none" stroke="rgba(75, 85, 99, 0.3)" strokeWidth="1"/>
          </pattern>
        </defs>
        <rect width="320" height="120" fill={`url(#grid-${title})`} />
        
        {/* Specification limits */}
        {specification && (
          <>
            <line
              x1="20"
              y1={80 - ((specification.max - minValue) / range) * 60 + 20}
              x2="300"
              y2={80 - ((specification.max - minValue) / range) * 60 + 20}
              stroke="rgb(239, 68, 68)"
              strokeWidth="1"
              strokeDasharray="3,3"
              opacity="0.7"
            />
            <line
              x1="20"
              y1={80 - ((specification.min - minValue) / range) * 60 + 20}
              x2="300"
              y2={80 - ((specification.min - minValue) / range) * 60 + 20}
              stroke="rgb(239, 68, 68)"
              strokeWidth="1"
              strokeDasharray="3,3"
              opacity="0.7"
            />
            {specification.target && (
              <line
                x1="20"
                y1={80 - ((specification.target - minValue) / range) * 60 + 20}
                x2="300"
                y2={80 - ((specification.target - minValue) / range) * 60 + 20}
                stroke="rgb(59, 130, 246)"
                strokeWidth="1"
                strokeDasharray="5,5"
                opacity="0.8"
              />
            )}
          </>
        )}
        
        {/* Data line */}
        <path
          d={pathData}
          stroke={color}
          strokeWidth="2"
          fill="none"
          className="drop-shadow-sm"
        />
        
        {/* Data points */}
        {chartData.map((value, index) => {
          const x = (index / (chartData.length - 1)) * 280 + 20;
          const y = 80 - ((value - minValue) / range) * 60 + 20;
          
          // Color code points based on specification
          let pointColor = color;
          if (specification) {
            if (value > specification.max || value < specification.min) {
              pointColor = 'rgb(239, 68, 68)'; // Red for out of spec
            } else if (value > specification.max * 0.9 || value < specification.min * 1.1) {
              pointColor = 'rgb(245, 158, 11)'; // Yellow for warning
            }
          }
          
          return (
            <circle
              key={index}
              cx={x}
              cy={y}
              r="2"
              fill={pointColor}
              className="drop-shadow-sm"
            />
          );
        })}
        
        {/* Area fill */}
        <path
          d={`${pathData} L ${(chartData.length - 1) / (chartData.length - 1) * 280 + 20} 100 L 20 100 Z`}
          fill={color}
          fillOpacity="0.1"
        />
        
        {/* Y-axis scale labels */}
        <text x="5" y="25" className="fill-gray-400 text-xs">
          {maxValue.toFixed(0)}
        </text>
        <text x="5" y="65" className="fill-gray-400 text-xs">
          {((maxValue + minValue) / 2).toFixed(0)}
        </text>
        <text x="5" y="105" className="fill-gray-400 text-xs">
          {minValue.toFixed(0)}
        </text>
      </svg>
    </div>
  );
};

export default TrendChart;