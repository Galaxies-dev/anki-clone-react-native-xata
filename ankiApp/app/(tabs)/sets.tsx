import {
  View,
  Text,
  ListRenderItem,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { Set } from '@/data/api';
import { Link } from 'expo-router';
import { getMySets } from '@/data/api';
import { defaultStyleSheet } from '@/constants/Styles';

const Page = () => {
  const [sets, setSets] = useState<{ id: string; set: Set; canEdit: boolean }[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    loadSets();
  }, []);

  // Load user Sets
  const loadSets = async () => {
    const data = await getMySets();
    setSets(data);
  };

  const renderSetRow: ListRenderItem<{ id: string; set: Set; canEdit: boolean }> = ({
    item: { set, canEdit },
  }) => {
    return (
      <View style={styles.setRow}>
        <View style={{ flexDirection: 'row' }}>
          <View style={{ flex: 1 }}>
            <Text style={styles.rowTitle}>{set.title}</Text>
            <View style={{ flexDirection: 'row', gap: 4, marginTop: 10 }}>
              <Link href={`/(learn)/${set.id}?limit=3`} asChild>
                <TouchableOpacity style={defaultStyleSheet.button}>
                  <Text style={defaultStyleSheet.buttonText}>3 cards</Text>
                </TouchableOpacity>
              </Link>
              <Link href={`/(learn)/${set.id}?limit=6`} asChild>
                <TouchableOpacity style={defaultStyleSheet.button}>
                  <Text style={defaultStyleSheet.buttonText}>6 cards</Text>
                </TouchableOpacity>
              </Link>
              <Link href={`/(learn)/${set.id}?limit=10`} asChild>
                <TouchableOpacity style={defaultStyleSheet.button}>
                  <Text style={defaultStyleSheet.buttonText}>10 cards</Text>
                </TouchableOpacity>
              </Link>
              {canEdit && (
                <Link href={`/(modals)/(cards)/${set.id}`} asChild>
                  <TouchableOpacity style={defaultStyleSheet.button}>
                    <Text style={defaultStyleSheet.buttonText}>Edit</Text>
                  </TouchableOpacity>
                </Link>
              )}
            </View>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {!sets.length && (
        <Link href={'/(tabs)/search'} asChild>
          <TouchableOpacity style={{}}>
            <Text style={{ textAlign: 'center', padding: 20, color: '#3f3f3f' }}>
              Add your first set!
            </Text>
          </TouchableOpacity>
        </Link>
      )}

      <FlatList
        data={sets}
        renderItem={renderSetRow}
        keyExtractor={(item) => item.id}
        refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={loadSets} />}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  setRow: {
    margin: 8,
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
  },
  rowTitle: {
    fontSize: 16,
    fontWeight: '500',
  },
});

export default Page;
