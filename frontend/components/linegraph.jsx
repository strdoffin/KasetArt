import { useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

// Helper function to convert "2025-03" to "March 2025"
function formatMonth(monthString) {
    const [year, month] = monthString.split("-");
    const date = new Date(`${year}-${month}-01`);
    return date.toLocaleString('default', { month: 'long', year: 'numeric' }); // E.g., "March 2025"
}

export default function Linegraph({ data: dailyAvg }) {
    const [selectedMonth, setSelectedMonth] = useState(""); // State for selected month

    // Extract available months from the data
    const availableMonths = Array.from(new Set(dailyAvg.map(item => item.date.slice(0, 7))));

    // Filter data based on the selected month
    const filteredData = selectedMonth 
        ? dailyAvg.filter(item => item.date.startsWith(selectedMonth)) 
        : dailyAvg;

    return (
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
            {/* Month Selector */}
            <div className="mb-4 flex justify-between">
                <label className="font-semibold text-gray-800 mr-2">Select Month:</label>
                <select
                    className="p-2 rounded"
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(e.target.value)}
                >
                    <option value="">All</option>
                    {availableMonths.map(month => (
                        <option key={month} value={month}>
                            {formatMonth(month)}
                        </option>
                    ))}
                </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">
                        Temperature Over Time
                    </h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={filteredData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line
                                type="monotone"
                                dataKey="avg_temp"
                                stroke="#8884d8"
                                activeDot={{ r: 8 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
                <div>
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">
                        Humidity Over Time
                    </h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={filteredData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line
                                type="monotone"
                                dataKey="avg_humi"
                                stroke="#82ca9d"
                                activeDot={{ r: 8 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}
