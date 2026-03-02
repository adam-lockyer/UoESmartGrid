import React from "react";
import { ResponsivePie } from "@nivo/pie";

const PieChart = ({ data, centerText }) => {
  if (!data || data.length === 0) {
    return <div>No data available</div>;
  }

  const CenteredText = ({ centerX, centerY }) => (
    <text
      x={centerX}
      y={centerY}
      textAnchor="middle"
      dominantBaseline="central"
      style={{
        fontSize: '18px',
        fontWeight: 'bold',
        fontFamily: 'Inter, serif sans', 
        fill: '#000000'
      }}
    >
      {centerText}
    </text>
  );

  return (
    <ResponsivePie
      data={data}
      margin={{ top: 10, right: 0, bottom: 10, left: 0 }}
      innerRadius={0.8}
      padAngle={0.7}
      cornerRadius={1}
      borderWidth={0}
      enableArcLinkLabels={false}
      enableArcLabels={false}
      activeOuterRadiusOffset={4}
      layers={['arcs', 'arcLabels', 'arcLinkLabels', 'legends', CenteredText]}
      tooltip={({ datum }) => (
        <div
          style={{
            background: '#2338277c',
            padding: '8px 12px',
            borderRadius: '4px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            fontSize: '14px',
            fontFamily:'Inter, serif sans',
            color:"white"
          }}
        >
          <strong>{datum.label}</strong>: {datum.value}
        </div>
      )}
    />
  );
};

export default PieChart;