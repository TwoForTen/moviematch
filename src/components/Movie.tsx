import React from 'react';
import { View, Text, Image } from 'react-native';
import ReviewStars from './ReviewStars';

interface Props {
  data: any;
}

const Movie: React.FC<Props> = ({ data }) => {
  return (
    <View>
      <Image source={{ uri: data.poster_path }} />
      <View>
        <Text>Title goes here</Text>
        <ReviewStars rating={8} />
        <Text>Kao žanr</Text>
        <Text>Length</Text>
      </View>
    </View>
  );
};

export default Movie;
