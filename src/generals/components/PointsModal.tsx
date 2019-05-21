import React from 'react';
import {StyleSheet, ModalBaseProps, View} from 'react-native';
import {Feather as Icon} from '@expo/vector-icons';
import PopupDialog from './PopupDialog';
import {Text, Button} from '../core-ui';
import {BLUE, WHITE} from '../constants/colors';
import {LARGE_FONT_SIZE, BIG_FONT_SIZE} from '../constants/size';
import numberFormatter from '../../helpers/numberFormatter';

type Props = ModalBaseProps & {
  pointsSource: string;
  pointsValue: number;
  exModeEffectivity?: number;
};

export default function PointsModal(props: Props) {
  let {
    visible = false,
    onRequestClose,
    pointsSource,
    pointsValue,
    exModeEffectivity,
  } = props;
  return (
    <PopupDialog visible={visible} onRequestClose={onRequestClose}>
      <View style={styles.pointsContainer}>
        <Icon name="zap" size={30} color={BLUE} style={{marginRight: 10}} />
        <Text fontWeight="bold" fontSize={BIG_FONT_SIZE} style={{color: BLUE}}>
          {numberFormatter(Math.floor(pointsValue))}
        </Text>
      </View>
      <Text fontWeight="bold" fontSize={LARGE_FONT_SIZE}>
        Points earned!
      </Text>
      {exModeEffectivity ? (
        <Text style={{lineHeight: 24, textAlign: 'center', marginTop: 5}}>
          Great job! You finished your{' '}
          <Text fontWeight="bold">{`\n ${pointsSource} `}</Text>with
          <Text fontWeight="bold" style={styles.highlight}>{` ${Math.floor(
            exModeEffectivity,
          )}% `}</Text>
          score!{'\n'}Try to maintain your heart rate in your goal zone to get
          more score!
        </Text>
      ) : (
        <Text style={{lineHeight: 24, textAlign: 'center', marginTop: 5}}>
          You got points from{' '}
          <Text fontWeight="bold">{`${pointsSource}. \n`}</Text>
          Gain more points to soar high above your friends!
        </Text>
      )}
      <Button
        onPress={onRequestClose}
        style={styles.interactButton}
        fontColor={BLUE}
      >
        Got it
      </Button>
    </PopupDialog>
  );
}

const styles = StyleSheet.create({
  paddedContainer: {
    padding: 20,
    width: '100%',
    alignItems: 'center',
  },
  pointsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 250,
  },
  interactButton: {
    backgroundColor: WHITE,
    marginTop: 20,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: BLUE,
    width: '90%',
  },
  highlight: {color: BLUE},
});
