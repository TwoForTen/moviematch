import React, { useContext, useRef, useCallback } from 'react';
import { Dimensions, StyleSheet } from 'react-native';
import { PanGestureHandler, State } from 'react-native-gesture-handler';
import Animated from 'react-native-reanimated';
import { debounce } from 'lodash';

import { UserContext } from '../../context/UserProvider';
import { SocketContext } from '../../context/SocketProvider';

interface Props {
  movie: any;
  index: number;
  active: number;
  setActive: React.Dispatch<React.SetStateAction<number>>;
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
  startClock,
  Clock,
  spring,
  stopClock,
  lessThan,
  neq,
} = Animated;

const { width } = Dimensions.get('screen');

const IMAGE_URL: string = 'https://image.tmdb.org/t/p/w500';
const CARD_WIDTH: number = width * 0.74;
const CARD_HEIGHT: number = CARD_WIDTH * 1.7;

function runSpring(
  clock: Animated.Clock,
  value: Animated.Node<number>,
  velocity: Animated.Node<number>,
  dest: Animated.Node<number>
) {
  const state = {
    finished: new Value(0),
    velocity: new Value(0),
    position: new Value(0),
    time: new Value(0),
  };

  const config = {
    damping: 7,
    mass: 1,
    stiffness: 121.6,
    overshootClamping: new Value(0),
    restSpeedThreshold: new Value(0.001),
    restDisplacementThreshold: new Value(0.001),
    toValue: new Value(0),
  };

  return [
    cond(clockRunning(clock), 0, [
      set(state.finished, 0),
      set(state.velocity, velocity),
      set(state.position, value),
      set(config.toValue, dest),
      cond(
        eq(config.toValue, 0),
        [
          set(config.overshootClamping, 0),
          set(config.restSpeedThreshold, 0.01),
          set(config.restDisplacementThreshold, 0.01),
        ],
        [
          set(config.overshootClamping, 1),
          set(config.restSpeedThreshold, 200),
          set(config.restDisplacementThreshold, 200),
        ]
      ),
      startClock(clock),
    ]),
    spring(clock, state, config),
    cond(state.finished, stopClock(clock)),
    state.position,
  ];
}

const MovieCards: React.FC<Props> = ({ movie, index, active, setActive }) => {
  const translateX = useRef(new Value(0)).current;
  const translateY = useRef(new Value(0)).current;
  const velocityX = useRef(new Value(0)).current;
  const gestureState = useRef(new Value(State.UNDETERMINED)).current;

  const { user } = useContext(UserContext);
  const { socket } = useContext(SocketContext);

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
        setActive((prev) => prev + 1);
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
        set(translateX, runSpring(clockX, translateX, velocityX, snapPoint)),
        cond(
          and(eq(clockRunning(clockX), 0), neq(translateX, 0)),
          call([translateX], onSwiped)
        ),
        translateX,
      ]),
      cond(eq(gestureState, State.END), [
        set(
          translateY,
          runSpring(clockY, translateY, new Value(0), new Value(0))
        ),
        translateY,
      ]),
    ]);
  }, [translateX]);
  return (
    <PanGestureHandler
      //   enabled={active === index}
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
          style={styles.image}
          source={{ uri: IMAGE_URL + movie.poster_path }}
        />
      </Animated.View>
    </PanGestureHandler>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: 10,
  },
});

export default MovieCards;
