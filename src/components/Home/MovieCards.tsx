import React, { useContext, useRef, useCallback } from 'react';
import { Dimensions, StyleSheet } from 'react-native';
import { PanGestureHandler, State } from 'react-native-gesture-handler';
import Animated from 'react-native-reanimated';
import { debounce } from 'lodash';

import { UserContext } from '../../context/UserProvider';
import { SocketContext } from '../../context/SocketProvider';
import SpringAnimation from '../../utils/springAnimation';
import theme from '../../theme';

interface Props {
  movie: any;
  index: number;
  setMovies: React.Dispatch<React.SetStateAction<any>>;
}

const {
  Value,
  event,
  useCode,
  block,
  cond,
  eq,
  and,
  greaterThan,
  set,
  call,
  clockRunning,
  Clock,
  stopClock,
  lessThan,
  neq,
} = Animated;

const { width } = Dimensions.get('screen');

const IMAGE_URL: string = 'https://image.tmdb.org/t/p/w500';
const CARD_WIDTH: number = width * 0.72;
const CARD_HEIGHT: number = CARD_WIDTH * 1.7;

const MovieCards: React.FC<Props> = ({ movie, index, setMovies }) => {
  const translateX = useRef(new Value(0)).current;
  const translateY = useRef(new Value(0)).current;
  const velocityX = useRef(new Value(0)).current;
  const gestureState = useRef(new Value(State.UNDETERMINED)).current;

  const { user } = useContext(UserContext);
  const { socket } = useContext(SocketContext);

  const styles = StyleSheet.create({
    container: {
      ...StyleSheet.absoluteFillObject,
      paddingTop: 20,
      alignItems: 'center',
      zIndex: -index,
    },
    image: {
      width: CARD_WIDTH,
      height: CARD_HEIGHT,
      borderRadius: 10,
      backgroundColor: theme.secondary,
    },
  });

  const onGestureHandler = event(
    [
      {
        nativeEvent: {
          translationX: translateX,
          translationY: translateY,
          velocityX: velocityX,
          state: gestureState,
        },
      },
    ],
    { useNativeDriver: true }
  );

  const onSwiped = useCallback(
    debounce(
      ([translateX]) => {
        if (translateX > 0) {
          socket.emit('addToWatchlist', {
            senderId: user._id,
            movie: movie.id,
          });
        }
        setMovies((movies: any) =>
          movies.filter((item: any) => item.id !== movie.id)
        );
      },
      2000,
      { leading: true, trailing: false }
    ),
    []
  );

  useCode(() => {
    const clockX = new Clock();
    const clockY = new Clock();
    const snapPoint = cond(
      and(lessThan(translateX, 0), lessThan(velocityX, -50)),
      -width,
      cond(
        and(greaterThan(translateX, 0), greaterThan(velocityX, 50)),
        width,
        0
      )
    );
    return block([
      cond(eq(gestureState, State.ACTIVE), [
        stopClock(clockX),
        stopClock(clockY),
        translateX,
      ]),
      cond(eq(gestureState, State.END), [
        set(
          translateX,
          new SpringAnimation(
            clockX,
            translateX,
            velocityX,
            snapPoint
          ).runSpring(1, 200, 200)
        ),
        cond(
          and(eq(clockRunning(clockX), 0), neq(translateX, 0)),
          call([translateX], onSwiped)
        ),
        translateX,
      ]),
      cond(eq(gestureState, State.END), [
        set(
          translateY,
          new SpringAnimation(
            clockY,
            translateY,
            new Value(0),
            new Value(0)
          ).runSpring(1, 200, 200)
        ),
        translateY,
      ]),
    ]);
  }, []);
  return (
    <PanGestureHandler
      maxPointers={1}
      onGestureEvent={onGestureHandler}
      onHandlerStateChange={onGestureHandler}
    >
      <Animated.View
        style={[
          styles.container,
          { transform: [{ translateX }, { translateY }] },
        ]}
      >
        <Animated.Image
          fadeDuration={0}
          style={styles.image}
          source={{ uri: IMAGE_URL + movie.poster_path }}
        />
      </Animated.View>
    </PanGestureHandler>
  );
};

export default MovieCards;
