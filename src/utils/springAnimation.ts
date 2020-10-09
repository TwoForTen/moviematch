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

export default class SpringAnimation {
  clock: Animated.Clock;
    value: Animated.Node<number>;
    velocity: Animated.Node<number>;
    dest: Animated.Node<number>

  constructor(
    clock: Animated.Clock,
    value: Animated.Node<number>,
    velocity: Animated.Node<number>,
    dest: Animated.Node<number>)
    {
    this.clock = clock;
    this.value = value;
    this.velocity = velocity;
    this.dest = dest;
  }

  runSpring(osClamp: number, rdTresh: number, rsTresh: number) {
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
      cond(clockRunning(this.clock), 0, [
        set(state.finished, 0),
        set(state.velocity, this.velocity),
        set(state.position, this.value),
        set(config.toValue, this.dest),
        cond(
          eq(config.toValue, 0),
          [
            set(config.overshootClamping, 0),
            set(config.restSpeedThreshold, 0.001),
            set(config.restDisplacementThreshold, 0.001),
          ],
          [
            set(config.overshootClamping, osClamp),
            set(config.restSpeedThreshold, rdTresh),
            set(config.restDisplacementThreshold, rsTresh),
          ]
        ),
        startClock(this.clock),
      ]),
      spring(this.clock, state, config),
      cond(state.finished, stopClock(this.clock)),
      state.position,
    ];
  }

}


