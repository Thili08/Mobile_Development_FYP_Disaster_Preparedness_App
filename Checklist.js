import styles from "./styles";
import { View, Text, FlatList, TouchableOpacity, } from 'react-native';
import React, { useState, useEffect } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';

function Checklist({title, items, storageKey}) {
  const [checkedItems, setCheckedItems] = useState([]);
  
  // This is to load saved progress in the checklist
  useEffect(() => {
    AsyncStorage.getItem(storageKey).then(data => {
      if (data) {
        setCheckedItems(JSON.parse(data));
      }
    });
  }, []);

  // This is to save progress in the checklist
  useEffect(() => {
    AsyncStorage.setItem(storageKey, JSON.stringify(checkedItems));
  }, [checkedItems]);

  // This function is to check or uncheck an item in the checklist
  const checkItem = (id) => {
    if (checkedItems.includes(id)) {
      setCheckedItems(checkedItems.filter(item => item !== id));
    } else {
      setCheckedItems([...checkedItems, id]);
    }
  };

  // This function is to reset the checklist
  const resetList = () => {
    setCheckedItems([]);
    AsyncStorage.removeItem(storageKey);
  };

  const progressBar = checkedItems.length / items.length;

  return (
    <View style={[styles.center, {padding: 20}]}>
      <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 10 }}>{title}</Text>
      <View style={{marginVertical: 16, alignItems: 'center', width: '100%'}} >
        <Text style={{marginBottom: 5, fontWeight: 'bold', fontSize: 15}} >
          {checkedItems.length} of {items.length} items completed ({Math.round(progressBar * 100)}%)
        </Text>
        <View style={{
          height: 20,
          width: '100%',
          maxWidth: 400,
          borderColor: 'black',
          borderWidth: 1,
          borderRadius: 10,
          backgroundColor: '#d2d0d0ff',
          overflow: 'hidden',
        }}>
          <View style={{
            height: '100%',
            width: `${progressBar * 100}%`,
            backgroundColor: progressBar === 1 ? '#4ba759ff' : '#3268e7ff',
            borderRadius: 10,
          }} />
        </View>
      </View>
      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.checklistOption}
            onPress={() => checkItem(item.id)}
          >
            <Text style={styles.itemText}>
              {checkedItems.includes(item.id) ? '✅ ' : '⬜ '} {item.text}
            </Text>
          </TouchableOpacity>
        )}
      />
      <TouchableOpacity style={styles.resetButton} onPress={resetList}>
        <Text style={{ color: 'white' }}>Reset Checklist</Text>
      </TouchableOpacity>
    </View>
  );
}

export default Checklist;