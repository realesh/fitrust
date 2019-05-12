import React, {Component} from 'react';
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  LayoutAnimation,
  AsyncStorage,
} from 'react-native';
import {
  Text,
  TextInput,
  AnimatedButton,
  Avatar,
  Dropdown,
} from '../../generals/core-ui';
import {TINY_FONT_SIZE, MEDIUM_FONT_SIZE} from '../../generals/constants/size';
import {BLUE, ERROR_THEME_COLOR, WHITE} from '../../generals/constants/colors';
import {NavigationScreenProps} from 'react-navigation';
import {linearEasingShort} from '../../generals/constants/animationConfig';
import {Toolbar} from '../../generals/components';
import {onDropdownValueChangeFn} from '../../generals/core-ui/Dropdown';
import {titles, middleTitles} from './data/EditProfileDataFixtures';
import EditSuccessModal from './components/EditSuccessModal';
import {Mutation} from 'react-apollo';
import {
  UpdateProfileResponse,
  UpdateProfileVariables,
  UPDATE_PROFILE,
  USER_PROFILE,
} from '../../graphql/queries/profile';
import {USER_DASHBOARD} from '../../graphql/queries/dashboard';

type NavigationScreenParams = {
  name: string;
  titleFirst: string;
  titleMiddle: string;
  titleLast: string;
  avatarUrl: string;
};

type Props = NavigationScreenProps<NavigationScreenParams>;

type State = {
  name: string;
  firstTitle: string | undefined;
  middleTitle: string | undefined;
  lastTitle: string | undefined;
  avatarUrl: string;
  inputError: boolean;
  loading: boolean;
  successModalVisible: boolean;
};

export default class EditProfileScene extends Component<Props, State> {
  state = {
    name: '',
    firstTitle: undefined,
    middleTitle: undefined,
    lastTitle: undefined,
    avatarUrl: '',
    inputError: false,
    loading: false,
    successModalVisible: false,
  };

  componentDidMount() {
    let name = this.props.navigation.getParam('name');
    let firstTitle = this.props.navigation.getParam('titleFirst');
    let middleTitle = this.props.navigation.getParam('titleMiddle');
    let lastTitle = this.props.navigation.getParam('titleLast');
    let avatarUrl = this.props.navigation.getParam('avatarUrl');
    this.setState({
      name,
      firstTitle,
      middleTitle,
      lastTitle,
      avatarUrl,
    });
  }

  render() {
    let {navigation} = this.props;
    let {
      name,
      firstTitle,
      middleTitle,
      lastTitle,
      avatarUrl,
      inputError,
      successModalVisible,
    } = this.state;

    return (
      <KeyboardAvoidingView style={styles.root}>
        <Toolbar navigation={navigation} title="Edit Profile" />
        <View style={styles.paddedContainer}>
          <Avatar size="big" source={avatarUrl} style={{marginBottom: 15}} />
          <Text
            fontWeight="bold"
            fontSize={MEDIUM_FONT_SIZE}
            style={{color: BLUE}}
            onPress={() => {}}
          >
            Change Profile Picture
          </Text>

          <TextInput
            inputType="text"
            onChangeText={this._onNameChange}
            value={name}
            label="Name"
            containerStyle={{marginBottom: 20}}
            error={inputError}
            onFocus={this._resetErrorState}
          />

          <Dropdown
            title="Title (First)"
            placeholder="Choose a Title"
            options={titles}
            selectedValue={firstTitle}
            onValueChange={this._onFirstTitleChange}
            containerStyle={{marginBottom: 20}}
            error={!firstTitle}
          />
          <Dropdown
            title="Title (Middle)"
            placeholder="Choose a Title"
            options={middleTitles}
            selectedValue={middleTitle}
            onValueChange={this._onMiddleTitleChange}
            containerStyle={{marginBottom: 20}}
            error={!middleTitle}
          />
          <Dropdown
            title="Title (Last)"
            placeholder="Choose a Title"
            options={titles}
            selectedValue={lastTitle}
            onValueChange={this._onLastTitleChange}
            containerStyle={{marginBottom: 20}}
            error={!lastTitle}
          />

          {inputError ? (
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
              Name field can't be empty
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

          {this._renderUpdateButton()}
        </View>

        <EditSuccessModal
          visible={successModalVisible}
          onRequestClose={this._toggleSuccessModal}
          onClosePress={this._navigateToProfile}
        />
      </KeyboardAvoidingView>
    );
  }

  _onNameChange = (value: string) => {
    this.setState({
      name: value,
    });
  };
  _onFirstTitleChange: onDropdownValueChangeFn = (value) => {
    this.setState({firstTitle: value});
  };
  _onMiddleTitleChange: onDropdownValueChangeFn = (value) => {
    this.setState({middleTitle: value});
  };
  _onLastTitleChange: onDropdownValueChangeFn = (value) => {
    this.setState({lastTitle: value});
  };
  _resetErrorState = () => {
    LayoutAnimation.configureNext(linearEasingShort);
    this.setState({inputError: false});
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

  _renderUpdateButton = () => {
    let {loading} = this.state;
    return (
      <Mutation<UpdateProfileResponse, UpdateProfileVariables>
        mutation={UPDATE_PROFILE}
      >
        {(updateProfile, {loading: updateLoading}) => {
          let setErrorState = () => {
            LayoutAnimation.configureNext(linearEasingShort);
            this.setState({inputError: true, loading: false});
          };

          let handleUpdate = async () => {
            let {name, firstTitle, middleTitle, lastTitle} = this.state;

            LayoutAnimation.configureNext(linearEasingShort);
            this.setState({loading: true});

            if (!name) {
              setTimeout(setErrorState, 1800);
            }

            try {
              let ID = await AsyncStorage.getItem('userID');
              updateProfile &&
                (await updateProfile({
                  variables: {
                    userID: ID || '',
                    name,
                    first: firstTitle || '',
                    middle: middleTitle || '',
                    last: lastTitle || '',
                  },
                  refetchQueries: [
                    {
                      query: USER_PROFILE,
                      variables: {
                        userID: ID,
                      },
                    },
                    {
                      query: USER_DASHBOARD,
                      variables: {
                        userID: ID,
                      },
                    },
                  ],
                }));
              setTimeout(this._toggleSuccessModal, 1300);
            } catch (error) {
              // Handle Error
            }
          };
          return (
            <AnimatedButton
              style={{position: 'absolute', bottom: 20}}
              onPress={handleUpdate}
              loading={loading}
            >
              Update
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
