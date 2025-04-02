'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const GridSizeSelector = ({ initialData }) => {
  const router = useRouter();
  // State for grid size (1x1 to 6x6)
  const [gridSize, setGridSize] = useState(2);
  
  // Initial data structure with default 2x2 grid
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
  
  // Create a dynamic grid with default "none" status
  const createGrid = (data, size) => {
    const grid = [];
    for (let y = 0; y < size; y++) {
      const row = [];
      for (let x = 0; x < size; x++) {
        // Default status is "none"
        row.push({ x, y, status: "none" });
      }
      grid.push(row);
    }
    
    // Update grid with positions from payload
    if (data.position && Array.isArray(data.position)) {
      data.position.forEach(pos => {
        if (pos.x >= 0 && pos.x < size && pos.y >= 0 && pos.y < size) {
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
  
  // Handle grid size change
  const handleGridSizeChange = (e) => {
    const newSize = parseInt(e.target.value, 10);
    setGridSize(newSize);
    
    // Reset grid data for new size
    setGridData({
      "normal_cnt": 0,
      "rot_cnt": 0,
      "position": []
    });
  };
  
  // Navigate to full page grid view
  const navigateToFullPageGrid = () => {
    router.push('/fullpagegrid');
  };
  
  const grid = createGrid(gridData, gridSize);
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
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="mb-6 flex justify-between items-start">
        <div>
          <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="gridSize">
            Select Grid Size:
          </label>
          <div className="flex items-center gap-4">
            <select
              id="gridSize"
              value={gridSize}
              onChange={handleGridSizeChange}
              className="block w-40 py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            >
              {[...Array(6)].map((_, i) => (
                <option key={i} value={i + 1}>{`${i + 1}x${i + 1}`}</option>
              ))}
            </select>
            <span className="text-sm text-gray-500">Grid dimensions: {gridSize} × {gridSize}</span>
          </div>
        </div>
        
        <div>
            <button 
            onClick={navigateToFullPageGrid}
            className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
            >
            Go to Full Page Grid
            </button>
            <p className='text-xs text-center text-gray-400 mt-2'>recommend for computer</p>
        </div>
      </div>
      
      <div className="mb-4">
        <div className="flex flex-wrap gap-4">
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
      
      <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 overflow-auto">
        <div className="max-w-2xl mx-auto">
          {grid.map((row, y) => (
            <div key={`row-${y}`} className="flex">
              {row.map((cell, x) => {
                const styles = getStatusStyles(cell.status);
                return (
                  <div 
                    key={`${x}-${y}`} 
                    className={`aspect-square flex items-center justify-center rounded-lg ${styles.bg} border ${styles.border} m-1`}
                    style={{ width: `calc((100% - ${gridSize * 7}px) / ${gridSize})` }}
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
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GridSizeSelector;