import { StyleSheet, Text, View, ScrollView, Linking} from 'react-native';
import React, { useEffect, useState } from 'react';
import resourceData from './assets/disasterTips.json';
import { getDistanceFromLatLon } from './helperFunctions';
import * as Location from 'expo-location';
import styles from './styles';

function sortByPostalSimilarity(shelters, userPostal) {
  if (!userPostal) return shelters;

  const userPrefix = userPostal.slice(0, 3); // Try 3 digits for more granularity
  return shelters.slice().sort((a, b) => {
    const aPrefix = a.POSTALCODE?.slice(0, 3);
    const bPrefix = b.POSTALCODE?.slice(0, 3);

    if (aPrefix === userPrefix && bPrefix !== userPrefix) return -1;
    if (aPrefix !== userPrefix && bPrefix === userPrefix) return 1;

    // If both match or both don't, sort by numeric proximity
    const aDiff = Math.abs(Number(a.POSTALCODE) - Number(userPostal));
    const bDiff = Math.abs(Number(b.POSTALCODE) - Number(userPostal));
    return aDiff - bDiff;
  });
}

async function fetchShelters() {
  try {
    const response = await fetch("https://data.gov.sg/api/action/datastore_search?resource_id=d_291795a678b8cf82f108780a6235ce18");
    const data = await response.json();
    return data.result.records;
  } catch (error) {
    console.error("Error fetching shelters:", error);
    return [];
  }
}

function ResourceHub() {

  const [shelters, setShelters] = useState([]);
  const [userPostal, setUserPostal] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status === 'granted') {
          let location = await Location.getCurrentPositionAsync({});
          let [reverse] = await Location.reverseGeocodeAsync(location.coords);
          setUserPostal(reverse.postalCode);
        }
      } catch (e) {
        console.log("Could not get user postal code:", e);
      }

      const data = await fetchShelters();
      const sorted = sortByPostalSimilarity(data, userPostal);
      console.log("User postal code:", userPostal);
      setShelters(sorted);
    })();
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.resourceContainer}>
      {resourceData.map((item, index) => (
        <View key={index} style={styles.resourceItem}>
          <Text style={styles.resourceTitle}>{item.title}</Text>
          <Text style={styles.resourceDesc}>{item.description}</Text>
          {item.link ? (
            <Text style={styles.resourceLink} onPress={() => Linking.openURL(item.link)}>{item.link}</Text>
          ) : null}
        </View>
      ))}
      <Text style={{ fontSize: 20, fontWeight: 'bold', marginTop: 24, marginBottom: 8 }}>
        Public Shelters (Singapore Civil Defence)
      </Text>
      <Text style={{ color: '#888', marginBottom: 8 }}>
        {userPostal ? `Showing shelters near postal code: ${userPostal}` : ''}
      </Text>
      {shelters.length === 0 ? (
        <Text style={{ color: '#888' }}>Loading shelters...</Text>
      ) : (
        shelters.map((shelter, idx) => (
          <View key={idx} style={{ marginBottom: 14, backgroundColor: '#e3f2fd', borderRadius: 10, padding: 12 }}>
            <Text style={{ fontWeight: 'bold', fontSize: 16 }}>{shelter.NAME}</Text>
            <Text style={{ color: '#555' }}>{shelter.ADDRESS}</Text>
            <Text style={{ color: '#888' }}>Postal Code: {shelter.POSTALCODE}</Text>
            <Text style={{ color: '#888' }}>{shelter.DESCRIPTION}</Text>
            <Text
              style={{ color: '#1976d2', marginTop: 4 }}
              onPress={() =>
                Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(shelter.ADDRESS + ' ' + shelter.POSTALCODE)}`)
              }
            >
              View on Google Maps
            </Text>
          </View>
        ))
      )}
    </ScrollView>
  );
}

export default ResourceHub;