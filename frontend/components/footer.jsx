import { useState, useEffect } from 'react';

export default function Footer() {
    const [time, setTime] = useState('');

    useEffect(() => {
        const updateTime = () => setTime(new Date().toLocaleTimeString());
        updateTime();
        const interval = setInterval(updateTime, 1000); // Update every second

        return () => clearInterval(interval);
    }, []);

    return (
        <footer className="text-center text-gray-500 text-sm mt-8">
            <p>© {new Date().getFullYear()} Environment Monitoring System</p>
            <p className="mt-1">Last updated: {time}</p>
        </footer>
    );
}