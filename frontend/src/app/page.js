'use client';
import { useEffect, useState } from "react";

export default function DailyAverages() {
    const [latestData, setLatestData] = useState(null);
    const [dailyAverages, setDailyAverages] = useState([]);

    useEffect(() => {
        // Fetch latest data
        const fetchLatestData = async () => {
            try {
                const res = await fetch("http://localhost:3000/data");
                const data = await res.json();
                setLatestData(data);
            } catch (err) {
                console.error("Error fetching latest data:", err);
            }
        };

        // Fetch daily averages
        const fetchDailyAverages = async () => {
            try {
                const res = await fetch("http://localhost:3000/daily-averages");
                const data = await res.json();
                setDailyAverages(data);
            } catch (err) {
                console.error("Error fetching daily averages:", err);
            }
        };

        // Initial fetch
        fetchLatestData();
        fetchDailyAverages();

        // Set up polling
        const latestDataInterval = setInterval(fetchLatestData, 5000);
        const dailyAveragesInterval = setInterval(fetchDailyAverages, 60000);

        // Cleanup intervals
        return () => {
            clearInterval(latestDataInterval);
            clearInterval(dailyAveragesInterval);
        };
    }, []);

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