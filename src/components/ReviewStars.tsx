import React from 'react';
import { View, Text } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import theme from '../theme';

interface Props {
  rating: number;
}

const returnFullStars = (amount: number) => {
  const fullStars: JSX.Element[] = [];
  for (let i = 0; i < amount; i++) {
    fullStars.push(<FontAwesome name="star" size={24} color="gold" key={i} />);
  }
  return fullStars;
};

const returnEmptyStars = (amount: number) => {
  const emptyStars: JSX.Element[] = [];
  for (let i = 0; i < amount; i++) {
    emptyStars.push(
      <FontAwesome name="star-o" size={24} color="gold" key={i} />
    );
  }
  return emptyStars;
};

const ReviewStars: React.FC<Props> = ({ rating }) => {
  const review: number = Math.round(rating) / 2;

  const renderedRatings: () => JSX.Element = () => {
    switch (review) {
      case 0:
        return <>{returnEmptyStars(5)}</>;
      case 0.5:
        return (
          <>
            <FontAwesome name="star-half-full" size={24} color="gold" />
            {returnEmptyStars(4)}
          </>
        );
      case 1:
        return (
          <>
            {returnFullStars(1)}
            {returnEmptyStars(4)}
          </>
        );
      case 1.5:
        return (
          <>
            {returnFullStars(1)}
            <FontAwesome name="star-half-full" size={24} color="gold" />
            {returnEmptyStars(3)}
          </>
        );
      case 2:
        return (
          <>
            {returnFullStars(2)}
            {returnEmptyStars(3)}
          </>
        );
      case 2.5:
        return (
          <>
            {returnFullStars(2)}
            <FontAwesome name="star-half-full" size={24} color="gold" />
            {returnEmptyStars(2)}
          </>
        );
      case 3:
        return (
          <>
            {returnFullStars(3)}
            {returnEmptyStars(2)}
          </>
        );
      case 3.5:
        return (
          <>
            {returnFullStars(3)}
            <FontAwesome name="star-half-full" size={24} color="gold" />
            {returnEmptyStars(1)}
          </>
        );
      case 4:
        return (
          <>
            {returnFullStars(4)}
            {returnEmptyStars(1)}
          </>
        );
      case 4.5:
        return (
          <>
            {returnFullStars(4)}
            <FontAwesome name="star-half-full" size={24} color="gold" />
          </>
        );
      case 5:
        return <>{returnFullStars(5)}</>;
      default:
        return (
          <Text style={{ color: theme.secondary, fontStyle: 'italic' }}>
            No rating
          </Text>
        );
    }
  };

  return <View style={{ flexDirection: 'row' }}>{renderedRatings()}</View>;
};

export default ReviewStars;
