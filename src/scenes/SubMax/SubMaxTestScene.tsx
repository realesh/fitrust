import React, {Component} from 'react';
import {View, StyleSheet, LayoutAnimation, TextInput} from 'react-native';
import {
  BLUE,
  WHITE,
  LIGHTER_GREY,
  LIGHT_GREY,
  BLACK,
} from '../../generals/constants/colors';
import {NavigationScreenProps} from 'react-navigation';
import {Toolbar} from '../../generals/components';
import {Text, Button} from '../../generals/core-ui';
import {
  MEDIUM_FONT_SIZE,
  HEADER_FONT_SIZE,
  LARGE_FONT_SIZE,
} from '../../generals/constants/size';
import CountDown from 'react-native-countdown-component';
import {linearEasingShort} from '../../generals/constants/animationConfig';
import SubMaxResultModal from './components/SubMaxResultModal';

type Props = NavigationScreenProps & {};

type State = {
  initCountFinish: boolean;
  easyInputDisable: boolean;
  modInputDisable: boolean;
  hardInputDisable: boolean;
  easyCount: boolean;
  modCount: boolean;
  hardCount: boolean;
  easyValue: string;
  modValue: string;
  hardValue: string;
  MHRResult: number;
  resultModalVisible: boolean;
};

export default class SubMaxTestScene extends Component<Props, State> {
  state = {
    initCountFinish: false,
    easyInputDisable: true,
    modInputDisable: true,
    hardInputDisable: true,
    easyCount: false,
    modCount: false,
    hardCount: false,
    easyValue: '',
    modValue: '',
    hardValue: '',
    MHRResult: 0,
    resultModalVisible: false,
  };

  _reference =
    'https://heartzones.com/wp-content/uploads/2016/03/hz-white-paper-1.pdf';

  render() {
    let {navigation} = this.props;
    let {
      initCountFinish,
      easyInputDisable,
      modInputDisable,
      hardInputDisable,
      easyCount,
      modCount,
      hardCount,
      easyValue,
      modValue,
      hardValue,
      MHRResult,
      resultModalVisible,
    } = this.state;

    let isEasyCurr = easyCount && !modCount;
    let isModCurr = modCount && !hardCount;
    let isHardCurr = hardCount;

    let easyButtonDisable = !isEasyCurr || !easyValue;
    let modButtonDisable = !isModCurr || !modValue;
    let hardButtonDisable = !isHardCurr || !hardValue;

    return (
      <View style={styles.root}>
        <Toolbar navigation={navigation} title="Sub Max Test" />
        {!initCountFinish && (
          <View style={styles.fillStyle}>
            <Text
              fontSize={LARGE_FONT_SIZE}
              style={{marginBottom: 10, color: BLUE}}
            >
              Your test will start in
            </Text>
            <CountDown
              until={5}
              timeToShow={['S']}
              onFinish={this._onInitialCountdownFinish}
              size={70}
              timeLabels={{s: ''}}
              showSeparator={true}
              digitTxtStyle={{fontFamily: 'Lato-Bold', color: BLUE}}
              digitStyle={{
                backgroundColor: 'transparent',
              }}
            />
          </View>
        )}

        <View style={[styles.countContainer]}>
          <View
            style={[
              styles.sectionContainer,
              isEasyCurr && styles.activeSection,
            ]}
          >
            <View style={styles.rowSectionContainer}>
              <Text
                fontWeight="bold"
                fontSize={HEADER_FONT_SIZE}
                style={{flex: 1, color: isEasyCurr ? BLACK : LIGHT_GREY}}
              >
                EASY
              </Text>
              <TestCountDown
                onFinish={this._activateEasyInput}
                running={isEasyCurr}
              />
            </View>
            <View style={styles.rowSectionContainer}>
              <View
                style={[
                  styles.HRInputContainer,
                  !easyInputDisable && styles.activeInput,
                ]}
              >
                <TextInput
                  style={styles.textInput}
                  placeholder="input heart rate..."
                  editable={!easyInputDisable}
                  value={easyValue}
                  onChangeText={this._onChangeEasy}
                />
              </View>
              <Button
                onPress={this._goToModerate}
                style={easyButtonDisable && styles.disabledButton}
                disabled={easyButtonDisable}
              >
                Next
              </Button>
            </View>
          </View>

          <View
            style={[styles.sectionContainer, isModCurr && styles.activeSection]}
          >
            <View style={styles.rowSectionContainer}>
              <Text
                fontWeight="bold"
                fontSize={HEADER_FONT_SIZE}
                style={{flex: 1, color: isModCurr ? BLACK : LIGHT_GREY}}
              >
                MODERATE
              </Text>
              <TestCountDown
                onFinish={this._activateModInput}
                running={isModCurr}
              />
            </View>
            <View style={styles.rowSectionContainer}>
              <View
                style={[
                  styles.HRInputContainer,
                  !modInputDisable && styles.activeInput,
                ]}
              >
                <TextInput
                  style={styles.textInput}
                  placeholder="input heart rate..."
                  editable={!modInputDisable}
                  value={modValue}
                  onChangeText={this._onChangeMod}
                />
              </View>
              <Button
                onPress={this._goToHard}
                style={modButtonDisable && styles.disabledButton}
                disabled={modButtonDisable}
              >
                Next
              </Button>
            </View>
          </View>

          <View
            style={[
              styles.sectionContainer,
              isHardCurr && styles.activeSection,
            ]}
          >
            <View style={styles.rowSectionContainer}>
              <Text
                fontWeight="bold"
                fontSize={HEADER_FONT_SIZE}
                style={{flex: 1, color: isHardCurr ? BLACK : LIGHT_GREY}}
              >
                HARD
              </Text>
              <TestCountDown
                onFinish={this._activateHardInput}
                running={isHardCurr}
              />
            </View>
            <View style={styles.rowSectionContainer}>
              <View
                style={[
                  styles.HRInputContainer,
                  !hardInputDisable && styles.activeInput,
                ]}
              >
                <TextInput
                  style={styles.textInput}
                  placeholder="input heart rate..."
                  editable={!hardInputDisable}
                  value={hardValue}
                  onChangeText={this._onChangeHard}
                />
              </View>
              <Button
                onPress={this._onSubmitResult}
                style={hardButtonDisable && styles.disabledButton}
                disabled={hardButtonDisable}
              >
                Finish
              </Button>
            </View>
          </View>
        </View>

        <SubMaxResultModal
          visible={resultModalVisible}
          subMaxResult={MHRResult}
          onUpdatePress={this._goToProfile}
          onRequestClose={this._toggleModalVisible}
        />
      </View>
    );
  }

  _onInitialCountdownFinish = () => {
    LayoutAnimation.configureNext(linearEasingShort);
    this.setState({initCountFinish: true, easyCount: true});
  };

  _activateEasyInput = () => {
    this.setState({easyInputDisable: false});
  };
  _activateModInput = () => {
    this.setState({modInputDisable: false});
  };
  _activateHardInput = () => {
    this.setState({hardInputDisable: false});
  };

  _goToModerate = () => {
    this.setState({
      easyInputDisable: true,
      modCount: true,
    });
  };
  _goToHard = () => {
    this.setState({
      modInputDisable: true,
      hardCount: true,
    });
  };

  _onChangeEasy = (value: string) => {
    this.setState({easyValue: value});
  };
  _onChangeMod = (value: string) => {
    this.setState({modValue: value});
  };
  _onChangeHard = (value: string) => {
    this.setState({hardValue: value});
  };
  _onSubmitResult = () => {
    let {easyValue, modValue, hardValue} = this.state;
    let MHR =
      (Number.parseInt(easyValue, 10) +
        60 +
        (Number.parseInt(modValue, 10) + 40) +
        (Number.parseInt(hardValue, 10) + 20)) /
      3;
    this.setState({
      resultModalVisible: true,
      MHRResult: MHR,
    });
    // console.log(Math.floor(MHR));
  };
  _toggleModalVisible = () => {
    this.setState({resultModalVisible: !this.state.resultModalVisible});
  };
  _goToProfile = () => {
    this.props.navigation.navigate('profileHome');
  };
}

type TestCountDownProps = {
  onFinish: () => void;
  running: boolean;
};
function TestCountDown({onFinish, running}: TestCountDownProps) {
  return (
    <CountDown
      until={2 * 60}
      // until={10}
      timeToShow={['M', 'S']}
      onFinish={onFinish}
      size={30}
      timeLabels={{h: '', m: '', s: ''}}
      showSeparator={true}
      separatorStyle={{
        paddingHorizontal: 10,
        fontFamily: 'Lato-Bold',
        color: running ? BLUE : LIGHT_GREY,
        marginBottom: 10,
      }}
      timeLabelStyle={{color: BLUE}}
      digitTxtStyle={{
        fontFamily: 'Lato-Bold',
        color: running ? BLUE : LIGHT_GREY,
      }}
      digitStyle={{
        backgroundColor: 'transparent',
      }}
      running={running}
    />
  );
}

const shadowSettings = {
  shadowColor: BLUE,
  shadowOpacity: 0.3,
  shadowRadius: 5,
  shadowOffset: {width: 0, height: 5},
  elevation: 5,
};

const styles = StyleSheet.create({
  root: {flex: 1},
  fillStyle: {
    zIndex: 1,
    backgroundColor: WHITE,
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  countContainer: {
    alignItems: 'center',
    height: '100%',
    width: '100%',
    flex: 1,
    padding: 20,
  },
  sectionContainer: {
    width: '100%',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: LIGHT_GREY,
    backgroundColor: LIGHTER_GREY,
    marginBottom: 30,
  },
  rowSectionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  activeSection: {
    borderColor: BLUE,
    backgroundColor: WHITE,
    ...shadowSettings,
  },
  HRInputContainer: {
    flex: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: LIGHT_GREY,
    marginRight: 10,
  },
  activeInput: {
    borderColor: BLUE,
  },
  textInput: {
    height: 20,
    fontSize: MEDIUM_FONT_SIZE,
    flex: 1,
    color: BLACK,
    fontFamily: 'Lato-Regular',
  },
  disabledButton: {
    backgroundColor: LIGHT_GREY,
    borderColor: WHITE,
  },
});
