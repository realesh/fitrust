import React from 'react';
import {
  StyleSheet,
  View,
  ViewProps,
  ViewStyle,
  TouchableOpacity,
} from 'react-native';
import {Feather as Icon} from '@expo/vector-icons';
import {LIGHTER_GREY, BLUE, GREY, GREEN} from '../constants/colors';
import {Text} from '../core-ui';

type Props = ViewProps & {
  /**
   * label text to be displayed above progress bar
   */
  label: string;

  currentValue: number;

  maxValue: number;

  unit: string;

  containerStyle?: ViewStyle;

  editable?: boolean;
};

function ProgressBarWithLabel(props: Props) {
  let {
    label,
    currentValue,
    maxValue,
    unit,
    containerStyle,
    editable = false,
    ...otherProps
  } = props;
  let percentage = (currentValue / maxValue) * 100;
  return (
    <View style={containerStyle} {...otherProps}>
      <View style={styles.labelContainer}>
        <Text style={styles.leftLabel}>{label}</Text>
        <Text style={styles.rightLabel}>
          {currentValue}{' '}
          <Text style={{color: GREY}}>
            / {maxValue} {unit}
          </Text>
        </Text>
        {editable && (
          <TouchableOpacity>
            <Icon
              name="plus-square"
              size={20}
              color={GREEN}
              style={{
                marginLeft: 10,
              }}
            />
          </TouchableOpacity>
        )}
      </View>
      <View style={styles.outerProgressBar}>
        <View
          style={[
            styles.innerProgressBar,
            {width: `${percentage >= 100 ? 100 : percentage}%`},
          ]}
        >
          <View style={styles.outerProgressDot}>
            <View style={styles.innerProgressDot} />
          </View>
        </View>
      </View>
    </View>
  );
}

export default ProgressBarWithLabel;

const styles = StyleSheet.create({
  outerProgressBar: {
    height: 4,
    borderRadius: 2,
    backgroundColor: LIGHTER_GREY,
  },
  innerProgressBar: {
    flex: 1,
    borderRadius: 2,
    backgroundColor: BLUE,
  },
  outerProgressDot: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    right: -7.5,
    top: -6,
    height: 16,
    width: 16,
    borderRadius: 7.5,
    backgroundColor: 'rgba(137, 157, 255, 0.2)',
    zIndex: 1,
  },
  innerProgressDot: {
    height: 10,
    width: 10,
    borderRadius: 5,
    backgroundColor: BLUE,
  },
  labelContainer: {
    flexDirection: 'row',
    width: '100%',
    marginBottom: 8,
  },
  leftLabel: {
    flex: 1,
  },
  rightLabel: {
    flex: 1,
    textAlign: 'right',
  },
});
