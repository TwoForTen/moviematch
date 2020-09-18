import React from 'react';
import { View, Text } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

interface Props {
  rating: number;
}

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
            <FontAwesome name="star" size={24} color="gold" />
            {returnEmptyStars(4)}
          </>
        );
      case 1.5:
        return (
          <>
            <FontAwesome name="star" size={24} color="gold" />
            <FontAwesome name="star-half-full" size={24} color="gold" />
            {returnEmptyStars(3)}
          </>
        );
      case 2:
        return (
          <>
            <FontAwesome name="star" size={24} color="gold" />
            <FontAwesome name="star" size={24} color="gold" />
            {returnEmptyStars(3)}
          </>
        );
      case 2.5:
        return (
          <>
            <FontAwesome name="star" size={24} color="gold" />
            <FontAwesome name="star" size={24} color="gold" />
            <FontAwesome name="star-half-full" size={24} color="gold" />
            {returnEmptyStars(2)}
          </>
        );
      case 3:
        return (
          <>
            <FontAwesome name="star" size={24} color="gold" />
            <FontAwesome name="star" size={24} color="gold" />
            <FontAwesome name="star" size={24} color="gold" />
            {returnEmptyStars(2)}
          </>
        );
      case 3.5:
        return (
          <>
            <FontAwesome name="star" size={24} color="gold" />
            <FontAwesome name="star" size={24} color="gold" />
            <FontAwesome name="star" size={24} color="gold" />
            <FontAwesome name="star-half-full" size={24} color="gold" />
            {returnEmptyStars(1)}
          </>
        );
      case 4:
        return (
          <>
            <FontAwesome name="star" size={24} color="gold" />
            <FontAwesome name="star" size={24} color="gold" />
            <FontAwesome name="star" size={24} color="gold" />
            <FontAwesome name="star" size={24} color="gold" />
            {returnEmptyStars(1)}
          </>
        );
      case 4.5:
        return (
          <>
            <FontAwesome name="star" size={24} color="gold" />
            <FontAwesome name="star" size={24} color="gold" />
            <FontAwesome name="star" size={24} color="gold" />
            <FontAwesome name="star" size={24} color="gold" />
            <FontAwesome name="star-half-full" size={24} color="gold" />
          </>
        );
      case 5:
        return (
          <>
            <FontAwesome name="star" size={24} color="gold" />
            <FontAwesome name="star" size={24} color="gold" />
            <FontAwesome name="star" size={24} color="gold" />
            <FontAwesome name="star" size={24} color="gold" />
            <FontAwesome name="star" size={24} color="gold" />
          </>
        );
      default:
        return <>{returnEmptyStars(5)}</>;
    }
  };

  return <View style={{ flexDirection: 'row' }}>{renderedRatings()}</View>;
};

export default ReviewStars;
