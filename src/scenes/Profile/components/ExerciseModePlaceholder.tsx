import React from 'react';
import {View, StyleSheet, Image} from 'react-native';
import {NavigationScreenProps} from 'react-navigation';
import {Feather as Icon} from '@expo/vector-icons';
import {fitbitWhite} from '../../../assets/images/profile';
import {Text, Button} from '../../../generals/core-ui';
import {WHITE, BLUE, WHITE30} from '../../../generals/constants/colors';
import {LARGE_FONT_SIZE} from '../../../generals/constants/size';

type Props = NavigationScreenProps & {
  mhr: number;
  fitbitConnected: boolean;
};

export default function ExerciseModePlaceholder(props: Props) {
  let {navigation, mhr, fitbitConnected} = props;

  let navigate = () =>
    navigation.navigate('exerciseModeSetting', {
      previous_scene: 'Placeholder',
      mhr,
    });

  return fitbitConnected ? (
    <View style={styles.container}>
      <Image
        source={fitbitWhite}
        style={{width: '50%', height: 100}}
        resizeMode="contain"
      />

      <Text style={{color: WHITE, textAlign: 'center'}}>
        Your exercise are about to be recorded and points will be earned in this
        exercise mode. Please make sure your phone's bluetooth is turned on and
        is connected to your FitBit device.
      </Text>
      <Button style={styles.button} fontColor={BLUE} onPress={navigate}>
        I'm ready!
      </Button>
    </View>
  ) : (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Icon size={50} name="lock" color={WHITE} />
      </View>
      <Text fontWeight="bold" fontSize={LARGE_FONT_SIZE} style={{color: WHITE}}>
        Features Locked
      </Text>
      <Text style={styles.message}>
        {
          "Exercise Mode are only available when you're connected to Fitbit.\nGo back to dashboard to connect to your Fitbit account.\n\nIf you have connected your Fitbit account and still see this message, try to kill and reopen the app."
        }
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 80,
  },
  button: {
    backgroundColor: WHITE,
    marginTop: 20,
    height: 40,
    borderRadius: 20,
    width: '50%',
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 20,
    backgroundColor: WHITE30,
  },
  message: {
    lineHeight: 24,
    textAlign: 'center',
    marginTop: 5,
    marginBottom: 20,
    color: WHITE,
  },
});
