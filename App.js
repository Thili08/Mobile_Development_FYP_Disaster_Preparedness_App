import { StatusBar } from 'expo-status-bar';
import { Text, View, TouchableOpacity, Image, ScrollView, Platform } from 'react-native';
import React, { useState, useEffect } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import ResourceHub from './ResourceHub';
import FloodChecklist from './FloodChecklist';
import HazeChecklist from './HazeChecklist';
import MissionsScreen from './Missions';
import QuizScreen from './Quiz';
import BadgesScreen from './Badges';
import AsyncStorage from '@react-native-async-storage/async-storage';
import badges from './badgesData';
import { fetchAlerts, fetchSingaporePSI} from './alertsData';
import { getPSIColor } from './helperFunctions';
import AlertsScreen from './AlertsScreen';
import ChecklistScreen from './ChecklistScreen';
import * as Notifications from 'expo-notifications';
import styles from './styles';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function HomeScreen({ navigation }) {
  
  const [location, setLocation] = useState(null);
  const [locationPermission, setLocationPermission] = useState(null);
  const [weather, setWeather] = useState(null);
  const [earnedBadges, setEarnedBadges] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [psiLevels, setPSILevels] = useState(null);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        setLocationPermission(true);
        const loc = await Location.getCurrentPositionAsync({});
        setLocation(loc);

        // Fetch weather data using the location 
        fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${loc.coords.latitude}&lon=${loc.coords.longitude}&appid=fcd1a368516e6af2a95b2e79d9e69e6a&units=metric`)
        .then(response => response.json())
        .then(json => {
          setWeather(json);
          console.log("Weather data fetched");
        })
        .catch(error => {
          console.error("Error fetching weather data:", error);
        });

        // Fetch alerts based on user location
        const fetchedAlerts = await fetchAlerts(loc.coords.latitude, loc.coords.longitude);
        setAlerts(fetchedAlerts);
        console.log("Alerts fetched:", fetchedAlerts);

        // Fetch PSI levels for Singapore
        if(loc) {
          const psi = await fetchSingaporePSI();
          setPSILevels(psi);
          console.log("PSI levels fetched:", psi);
        }

      } else {
        setLocationPermission(false);
      }
    })();
  }, []);

  // Refresh earned badges when screen is focused
  useFocusEffect(
    React.useCallback(() => {
      AsyncStorage.getItem('earnedBadges')
        .then(data => {
          if (data) {
            setEarnedBadges(JSON.parse(data).map(String));
          } else {
            setEarnedBadges([]);
          }
        });
    }, [])
  );

  if (locationPermission === false) {
    return <PermissionDeniedScreen />;
  }

  return (
    <ScrollView contentContainerStyle={styles.homeContainer}>
      {/* 1. Current Temp + Weather Condition */}
      <View style={styles.blob}>
        {weather && weather.weather && weather.weather[0] && weather.name ? (
          <>
            <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{weather.name}</Text>
            <Image
              source={{
                uri: `https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`
              }}
              style={{ width: 50, height: 50 }}
            />
            <Text style={styles.blobSubtitle}>
              {Math.round(weather.main.temp)}°C, {weather.weather[0].main}
            </Text>
            <Text style={styles.blobSubtitle}>
              {weather.weather[0].description.charAt(0).toUpperCase() + weather.weather[0].description.slice(1)}
            </Text>
          </>
        ) : weather && weather.message ? (
          <Text style={styles.blobSubtitle}>{weather.message}</Text>
        ) : (
          <Text style={styles.blobSubtitle}>Loading...</Text>
        )}
      </View>

      {/* 2. Recent Alerts */}
      <TouchableOpacity style={styles.blob} onPress={() => navigation.navigate('Alerts')}>
        <Text style={styles.blobTitle}>Recent Alerts</Text>
        {alerts.length === 0 ? (
          <Text style={styles.blobSubtitle}>No new alerts</Text>
        ) : (
          alerts.slice(0, 3).map((alert) => (
            <View 
              key={alert.id}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                margin: 7,
                padding: 10,
                backgroundColor: 'white',
                borderRadius: 10,
              }}
            >
              <View style={{ flex: 1 }} >
                <Text style={{ fontWeight: 'bold' }} ellipsizeMode="tail">
                  {alert.title}  ({alert.category})
                </Text>
              </View>
            </View>
          ))
        )}
        <Text style={{ fontWeight: 'bold', marginTop: 10 }}>Singapore PSI Levels</Text>
        {psiLevels ? (
          <View style={{ marginVertical: 16, flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' }}>
            {['central', 'east', 'west', 'north', 'south'].map(region => (
              <View
                key={region}
                style={{
                  backgroundColor: getPSIColor(psiLevels[region]),
                  borderRadius: 12,
                  paddingVertical: 12,
                  paddingHorizontal: 16,
                  margin: 4,
                  minWidth: 90,
                  alignItems: 'center',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  shadowColor: '#000',
                }}
              >
                <Text style={{ fontWeight: 'bold', color: '#222', fontSize: 15 }}>
                  {region.charAt(0).toUpperCase() + region.slice(1)}
                </Text>
                <Text style={{ fontWeight: 'bold', fontSize: 20, color: '#222' }}>
                  {psiLevels[region]}
                </Text>
              </View>
            ))}
          </View>
        ) : (
          <Text style={styles.blobSubtitle}>Loading PSI levels...</Text>
        )}
        <Text style={{color: 'blue', marginTop: 5}}>See all alerts</Text>
      </TouchableOpacity>

      {/* 3. Badges */}
      <TouchableOpacity style={styles.blob} onPress={() => navigation.navigate('Badges')}>
        <Text style={styles.blobTitle}>Badges</Text>
        {earnedBadges.length === 0 ? (
          <Text style={styles.blobSubtitle}>No badges earned yet!</Text>
        ) : (
          <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
            {badges
              .filter((badge) => earnedBadges.includes(badge.id.toString()))
              .map((badge) => (
                <Text key={badge.id} style={{ fontSize: 24, marginRight: 8 }}>
                  {badge.icon}
                </Text>
              ))}
          </View>
        )}
      </TouchableOpacity>

      {/* 4. Missions/Quizzes */}
      <TouchableOpacity style={styles.blob} onPress={() => navigation.navigate('Missions')}>
        <Text style={styles.blobTitle}>Missions</Text>
        <Text style={styles.blobSubtitle}>Try to complete a mission to earn badges!</Text>
      </TouchableOpacity>

      {/* Bottom row: Resource Hub (left), Checklist (right) */}
      <View style={styles.bottomRow}>
        <TouchableOpacity style={[styles.blob, styles.halfBlob, {alignItems: 'center', justifyContent: 'center'}]} onPress={() => navigation.navigate('Resources')}>
          <Text style={styles.blobTitle}>Resource Hub</Text>
          <Ionicons name="file-tray-full-sharp" size={32} color="#257fd8ff" />
        </TouchableOpacity>
        <TouchableOpacity style={[styles.blob, styles.halfBlob, {alignItems: 'center', justifyContent: 'center'}]} onPress={() => navigation.navigate('Checklists')}>
          <Text style={styles.blobTitle}>Checklist</Text>
          <Ionicons name="clipboard-outline" size={32} color="#257fd8ff" />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

function PermissionDeniedScreen() {
  return (
    <View style={styles.center}>
      <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>
        Location Permission Denied
      </Text>
      <Text style={{ textAlign: 'center', marginBottom: 20 }}>
        This app requires location access to provide weather updates and local alerts. Please enable location permissions in your device settings.
      </Text>
      <Ionicons name="alert" size={100} color="gray" />
    </View>
  );
}

function MissionsStack() {
  return(
    <Stack.Navigator>
      <Stack.Screen name="Missions main" component={MissionsScreen} options={{headerShown: false}} />
      <Stack.Screen name="Quiz" component={QuizScreen} options={{title: 'Disaster Preparedness Quiz'}} />
    </Stack.Navigator>
  )
}

function ChecklistStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Checklist Main" component={ChecklistScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Flood" component={FloodChecklist} />
      <Stack.Screen name="Haze" component={HazeChecklist} />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color, size }) => {
            let iconName;
            if (route.name === 'Home') {
              iconName = 'home';
            } else if (route.name === 'Checklists') {
              iconName = 'list';
            } else if (route.name === 'Resources') {
              iconName = 'book';
            } else if (route.name === 'Badges') {
              iconName = 'ribbon';
            } else if (route.name === 'Alerts') {
              iconName = 'alert-circle';
            } else if (route.name === 'Missions') {
              iconName = 'golf-outline';
            }
            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: 'blue',
          tabBarInactiveTintColor: 'gray',
        })}
      >
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Checklists" component={ChecklistStack} options={{ headerShown: false }}/>
        <Tab.Screen name="Resources" component={ResourceHub} />
        <Tab.Screen name="Badges" component={BadgesScreen} />
        <Tab.Screen name="Missions" component={MissionsStack} options={{ headerShown: false }} />
        <Tab.Screen name="Alerts" component={AlertsScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}