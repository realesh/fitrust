import React, {Component} from 'react';
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  LayoutAnimation,
  AsyncStorage,
} from 'react-native';
import {Text, TextInput, AnimatedButton} from '../../generals/core-ui';
import {TINY_FONT_SIZE} from '../../generals/constants/size';
import {BLUE, ERROR_THEME_COLOR, WHITE} from '../../generals/constants/colors';
import {NavigationScreenProp} from 'react-navigation';
import {linearEasingShort} from '../../generals/constants/animationConfig';
import {Toolbar} from '../../generals/components';
import ChangePasswordSuccessModal from './components/ChangePasswordSuccessModal';
import {validatePassword} from '../../helpers/inputValidation';
import {Mutation} from 'react-apollo';
import {
  ChangePasswordResponse,
  ChangePasswordVariables,
  CHANGE_PASSWORD,
} from '../../graphql/queries/profile';
import parseGraphQLError from '../../helpers/parseGraphQLError';

type Props = {
  navigation: NavigationScreenProp<any>;
};

type State = {
  oldPassword: string;
  newPassword: string;
  newRepeatPassword: string;
  loading: boolean;
  errorMessage: string;
  successModalVisible: boolean;
};

export default class ChangePasswordScene extends Component<Props, State> {
  state = {
    oldPassword: '',
    newPassword: '',
    newRepeatPassword: '',
    errorMessage: '',
    loading: false,
    successModalVisible: false,
  };

  render() {
    let {navigation} = this.props;
    let {
      oldPassword,
      newPassword,
      newRepeatPassword,
      errorMessage,
      loading,
      successModalVisible,
    } = this.state;

    return (
      <KeyboardAvoidingView style={styles.root}>
        <Toolbar navigation={navigation} title="Change Password" />
        <View style={styles.paddedContainer}>
          <TextInput
            inputType="password"
            iconName="unlock"
            onChangeText={this._onOldPasswordChange}
            value={oldPassword}
            label="Old Password"
            containerStyle={{marginBottom: 20}}
            error={!!errorMessage}
            onFocus={this._resetErrorState}
          />
          <TextInput
            inputType="password"
            iconName="unlock"
            onChangeText={this._onNewPasswordChange}
            value={newPassword}
            label="New Password"
            containerStyle={{marginBottom: 20}}
            error={!!errorMessage}
            onFocus={this._resetErrorState}
          />
          <TextInput
            inputType="password"
            iconName="unlock"
            onChangeText={this._onNewRepeatPasswordChange}
            value={newRepeatPassword}
            label="Repeat New Password"
            containerStyle={{marginBottom: 20}}
            error={!!errorMessage}
            onFocus={this._resetErrorState}
          />

          {!!errorMessage && (
            <Text
              fontSize={TINY_FONT_SIZE}
              fontWeight="bold"
              style={{
                width: '80%',
                color: ERROR_THEME_COLOR,
                marginBottom: 20,
                alignSelf: 'center',
                textAlign: 'center',
              }}
            >
              {errorMessage}
            </Text>
          )}

          {this._renderChangeButton()}
        </View>

        <ChangePasswordSuccessModal
          visible={successModalVisible}
          onRequestClose={this._toggleSuccessModal}
          onClosePress={this._navigateToProfile}
        />
      </KeyboardAvoidingView>
    );
  }

  _onOldPasswordChange = (value: string) => {
    this.setState({
      oldPassword: value,
    });
  };
  _onNewPasswordChange = (value: string) => {
    this.setState({
      newPassword: value,
    });
  };
  _onNewRepeatPasswordChange = (value: string) => {
    this.setState({
      newRepeatPassword: value,
    });
  };

  _resetErrorState = () => {
    LayoutAnimation.configureNext(linearEasingShort);
    this.setState({errorMessage: ''});
  };
  _navigateToProfile = () => {
    this._toggleSuccessModal();
    this.props.navigation.navigate('home');
  };
  _handleSuccess = () => {};
  _toggleSuccessModal = () => {
    LayoutAnimation.configureNext(linearEasingShort);
    this.setState({
      successModalVisible: !this.state.successModalVisible,
      loading: false,
    });
  };

  _setErrorState = (errorMessage: string) => {
    LayoutAnimation.configureNext(linearEasingShort);
    this.setState({
      errorMessage,
      loading: false,
    });
  };

  _renderChangeButton = () => {
    let {loading} = this.state;
    return (
      <Mutation<ChangePasswordResponse, ChangePasswordVariables>
        mutation={CHANGE_PASSWORD}
      >
        {(changePassword) => {
          let handleUpdate = async () => {
            let {oldPassword, newPassword, newRepeatPassword} = this.state;

            LayoutAnimation.configureNext(linearEasingShort);
            this.setState({loading: true});

            let validation =
              validatePassword(oldPassword) &&
              validatePassword(newPassword) &&
              validatePassword(newRepeatPassword);

            if (!validation) {
              this._setErrorState(
                'Password must be at least 6 characters, and contain uppercase, lowercase, and number',
              );
            } else if (newPassword !== newRepeatPassword) {
              this._setErrorState("Repeated new password doesn't match!");
            } else {
              try {
                let ID = await AsyncStorage.getItem('userID');
                changePassword &&
                  (await changePassword({
                    variables: {
                      userID: ID || '',
                      oldPassword,
                      newPassword,
                    },
                  }));
                setTimeout(this._toggleSuccessModal, 1300);
              } catch (error) {
                let errorMessage = parseGraphQLError(error);
                this._setErrorState(errorMessage);
              }
            }
          };
          return (
            <AnimatedButton
              style={{position: 'absolute', bottom: 20}}
              onPress={handleUpdate}
              loading={loading}
            >
              Change
            </AnimatedButton>
          );
        }}
      </Mutation>
    );
  };
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  paddedContainer: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  image: {
    marginBottom: 10,
    width: 180,
    height: 48,
  },
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 50,
    width: '100%',
    borderRadius: 10,
    backgroundColor: BLUE,
    alignSelf: 'center',
  },
  clickableArea: {
    width: '100%',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlayContainer: {
    flex: 1,
    width: '100%',
    height: '100%',
    position: 'absolute',
    backgroundColor: WHITE,
    zIndex: 2,
  },
  textCenterStyle: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
