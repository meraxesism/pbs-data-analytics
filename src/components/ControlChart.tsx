import React, { useMemo } from 'react';

interface ControlChartProps {
  parameter: {
    id: string;
    name: string;
    unit: string;
    target: number;
    tolerance: number;
  };
  data: any;
}

const ControlChart: React.FC<ControlChartProps> = ({ parameter, data }) => {
  const chartData = useMemo(() => {
    if (!data || !data.measurements) {
      // Generate sample data with subgroups for X-bar R chart
      return Array.from({ length: 20 }, (_, i) => {
        const subgroupSize = 5;
        const subgroup = Array.from({ length: subgroupSize }, () => 
          parameter.target + (Math.random() - 0.5) * parameter.tolerance * 1.2
        );
        const mean = subgroup.reduce((sum, val) => sum + val, 0) / subgroupSize;
        const range = Math.max(...subgroup) - Math.min(...subgroup);
        return {
          sample: i + 1,
          mean: mean,
          range: range,
          subgroup: subgroup
        };
      });
    }
    
    // Process existing data into subgroups
    const measurements = data.measurements.slice(-100); // Last 100 measurements
    const subgroups = [];
    const subgroupSize = 5;
    
    for (let i = 0; i < Math.min(20, Math.floor(measurements.length / subgroupSize)); i++) {
      const start = i * subgroupSize;
      const subgroup = measurements.slice(start, start + subgroupSize).map(m => m.value);
      const mean = subgroup.reduce((sum, val) => sum + val, 0) / subgroupSize;
      const range = Math.max(...subgroup) - Math.min(...subgroup);
      
      subgroups.push({
        sample: i + 1,
        mean: mean,
        range: range,
        subgroup: subgroup
      });
    }
    
    return subgroups;
  }, [data, parameter]);

  // Calculate control limits
  const xBarMean = chartData.reduce((sum, d) => sum + d.mean, 0) / chartData.length;
  const rBar = chartData.reduce((sum, d) => sum + d.range, 0) / chartData.length;
  
  // Control chart constants for subgroup size of 5
  const A2 = 0.577; // A2 factor for n=5
  const D3 = 0; // D3 factor for n=5
  const D4 = 2.114; // D4 factor for n=5
  
  // X-bar chart limits
  const xBarUCL = xBarMean + A2 * rBar;
  const xBarLCL = xBarMean - A2 * rBar;
  
  // R chart limits
  const rUCL = D4 * rBar;
  const rLCL = D3 * rBar;

  // Chart dimensions
  const chartWidth = 500;
  const chartHeight = 200;
  const margin = { top: 20, right: 80, bottom: 40, left: 60 };
  const plotWidth = chartWidth - margin.left - margin.right;
  const plotHeight = chartHeight - margin.top - margin.bottom;

  // X-bar chart scales
  const xBarMax = Math.max(...chartData.map(d => d.mean), xBarUCL);
  const xBarMin = Math.min(...chartData.map(d => d.mean), xBarLCL);
  const xBarRange = xBarMax - xBarMin || 1;

  // R chart scales
  const rMax = Math.max(...chartData.map(d => d.range), rUCL);
  const rMin = 0;
  const rRange = rMax - rMin || 1;

  const getXBarY = (value: number) => margin.top + ((xBarMax - value) / xBarRange) * plotHeight;
  const getRY = (value: number) => margin.top + ((rMax - value) / rRange) * plotHeight;
  const getX = (index: number) => margin.left + (index / (chartData.length - 1)) * plotWidth;

  const isOutOfControl = (value: number, ucl: number, lcl: number) => value > ucl || value < lcl;

  return (
    <div className="bg-gray-700/50 rounded-lg p-4">
      <div className="mb-4">
        <h4 className="text-white font-semibold text-lg mb-2">
          X̄-R Chart of {parameter.name}
        </h4>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-400">X̄ = </span>
            <span className="text-white font-medium">{xBarMean.toFixed(3)}</span>
          </div>
          <div>
            <span className="text-gray-400">R̄ = </span>
            <span className="text-white font-medium">{rBar.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* X-bar Chart */}
      <div className="mb-6">
        <svg width={chartWidth} height={chartHeight} className="bg-white rounded">
          {/* Grid */}
          <defs>
            <pattern id="xbar-grid" width="40" height="20" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 20" fill="none" stroke="#e5e7eb" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect x={margin.left} y={margin.top} width={plotWidth} height={plotHeight} fill="url(#xbar-grid)" />
          
          {/* Control limits */}
          <line
            x1={margin.left}
            y1={getXBarY(xBarUCL)}
            x2={margin.left + plotWidth}
            y2={getXBarY(xBarUCL)}
            stroke="#dc2626"
            strokeWidth="2"
          />
          <line
            x1={margin.left}
            y1={getXBarY(xBarLCL)}
            x2={margin.left + plotWidth}
            y2={getXBarY(xBarLCL)}
            stroke="#dc2626"
            strokeWidth="2"
          />
          <line
            x1={margin.left}
            y1={getXBarY(xBarMean)}
            x2={margin.left + plotWidth}
            y2={getXBarY(xBarMean)}
            stroke="#16a34a"
            strokeWidth="2"
          />

          {/* Data points and lines */}
          {chartData.map((point, index) => {
            const x = getX(index);
            const y = getXBarY(point.mean);
            const nextPoint = chartData[index + 1];
            const isOOC = isOutOfControl(point.mean, xBarUCL, xBarLCL);

            return (
              <g key={index}>
                {nextPoint && (
                  <line
                    x1={x}
                    y1={y}
                    x2={getX(index + 1)}
                    y2={getXBarY(nextPoint.mean)}
                    stroke="#2563eb"
                    strokeWidth="2"
                  />
                )}
                <circle
                  cx={x}
                  cy={y}
                  r="4"
                  fill={isOOC ? "#dc2626" : "#2563eb"}
                  stroke="white"
                  strokeWidth="2"
                />
                {isOOC && (
                  <rect
                    x={x - 6}
                    y={y - 6}
                    width="12"
                    height="12"
                    fill="none"
                    stroke="#dc2626"
                    strokeWidth="2"
                  />
                )}
              </g>
            );
          })}

          {/* X-axis labels */}
          {chartData.map((_, index) => {
            if (index % 2 === 0) {
              return (
                <text
                  key={index}
                  x={getX(index)}
                  y={chartHeight - 10}
                  textAnchor="middle"
                  className="fill-gray-600 text-xs"
                >
                  {index + 1}
                </text>
              );
            }
            return null;
          })}

          {/* Y-axis labels */}
          <text x={10} y={getXBarY(xBarUCL)} className="fill-gray-600 text-xs" dominantBaseline="middle">
            {xBarUCL.toFixed(1)}
          </text>
          <text x={10} y={getXBarY(xBarMean)} className="fill-gray-600 text-xs" dominantBaseline="middle">
            {xBarMean.toFixed(1)}
          </text>
          <text x={10} y={getXBarY(xBarLCL)} className="fill-gray-600 text-xs" dominantBaseline="middle">
            {xBarLCL.toFixed(1)}
          </text>

          {/* Control limit labels */}
          <text x={chartWidth - 75} y={getXBarY(xBarUCL)} className="fill-red-600 text-xs font-medium" dominantBaseline="middle">
            UCL={xBarUCL.toFixed(1)}
          </text>
          <text x={chartWidth - 75} y={getXBarY(xBarMean)} className="fill-green-600 text-xs font-medium" dominantBaseline="middle">
            X̄={xBarMean.toFixed(3)}
          </text>
          <text x={chartWidth - 75} y={getXBarY(xBarLCL)} className="fill-red-600 text-xs font-medium" dominantBaseline="middle">
            LCL={xBarLCL.toFixed(1)}
          </text>

          {/* Chart title and axis labels */}
          <text x={chartWidth / 2} y={15} textAnchor="middle" className="fill-gray-800 text-sm font-medium">
            Sample Mean
          </text>
          <text x={chartWidth / 2} y={chartHeight - 5} textAnchor="middle" className="fill-gray-600 text-xs">
            Sample
          </text>
        </svg>
      </div>

      {/* R Chart */}
      <div>
        <svg width={chartWidth} height={chartHeight} className="bg-white rounded">
          {/* Grid */}
          <rect x={margin.left} y={margin.top} width={plotWidth} height={plotHeight} fill="url(#xbar-grid)" />
          
          {/* Control limits */}
          <line
            x1={margin.left}
            y1={getRY(rUCL)}
            x2={margin.left + plotWidth}
            y2={getRY(rUCL)}
            stroke="#dc2626"
            strokeWidth="2"
          />
          <line
            x1={margin.left}
            y1={getRY(rLCL)}
            x2={margin.left + plotWidth}
            y2={getRY(rLCL)}
            stroke="#dc2626"
            strokeWidth="2"
          />
          <line
            x1={margin.left}
            y1={getRY(rBar)}
            x2={margin.left + plotWidth}
            y2={getRY(rBar)}
            stroke="#16a34a"
            strokeWidth="2"
          />

          {/* Data points and lines */}
          {chartData.map((point, index) => {
            const x = getX(index);
            const y = getRY(point.range);
            const nextPoint = chartData[index + 1];
            const isOOC = isOutOfControl(point.range, rUCL, rLCL);

            return (
              <g key={index}>
                {nextPoint && (
                  <line
                    x1={x}
                    y1={y}
                    x2={getX(index + 1)}
                    y2={getRY(nextPoint.range)}
                    stroke="#2563eb"
                    strokeWidth="2"
                  />
                )}
                <circle
                  cx={x}
                  cy={y}
                  r="4"
                  fill={isOOC ? "#dc2626" : "#2563eb"}
                  stroke="white"
                  strokeWidth="2"
                />
                {isOOC && (
                  <rect
                    x={x - 6}
                    y={y - 6}
                    width="12"
                    height="12"
                    fill="none"
                    stroke="#dc2626"
                    strokeWidth="2"
                  />
                )}
              </g>
            );
          })}

          {/* X-axis labels */}
          {chartData.map((_, index) => {
            if (index % 2 === 0) {
              return (
                <text
                  key={index}
                  x={getX(index)}
                  y={chartHeight - 10}
                  textAnchor="middle"
                  className="fill-gray-600 text-xs"
                >
                  {index + 1}
                </text>
              );
            }
            return null;
          })}

          {/* Y-axis labels */}
          <text x={10} y={getRY(rUCL)} className="fill-gray-600 text-xs" dominantBaseline="middle">
            {rUCL.toFixed(1)}
          </text>
          <text x={10} y={getRY(rBar)} className="fill-gray-600 text-xs" dominantBaseline="middle">
            {rBar.toFixed(2)}
          </text>
          <text x={10} y={getRY(rLCL)} className="fill-gray-600 text-xs" dominantBaseline="middle">
            {rLCL.toFixed(1)}
          </text>

          {/* Control limit labels */}
          <text x={chartWidth - 75} y={getRY(rUCL)} className="fill-red-600 text-xs font-medium" dominantBaseline="middle">
            UCL={rUCL.toFixed(1)}
          </text>
          <text x={chartWidth - 75} y={getRY(rBar)} className="fill-green-600 text-xs font-medium" dominantBaseline="middle">
            R̄={rBar.toFixed(2)}
          </text>
          <text x={chartWidth - 75} y={getRY(rLCL)} className="fill-red-600 text-xs font-medium" dominantBaseline="middle">
            LCL={rLCL.toFixed(1)}
          </text>

          {/* Chart title and axis labels */}
          <text x={chartWidth / 2} y={15} textAnchor="middle" className="fill-gray-800 text-sm font-medium">
            Sample Range
          </text>
          <text x={chartWidth / 2} y={chartHeight - 5} textAnchor="middle" className="fill-gray-600 text-xs">
            Sample
          </text>
        </svg>
      </div>
    </div>
  );
};

export default ControlChart;