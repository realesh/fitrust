import React, {Component} from 'react';
import {StyleSheet, View, AsyncStorage, LayoutAnimation} from 'react-native';
import {AnimatedButton} from '../../generals/core-ui';
import {linearEasingShort} from '../../generals/constants/animationConfig';
import {NavigationScreenProps} from 'react-navigation';

type Props = NavigationScreenProps;

type State = {
  loading: boolean;
};

export default class CheckAuthScene extends Component<Props, State> {
  state = {
    loading: false,
  };

  componentDidMount() {
    LayoutAnimation.configureNext(linearEasingShort);
    this.setState({loading: true});
    this._getToken();
  }

  _getToken = async () => {
    try {
      let userData = await AsyncStorage.getItem('userToken');
      if (userData) {
        let navigate = () =>
          this.props.navigation.navigate('dashboardHome', {token: userData});
        setTimeout(navigate, 1500);
      } else {
        let navigate = () => this.props.navigation.navigate('auth');
        setTimeout(navigate, 1500);
      }
    } catch (error) {
      // Handle ERROR
    }
  };

  render() {
    let {loading} = this.state;
    return (
      <View style={styles.container}>
        <AnimatedButton loading={loading} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
