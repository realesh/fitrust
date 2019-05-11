import React, {Component} from 'react';
import {StyleSheet, View, AsyncStorage} from 'react-native';
import {NavigationScreenProps} from 'react-navigation';
import {Query} from 'react-apollo';
import {
  VerifyTokenResponse,
  VerifyTokenVariables,
  VERIFY_TOKEN,
} from '../../graphql/queries/user';

type Props = NavigationScreenProps;

type State = {
  token: string;
  sentID: string;
  sentName: string;
};

export default class CheckAuthScene extends Component<Props, State> {
  state = {
    token: '',
    sentID: '',
    sentName: '',
  };

  componentDidMount() {
    this._getToken();
  }

  _getToken = async () => {
    try {
      let userToken = await AsyncStorage.getItem('userToken');
      if (userToken) {
        this.setState({token: userToken});
      } else {
        let skipOnBoard = await AsyncStorage.getItem('skipOnBoard');
        if (skipOnBoard) {
          this.props.navigation.navigate('authField');
        }
        this.props.navigation.navigate('auth');
      }
    } catch (error) {
      // Handle Error
    }
  };

  render() {
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

          return <View style={styles.container} />;
        }}
      </Query>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
