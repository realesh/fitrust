import React from 'react';
import {
  StyleSheet,
  View,
  ViewProps,
  ViewStyle,
  TouchableOpacity,
} from 'react-native';
import {Feather as Icon} from '@expo/vector-icons';
import {LIGHTER_GREY, BLUE, GREY, GREEN, WHITE} from '../constants/colors';
import {Text, Button} from '../core-ui';

type Props = ViewProps & {
  label: string;
  currentValue: number;
  maxValue: number;
  unit: string;
  containerStyle?: ViewStyle;
  iconName?: string;
  onIconPress: () => void;
  isClaimed: boolean;
  onClaimPress: () => void;
};

function ProgressBarWithLabel(props: Props) {
  let {
    label,
    currentValue,
    maxValue,
    unit,
    containerStyle,
    iconName = '',
    onIconPress,
    isClaimed,
    onClaimPress,
    ...otherProps
  } = props;
  let percentage = (currentValue / maxValue) * 100;

  let _onClaimPress = () => {
    !isClaimed && onClaimPress();
    return;
  };

  return isClaimed ? (
    <View style={[styles.root, styles.goalCompleteContainer, containerStyle]}>
      <Text style={{flex: 1, marginRight: 20}}>{label}</Text>
      <View style={styles.disabledButton}>
        <Text fontWeight="bold" style={{color: GREY}}>
          COMPLETED
        </Text>
      </View>
    </View>
  ) : percentage < 100 ? (
    <View style={[styles.root, containerStyle]} {...otherProps}>
      <View style={styles.labelContainer}>
        <Text>{label}</Text>
        <Text style={styles.rightLabel}>
          {currentValue}{' '}
          <Text style={{color: GREY}}>
            / {maxValue} {unit}
          </Text>
        </Text>
        {iconName && (
          <TouchableOpacity onPress={onIconPress}>
            <Icon
              name={iconName}
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
  ) : (
    <View style={[styles.root, styles.goalCompleteContainer, containerStyle]}>
      <Text style={{flex: 1, marginRight: 20}}>{label}</Text>
      <Button
        onPress={_onClaimPress}
        style={styles.interactButton}
        fontColor={GREEN}
      >
        CLAIM
      </Button>
    </View>
  );
}

export default ProgressBarWithLabel;

const styles = StyleSheet.create({
  root: {
    height: 40,
  },
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
  rightLabel: {
    flex: 1,
    textAlign: 'right',
  },
  interactButton: {
    flex: 1,
    backgroundColor: WHITE,
    height: '100%',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: GREEN,
  },
  disabledButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: WHITE,
    height: '100%',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: GREY,
  },
  goalCompleteContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
