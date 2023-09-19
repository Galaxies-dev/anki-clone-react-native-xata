import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Link, useLocalSearchParams } from 'expo-router';
import { Card, getLearnCards, saveLearning } from '@/data/api';
import { defaultStyleSheet } from '@/constants/Styles';
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import LearnCard from '@/components/LearnCard';
import { Ionicons } from '@expo/vector-icons';

const Page = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { limit } = useLocalSearchParams<{ limit: string }>();
  const [cards, setCards] = useState<Card[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showFront, setShowFront] = useState(true);
  const [textHidden, setTextHidden] = useState(false);
  const [correctCards, setCorrectCards] = useState(0);
  const [wrongCards, setWrongCards] = useState(0);
  const [showResult, setShowResult] = useState(false);

  const rotate = useSharedValue(0);
  const frontAnimatedStyles = useAnimatedStyle(() => {
    const rotateValue = interpolate(rotate.value, [0, 1], [0, 180]);
    return {
      transform: [
        {
          rotateY: withTiming(`${rotateValue}deg`, { duration: 600 }),
        },
      ],
    };
  });

  const backAnimatedStyles = useAnimatedStyle(() => {
    const rotateValue = interpolate(rotate.value, [0, 1], [180, 360]);
    return {
      transform: [
        {
          rotateY: withTiming(`${rotateValue}deg`, { duration: 600 }),
        },
      ],
    };
  });

  useEffect(() => {
    const loadCards = async () => {
      const cards = await getLearnCards(id!, limit!);
      setCards(cards);
    };
    loadCards();
  }, []);

  // Rotate the card
  const onShowAnswer = () => {
    rotate.value = 1;
    setShowFront(false);
  };

  // Show next card
  const onNextCard = async (correct: boolean) => {
    if (currentIndex < cards.length - 1) {
      correct ? setCorrectCards(correctCards + 1) : setWrongCards(wrongCards + 1);

      rotate.value = 0;
      setTextHidden(true);
      setTimeout(() => {
        setCurrentIndex(currentIndex + 1);
        setTextHidden(false);
      }, 600);
    } else {
      setShowResult(true);
      // Save the use rprogress
      const correctResult = correctCards + (correct ? 1 : 0);
      const wrongResult = wrongCards + (correct ? 0 : 1);
      saveLearning(id, +limit, correctResult, wrongResult);
      setCorrectCards(correctResult);
      setWrongCards(wrongResult);
    }

    setShowFront(true);
  };

  return (
    <View style={defaultStyleSheet.container}>
      {showResult && (
        <View style={styles.container}>
          <Text style={styles.resultText}>
            {correctCards} correct, {wrongCards} wrong
          </Text>
          <Link href={'/(tabs)/sets'} asChild>
            <TouchableOpacity style={defaultStyleSheet.bottomButton}>
              <Text style={defaultStyleSheet.buttonText}>End session</Text>
            </TouchableOpacity>
          </Link>
        </View>
      )}

      {!showResult && cards.length > 0 && (
        <>
          <Text style={defaultStyleSheet.header}>
            {currentIndex + 1} / {cards.length}
          </Text>
          <View style={styles.container}>
            <Animated.View style={[styles.frontcard, frontAnimatedStyles]}>
              <LearnCard card={cards[currentIndex]} isFront={true} textHidden={textHidden} />
            </Animated.View>
            <Animated.View style={[styles.backCard, backAnimatedStyles]}>
              <LearnCard card={cards[currentIndex]} isFront={false} />
            </Animated.View>

            {showFront && (
              <TouchableOpacity style={defaultStyleSheet.bottomButton} onPress={onShowAnswer}>
                <Text style={defaultStyleSheet.buttonText}>Show answer</Text>
              </TouchableOpacity>
            )}

            {!showFront && (
              <View style={styles.bottomView}>
                <TouchableOpacity style={defaultStyleSheet.button} onPress={() => onNextCard(true)}>
                  <Text style={defaultStyleSheet.buttonText}>Correct</Text>
                  <Ionicons name="checkmark" size={20} color="#fff" />
                </TouchableOpacity>
                <TouchableOpacity
                  style={defaultStyleSheet.button}
                  onPress={() => onNextCard(false)}>
                  <Text style={defaultStyleSheet.buttonText}>Wrong</Text>
                  <Ionicons name="close" size={20} color="#fff" />
                </TouchableOpacity>
              </View>
            )}
          </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    marginTop: 100,
  },
  frontcard: {
    position: 'absolute',
    backfaceVisibility: 'hidden',
  },
  backCard: {
    backfaceVisibility: 'hidden',
  },
  bottomView: {
    position: 'absolute',
    bottom: 40,
    width: 300,
    flex: 1,
  },
  resultText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
});

export default Page;
