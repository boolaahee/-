
import React from 'react';

const palmNames = ["大安", "留連", "速喜", "赤口", "小吉", "空亡"];

interface PalmDiagramProps {
  highlightIndex: number | null; // 要高亮的掌位索引
}

const PalmDiagram: React.FC<PalmDiagramProps> = ({ highlightIndex }) => {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
      {palmNames.map((name, index) => (
        <div
          key={index}
          style={{
            margin: '10px',
            padding: '15px',
            borderRadius: '50%',
            border: '2px solid #333',
            backgroundColor: highlightIndex === index ? '#ffd700' : '#f0f0f0',
            color: highlightIndex === index ? '#000' : '#555',
            fontWeight: highlightIndex === index ? 'bold' : 'normal',
            transition: '0.3s'
          }}
        >
          {name}
        </div>
      ))}
    </div>
  );
};

export default PalmDiagram;
