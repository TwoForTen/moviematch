import React from 'react';
import { WebView } from 'react-native-webview';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../../routes/HomeNavigation';

type TrailerScreenRouteProp = RouteProp<RootStackParamList, 'Trailer'>;

interface Props {
  route: TrailerScreenRouteProp;
}

const Trailer: React.FC<Props> = ({ route }) => {
  return (
    <WebView
      source={{ uri: `https://youtube.com/watch?v=${route.params.id}` }}
    />
  );
};

export default Trailer;
