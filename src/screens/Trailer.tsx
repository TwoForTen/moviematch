import React from 'react';
import { WebView } from 'react-native-webview';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../routes/StackNavigation';

type TrailerScreenRouteProp = RouteProp<RootStackParamList, 'Trailer'>;

interface Props {
  route: TrailerScreenRouteProp;
}

const Trailer = ({ route }: Props) => {
  return (
    <WebView
      source={{ uri: `https://youtube.com/watch?v=${route.params.id}` }}
    />
  );
};

export default Trailer;
