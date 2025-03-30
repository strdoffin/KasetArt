'use client';
import React, { useEffect, useState } from 'react';

const GridStatusDisplay = ({ initialData }) => {
  const [gridData, setGridData] = useState(initialData || {
    "normal_cnt": 4, 
    "rot_cnt": 1,
    "position": [
      {"x": 0, "y": 2, "status": "rot"},
    ]
  });
  
  // Create a 4x4 grid with default "normal" status
  const createGrid = (data) => {
    const grid = [];
    for (let y = 0; y < 4; y++) {
      const row = [];
      for (let x = 0; x < 4; x++) {
        // Default status is "normal"
        row.push({ x, y, status: "normal" });
      }
      grid.push(row);
    }
    
    // Update grid with positions from payload
    data.position.forEach(pos => {
      if (pos.x >= 0 && pos.x < 4 && pos.y >= 0 && pos.y < 4) {
        grid[pos.y][pos.x].status = pos.status;
      }
    });
    
    return grid;
  };
  
  // Update grid data when props change
  useEffect(() => {
    if (initialData) {
      setGridData(initialData);
    }
  }, [initialData]);
  
  const grid = createGrid(gridData);
  
  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-8">
      <div className="mb-4">
        <div className="flex space-x-6">
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
            <span className="text-sm text-gray-700">Normal cells: {gridData.normal_cnt}</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
            <span className="text-sm text-gray-700">Rotted cells: {gridData.rot_cnt}</span>
          </div>
        </div>
      </div>
      
      <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
        <div className="grid grid-cols-4 gap-3">
          {grid.map((row, y) => 
            row.map((cell, x) => (
              <div 
                key={`${x}-${y}`} 
                className={`
                  h-16 w-full flex items-center justify-center rounded-lg
                  ${cell.status === "rot" 
                    ? "bg-red-100 border border-red-200" 
                    : "bg-green-100 border border-green-200"}
                `}
              >
                <div className="text-center">
                  <div className={`text-xs font-medium ${cell.status === "rot" ? "text-red-800" : "text-green-800"}`}>
                    ({x},{y})
                  </div>
                  <div className={`text-xs ${cell.status === "rot" ? "text-red-600" : "text-green-600"}`}>
                    {cell.status}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default GridStatusDisplay;