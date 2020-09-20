import React from 'react';
import { TouchableOpacity } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { AntDesign } from '@expo/vector-icons';

import Home from '../screens/Home/Home';
import Trailer from '../screens/Home/Trailer';

export type RootStackParamList = {
  Home: undefined;
  Trailer: { id: string };
};

const Stack = createStackNavigator<RootStackParamList>();

const PickGenre: React.FC = () => {
  return (
    <TouchableOpacity style={{ padding: 20 }}>
      <AntDesign name="setting" size={24} color="black" />
    </TouchableOpacity>
  );
};

const HomeNavigation = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={Home}
        options={{
          headerTitle: 'Browse',
          headerRight: () => <PickGenre />,
        }}
      />
      <Stack.Screen name="Trailer" component={Trailer} />
    </Stack.Navigator>
  );
};

export default HomeNavigation;
