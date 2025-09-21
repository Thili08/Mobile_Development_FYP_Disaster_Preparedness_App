import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import styles from './styles';

function ChecklistScreen({ navigation }) {
  return (
    <View style={[styles.center, { padding: 24 }]}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 8 }}>Checklists</Text>
      <Text style={{ color: '#555', marginBottom: 24, textAlign: 'center' }}>
        Select a checklist to help you prepare for different types of disasters.
      </Text>
      <TouchableOpacity
        onPress={() => navigation.navigate('Flood')}
        style={[styles.checklistButton, {backgroundColor: '#e0f2ffff',}]}
      >
        <Ionicons name="water" size={32} color="#257fd8ff" style={{ marginRight: 16 }} />
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#257fd8ff' }}>Flood Checklist</Text>
          <Text style={{ color: '#257fd8ff', opacity: 0.7 }}>Be ready for heavy rain and floods</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => navigation.navigate('Haze')}
        style={[styles.checklistButton, {backgroundColor: '#f3e5f5ff',}]}
      >
        <Ionicons name="cloudy" size={32} color="#8a1fa7ff" style={{ marginRight: 16 }} />
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#8a1fa7ff' }}>Haze Checklist</Text>
          <Text style={{ color: '#8a1fa7ff', opacity: 0.7, }}>Protect yourself from haze and poor air</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}

export default ChecklistScreen;