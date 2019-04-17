import React, {Component} from 'react';
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
  Avatar,
  Dropdown,
} from '../../generals/core-ui';
import {TINY_FONT_SIZE, MEDIUM_FONT_SIZE} from '../../generals/constants/size';
import {BLUE, ERROR_THEME_COLOR, WHITE} from '../../generals/constants/colors';
import {NavigationScreenProp} from 'react-navigation';
import {linearEasingShort} from '../../generals/constants/animationConfig';
import {Toolbar} from '../../generals/components';
import {onDropdownValueChangeFn} from '../../generals/core-ui/Dropdown';
import {titles, middleTitles} from './data/EditProfileDataFixtures';
import EditSuccessModal from './components/EditSuccessModal';

type Props = {
  navigation: NavigationScreenProp<any>;
};

type State = {
  name: string;
  firstTitle: string | undefined;
  middleTitle: string | undefined;
  lastTitle: string | undefined;
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
    inputError: false,
    loading: false,
    successModalVisible: false,
  };

  render() {
    let {navigation} = this.props;
    let {
      name,
      firstTitle,
      middleTitle,
      lastTitle,
      inputError,
      loading,
      successModalVisible,
    } = this.state;

    return (
      <KeyboardAvoidingView style={styles.root}>
        <Toolbar navigation={navigation} title="Edit Profile" />
        <View style={styles.paddedContainer}>
          <Avatar
            size="big"
            source="https://pbs.twimg.com/profile_images/378800000500168907/7cba3b0f55df5a1a5458c18ba4a5d4a9_400x400.jpeg"
            style={{marginBottom: 15}}
          />
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

          <AnimatedButton
            style={{position: 'absolute', bottom: 20}}
            onPress={this._handleUpdate}
            loading={loading}
          >
            Update
          </AnimatedButton>
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
  _handleUpdate = () => {
    let {name} = this.state;

    let setErrorState = () => {
      LayoutAnimation.configureNext(linearEasingShort);
      this.setState({inputError: true, loading: false});
    };

    LayoutAnimation.configureNext(linearEasingShort);
    this.setState({loading: true});

    if (name) {
      setTimeout(this._toggleSuccessModal, 1800);
    } else {
      setTimeout(setErrorState, 1800);
    }
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
