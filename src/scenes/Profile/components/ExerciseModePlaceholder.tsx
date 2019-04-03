import React from 'react';
import {View, StyleSheet, Image} from 'react-native';
import {NavigationScreenProps} from 'react-navigation';
import {fitbitWhite} from '../../../assets/images/profile';
import {Text, Button} from '../../../generals/core-ui';
import {WHITE, BLUE} from '../../../generals/constants/colors';

type Props = NavigationScreenProps;

export default function ExerciseModePlaceholder(props: Props) {
  let {navigation} = props;

  let navigate = () =>
    navigation.navigate('exerciseModeSetting', {previous_scene: 'Placeholder'});

  return (
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
});
