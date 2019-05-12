import React, {Component} from 'react';
import {StyleSheet, View} from 'react-native';
import {Feather as Icon} from '@expo/vector-icons';
import {LARGE_FONT_SIZE} from '../generals/constants/size';
import {Text, AnimatedButton} from '../generals/core-ui';
import {NavigationScreenProps} from 'react-navigation';
import {BLUE30, BLUE} from '../generals/constants/colors';
import {UpdateFitbitAuthFn} from './Dashboard/DashboardScene';

type Props = NavigationScreenProps & {
  updateFunc: UpdateFitbitAuthFn;
};

export default class LockedScene extends Component<Props> {
  state = {
    loading: false,
  };

  render() {
    let {loading} = this.state;
    return (
      <View style={styles.container}>
        <View style={styles.iconContainer}>
          <Icon size={50} name="lock" color={BLUE} />
        </View>
        <Text fontWeight="bold" fontSize={LARGE_FONT_SIZE}>
          Features Locked
        </Text>
        <Text style={styles.message}>
          Steps tracking are only available when you're connected to Fitbit
        </Text>
        <AnimatedButton loading={loading} onPress={this._goToFitbitAuth}>
          Connect
        </AnimatedButton>
      </View>
    );
  }
  _goToFitbitAuth = () => {
    this.props.navigation.navigate('fitbitAuth', {
      previous_scene: 'Dashboard',
      updateFunc: this.props.updateFunc,
    });
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  message: {
    lineHeight: 24,
    textAlign: 'center',
    marginTop: 5,
    marginBottom: 20,
  },
  imageContainer: {
    flex: 1,
  },
  messageContainer: {
    alignItems: 'center',
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 20,
    backgroundColor: BLUE30,
  },
});
