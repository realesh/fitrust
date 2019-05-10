import React, {Component} from 'react';
import {StyleSheet, View, AsyncStorage, LayoutAnimation} from 'react-native';
import {AnimatedButton} from '../../generals/core-ui';
import {linearEasingShort} from '../../generals/constants/animationConfig';
import {NavigationScreenProps} from 'react-navigation';
import {Query} from 'react-apollo';
import {
  VerifyTokenResponse,
  VerifyTokenVariables,
  VERIFY_TOKEN,
} from '../../graphql/queries/user';

type Props = NavigationScreenProps;

type State = {
  loading: boolean;
  token: string;
  sentID: string;
  sentName: string;
};

export default class CheckAuthScene extends Component<Props, State> {
  state = {
    loading: false,
    token: '',
    sentID: '',
    sentName: '',
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
        this.setState({token: userData});
      } else {
        this.props.navigation.navigate('authField');
      }
    } catch (error) {
      // Handle Error
    }
  };

  render() {
    let {loading} = this.state;
    return (
      <Query<VerifyTokenResponse, VerifyTokenVariables>
        query={VERIFY_TOKEN}
        variables={{token: this.state.token}}
        skip={!this.state.token}
      >
        {({data}) => {
          let result = data && data.verifyToken;
          if (result) {
            this.props.navigation.navigate('dashboardHome', {
              id: result.id,
              name: result.name,
              token: this.state.token,
            });
          }

          return (
            <View style={styles.container}>
              <AnimatedButton loading={loading} />
            </View>
          );
        }}
      </Query>
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
