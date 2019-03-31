import React, {Component} from 'react';
import {View, StyleSheet, Image, ScrollView} from 'react-native';
import {NavigationScreenProps} from 'react-navigation';

type Props = NavigationScreenProps;

type State = {};

export default class ExerciseModeScene extends Component<Props, State> {
  render() {
    return <View style={styles.container} />;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
