import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import Home from '../screens/Home';
import Trailer from '../screens/Trailer';

export type RootStackParamList = {
  Home: undefined;
  Trailer: { id: string };
};

const Stack = createStackNavigator<RootStackParamList>();

const StackNavigation = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={Home}
        options={{ header: () => <></> }}
      />
      <Stack.Screen name="Trailer" component={Trailer} />
    </Stack.Navigator>
  );
};

export default StackNavigation;
