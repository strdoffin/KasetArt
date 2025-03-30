'use client';
import React, { useEffect, useState } from 'react';

const GridStatusDisplay = ({ initialData }) => {
  const [gridData, setGridData] = useState(initialData || {
    "normal_cnt": 2, 
    "rot_cnt": 2,
    "position": [
      {"x": 0, "y": 1, "status": "rot"},
      {"x": 1, "y": 1, "status": "rot"},
      {"x": 0, "y": 0, "status": "normal"},
      {"x": 1, "y": 0, "status": "normal"},
    ]
  });
  
  // Create a 2x2 grid with default "none" status
  const createGrid = (data) => {
    const grid = [];
    for (let y = 0; y < 2; y++) {
      const row = [];
      for (let x = 0; x < 2; x++) {
        // Default status is "none"
        row.push({ x, y, status: "none" });
      }
      grid.push(row);
    }
    
    // Update grid with positions from payload
    if (data.position && Array.isArray(data.position)) {
      data.position.forEach(pos => {
        if (pos.x >= 0 && pos.x < 2 && pos.y >= 0 && pos.y < 2) {
          grid[pos.y][pos.x].status = pos.status || "none";
        }
      });
    }
    
    return grid;
  };
  
  // Count cells of each type
  const countCellTypes = (grid) => {
    let normal = 0;
    let rot = 0;
    let none = 0;
    
    grid.forEach(row => {
      row.forEach(cell => {
        if (cell.status === "normal") normal++;
        else if (cell.status === "rot") rot++;
        else none++;
      });
    });
    
    return { normal, rot, none };
  };
  
  // Update grid data when props change
  useEffect(() => {
    if (initialData) {
      setGridData(initialData);
    }
  }, [initialData]);
  
  const grid = createGrid(gridData);
  const cellCounts = countCellTypes(grid);
  
  // Function to get styling based on status
  const getStatusStyles = (status) => {
    switch(status) {
      case "rot":
        return {
          bg: "bg-red-100",
          border: "border-red-200",
          text: "text-red-800",
          subtext: "text-red-600"
        };
      case "normal":
        return {
          bg: "bg-green-100",
          border: "border-green-200",
          text: "text-green-800",
          subtext: "text-green-600"
        };
      case "none":
      default:
        return {
          bg: "bg-gray-100",
          border: "border-gray-200",
          text: "text-gray-800",
          subtext: "text-gray-600"
        };
    }
  };
  
  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-8">
      <div className="mb-4">
        <div className="flex space-x-6">
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
            <span className="text-sm text-gray-700">Normal cells: {cellCounts.normal}</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
            <span className="text-sm text-gray-700">Rotted cells: {cellCounts.rot}</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-gray-500 mr-2"></div>
            <span className="text-sm text-gray-700">Empty cells: {cellCounts.none}</span>
          </div>
        </div>
      </div>
      
      <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
        <div className="grid grid-cols-2 gap-3 h-96">
          {grid.map((row, y) => 
            row.map((cell, x) => {
              const styles = getStatusStyles(cell.status);
              return (
                <div 
                  key={`${x}-${y}`} 
                  className={`h-full w-full flex items-center justify-center rounded-lg ${styles.bg} border ${styles.border}`}
                >
                  <div className="text-center">
                    <div className={`text-xs font-medium ${styles.text}`}>
                      ({x},{y})
                    </div>
                    <div className={`text-xs ${styles.subtext}`}>
                      {cell.status}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default GridStatusDisplay;