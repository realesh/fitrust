import React, {Component, Fragment} from 'react';
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  LayoutAnimation,
  AsyncStorage,
  ScrollView,
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
import {MutationFunc, Mutation} from 'react-apollo';
import {
  REGISTER_USER,
  RegisterUserResponse,
  RegisterUserVariables,
  LoginUserResponse,
  LoginUserVariables,
  LOGIN_USER,
} from '../../graphql/queries/user';
import parseGraphQLError from '../../helpers/parseGraphQLError';

type NavigationScreenParams = {
  command: string;
};
type OwnProps = NavigationScreenProps<NavigationScreenParams> & {};

type Props = OwnProps;
type BaseProps = Props & {
  registerUser: MutationFunc<RegisterUserResponse, RegisterUserVariables>;
  registerData?: RegisterUserResponse;
  registerLoading: boolean;
  loginUser: MutationFunc<LoginUserResponse, LoginUserVariables>;
  loginData?: LoginUserResponse;
  loginLoading: boolean;
};

type State = {
  name: string;
  username: string;
  password: string;
  date: Date;
  rememberMe: boolean;
  login: boolean;

  errorMessage: string | null;
  loading: boolean;
  welcomeAnimation: number;
};

class AuthScene extends Component<Props> {
  componentDidMount() {
    let isLoggedout = this.props.navigation.getParam('command', '');
    if (isLoggedout === 'logout') {
      AsyncStorage.multiRemove([
        'fitbit_access_token',
        'fitbit_user_id',
        'userToken',
        'userID',
      ]);
    }
  }

  render() {
    let {...props} = this.props;
    return (
      <Mutation<RegisterUserResponse, RegisterUserVariables>
        mutation={REGISTER_USER}
      >
        {(registerUser, {data: registerData, loading: registerLoading}) => {
          return (
            <Mutation<LoginUserResponse, LoginUserVariables>
              mutation={LOGIN_USER}
            >
              {(loginUser, {data: loginData, loading: loginLoading}) => {
                return (
                  <AuthSceneBase
                    {...props}
                    registerUser={registerUser}
                    registerData={registerData}
                    registerLoading={registerLoading}
                    loginUser={loginUser}
                    loginData={loginData}
                    loginLoading={loginLoading}
                  />
                );
              }}
            </Mutation>
          );
        }}
      </Mutation>
    );
  }
}

class AuthSceneBase extends Component<BaseProps, State> {
  state = {
    name: '',
    username: '',
    password: '',
    date: new Date(),
    rememberMe: false,
    login: true,

    errorMessage: null,
    loading: false,

    // 0: init, 1: enter, 2: greetings, 3: translate
    welcomeAnimation: 0,
  };

  componentDidUpdate(prevProps: BaseProps) {
    let {
      registerLoading: prevRegLoading,
      loginLoading: prevLogLoading,
    } = prevProps;
    let {
      registerLoading: currRegLoading,
      loginLoading: currLogLoading,
    } = this.props;
    if (
      prevRegLoading !== currRegLoading ||
      prevLogLoading !== currLogLoading
    ) {
      if (prevRegLoading || currLogLoading) {
        LayoutAnimation.configureNext(linearEasingShort);
        this.setState({loading: true});
      } else if (!prevRegLoading && !currLogLoading) {
        LayoutAnimation.configureNext(linearEasingShort);
        this.setState({loading: false});
      }
    }
  }

  render() {
    let {
      name,
      username,
      password,
      date,
      rememberMe,
      login,
      errorMessage,
    } = this.state;

    return (
      <KeyboardAvoidingView behavior="padding" style={styles.root}>
        <ScrollView style={styles.paddedContainer}>
          {this._renderHeaderText()}

          <View style={{marginBottom: 40}}>
            {!login && (
              <TextInput
                inputType="text"
                onChangeText={this._onChangeName}
                value={name}
                label="Name"
                containerStyle={{marginBottom: 10}}
                error={!!errorMessage}
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
              error={!!errorMessage}
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
              error={!!errorMessage}
              onFocus={this._resetErrorState}
            />
            {!login && (
              <DatePicker onDateChange={this._onChangeDate} value={date} />
            )}
            {/* {login && (
              <CheckLabel
                checked={rememberMe}
                onPress={this._onToggleRememberMe}
                style={{marginTop: 10}}
              >
                Remember me
              </CheckLabel>
            )} */}
          </View>

          {errorMessage && (
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

          {this._renderButton()}
          {this._renderTextButton()}
        </ScrollView>
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
    this.setState({errorMessage: null});
  };
  _setErrorState = (errorMessage: string) => {
    LayoutAnimation.configureNext(linearEasingShort);
    this.setState({errorMessage});
  };
  _toggleLoginState = () => {
    let {login} = this.state;
    this._resetErrorState();
    LayoutAnimation.configureNext(linearEasingLong);
    this.setState({login: !login});
  };
  _handleLogin = async () => {
    try {
      let result =
        this.props.loginUser &&
        (await this.props.loginUser({
          variables: {
            username: this.state.username,
            password: this.state.password,
          },
        }));

      let token = result && result.data && result.data.loginUser.token;
      let name =
        (result && result.data && result.data.loginUser.name) || 'Guest';
      let id = (result && result.data && result.data.loginUser.id) || 'Guest';
      this.setState({name});
      if (token) {
        this._navigateToMain(id, name, token);
      } else {
        this._setErrorState('Oops! Some error happened');
      }
    } catch (error) {
      let errorMessage = parseGraphQLError(error);
      this._setErrorState(errorMessage);
    }
  };
  _handleSignUp = async () => {
    try {
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
      let name =
        (result && result.data && result.data.registerUser.name) || 'Guest';
      let id =
        (result && result.data && result.data.registerUser.id) || 'Guest';
      if (token) {
        this._navigateToMain(id, name, token);
      } else {
        this._setErrorState('Oops! Some error happened');
      }
    } catch (error) {
      let errorMessage = parseGraphQLError(error);
      this._setErrorState(errorMessage);
    }
  };
  _navigateToMain = (id: string, name: string, token: string) => {
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

    let navigate = () =>
      navigation.navigate('dashboardHome', {id, name, token});
    setTimeout(navigate, 1800);
  };
}

const styles = StyleSheet.create({
  root: {
    flexGrow: 1,
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

export default AuthScene;
