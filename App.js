import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { 
  StyleSheet, Text, View, 
  TouchableOpacity, TextInput, ScrollView, Alert, Platform } from 'react-native';
import { Fontisto } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { theme } from './colors';

const STORAGE_KEY = "@toDos"

export default function App() {

  const [working, setWorking] = useState(true);
  const [text, setText] = useState("");
  const [toDos, setToDos] = useState({});
  useEffect(() => {
    loadToDos();
  }, []);
  const travel = () => setWorking(false);
  const work = () => setWorking(true);
  const onChangeText = (payLoad) => setText(payLoad);
  const saveToDos = async (toSave) => {
    const s = JSON.stringify(toSave)
    await AsyncStorage.setItem(STORAGE_KEY, s)
  }
  const loadToDos = async() => {
    const s = await AsyncStorage.getItem(STORAGE_KEY);
    if(s) {setToDos(JSON.parse(s))}
    ;
    
  }
  const addToDo = async () => {
    if(text === ""){
      return;
    }
    const newToDos = {
      ...toDos, 
      [Date.now()] : {text, working }};
    setToDos(newToDos);
    await saveToDos(newToDos);
    setText("");
  };
  const deleteToDo = (key) => {
    if(Platform.OS === "web"){
      const ok = confirm("Do you want to delete this To Do?")
      if(ok){
        const newToDos = {...toDos};
        delete newToDos[key];
        setToDos(newToDos);
        saveToDos(newToDos);
      }
    }else{
      Alert.alert(
        "Delete to do", 
        "Are you sure to delete?", [
        {text: "Cancel"},
        {text: "I'm Sure",
         style: "destructive",
          onPress: async () => {
           const newToDos = {...toDos};
            delete newToDos[key];
            setToDos(newToDos);
            await saveToDos(newToDos);
          },
        },
      ]);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <View style={styles.header}>
        <TouchableOpacity onPress={work}>
            <Text style={{...styles.btnText, color: working ? "white" : theme.grey}}>Work</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={travel}>
            <Text style={{...styles.btnText, color: !working ? "white" : theme.grey}}>Travel</Text>
        </TouchableOpacity>
      </View>
      
      <TextInput 
        onSubmitEditing={addToDo}
        onChangeText={onChangeText}
        returnKeyType="done"
        value = {text}
        placeholder={working ? "Add a To Do List": "Where do you want to go?"} 
        style={styles.input} 
      />
      <ScrollView>
        {
        Object.keys(toDos).map((key) => (
          toDos[key].working === working ? 
          <View style={styles.toDo} key={key}>
            <Text style={styles.toDoText}>{toDos[key].text}</Text>
            <TouchableOpacity onPress={() => deleteToDo(key)}>
                <Fontisto name="trash" size={20} color="grey" />
            </TouchableOpacity>
          </View> : null
        ))
        }
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.bg,
    paddingHorizontal: 20,
  },
  header:{
    justifyContent: "space-between",
    flexDirection:"row",
    marginTop: 100,

  },
  btnText: {
    fontSize: 38,
    color: "white",
    fontWeight: "600",
  },
  input: {
    backgroundColor: "white",
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 20,
    marginVertical: 20,
    fontSize: 15,
  },
  toDo: {
    backgroundColor: theme.grey,
    marginBottom: 10,
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderRadius: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",

  },
  toDoText: {
    color: "white",
    fontSize: 16,
    fontWeight: "500",
  },
});
