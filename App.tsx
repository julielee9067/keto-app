import Camera from './components/Camera';
import React from 'react';
import Album from './components/Album';
import LogIn from './components/LogIn';
import HomeScreen from './components/HomeScreen';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import SelectedPhoto from './components/SelectedPhoto';

export default function App() {
  const Stack = createStackNavigator();

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="HomeScreen" component={HomeScreen} />
        <Stack.Screen name="Camera" component={Camera} />
        <Stack.Screen name="Album" component={Album} />
        <Stack.Screen name="LogIn" component={LogIn} />
        <Stack.Screen name="SelectedPhoto" component={SelectedPhoto} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
