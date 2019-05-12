import React, {Component} from 'react';
import {StyleSheet, View, LayoutAnimation, AsyncStorage} from 'react-native';
import {AuthSession} from 'expo';
import {FITBIT_APP_ID, EXPIRED_DURATION} from '../generals/constants/fitbit';
import {LARGE_FONT_SIZE} from '../generals/constants/size';
import {Text, AnimatedButton} from '../generals/core-ui';
import {linearEasingShort} from '../generals/constants/animationConfig';
import {Toolbar} from '../generals/components';
import {NavigationScreenProps} from 'react-navigation';
import {UpdateFitbitAuthFn} from './Dashboard/DashboardScene';

type OAuthResult = {
  params: OAuthParams;
};

type OAuthParams = {
  access_token: string;
  token_type: string;
  user_id: string;
};

type NavigationScreenParams = {
  updateFunc: UpdateFitbitAuthFn;
};

type Props = NavigationScreenProps<NavigationScreenParams> & {};

export default class Placeholder extends Component<Props> {
  state = {
    loading: false,
  };

  render() {
    let {loading} = this.state;
    return (
      <View style={styles.container}>
        <Toolbar navigation={this.props.navigation} />
        <View style={styles.paddedContainer}>
          <View style={styles.imageContainer} />
          <View style={styles.messageContainer}>
            <Text fontWeight="bold" fontSize={LARGE_FONT_SIZE}>
              Connect to Fitbit
            </Text>
            <Text style={styles.message}>
              Fitrust uses some features from Fitbit to further enhance your
              daily fitness tracking. Connect to Fitbit to have the best
              experience from Fitrust.
            </Text>
            <AnimatedButton
              loading={loading}
              onPress={this._handlePressAsync}
              style={styles.alignStretch}
            >
              Connect
            </AnimatedButton>
          </View>
        </View>
      </View>
    );
  }
  _handlePressAsync = async () => {
    LayoutAnimation.configureNext(linearEasingShort);
    this.setState({loading: true});
    try {
      let redirectUrl = AuthSession.getRedirectUrl();
      let result = ((await AuthSession.startAsync({
        authUrl:
          `https://www.fitbit.com/oauth2/authorize?response_type=token&client_id=${FITBIT_APP_ID}` +
          `&redirect_uri=${redirectUrl}` +
          `&scope=activity%20heartrate%20nutrition%20profile%20weight&expires_in=${EXPIRED_DURATION}`,
      })) as unknown) as OAuthResult;
      this._storeFitbitKeys(result.params);
    } catch (error) {
      // Failed OAuth
    }
  };
  _storeFitbitKeys = async (params: OAuthParams) => {
    let fitbit_keys = [
      ['fitbit_access_token', params.access_token],
      ['fitbit_user_id', params.user_id],
    ];

    await AsyncStorage.multiSet(fitbit_keys);
    LayoutAnimation.configureNext(linearEasingShort);
    this.setState({loading: false});
    this.props.navigation.getParam('updateFunc')(
      params.user_id,
      params.access_token,
    );
    this.props.navigation.goBack();
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  paddedContainer: {
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
  alignStretch: {alignSelf: 'stretch'},
});
