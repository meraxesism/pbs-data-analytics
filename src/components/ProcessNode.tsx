import React from 'react';

interface ProcessNodeProps {
  id: string;
  name: string;
  x: number;
  y: number;
  type: string;
  data?: any;
  onClick: () => void;
  width?: number;
  height?: number;
}

const ProcessNode: React.FC<ProcessNodeProps> = ({ name, x, y, type, data, onClick, width, height }) => {
  const getStatusColor = () => {
    if (!data) return { primary: 'rgb(34, 197, 94)', secondary: 'rgba(34, 197, 94, 0.2)' }; // green
    if (data.status === 'critical') return { primary: 'rgb(239, 68, 68)', secondary: 'rgba(239, 68, 68, 0.2)' }; // red
    if (data.status === 'warning') return { primary: 'rgb(245, 158, 11)', secondary: 'rgba(245, 158, 11, 0.2)' }; // yellow
    return { primary: 'rgb(34, 197, 94)', secondary: 'rgba(34, 197, 94, 0.2)' }; // green
  };

  const getNodeDimensions = () => {
    return {
      width: width || 120,
      height: height || 50
    };
  };

  const getTypeBasedStyling = () => {
    switch (type) {
      case 'storage':
        return {
          borderRadius: '8px',
          strokeDashArray: '5,5',
          opacity: 0.9,
          icon: '📦'
        };
      case 'oven':
        return {
          borderRadius: '4px',
          strokeDashArray: undefined,
          opacity: 0.95,
          icon: '🔥'
        };
      case 'booth':
        return {
          borderRadius: '6px',
          strokeDashArray: undefined,
          opacity: 0.9,
          icon: '🎨'
        };
      case 'process':
        return {
          borderRadius: '4px',
          strokeDashArray: undefined,
          opacity: 0.9,
          icon: '⚙️'
        };
      case 'destination':
        return {
          borderRadius: '8px',
          strokeDashArray: '3,3',
          opacity: 0.95,
          icon: '🎯'
        };
      default:
        return {
          borderRadius: '4px',
          strokeDashArray: undefined,
          opacity: 0.9,
          icon: '⚡'
        };
    }
  };

  const { width: nodeWidth, height: nodeHeight } = getNodeDimensions();
  const statusColors = getStatusColor();
  const typeStyle = getTypeBasedStyling();
  
  // Enhanced font sizing based on node dimensions and text length
  const getFontSize = () => {
    const textLength = name.replace(/\n/g, '').length;
    const nodeArea = nodeWidth * nodeHeight;
    const lines = name.split('\n').length;
    
    // Base size calculation
    let baseSize = Math.min(
      nodeWidth / (textLength / lines * 0.8),
      nodeHeight / (lines * 1.8)
    );
    
    // Clamp to reasonable bounds
    return Math.max(8, Math.min(14, baseSize));
  };

  const fontSize = getFontSize();
  const textLines = name.split('\n');

  return (
    <g className="cursor-pointer transition-all duration-200 hover:drop-shadow-lg" onClick={onClick}>
      {/* Node shadow/glow effect */}
      <rect
        x={x - nodeWidth/2 - 2}
        y={y - nodeHeight/2 - 2}
        width={nodeWidth + 4}
        height={nodeHeight + 4}
        rx={parseInt(typeStyle.borderRadius)}
        fill={statusColors.secondary}
        opacity="0.6"
        className="blur-sm"
      />
      
      {/* Main node background */}
      <rect
        x={x - nodeWidth/2}
        y={y - nodeHeight/2}
        width={nodeWidth}
        height={nodeHeight}
        rx={parseInt(typeStyle.borderRadius)}
        fill="rgba(30, 41, 59, 0.95)"
        stroke={statusColors.primary}
        strokeWidth="2"
        strokeDasharray={typeStyle.strokeDashArray}
        opacity={typeStyle.opacity}
        className="transition-all duration-200 hover:fill-slate-700"
      />
      
      {/* Status indicator gradient */}
      <defs>
        <linearGradient id={`gradient-${x}-${y}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: statusColors.primary, stopOpacity: 0.3 }} />
          <stop offset="100%" style={{ stopColor: statusColors.primary, stopOpacity: 0.1 }} />
        </linearGradient>
      </defs>
      
      <rect
        x={x - nodeWidth/2}
        y={y - nodeHeight/2}
        width={nodeWidth}
        height={nodeHeight}
        rx={parseInt(typeStyle.borderRadius)}
        fill={`url(#gradient-${x}-${y})`}
      />

      {/* Node text */}
      {textLines.map((line, index) => {
        const lineY = y + (index - (textLines.length - 1) / 2) * (fontSize + 2);
        return (
          <text
            key={index}
            x={x}
            y={lineY}
            textAnchor="middle"
            dominantBaseline="middle"
            className="fill-white font-semibold pointer-events-none select-none"
            style={{ 
              fontSize: `${fontSize}px`,
              textShadow: '0 1px 2px rgba(0,0,0,0.5)'
            }}
          >
            {line.trim()}
          </text>
        );
      })}

      {/* Status pulse indicator */}
      <circle
        cx={x + nodeWidth/2 - 6}
        cy={y - nodeHeight/2 + 6}
        r="3"
        fill={statusColors.primary}
        className={data?.status === 'normal' ? 'animate-pulse' : ''}
        opacity="0.9"
      />

      {/* Type icon */}
      <text
        x={x - nodeWidth/2 + 8}
        y={y - nodeHeight/2 + 12}
        className="fill-white opacity-60"
        style={{ fontSize: '12px' }}
        pointerEvents="none"
      >
        {typeStyle.icon}
      </text>

      {/* Temperature display if available */}
      {data?.temperature && (
        <text
          x={x}
          y={y + nodeHeight/2 + 12}
          textAnchor="middle"
          className="fill-gray-300"
          style={{ fontSize: `${Math.max(8, fontSize * 0.7)}px` }}
          pointerEvents="none"
        >
          {Math.round(data.temperature)}°C
        </text>
      )}

      {/* Efficiency indicator */}
      {data?.efficiency && (
        <rect
          x={x - nodeWidth/2}
          y={y + nodeHeight/2 - 3}
          width={nodeWidth * (data.efficiency / 100)}
          height="3"
          fill={data.efficiency > 80 ? statusColors.primary : 'rgb(245, 158, 11)'}
          opacity="0.7"
        />
      )}

      {/* Hover highlight */}
      <rect
        x={x - nodeWidth/2}
        y={y - nodeHeight/2}
        width={nodeWidth}
        height={nodeHeight}
        rx={parseInt(typeStyle.borderRadius)}
        fill="transparent"
        stroke="rgba(255, 255, 255, 0.3)"
        strokeWidth="1"
        className="opacity-0 hover:opacity-100 transition-opacity duration-200"
        pointerEvents="none"
      />
    </g>
  );
};

export default ProcessNode;