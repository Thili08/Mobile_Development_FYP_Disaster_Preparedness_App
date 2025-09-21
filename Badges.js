import React, { useState, useEffect } from "react";
import { View, Text, Button } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import badges from "./badgesData";
import { useFocusEffect } from "@react-navigation/native"; 
import styles from "./styles";

export default function BadgesScreen() {
  const [earned, setEarnedBadges] = useState([]);

  useFocusEffect(
    React.useCallback(() => {
      AsyncStorage.getItem("earnedBadges").then((data) => {
        if (data) {
          setEarnedBadges(JSON.parse(data).map(String));
        } else {
          setEarnedBadges([]);
        }
      });
    }, [])
  );

  return (
    <View style={styles.center}>
      <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 20 }}>
        Earned Badges
      </Text>
      {earned.length === 0 ? (
        <Text style={{ textAlign: "center" }}>No badges earned yet. Complete missions to earn badges!</Text>
      ) : (
        badges
          .filter((badge) => earned.includes(badge.id.toString()))
          .map((badge) => (
            <View key={badge.id} style={styles.badgeContainer}>
              <Text style={styles.badgeIcon}>{badge.icon}</Text>
              <Text style={styles.badgeName}>{badge.name}</Text>
              <Text style={styles.badgeDescription}>{badge.description}</Text>
            </View>
          ))
      )}
      <Button
        title="Reset Badges"
        onPress={async () => {
          await AsyncStorage.removeItem("earnedBadges");
          setEarnedBadges([]);
          console.log("Badges reset");
        }}
      />
    </View>
  );
}
