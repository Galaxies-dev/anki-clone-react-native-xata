import { View, Text, TouchableOpacity, Switch, Image } from 'react-native';
import React, { useState } from 'react';
import { defaultStyleSheet } from '@/constants/Styles';
import { TextInput } from 'react-native-gesture-handler';
import * as ImagePicker from 'expo-image-picker';
import { addToFavorites, createSet } from '@/data/api';
import { useRouter } from 'expo-router';

const Page = () => {
  const router = useRouter();
  const [information, setInformation] = useState({
    title: '',
    description: '',
    private: true,
    image: null as any,
  });

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      base64: true,
      aspect: [4, 3],
      quality: 0.5,
    });

    if (!result.canceled) {
      setInformation({ ...information, image: result.assets[0].base64 });
    }
  };

  // Create set, add new favorite and go back
  const onCreateSet = async () => {
    const newSet = await createSet(information);
    await addToFavorites(newSet.id!);
    router.back();
  };

  return (
    <>
      <View style={[defaultStyleSheet.container, { marginTop: 20, marginHorizontal: 16 }]}>
        <TextInput
          style={defaultStyleSheet.input}
          placeholder="Title"
          value={information.title}
          onChangeText={(text) => setInformation({ ...information, title: text })}
        />
        <TextInput
          style={defaultStyleSheet.input}
          placeholder="Description"
          value={information.description}
          onChangeText={(text) => setInformation({ ...information, description: text })}
        />
        <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 8 }}>
          <Switch
            ios_backgroundColor="#3e3e3e"
            onValueChange={(value) => setInformation({ ...information, private: value })}
            value={information.private}
          />
          <Text style={{ marginLeft: 8 }}>Private</Text>
        </View>

        <TouchableOpacity style={defaultStyleSheet.button} onPress={pickImage}>
          <Text style={defaultStyleSheet.buttonText}>Select Image</Text>
        </TouchableOpacity>

        {information.image && (
          <View style={{ marginTop: 16 }}>
            <Image
              source={{ uri: `data:image/jpeg;base64,${information.image}` }}
              style={{ width: '100%', height: 200 }}
            />
          </View>
        )}
      </View>
      <View style={{ alignItems: 'center' }}>
        <TouchableOpacity style={defaultStyleSheet.bottomButton} onPress={onCreateSet}>
          <Text style={defaultStyleSheet.buttonText}>Create Set</Text>
        </TouchableOpacity>
      </View>
    </>
  );
};

export default Page;
