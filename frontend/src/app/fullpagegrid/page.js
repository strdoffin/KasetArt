'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const FullPageGrid = ({ initialData }) => {
  const router = useRouter();
  const [gridSize, setGridSize] = useState(7); // Default to 7x7 since we redirect from 6x6
  
  // Initial empty grid data
  const [gridData, setGridData] = useState(initialData || {
    "normal_cnt": 0, 
    "rot_cnt": 0,
    "position": []
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
  
  // Toggle cell status on click
  const toggleCellStatus = (x, y) => {
    const grid = createGrid(gridData, gridSize);
    const cell = grid[y][x];
    
    // Cycle through statuses: none -> normal -> rot -> none
    let newStatus;
    switch(cell.status) {
      case "none": 
        newStatus = "normal"; 
        break;
      case "normal": 
        newStatus = "rot"; 
        break;
      case "rot": 
      default: 
        newStatus = "none";
    }
    
    // Update positions array
    const newPositions = gridData.position.filter(pos => !(pos.x === x && pos.y === y));
    if (newStatus !== "none") {
      newPositions.push({ x, y, status: newStatus });
    }
    
    // Update grid data
    setGridData({
      ...gridData,
      normal_cnt: newStatus === "normal" ? gridData.normal_cnt + 1 : 
                  cell.status === "normal" ? gridData.normal_cnt - 1 : 
                  gridData.normal_cnt,
      rot_cnt: newStatus === "rot" ? gridData.rot_cnt + 1 : 
               cell.status === "rot" ? gridData.rot_cnt - 1 : 
               gridData.rot_cnt,
      position: newPositions
    });
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
    <div className="bg-white p-6 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Full Page Grid View</h1>
        
        <div className="mb-6 flex justify-between items-center">
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
                {[...Array(20)].map((_, i) => (
                  <option key={i} value={i + 1}>{`${i + 1}x${i + 1}`}</option>
                ))}
              </select>
              <span className="text-sm text-gray-500">Grid dimensions: {gridSize} × {gridSize}</span>
            </div>
          </div>
          
          <button 
            onClick={() => router.push('/')}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition"
          >
            Back to Standard View
          </button>
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
          <div className="w-full">
            {grid.map((row, y) => (
              <div key={`row-${y}`} className="flex">
                {row.map((cell, x) => {
                  const styles = getStatusStyles(cell.status);
                  return (
                    <div 
                      key={`${x}-${y}`} 
                      className={`aspect-square flex items-center justify-center rounded-lg ${styles.bg} border ${styles.border} m-1 cursor-pointer hover:opacity-80`}
                      style={{ width: `calc((100% - ${gridSize * 7}px) / ${gridSize})` }}
                      onClick={() => toggleCellStatus(x, y)}
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
    </div>
  );
};

export default FullPageGrid;