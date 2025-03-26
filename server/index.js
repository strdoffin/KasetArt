require('dotenv').config();
const express = require("express");
const mqtt = require("mqtt");
const cors = require("cors");
const { createClient } = require('@supabase/supabase-js');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// Supabase configuration
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const brokerUrl = "wss://mqtt.netpie.io:443/mqtt";
const clientId = "1589f4d7-9026-4799-a4c8-cf5cb6cf69fb";
const username = "3dHteifcwturssZ57Dgj28gKMrhV6YSt";
const password = "zWs6BRy7mzHFhTTxj3Pa2AuNwS8F5kGh";
const topic = "@msg/sayhi";

let latestMessage = null;
let dailyTemps = [];
let dailyHumis = [];

const client = mqtt.connect(brokerUrl, {
    clientId,
    username,
    password,
});

client.on("connect", () => {
    console.log("Connected to MQTT broker");

    client.subscribe(topic, (err) => {
        if (err) {
            console.error("Failed to subscribe:", err);
        } else {
            console.log(`Subscribed to topic: ${topic}`);
        }
    });
});

client.on("message", async (receivedTopic, message) => {
    if (receivedTopic === topic) {
        try {
            latestMessage = JSON.parse(message.toString());
            console.log(`Received message:`, latestMessage);

            // Collect temperature and humidity for daily average calculation
            dailyTemps.push(latestMessage.temp);
            dailyHumis.push(latestMessage.humi);
        } catch (error) {
            console.error("Error parsing message:", error);
        }
    }
});

// Function to calculate and store daily averages
async function calculateAndStoreDailyAverage() {
    if (dailyTemps.length === 0 || dailyHumis.length === 0) return;

    const avgTemp = dailyTemps.reduce((a, b) => a + b, 0) / dailyTemps.length;
    const avgHumi = dailyHumis.reduce((a, b) => a + b, 0) / dailyHumis.length;

    try {
        const { data, error } = await supabase
            .from('daily_avg')
            .upsert({
                date: new Date().toISOString().split('T')[0],
                avg_temp: avgTemp,
                avg_humi: avgHumi
            }, {
                onConflict: 'date'
            });

        if (error) {
            console.error('Error storing daily average:', error);
        } else {
            console.log('Daily average stored successfully');
        }

        // Reset daily collections
        dailyTemps = [];
        dailyHumis = [];
    } catch (err) {
        console.error('Unexpected error:', err);
    }
}

// Run daily average calculation and storage every 24 hours
setInterval(calculateAndStoreDailyAverage, 24 * 60 * 60 * 1000);

// Endpoint to get latest message
app.get("/data", (req, res) => {
    if (latestMessage) {
        res.json(latestMessage);
    } else {
        res.status(404).json({ error: "No data received yet" });
    }
});

// Endpoint to fetch daily averages
app.get("/daily-averages", async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('daily_avg')
            .select('*')
            .order('date', { ascending: false });

        if (error) {
            throw error;
        }

        res.json(data);
    } catch (err) {
        console.error('Error fetching daily averages:', err);
        res.status(500).json({ error: "Failed to fetch daily averages" });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});