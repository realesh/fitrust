declare module 'react-native-countdown-component' {
  import {StyleProp, ViewStyle} from 'react-native';
  import {Component} from 'react';

  type TimeType = 'D' | 'H' | 'M' | 'S';
  type TimeLabels = {
    d?: string;
    h?: string;
    m?: string;
    s?: string;
  };

  type CountdownProps = {
    style?: StyleProp<ViewStyle>;
    digitStyle?: StyleProp<ViewStyle>;
    digitTxtStyle?: StyleProp<TextStyle>;
    timeLabelStyle?: StyleProp<TextStyle>;
    separatorStyle?: StyleProp<TextStyle>;
    size?: number;
    until: number;
    onFinish: () => void | null;
    onChange?: () => void | null;
    timeToShow: Array<TimeType>;
    timeLabels?: TimeLabels;
    showSeparator?: boolean;
    running?: boolean;
  };

  export default class CountDown extends Component<CountdownProps> {}
}
