import * as Location from 'expo-location';
import { getDistanceFromLatLon, } from './helperFunctions';

// Fetch global alerts from EONET API
export async function fetchAlerts(latitude, longitude) {
    try {
        const response = await fetch("https://eonet.gsfc.nasa.gov/api/v2.1/events?status=open&days=30");
        const data = await response.json();

        if (!data.events) return [];

        const alerts = data.events.map(event => {
            const geometry = event.geometries && event.geometries[0];
            const coords = geometry ? geometry.coordinates : null;

            let distance = null;
            if(coords && coords.length >= 2) {
                distance = getDistanceFromLatLon(latitude, longitude, coords[1], coords[0]);
            }

            return {
                id: event.id,
                title: event.title,
                category: event.categories && event.categories[0] ? event.categories[0].title : "Unknown",
                date: geometry ? geometry.date : "Unknown",
                distance: distance !== null ? distance.toFixed(2) : "Unknown",
                link: event.sources && event.sources[0] ? event.sources[0].url : null
            }
        })

        return alerts.filter(alert => alert.distance !== null && alert.distance <= 3000); // Filter alerts within 3000 km
    } catch (error) {
        console.error("Error fetching alerts:", error);
        return [];
    }
}

// Fetch Singapore PSI data from government API
export async function fetchSingaporePSI() {
    try {
        const psiResponse = await fetch("https://api-open.data.gov.sg/v2/real-time/api/psi");
        const psiData = await psiResponse.json();
        const psi = psiData.data.items[0].readings.psi_twenty_four_hourly;
        return psi;
    } catch (error) {
        console.error("Error fetching Singapore PSI data:", error);
        return null;
    }
}

// Fetch Singapore Rainfall data from government API
export async function fetchSingaporeRainfall() {
    try {
        const response = await fetch("https://api-open.data.gov.sg/v2/real-time/api/rainfall");
        const data = await response.json();
        const latestReadings = data.data.readings[0].data;
        const stations = data.data.stations;
        return { latestReadings, stations };
    } catch (error) {
        console.error("Error fetching Singapore Rainfall data:", error);
        return { latestReadings: [], stations: [] };
    }
}