import React, {Component, Fragment} from 'react';
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  LayoutAnimation,
} from 'react-native';
import {
  Text,
  TextInput,
  AnimatedButton,
  CheckLabel,
} from '../../generals/core-ui';
import {
  HEADER_FONT_SIZE,
  TINY_FONT_SIZE,
  MEDIUM_FONT_SIZE,
} from '../../generals/constants/size';
import {
  BLUE,
  GREY,
  ERROR_THEME_COLOR,
  WHITE,
} from '../../generals/constants/colors';
import {NavigationScreenProps} from 'react-navigation';
import {
  linearEasingLong,
  linearEasingShort,
} from '../../generals/constants/animationConfig';
import DatePicker from '../../generals/components/DatePicker';
import {graphql, MutationFunc} from 'react-apollo';
import {
  REGISTER_USER,
  RegisterUserResponse,
  RegisterUserVariables,
} from '../../graphql/queries/user';

type RegisterUserProps = {
  registerUser?: MutationFunc<RegisterUserResponse, RegisterUserVariables>;
};
type OwnProps = NavigationScreenProps & {};

type Props = OwnProps & RegisterUserProps;

type State = {
  name: string;
  username: string;
  password: string;
  date: Date;
  rememberMe: boolean;
  login: boolean;

  inputError: boolean;
  loading: boolean;
  welcomeAnimation: number;
};

class AuthScene extends Component<Props, State> {
  state = {
    name: '',
    username: '',
    password: '',
    date: new Date(),
    rememberMe: false,
    login: true,

    inputError: false,
    loading: false,

    // 0: init, 1: enter, 2: greetings, 3: translate
    welcomeAnimation: 0,
  };

  render() {
    let {
      name,
      username,
      password,
      date,
      rememberMe,
      login,
      inputError,
    } = this.state;

    return (
      <KeyboardAvoidingView style={styles.root}>
        <View style={styles.paddedContainer}>
          {this._renderHeaderText()}

          <View style={{marginBottom: 40}}>
            {!login && (
              <TextInput
                inputType="text"
                onChangeText={this._onChangeName}
                value={name}
                label="Name"
                containerStyle={{marginBottom: 10}}
                error={inputError}
                onFocus={this._resetErrorState}
              />
            )}
            <TextInput
              inputType="username"
              validate={login ? false : true}
              onChangeText={this._onChangeUsername}
              value={username}
              label="Username"
              iconName="user"
              containerStyle={{marginBottom: 10}}
              error={inputError}
              onFocus={this._resetErrorState}
            />
            <TextInput
              inputType="password"
              validate={login ? false : true}
              onChangeText={this._onChangePassword}
              value={password}
              label="Password"
              iconName="unlock"
              containerStyle={{marginBottom: 10}}
              error={inputError}
              onFocus={this._resetErrorState}
            />
            {!login && (
              <DatePicker onDateChange={this._onChangeDate} value={date} />
            )}
            {login && (
              <CheckLabel
                checked={rememberMe}
                onPress={this._onToggleRememberMe}
                style={{marginTop: 10}}
              >
                Remember me
              </CheckLabel>
            )}
          </View>

          {inputError && login ? (
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
              Oops! You've entered a wrong username or password
            </Text>
          ) : (
            inputError && (
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
                Every field must be filled!
              </Text>
            )
          )}

          {this._renderButton()}
          {this._renderTextButton()}
        </View>
        {this._renderSuccessOverlay()}
      </KeyboardAvoidingView>
    );
  }

  _onChangeName = (value: string) => {
    this.setState({
      name: value,
    });
  };
  _onChangeUsername = (value: string) => {
    this.setState({
      username: value,
    });
  };
  _onChangePassword = (value: string) => {
    this.setState({
      password: value,
    });
  };
  _onToggleRememberMe = () => {
    this.setState({rememberMe: !this.state.rememberMe});
  };
  _onChangeDate = (value: Date) => {
    this.setState({date: value});
  };

  _renderSuccessOverlay = () => {
    let {welcomeAnimation, name} = this.state;

    return welcomeAnimation !== 0 ? (
      welcomeAnimation === 1 ? (
        <View style={[styles.overlayContainer]} pointerEvents="none" />
      ) : welcomeAnimation === 2 ? (
        <View
          style={[styles.overlayContainer, styles.textCenterStyle]}
          pointerEvents="none"
        >
          <View style={styles.paddedContainer}>
            <Text fontWeight="regular" fontSize={MEDIUM_FONT_SIZE}>
              {`Hello, ${name}.`}
            </Text>
          </View>
        </View>
      ) : (
        <View style={styles.overlayContainer} pointerEvents="none">
          <View style={styles.paddedContainer}>
            <Text fontWeight="regular" fontSize={MEDIUM_FONT_SIZE}>
              {`Hello, ${name}.`}
            </Text>
          </View>
        </View>
      )
    ) : null;
  };
  _renderButton = () => {
    let {login, loading} = this.state;
    if (login) {
      return (
        <AnimatedButton onPress={this._handleLogin} loading={loading}>
          Login
        </AnimatedButton>
      );
    } else {
      return (
        <AnimatedButton onPress={this._handleSignUp} loading={loading}>
          Sign up
        </AnimatedButton>
      );
    }
  };
  _renderTextButton = () => {
    let {login} = this.state;

    return (
      <Text
        fontSize={TINY_FONT_SIZE}
        fontWeight="bold"
        style={{color: GREY, marginTop: 10, alignSelf: 'center'}}
        onPress={this._toggleLoginState}
      >
        {login ? 'New user?' : 'Existing user?'}
        <Text fontSize={TINY_FONT_SIZE} fontWeight="bold" style={{color: BLUE}}>
          {login ? ' Sign up' : ' Login'}
        </Text>
      </Text>
    );
  };
  _renderHeaderText = () => {
    let {login} = this.state;

    if (login) {
      return (
        <Fragment>
          <Text
            fontWeight="bold"
            fontSize={HEADER_FONT_SIZE}
            style={{marginBottom: 20}}
          >
            Glad you're back!
          </Text>
        </Fragment>
      );
    } else {
      return (
        <Fragment>
          <Text fontWeight="bold" fontSize={HEADER_FONT_SIZE}>
            Start now to get fit!
          </Text>
          <Text
            fontWeight="light"
            fontSize={MEDIUM_FONT_SIZE}
            style={{marginBottom: 20}}
          >
            Sign up to continue to Fitrust App
          </Text>
        </Fragment>
      );
    }
  };
  _resetErrorState = () => {
    LayoutAnimation.configureNext(linearEasingShort);
    this.setState({inputError: false});
  };
  _toggleLoginState = () => {
    let {login} = this.state;
    this._resetErrorState();
    LayoutAnimation.configureNext(linearEasingLong);
    this.setState({login: !login});
  };
  _handleLogin = () => {
    let {username, password} = this.state;

    let setErrorState = () => {
      LayoutAnimation.configureNext(linearEasingShort);
      this.setState({inputError: true, loading: false});
    };

    LayoutAnimation.configureNext(linearEasingShort);
    this.setState({loading: true});

    if (username.toLowerCase() === 'realesh' && password === 'Testing123') {
      setTimeout(this._navigateToMain, 1800);
    } else {
      setTimeout(setErrorState, 1800);
    }
  };
  _handleSignUp = () => {
    let {username, password} = this.state;

    let setErrorState = () => {
      LayoutAnimation.configureNext(linearEasingShort);
      this.setState({inputError: true, loading: false});
    };

    LayoutAnimation.configureNext(linearEasingShort);
    this.setState({loading: true});

    if (username && password) {
      setTimeout(this._registerUser, 1800);
    } else {
      setTimeout(setErrorState, 1800);
    }
  };
  _registerUser = async () => {
    let result =
      this.props.registerUser &&
      (await this.props.registerUser({
        variables: {
          username: this.state.username,
          password: this.state.password,
          name: this.state.name,
          dob: this.state.date.toISOString(),
        },
      }));

    let token = result && result.data && result.data.registerUser.token;
    let name = result && result.data && result.data.registerUser.name;
    {
      name && this._navigateToMain(name);
    }
  };
  _navigateToMain = (name: string) => {
    let {navigation} = this.props;

    let setTo1 = () => {
      LayoutAnimation.configureNext(linearEasingShort);
      this.setState({welcomeAnimation: 1});
    };
    let setTo2 = () => {
      LayoutAnimation.configureNext(linearEasingLong);
      this.setState({welcomeAnimation: 2});
    };
    let setTo3 = () => {
      LayoutAnimation.configureNext(linearEasingShort);
      this.setState({welcomeAnimation: 3});
    };

    setTo1();
    setTimeout(setTo2, 300);
    setTimeout(setTo3, 1500);

    let navigate = () => navigation.navigate('dashboardHome', {name});
    setTimeout(navigate, 1800);
  };
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  paddedContainer: {
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

export default graphql<
  OwnProps,
  RegisterUserResponse,
  RegisterUserVariables,
  RegisterUserProps
>(REGISTER_USER, {
  props: ({mutate}) => {
    return {
      registerUser: mutate,
    };
  },
})(AuthScene);
