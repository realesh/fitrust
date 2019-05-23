import React, {Component} from 'react';
import {View, StyleSheet, WebView, ActivityIndicator} from 'react-native';
import {NavigationScreenProps} from 'react-navigation';
import {Toolbar} from './components';
import {WHITE} from './constants/colors';

type NavigationParams = {
  uri: string;
  title?: string;
};

type Props = NavigationScreenProps<NavigationParams> & {};

export default class WebViewScene extends Component<Props> {
  render() {
    let {navigation} = this.props;
    let uri = navigation.getParam('uri');
    let title = navigation.getParam('title');

    return (
      <View style={styles.root}>
        <Toolbar navigation={navigation} title={title} />
        <WebView
          source={{uri}}
          startInLoadingState={true}
          renderLoading={this._renderLoading}
        />
      </View>
    );
  }

  _renderLoading = () => (
    <View style={styles.loading}>
      <ActivityIndicator />
    </View>
  );

  _onBackPress = () => this.props.navigation.goBack();
}

let styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: WHITE,
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
  },
});
