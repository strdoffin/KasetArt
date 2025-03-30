'use client';
import { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import Footer from './../../components/footer';
import GridStatusDisplay from './../../components/gridlive';
export default function Home() {
    const [latestData, setLatestData] = useState(null);
    const [dailyAverages, setDailyAverages] = useState([]);
    const [loading, setLoading] = useState(true);

    const BASE_URL = process.env.NEXT_PUBLIC_API_URL||"http://localhost:3000"

    const fetchLatestData = async () => {
        try {
            const res = await fetch(`${BASE_URL}/data`);
            if (!res.ok) {
                // throw new Error('Failed to fetch latest data');
                setLoading(false);
            }
            const data = await res.json();
            setLatestData(data);
        } catch (err) {
            // console.error("Error fetching latest data:", err);
        } finally {
            setLoading(false);
        }
    };
    
    const fetchDailyAverages = async () => {
        try {
            const response = await fetch(`${BASE_URL}/daily-averages`);
            
            if (!response.ok) {
                // throw new Error(`Failed to fetch daily averages: ${response.status}`);
            }
            
            const data = await response.json();
            setDailyAverages(data);
        } catch (error) {
            // console.error("Error fetching daily averages:", error);
        }
    };
    
    useEffect(() => {
        fetchLatestData();
        fetchDailyAverages();

        const latestDataInterval = setInterval(fetchLatestData, 500);
        const dailyAveragesInterval = setInterval(fetchDailyAverages, 5000);

        return () => {
            clearInterval(latestDataInterval);
            clearInterval(dailyAveragesInterval);
        };
    }, [BASE_URL]);

    return (
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 min-h-screen py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <header className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Environment Monitoring Dashboard</h1>
                    <p className="text-gray-600">Real-time temperature and humidity monitoring system</p>
                </header>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    {loading ? (
                        <div className="bg-white p-6 rounded-lg shadow-md flex items-center justify-center h-48">
                            <div className="text-gray-500">Loading latest readings...</div>
                        </div>
                    ) : latestData ? (
                        <div className="bg-white p-6 rounded-lg shadow-md">
                            <h2 className="text-xl font-semibold text-gray-800 mb-4">Current Readings</h2>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                                    <div className="text-sm text-blue-500 mb-1">Temperature</div>
                                    <div className="flex items-end">
                                        <span className="text-3xl font-bold text-blue-600">{latestData.temp}</span>
                                        <span className="text-xl ml-1 text-blue-500">°C</span>
                                    </div>
                                    <div className="text-xs text-blue-400 mt-2">Updated just now</div>
                                </div>
                                <div className="bg-teal-50 p-4 rounded-lg border border-teal-100">
                                    <div className="text-sm text-teal-500 mb-1">Humidity</div>
                                    <div className="flex items-end">
                                        <span className="text-3xl font-bold text-teal-600">{latestData.humi}</span>
                                        <span className="text-xl ml-1 text-teal-500">%</span>
                                    </div>
                                    <div className="text-xs text-teal-400 mt-2">Updated just now</div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-white p-6 rounded-lg shadow-md flex items-center justify-center h-48">
                            <div className="text-red-500">No data available</div>
                        </div>
                    )}
                    
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">System Status</h2>
                        <div className="space-y-4">
                            <div className="flex items-center">
                                <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                                <span className="text-sm text-gray-700">Sensors online</span>
                            </div>
                            <div className="flex items-center">
                                <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                                <span className="text-sm text-gray-700">Data collection active</span>
                            </div>
                            <div className="flex items-center">
                                <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                                <span className="text-sm text-gray-700">Database connected</span>
                            </div>
                            <div className="flex items-center">
                                <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                                <span className="text-sm text-gray-700">MQTT broker connected</span>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-md mb-8">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-semibold text-gray-800">Historical Data</h2>
                        <div className="text-sm text-gray-500">
                            {dailyAverages.length} days of data available
                        </div>
                    </div>
                    
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead>
                                <tr>
                                    <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                    <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Avg Temperature</th>
                                    <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Avg Humidity</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {dailyAverages.length > 0 ? (
                                    dailyAverages.map((avg) => (
                                        <tr key={avg.date} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{avg.date}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${parseFloat(avg.avg_temp) > 25 ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'}`}>
                                                    {avg.avg_temp.toFixed(2)}°C
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${parseFloat(avg.avg_humi) > 60 ? 'bg-teal-100 text-teal-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                                    {avg.avg_humi.toFixed(2)}%
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="3" className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">No historical data available</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md mb-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <h2 className="text-xl font-semibold text-gray-800 mb-4">Temperature Over Time</h2>
                            <ResponsiveContainer width="100%" height={300}>
                                <LineChart data={dailyAverages}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="date" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Line type="monotone" dataKey="avg_temp" stroke="#8884d8" activeDot={{ r: 8 }} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold text-gray-800 mb-4">Humidity Over Time</h2>
                            <ResponsiveContainer width="100%" height={300}>
                                <LineChart data={dailyAverages}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="date" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Line type="monotone" dataKey="avg_humi" stroke="#82ca9d" activeDot={{ r: 8 }} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
                <GridStatusDisplay initialData={latestData}/>
                <Footer />
            </div>
        </div>
    );
}