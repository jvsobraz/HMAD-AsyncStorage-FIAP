import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList
} from 'react-native';
import { useState, useEffect } from 'react';
import axios from 'axios';

import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import AsyncStorage from '@react-native-async-storage/async-storage';

export default function App() {
  const [phrase, setPhrase] = useState({});
  const [phrases, setPhrases] = useState(['']);

  const Tabs = createBottomTabNavigator();

  function Home() {
    return(
      <View style={styles.container}>    
        <Text style={styles.phrase}>{phrase?.slip?.advice}</Text>

        <TouchableOpacity
          style={styles.button}
          onPress={() => savePhrases(phrase?.slip?.advice)}>
          <Text style={styles.textButton}>Salvar frase</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={getPhrase}>
          <Text style={styles.textButton}>Trocar frase</Text>
        </TouchableOpacity>
      </View>
    )
  }

  function ListPhrases() {
    return(
      <FlatList 
        data={phrases}
        renderItem={({ item }) => {
          return(
            <Text>{item}</Text>
          )
        }}
      />
    );
  }

  const savePhrases = async (phrase) => {
    const newArrayPhrases = [...phrases, phrase];
    AsyncStorage.setItem('phrases', JSON.stringify(newArrayPhrases))
    setPhrases(newArrayPhrases)
  }

  const getPhrases = async () => {
    const item = await AsyncStorage.getItem('phrases')
    const response = JSON.parse(item);
    setPhrases(response);
  }

  function TabsNavigation() {
    return(
      <Tabs.Navigator>
        <Tabs.Screen name='Home' component={Home} />
        <Tabs.Screen name='List' component={ListPhrases} />
      </Tabs.Navigator>
    )
  }

  const getPhrase = async () => {
    const response = await axios.get('https://api.adviceslip.com/advice');
    setPhrase(response.data);
  };

  useEffect(() => {
    getPhrase();
    getPhrases();
  }, [phrases]);

  return (
    <NavigationContainer>
      <TabsNavigation />
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  phrase: {
    fontWeight: 'bold',
    fontSize: 22,
    color: 'purple',
    textAlign: 'center',
  },
  button: {
    backgroundColor: 'gray',
    borderRadius: 10,
    padding: 10,
    borderWidth: 1,
    marginTop: 40
  },
  textButton: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});
