import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { Card, createCard, deleteSet, getCardsForSet } from '@/data/api';
import { defaultStyleSheet } from '@/constants/Styles';
import { Ionicons } from '@expo/vector-icons';

const Page = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [cards, setCards] = useState<Card[]>([]);
  const [information, setInformation] = useState({
    question: '',
    answer: '',
  });
  const router = useRouter();

  useEffect(() => {
    if (!id) return;

    const loadCards = async () => {
      const data = await getCardsForSet(id);
      setCards(data);
    };
    loadCards();
  }, [id]);

  const onAddCard = async () => {
    const newCard = await createCard({ set: id, ...information });
    setCards([...cards, newCard]);
    setInformation({
      question: '',
      answer: '',
    });
  };

  const onDeleteSet = async () => {
    deleteSet(id!);
    router.back();
  };

  return (
    <View style={[defaultStyleSheet.container, { marginTop: 20, marginHorizontal: 16 }]}>
      <Stack.Screen
        options={{
          headerRight: () => (
            <TouchableOpacity onPress={onDeleteSet}>
              <Ionicons name="trash-outline" size={24} color="#fff" />
            </TouchableOpacity>
          ),
        }}
      />

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
      <TouchableOpacity style={defaultStyleSheet.button} onPress={onAddCard}>
        <Text style={defaultStyleSheet.buttonText}>Add card</Text>
      </TouchableOpacity>

      <View style={{ marginTop: 20 }}>
        {cards.map((card) => (
          <View key={card.id} style={{ padding: 16, backgroundColor: '#fff', marginBottom: 10 }}>
            <Text style={{ fontWeight: 'bold' }}>{card.question}</Text>
            <Text>{card.answer}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

export default Page;
