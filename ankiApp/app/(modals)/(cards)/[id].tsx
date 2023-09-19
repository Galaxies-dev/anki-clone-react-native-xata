import { View, Text, TextInput } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useLocalSearchParams } from 'expo-router';
import { Card, getCardsForSet } from '@/data/api';
import { defaultStyleSheet } from '../../../constants/Styles';

const Page = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [cards, setCards] = useState<Card[]>([]);
  const [information, setInformation] = useState({
    question: '',
    answer: '',
  });

  useEffect(() => {
    if (!id) return;

    const loadCards = async () => {
      const data = await getCardsForSet(id);
      console.log('🚀 ~ file: [id].tsx:15 ~ loadCards ~ data:', data);
      setCards(data);
    };
    loadCards();
  }, [id]);

  return (
    <View style={[defaultStyleSheet.container, { marginTop: 20, marginHorizontal: 16 }]}>
      <TextInput
        style={defaultStyleSheet.input}
        placeholder="Questions"
        value={information.question}
        onChangeText={(text) => setInformation({ ...information, question: text })}
      />
      <TextInput
        style={defaultStyleSheet.input}
        placeholder="Answer"
        value={information.answer}
        onChangeText={(text) => setInformation({ ...information, answer: text })}
      />
    </View>
  );
};

export default Page;
