import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, ActivityIndicator, Switch } from 'react-native';
import * as Location from 'expo-location';
import { fetchAlerts, fetchSingaporePSI, fetchSingaporeRainfall} from './alertsData';
import { getPSIColor } from './helperFunctions';
import styles from './styles';
import simulationRainfallData from './assets/simulationRainfall.json'; // Import the simulated data
import simulationPSIData from './assets/simulationPSI.json'; // Import the simulated PSI data
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowAlert: true,
    shouldShowList: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

async function registerForPushNotificationsAsync() {
  const {status} = await Notifications.getPermissionsAsync();
  if(status !== 'granted') {
    const {status: newStatus} = await Notifications.requestPermissionsAsync();
    status = newStatus;
  }
  if (status !== 'granted') {
    alert('Enable notifications to receive important alerts.');
    return;
  }
  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
    });
  }
}

export default function AlertsScreen() {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [psiLevels, setPSILevels] = useState(null);
  const [rainfall, setRainfall] = useState({ latestReadings: [], stations: [] });
  const [useSimulated, setUseSimulated] = useState(false);

  useEffect(() => {
    registerForPushNotificationsAsync();
  }, []);

  useEffect(() => {
    (async () => {
      setLoading(true);
      let psi = null;
      let rain = { latestReadings: [], stations: [] };
      if (useSimulated) {
        // Use simulated data for PSI levels
        psi = simulationPSIData.data.items[0].readings.psi_twenty_four_hourly
        setPSILevels(psi);

        // Use simulated data for Rainfall
        const stations = simulationRainfallData.data.stations;
        const latestReadings = simulationRainfallData.data.readings[0].data;
        rain = { latestReadings, stations };
        setRainfall(rain);
        setAlerts([]);
        setLoading(false);
      } else {
        // Fetch live data
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status === 'granted') {
          const loc = await Location.getCurrentPositionAsync({});
          const fetchedAlerts = await fetchAlerts(loc.coords.latitude, loc.coords.longitude);
          setAlerts(fetchedAlerts);

          const psi = await fetchSingaporePSI();
          setPSILevels(psi);

          const rain = await fetchSingaporeRainfall();
          setRainfall(rain);
        }
        setLoading(false);
      }
      
      // PSI notification
      if (psi && Object.values(psi).some(val => val >= 100)) {
        console.log("Trigger PSI notification");
        await Notifications.scheduleNotificationAsync({
          content: {
            title: 'High PSI Alert',
            body: 'PSI levels are high! Limit outdoor activities and wear a mask if needed.',
          },
          trigger: null,
        });
      }

      // Rainfall notification
      if (rain.latestReadings && rain.latestReadings.some(r => r.value >= 50)) {
        console.log("Trigger Rainfall notification");
        await Notifications.scheduleNotificationAsync({
          content: {
            title: 'Heavy Rainfall Alert',
            body: 'Heavy rainfall detected in some areas. Stay safe and avoid flood-prone zones.',
          },
          trigger: null,
        });
      }

    })();
  }, [useSimulated]);

  return (
    <ScrollView contentContainerStyle={{backgroundColor: 'white', alignItems: 'center', justifyContent: 'center'}}>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 16 }}>
        <Text style={{ marginRight: 8, fontWeight: 'bold' }}>Use Simulated Data</Text>
        <Switch
          value={useSimulated}
          onValueChange={setUseSimulated}
        />
      </View>
      <Text style={[styles.alertsTitle, {marginTop: 20}]}>Singapore PSI Levels</Text>
      <Text style={{ color: '#888', marginBottom: 8, marginHorizontal: 12, fontStyle: 'italic' }}>(Pollutant Standards Index is an air quality index to indicate the level of pollutants in the air. A lower score is better)</Text>
      {psiLevels && (
        <View style={{ marginVertical: 16, flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' }}>
          {['central', 'east', 'west', 'north', 'south'].map(region => (
            <View
              key={region}
              style={{
                backgroundColor: getPSIColor(psiLevels[region]),
                borderRadius: 8,
                padding: 12,
                marginHorizontal: 8,
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'space-between',
                width: 100,
                marginBottom: 12
              }}
            >
              <Text style={{ fontWeight: 'bold', color: '#222' }}>
                {region.charAt(0).toUpperCase() + region.slice(1)}
              </Text>
              <Text style={{ fontWeight: 'bold', fontSize: 18, color: '#222' }}>
                {psiLevels[region]}
              </Text>
            </View>
          ))}
        </View>
      )}
      <Text style={[styles.alertsTitle, {marginBottom: 20, width: '95%', textAlign: 'center', }]}>Rainfall Across Singapore (Last 24 Hours, mm)</Text>
      {rainfall.latestReadings.length > 0 && (
        <View style={{ width: '95%', marginBottom: 20 }}>
          {rainfall.latestReadings.filter(r => r.value > 0).length === 0 ? (
            <Text style={{ color: '#888', fontStyle: 'italic', marginBottom: 8 }}>
              No rainfall detected across all stations.
            </Text>
          ) : (
            rainfall.latestReadings
              .filter(r => r.value > 0)
              .slice(0, 5)
              .map((reading, idx) => {
                const station = rainfall.stations.find(s => s.id === reading.stationId);
                return (
                  <View key={reading.stationId} style={{ backgroundColor: '#e3f2fd', borderRadius: 8, padding: 10, marginBottom: 6 }}>
                    <Text style={{ fontWeight: 'bold' }}>{station ? station.name : reading.stationId}</Text>
                    <Text>Rainfall: {reading.value} mm</Text>
                  </View>
                );
              })
          )}
          {rainfall.latestReadings.filter(r => r.value > 0).length > 5 && (
            <Text style={{ color: '#888', fontSize: 12, marginTop: 4 }}>
              Showing 5 of {rainfall.latestReadings.filter(r => r.value > 0).length} stations
            </Text>
          )}
        </View>
      )}
      <Text style={[styles.alertsTitle, {marginBottom: 10}]}>Global Alerts</Text>
      <Text style={{ color: '#888', marginBottom: 8, marginHorizontal: 12, fontStyle: 'italic' }}>(Showing alerts within 3000 km of your location in the last 30 days)</Text>
      {loading ? (
        <ActivityIndicator size="large" color="blue" style={{ marginTop: 20 }} />
      ) : alerts.length === 0 ? (
        <Text style={[styles.subtitle, {marginBottom: 20}]}>No current alerts for your location.</Text>
      ) : (
        alerts.map(alert => (
          <View key={alert.id} style={{ marginBottom: 18, padding: 12, backgroundColor: '#ffe6e6', borderRadius: 10, width: '90%' }}>
            <Text style={{ fontWeight: 'bold', fontSize: 16 }}>{alert.title}</Text>
            <Text style={{ color: '#555' }}>Disaster Type: {alert.category}</Text>
            <Text style={{ color: '#555' }}>Date: {new Date(alert.date).toLocaleDateString()}</Text>
            <Text style={{ color: '#555' }}>Distance: {alert.distance} km away</Text>
          </View>
        ))
      )}
    </ScrollView>
  );
}