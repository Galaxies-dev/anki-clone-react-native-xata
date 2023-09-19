import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card } from '@/data/api';

interface Props {
  card: Card;
  isFront: boolean;
  textHidden?: boolean;
}
const LearnCard = ({ card, isFront, textHidden }: Props) => {
  return (
    <View style={styles.container}>
      {isFront && !textHidden && <Text style={styles.cardNumber}>{card.question}</Text>}
      {!isFront && <Text style={styles.cardNumber}>{card.answer}</Text>}
    </View>
  );
};
export default LearnCard;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    width: 300,
    height: 300,
    justifyContent: 'center',
    borderRadius: 10,
    padding: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },

  cardNumber: {
    fontSize: 18,
    color: '#023047',
    alignSelf: 'center',
    marginTop: 20,
  },
});
