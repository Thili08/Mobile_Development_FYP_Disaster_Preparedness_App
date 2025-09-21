import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import styles from './styles';
import AsyncStorage from '@react-native-async-storage/async-storage';

const questions = [
  {
    id: "1",
    question: "What should you do first during a flood?",
    options: [
      "Go outside to check the water level",
      "Move to higher ground or an upper floor",
      "Stay in your car",
      "Ignore the flood warnings",
    ],
    answer: 2,
  },
  {
    id: "2",
    question:
      "Which of the following is NOT a recommended item to include in a flood emergency kit?",
    options: [
      "Water",
      "Non-perishable food",
      "Flashlight",
      "Pet food"
    ],
    answer: 4,
  },
];

export default function QuizScreen({ navigation }) {
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [score, setScore] = useState(0);
    const [showScore, setShowScore] = useState(false);

    const awardBadge = async () => {
      try {
        const earned = JSON.parse(await AsyncStorage.getItem("earnedBadges")) || [];
        if (!earned.includes("3")) {
          earned.push("3");
          await AsyncStorage.setItem("earnedBadges", JSON.stringify(earned));
          console.log("Badge 3 awarded!");
        }
      } catch (error) {
        console.error("Error awarding badge:", error);
      }
    };

    const handleAnswerOption = (id) => {
        if (id === questions[currentQuestion].answer) {
          setScore(score + 1);
        }
        if (currentQuestion < questions.length - 1) {
          setCurrentQuestion(currentQuestion + 1);
        } else {
          if(score + (id === questions[currentQuestion].answer ? 1 : 0) === questions.length) {
            awardBadge();
          }
          setShowScore(true);
        }
    };

    return (
      <View style={styles.center}>
        {!showScore ? (
          <>
            <Text style={{ fontSize: 16, marginBottom: 10 }}>
              Question {currentQuestion + 1} of {questions.length}
            </Text>
            <View style={{
              height: 12,
              width: '80%',
              backgroundColor: '#d6d6d6ff',
              borderRadius: 6,
              marginBottom: 16,
              alignSelf: 'center'
            }}>
              <View style={{
                height: '100%',
                width: `${((currentQuestion + 1) / questions.length) * 100}%`,
                backgroundColor: '#4ba759ff',
                borderRadius: 6,
              }} />
            </View>
            <View style={{ marginBottom: 80, alignItems: 'center', marginHorizontal: 20, backgroundColor: '#bae2e5ff', padding: 20, borderRadius: 10 }}>
              <Text  style={{ fontWeight: 'bold', fontSize: 18, color: '#0a2344ff'}} >{questions[currentQuestion].question}</Text>
            </View>
            {questions[currentQuestion].options.map((option, index) => (
              <TouchableOpacity
                key={index}
                style={styles.optionButton}
                onPress={() => handleAnswerOption(index + 1)}
              >
                <Text style={{color: '#bae2e5ff'}}>{option}</Text>
              </TouchableOpacity>
            ))}
          </>
        ) : (
          <>
            <Text>Congratulations, you have completed the quiz!</Text>
            <Text>Your score: {score}</Text>
            <TouchableOpacity
              style={styles.resetButton}
              onPress={() => {
                setCurrentQuestion(0);
                setScore(0);
                setShowScore(false);
              }}
            >
              <Text style={styles.resetButtonText}>Try Again</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.resetButton,
                { backgroundColor: "darkblue", marginTop: 10 },
              ]}
              onPress={() => {
                navigation.goBack();
              }}
            >
              <Text style={{ color: "white" }}>Back to Missions</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    );
}