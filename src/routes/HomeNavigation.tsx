import React, { useContext } from 'react';
import { TouchableOpacity } from 'react-native';
import {
  createStackNavigator,
  CardStyleInterpolators,
} from '@react-navigation/stack';
import { AntDesign } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

import theme from '../theme';
import Home from '../screens/Home/Home';
import Trailer from '../screens/Home/Trailer';
import Settings from '../screens/Home/Settings';
import { GenreContext } from '../context/GenreProvider';

export type RootStackParamList = {
  Home: undefined;
  Trailer: { id: string };
  Settings: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

const PickGenre: React.FC = () => {
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      style={{ padding: 20 }}
      onPress={() => navigation.navigate('Settings')}
    >
      <AntDesign name="setting" size={24} color={theme.black} />
    </TouchableOpacity>
  );
};

const HomeNavigation = () => {
  const { genre } = useContext(GenreContext);
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={Home}
        options={{
          headerTitle: genre.name,
          headerRight: () => <PickGenre />,
        }}
      />
      <Stack.Screen name="Trailer" component={Trailer} />
      <Stack.Screen
        name="Settings"
        component={Settings}
        options={{
          headerTitle: 'Genres',
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        }}
      />
    </Stack.Navigator>
  );
};

export default HomeNavigation;
