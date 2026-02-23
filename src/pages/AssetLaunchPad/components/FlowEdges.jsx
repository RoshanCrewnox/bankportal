import React from 'react';
import { getSmoothStepPath } from '@xyflow/react';

// --- Custom Edge: Premium Thinner Tube with Clearer Pulse ---
export const TubeEdge = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  data
}) => {
  const [edgePath] = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetPosition,
    targetX,
    targetY,
    borderRadius: 32,
  });

  const glowColor = data?.glowColor || "#3b82f6";

  return (
    <>
      {/* Outer Tube (Glass) */}
      <path
        d={edgePath}
        fill="none"
        strokeWidth={12}
        className="stroke-gray-400/5 dark:stroke-white/5"
      />
      {/* Animated Glowing Pulse */}
      <path
        d={edgePath}
        fill="none"
        strokeWidth={1.5}
        stroke={glowColor}
        strokeDasharray="20, 150"
        strokeLinecap="round"
        style={{
          filter: `drop-shadow(0 0 6px ${glowColor})`,
        }}
      >
        <animate
          attributeName="stroke-dashoffset"
          from="170"
          to="0"
          dur="3s"
          repeatCount="indefinite"
        />
      </path>
    </>
  );
};
