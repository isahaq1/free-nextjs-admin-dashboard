"use client";
import React from "react";

interface CircleProgressProps {
  value: number;
  text: string;
  color?: string;
  size?: number;
}

const CircleProgress = ({
  value,
  text,
  color = "#ffa34d",
  size = 78,
}: CircleProgressProps) => {
  const center = size / 2;
  const radius = size / 2 - 2;
  const innerRadius = size / 4;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  return (
    <div className="dashboard-chart">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid meet"
        viewBox={`0 0 ${size} ${size}`}
        height={size}
        width={size}
      >
        <defs />
        <circle
          cx={center}
          cy={center}
          r={radius - 2}
          fill="#ffffff"
          fillOpacity="1"
          stroke="transparent"
          strokeWidth="0"
        />
        <circle
          cx={center}
          cy={center}
          r={innerRadius}
          fill="none"
          stroke="#dddddd"
          strokeWidth="2"
        />
        <path
          d={`M ${center} ${size / 6}
            A ${radius} ${radius} 0 1 1 ${center - 0.01} ${size / 6}`}
          stroke={color}
          strokeWidth="4"
          strokeLinecap="round"
          fill="none"
        />
        <text
          alignmentBaseline="baseline"
          x={center}
          y={center}
          textAnchor="middle"
        >
          <tspan
            x={center}
            y={center}
            dy="0.32em"
            fontSize="11"
            fontWeight="normal"
            fill="#444444"
          >
            {text}
          </tspan>
          <tspan fontSize="10" fontWeight="normal" fill="#444444">
            %
          </tspan>
        </text>
      </svg>
    </div>
  );
};

export default CircleProgress;
