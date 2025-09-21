import { View, Text, TouchableOpacity } from "react-native";
import styles from "./styles";

export default function MissionsScreen({ navigation }) {
  return (
    <View style={styles.center}>
      <Text style={{ fontSize: 24, fontWeight: "bold" }}>
        Missions & Quizzes
      </Text>
      <TouchableOpacity
        style={{
          padding: 12,
          backgroundColor: "lightblue",
          marginTop: 20,
          borderRadius: 20,
        }}
        onPress={() => navigation.navigate("Quiz")}
      >
        <Text style={{ fontSize: 15 }}>Take Disaster Preparedness Quiz</Text>
      </TouchableOpacity>
    </View>
  );
}
