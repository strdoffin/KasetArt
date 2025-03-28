'use client';
import { useEffect, useState } from "react";

export default function DailyAverages() {
    const [latestData, setLatestData] = useState(null);
    const [dailyAverages, setDailyAverages] = useState([]);
    const [error, setError] = useState(null);

    // Determine the correct base URL based on environment
    const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

    useEffect(() => {
        const fetchLatestData = async () => {
            try {
                const res = await fetch(`${BASE_URL}/data`);
                if (!res.ok) {
                    throw new Error('Failed to fetch latest data');
                }
                const data = await res.json();
                setLatestData(data);
            } catch (err) {
                console.error("Error fetching latest data:", err);
                setError('Could not fetch latest sensor data');
            }
        };

        const fetchDailyAverages = async () => {
            try {
                const res = await fetch(`${BASE_URL}/daily-averages`);
                if (!res.ok) {
                    throw new Error('Failed to fetch daily averages');
                }
                const data = await res.json();
                setDailyAverages(data);
            } catch (err) {
                console.error("Error fetching daily averages:", err);
                setError('Could not fetch daily averages');
            }
        };

        // Initial fetch
        fetchLatestData();
        fetchDailyAverages();

        // Set up intervals
        const latestDataInterval = setInterval(fetchLatestData, 5000);
        const dailyAveragesInterval = setInterval(fetchDailyAverages, 60000);

        // Cleanup intervals
        return () => {
            clearInterval(latestDataInterval);
            clearInterval(dailyAveragesInterval);
        };
    }, []);

    if (error) {
        return <div className="text-red-500">{error}</div>;
    }

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Temperature and Humidity Monitoring</h1>
            
            {latestData && (
                <div className="mb-4 p-4 border-2 rounded">
                    <h2 className="text-xl font-semibold">Latest Readings</h2>
                    <p>Temperature: {latestData.temp}°C</p>
                    <p>Humidity: {latestData.humi}%</p>
                </div>
            )}
            <h2 className="text-xl font-semibold mb-2">Daily Averages</h2>
            <table className="w-full border-collapse">
                <thead>
                    <tr className="border-2">
                        <th className="border p-2">Date</th>
                        <th className="border p-2">Avg Temperature</th>
                        <th className="border p-2">Avg Humidity</th>
                    </tr>
                </thead>
                <tbody>
                    {dailyAverages.map((avg) => (
                        <tr key={avg.date} className="hover:bg-gray-50">
                            <td className="border p-2">{avg.date}</td>
                            <td className="border p-2">{avg.avg_temp.toFixed(2)}°C</td>
                            <td className="border p-2">{avg.avg_humi.toFixed(2)}%</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}