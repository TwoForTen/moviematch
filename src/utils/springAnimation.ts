import Animated from 'react-native-reanimated';

const {
  Value,
  set,
  cond,
  clockRunning,
  eq,
  startClock,
  stopClock,
  spring,
} = Animated;

export default function runSpring(
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
          set(config.restSpeedThreshold, 0.001),
          set(config.restDisplacementThreshold, 0.001),
        ],
        [
          set(config.overshootClamping, 1),
          set(config.restSpeedThreshold, 150),
          set(config.restDisplacementThreshold, 150),
        ]
      ),
      startClock(clock),
    ]),
    spring(clock, state, config),
    cond(state.finished, stopClock(clock)),
    state.position,
  ];
}
