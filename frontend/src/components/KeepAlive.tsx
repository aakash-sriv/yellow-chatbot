import { useEffect } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const KeepAlive = () => {
    useEffect(() => {
        // Ping the server every 4 minutes (240000 ms) to keep it alive
        // Render free tier spins down after ~15 mins of inactivity
        const pingInterval = setInterval(async () => {
            try {
                await axios.get(`${API_URL.replace('/api', '')}/health`);
                console.log('Keep-alive ping sent');
            } catch (error) {
                // Silent fail is fine, we just want to wake it up
                console.log('Keep-alive ping failed', error);
            }
        }, 4 * 60 * 1000); // 4 minutes

        return () => clearInterval(pingInterval);
    }, []);

    return null; // This component doesn't render anything
};
