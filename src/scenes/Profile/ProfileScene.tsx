import React, {Component} from 'react';
import {View, StyleSheet} from 'react-native';
import {NavigationScreenProps} from 'react-navigation';

type Props = NavigationScreenProps;

export default class ProfileScene extends Component<Props> {
  render() {
    return <View style={styles.root} />;
  }
}

const styles = StyleSheet.create({
  root: {
    flexGrow: 1,
  },
});
