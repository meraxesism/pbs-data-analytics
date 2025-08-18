import React, { useState, useRef } from 'react';
import { useData } from '../contexts/DataContext';
import DetailModal from './DetailModal';
import ProcessNode from './ProcessNode';

interface Connection {
  from: string;
  to: string;
  bidirectional?: boolean;
  style?: 'direct' | 'orthogonal' | 'curved';
  waypoints?: Array<{ x: number; y: number }>;
}

interface NodePosition {
  id: string;
  name: string;
  x: number;
  y: number;
  type: string;
  width?: number;
  height?: number;
}

const ProcessFlow: React.FC = () => {
  const { processData } = useData();
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [scale, setScale] = useState(0.8);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [dragDistance, setDragDistance] = useState(0);
  const svgRef = useRef<SVGSVGElement>(null);

  // Completely redesigned clean layout with proper spacing
  const nodes: NodePosition[] = [
    // Stage 1: Raw Material Input (Top)
    { id: 'biw-storage', name: 'BIW STORAGE', x: 200, y: 100, type: 'storage', width: 140, height: 60 },
    
    // Stage 2: Pretreatment Line (Upper horizontal flow)
    { id: 'prewash', name: 'PREWASH', x: 400, y: 100, type: 'process', width: 120, height: 50 },
    { id: 'pretreatment', name: 'PRETREATMENT', x: 600, y: 100, type: 'process', width: 130, height: 50 },
    { id: 'electrocoat-line', name: 'ELECTROCOAT\nLINE', x: 800, y: 100, type: 'process', width: 120, height: 60 },
    { id: 'electrocoat-oven', name: 'ELECTROCOAT\nOVEN', x: 1000, y: 100, type: 'oven', width: 120, height: 60 },
    
    // Stage 3: Surface Preparation (Second row)
    { id: 'roof-ditch', name: 'ROOF DITCH', x: 200, y: 220, type: 'process', width: 110, height: 50 },
    { id: 'melt-sheet', name: 'MELT SHEET', x: 400, y: 220, type: 'process', width: 110, height: 50 },
    { id: 'jig-dejig', name: 'JIG DEJIG', x: 600, y: 220, type: 'process', width: 110, height: 50 },
    { id: 'sealant-line-1', name: 'SEALANT LINE', x: 800, y: 220, type: 'process', width: 120, height: 50 },
    
    // Stage 4: Base Processing (Third row)
    { id: 'surfacer-ovenline', name: 'SURFACER\nOVEN', x: 200, y: 340, type: 'oven', width: 120, height: 60 },
    { id: 'surfacer', name: 'SURFACER\nBOOTH', x: 400, y: 340, type: 'booth', width: 120, height: 60 },
    { id: 'wet-sanding', name: 'WET SANDING', x: 600, y: 340, type: 'process', width: 120, height: 50 },
    { id: 'dry-sanding', name: 'DRY SANDING', x: 800, y: 340, type: 'process', width: 120, height: 50 },
    
    // Stage 5: Base Coat (Fourth row)
    { id: 'bc-booth', name: 'BASE COAT\nBOOTH', x: 200, y: 460, type: 'booth', width: 120, height: 60 },
    { id: 'bc-oven', name: 'BASE COAT\nOVEN', x: 400, y: 460, type: 'oven', width: 120, height: 60 },
    { id: 'polishing', name: 'POLISHING', x: 600, y: 460, type: 'process', width: 120, height: 50 },
    { id: 'color-change-bank', name: 'COLOR CHANGE', x: 800, y: 460, type: 'process', width: 120, height: 50 },
    
    // Stage 6: Top Coat (Fifth row)
    { id: 'top-coat-booth-1', name: 'TOP COAT\nBOOTH 1', x: 200, y: 580, type: 'booth', width: 120, height: 60 },
    { id: 'top-coat-oven-1', name: 'TOP COAT\nOVEN 1', x: 400, y: 580, type: 'oven', width: 120, height: 60 },
    { id: 'top-coat-booth-2', name: 'TOP COAT\nBOOTH 2', x: 600, y: 580, type: 'booth', width: 120, height: 60 },
    { id: 'top-coat-oven-2', name: 'TOP COAT\nOVEN 2', x: 800, y: 580, type: 'oven', width: 120, height: 60 },
    
    // Stage 7: Final Processing (Sixth row)
    { id: 'wax-booth', name: 'WAX BOOTH', x: 200, y: 700, type: 'booth', width: 120, height: 50 },
    { id: 'under-body', name: 'UNDER BODY\nTREATMENT', x: 400, y: 700, type: 'process', width: 120, height: 60 },
    { id: 'under-body-oven', name: 'UNDER BODY\nOVEN', x: 600, y: 700, type: 'oven', width: 120, height: 60 },
    
    // Stage 8: Quality Control & Final (Bottom)
    { id: 'painted-bodies-storage', name: 'PAINTED\nSTORAGE', x: 200, y: 820, type: 'storage', width: 120, height: 60 },
    { id: 'cont-room', name: 'CONTROL\nROOM', x: 400, y: 820, type: 'process', width: 120, height: 60 },
    { id: 'paint-mix-room', name: 'PAINT MIX', x: 600, y: 820, type: 'process', width: 120, height: 60 },
    { id: 'painted-bodies-assy', name: 'TO ASSEMBLY', x: 800, y: 820, type: 'destination', width: 120, height: 60 },
    
    // Rework Station (Right side)
    { id: 'rp-bodies-wet-sanding', name: 'REWORK\nSTATION', x: 1000, y: 460, type: 'process', width: 120, height: 60 },
  ];

  // Clean, logical connections with minimal waypoints
  const connections: Connection[] = [
    // Main flow - Stage 1 (Horizontal top row)
    { from: 'biw-storage', to: 'prewash', style: 'orthogonal' },
    { from: 'prewash', to: 'pretreatment', style: 'orthogonal' },
    { from: 'pretreatment', to: 'electrocoat-line', style: 'orthogonal' },
    { from: 'electrocoat-line', to: 'electrocoat-oven', style: 'orthogonal' },

    // Flow down to Stage 2 (Vertical then horizontal)
    { from: 'electrocoat-oven', to: 'sealant-line-1', style: 'orthogonal', waypoints: [{ x: 1000, y: 160 }, { x: 800, y: 160 }] },
    { from: 'sealant-line-1', to: 'jig-dejig', style: 'orthogonal' },
    { from: 'jig-dejig', to: 'melt-sheet', style: 'orthogonal' },
    { from: 'melt-sheet', to: 'roof-ditch', style: 'orthogonal' },

    // Flow to Stage 3 (Surface preparation)
    { from: 'roof-ditch', to: 'surfacer-ovenline', style: 'orthogonal', waypoints: [{ x: 200, y: 280 }] },
    { from: 'surfacer-ovenline', to: 'surfacer', style: 'orthogonal' },
    { from: 'surfacer', to: 'wet-sanding', style: 'orthogonal' },
    { from: 'wet-sanding', to: 'dry-sanding', style: 'orthogonal' },

    // Flow to Stage 4 (Base coat)
    { from: 'dry-sanding', to: 'color-change-bank', style: 'orthogonal', waypoints: [{ x: 800, y: 400 }] },
    { from: 'color-change-bank', to: 'polishing', style: 'orthogonal', waypoints: [{ x: 800, y: 400 }, { x: 600, y: 400 }] },
    { from: 'polishing', to: 'bc-oven', style: 'orthogonal', waypoints: [{ x: 600, y: 400 }, { x: 400, y: 400 }] },
    { from: 'bc-oven', to: 'bc-booth', style: 'orthogonal' },

    // Flow to Stage 5 (Top coat - parallel processing)
    { from: 'bc-booth', to: 'top-coat-booth-1', style: 'orthogonal', waypoints: [{ x: 200, y: 520 }] },
    { from: 'bc-booth', to: 'top-coat-booth-2', style: 'orthogonal', waypoints: [{ x: 200, y: 520 }, { x: 600, y: 520 }] },
    { from: 'top-coat-booth-1', to: 'top-coat-oven-1', style: 'orthogonal' },
    { from: 'top-coat-booth-2', to: 'top-coat-oven-2', style: 'orthogonal' },

    // Convergence to Stage 6 (Final processing)
    { from: 'top-coat-oven-1', to: 'wax-booth', style: 'orthogonal', waypoints: [{ x: 400, y: 640 }, { x: 200, y: 640 }] },
    { from: 'top-coat-oven-2', to: 'wax-booth', style: 'orthogonal', waypoints: [{ x: 800, y: 640 }, { x: 200, y: 640 }] },
    { from: 'wax-booth', to: 'under-body', style: 'orthogonal' },
    { from: 'under-body', to: 'under-body-oven', style: 'orthogonal' },

    // Final Stage (Storage and assembly)
    { from: 'under-body-oven', to: 'painted-bodies-storage', style: 'orthogonal', waypoints: [{ x: 600, y: 760 }, { x: 200, y: 760 }] },
    { from: 'painted-bodies-storage', to: 'cont-room', style: 'orthogonal' },
    { from: 'cont-room', to: 'paint-mix-room', style: 'orthogonal' },
    { from: 'paint-mix-room', to: 'painted-bodies-assy', style: 'orthogonal' },

    // Rework path
    { from: 'polishing', to: 'rp-bodies-wet-sanding', style: 'orthogonal', waypoints: [{ x: 1000, y: 460 }] },
    { from: 'rp-bodies-wet-sanding', to: 'wet-sanding', style: 'orthogonal', waypoints: [{ x: 1000, y: 340 }, { x: 600, y: 340 }] },
  ];

  // Larger viewport for better spacing
  const viewWidth = 1200;
  const viewHeight = 900;

  // Pan and zoom handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button === 0) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
      setDragDistance(0);
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      const newPan = {
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      };
      setPan(newPan);
      
      const distance = Math.sqrt(
        Math.pow(e.clientX - (dragStart.x + pan.x), 2) + 
        Math.pow(e.clientY - (dragStart.y + pan.y), 2)
      );
      setDragDistance(distance);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const newScale = Math.max(0.4, Math.min(2, scale - e.deltaY * 0.001));
    setScale(newScale);
  };

  const getNodePosition = (node: NodePosition) => ({
    x: node.x,
    y: node.y,
  });

  // Improved connection path generator
  const getConnectionPath = (connection: Connection) => {
    const fromNode = nodes.find(n => n.id === connection.from);
    const toNode = nodes.find(n => n.id === connection.to);
    if (!fromNode || !toNode) return '';

    const fromPos = getNodePosition(fromNode);
    const toPos = getNodePosition(toNode);

    // Calculate clean edge connection points
    const getEdgePoint = (node: NodePosition, toward: { x: number; y: number }) => {
      const cx = node.x;
      const cy = node.y;
      const halfW = (node.width ?? 120) / 2;
      const halfH = (node.height ?? 50) / 2;
      
      const dx = toward.x - cx;
      const dy = toward.y - cy;
      
      if (Math.abs(dx) > Math.abs(dy)) {
        return { x: cx + (dx > 0 ? halfW + 10 : -halfW - 10), y: cy };
      } else {
        return { x: cx, y: cy + (dy > 0 ? halfH + 10 : -halfH - 10) };
      }
    };

    let start = getEdgePoint(fromNode, toPos);
    let end = getEdgePoint(toNode, fromPos);

    // Handle waypoints with cleaner routing
    if (connection.waypoints && connection.waypoints.length > 0) {
      const waypoints = connection.waypoints;
      let pathCommands = [`M ${start.x} ${start.y}`];
      
      for (let i = 0; i < waypoints.length; i++) {
        const waypoint = waypoints[i];
        pathCommands.push(`L ${waypoint.x} ${waypoint.y}`);
      }
      
      end = getEdgePoint(toNode, waypoints[waypoints.length - 1]);
      pathCommands.push(`L ${end.x} ${end.y}`);
      
      return pathCommands.join(' ');
    }

    // Simple orthogonal routing
    const midX = start.x + (end.x - start.x) / 2;
    const midY = start.y + (end.y - start.y) / 2;
    
    if (Math.abs(end.x - start.x) > Math.abs(end.y - start.y)) {
      return `M ${start.x} ${start.y} L ${midX} ${start.y} L ${midX} ${end.y} L ${end.x} ${end.y}`;
    } else {
      return `M ${start.x} ${start.y} L ${start.x} ${midY} L ${end.x} ${midY} L ${end.x} ${end.y}`;
    }
  };

  const handleNodeClick = (nodeId: string) => {
    if (dragDistance < 5) {
      setSelectedNode(selectedNode === nodeId ? null : nodeId);
    }
  };

  return (
    <div className="w-full h-screen bg-gradient-to-br from-gray-900 to-gray-800 relative overflow-hidden">
      {/* Modern Header */}
      <div className="absolute top-6 left-6 z-10">
        <div className="bg-gray-800/80 backdrop-blur-sm rounded-xl p-4 border border-gray-600/50">
          <h1 className="text-2xl font-bold text-white mb-2">🏭 Paint Shop Process Flow</h1>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-green-400 rounded-full mr-2 animate-pulse"></div>
            <span className="text-gray-300 text-sm">Real-time Monitoring</span>
          </div>
        </div>
      </div>

      {/* Clean Legend */}
      <div className="absolute top-6 right-6 z-10">
        <div className="bg-gray-800/80 backdrop-blur-sm rounded-xl p-4 border border-gray-600/50">
          <h3 className="text-white font-semibold mb-3">Process Status</h3>
          <div className="space-y-2">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-400 rounded-full mr-2"></div>
              <span className="text-gray-300 text-xs">Normal</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-yellow-400 rounded-full mr-2"></div>
              <span className="text-gray-300 text-xs">Warning</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-red-400 rounded-full mr-2"></div>
              <span className="text-gray-300 text-xs">Critical</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Canvas */}
      <div 
        className="w-full h-full cursor-grab active:cursor-grabbing"
        style={{ 
          transform: `scale(${scale}) translate(${pan.x}px, ${pan.y}px)`,
          transformOrigin: '0 0'
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
      >
        <svg
          ref={svgRef}
          className="w-full h-full"
          viewBox={`0 0 ${viewWidth} ${viewHeight}`}
        >
          <defs>
            {/* Clean grid pattern */}
            <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
              <path d="M 50 0 L 0 0 0 50" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="1"/>
            </pattern>
            
            {/* Modern arrow markers */}
            <marker id="arrow-primary" markerWidth="10" markerHeight="8" refX="9" refY="4" orient="auto">
              <polygon points="0 1, 9 4, 0 7" fill="#22c55e" stroke="#22c55e"/>
            </marker>
            
            <marker id="arrow-secondary" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
              <polygon points="0 1, 7 3, 0 5" fill="#60a5fa" stroke="#60a5fa"/>
            </marker>
          </defs>
          
          <rect width="100%" height="100%" fill="url(#grid)" />

          {/* Clean connection lines */}
          {connections.map((connection, index) => {
            const isMainFlow = ['biw-storage', 'prewash', 'pretreatment', 'electrocoat-line'].includes(connection.from);
            
            return (
              <path
                key={`connection-${index}`}
                d={getConnectionPath(connection)}
                stroke={isMainFlow ? "#22c55e" : "#60a5fa"}
                strokeWidth={isMainFlow ? "3" : "2"}
                fill="none"
                markerEnd={isMainFlow ? "url(#arrow-primary)" : "url(#arrow-secondary)"}
                className="transition-all duration-300 hover:opacity-80"
                opacity="0.8"
              />
            );
          })}

          {/* Stage indicators */}
          <g className="text-white text-sm font-bold">
            <circle cx={100} cy={100} r="20" fill="#3b82f6" opacity="0.9"/>
            <text x={100} y={106} textAnchor="middle" fill="white">1</text>
            
            <circle cx={100} cy={220} r="20" fill="#3b82f6" opacity="0.9"/>
            <text x={100} y={226} textAnchor="middle" fill="white">2</text>
            
            <circle cx={100} cy={340} r="20" fill="#3b82f6" opacity="0.9"/>
            <text x={100} y={346} textAnchor="middle" fill="white">3</text>
            
            <circle cx={100} cy={460} r="20" fill="#3b82f6" opacity="0.9"/>
            <text x={100} y={466} textAnchor="middle" fill="white">4</text>
            
            <circle cx={100} cy={580} r="20" fill="#3b82f6" opacity="0.9"/>
            <text x={100} y={586} textAnchor="middle" fill="white">5</text>
          </g>

          {/* Title */}
          <text x={600} y={40} textAnchor="middle" className="fill-white text-xl font-bold opacity-80">
            Automotive Paint Shop - Optimized Flow
          </text>

          {/* Process nodes */}
          {nodes.map((node) => (
            <ProcessNode
              key={node.id}
              id={node.id}
              name={node.name}
              x={node.x}
              y={node.y}
              type={node.type}
              data={processData?.[node.id]}
              onClick={() => handleNodeClick(node.id)}
              width={node.width}
              height={node.height}
            />
          ))}
        </svg>
      </div>

      {/* Modern Controls */}
      <div className="absolute bottom-6 left-6 z-10">
        <div className="bg-gray-800/80 backdrop-blur-sm rounded-xl p-3 border border-gray-600/50">
          <div className="flex gap-2">
            <button
              onClick={() => setScale(Math.min(2, scale + 0.2))}
              className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              Zoom In
            </button>
            <button
              onClick={() => setScale(Math.max(0.4, scale - 0.2))}
              className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              Zoom Out
            </button>
            <button
              onClick={() => { setPan({ x: 0, y: 0 }); setScale(0.8); }}
              className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              Reset
            </button>
          </div>
        </div>
      </div>

      {/* Detail Modal */}
      {selectedNode && (
        <DetailModal processId={selectedNode} onClose={() => setSelectedNode(null)} />
      )}
    </div>
  );
};

export default ProcessFlow;