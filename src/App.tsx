import React, {Component} from 'react';
import {StyleSheet} from 'react-native';
import {SafeAreaView} from 'react-navigation';
import {Font, AppLoading} from 'expo';

import {WHITE} from './generals/constants/colors';
import Main from './generals/routes/Main';

type State = {
  fontLoaded: boolean;
};

export default class App extends Component<{}, State> {
  state = {
    fontLoaded: false,
  };

  render() {
    let {fontLoaded} = this.state;
    return fontLoaded ? (
      <SafeAreaView style={styles.root} forceInset={{top: 'always'}}>
        <Main />
      </SafeAreaView>
    ) : (
      <AppLoading
        startAsync={this._init}
        onFinish={this._handleFinishLoading}
      />
    );
  }

  _init = async () => {
    await Font.loadAsync({
      'Lato-Regular': require('./assets/fonts/Lato-Regular.ttf'),
      'Lato-Light': require('./assets/fonts/Lato-Light.ttf'),
      'Lato-Bold': require('./assets/fonts/Lato-Bold.ttf'),
    });
  };

  _handleFinishLoading = () => {
    this.setState({fontLoaded: true});
  };
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: WHITE,
  },
});
