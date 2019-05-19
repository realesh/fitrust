import React, {Component} from 'react';
import {
  View,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  AsyncStorage,
  ActivityIndicator,
} from 'react-native';
import {NavigationScreenProps} from 'react-navigation';
import {Text, Avatar} from '../../generals/core-ui';
import {LARGE_FONT_SIZE, SCREEN_WIDTH} from '../../generals/constants/size';
import {
  WHITE,
  GREY,
  LIGHTER_GREY,
  LIGHT_GREY,
  BLUE,
} from '../../generals/constants/colors';
import {trophyCopper} from '../../assets/images/profile';
import PopupInfoDialog from '../../generals/components/PopupInfoDialog';
import {infoBMI, infoMHR, DEFAULT_USER_PROFILE} from './data/profileData';
import BMIInsight from './components/BMIInsight';
import MHRInsight from './components/MHRInsight';
import CollapsibleSettings from './components/CollapsibleSettings';
import FancyRibbonButton from './components/FancyRibbonButton';
// import {settingsItems} from './data/settingsDataFixtures';
import ExerciseModePlaceholder from './components/ExerciseModePlaceholder';
import {Query} from 'react-apollo';
import {
  UserProfileResponse,
  UserProfileVariables,
  USER_PROFILE,
} from '../../graphql/queries/profile';
import {SettingsItem} from './data/settingsDataFixtures';
import LogoutModal from './components/LogoutModal';

type Props = NavigationScreenProps;

type State = {
  bmiModalVisible: boolean;
  mhrModalVisible: boolean;
  logoutModalVisible: boolean;
  activeIndex: number;
  userID: string;
};

export default class ProfileScene extends Component<Props, State> {
  state = {
    bmiModalVisible: false,
    mhrModalVisible: false,
    logoutModalVisible: false,
    activeIndex: 0,
    userID: '',
  };

  _scrollView?: ScrollView;

  componentDidMount() {
    this._getID();
  }

  _getID = async () => {
    let userID = await AsyncStorage.getItem('userID');
    userID && this.setState({userID});
  };

  render() {
    let {bmiModalVisible, mhrModalVisible, logoutModalVisible} = this.state;

    return (
      <Query<UserProfileResponse, UserProfileVariables>
        query={USER_PROFILE}
        variables={{userID: this.state.userID}}
      >
        {({data, loading}) => {
          let result =
            (data && data.user && data.user.profile) || DEFAULT_USER_PROFILE;

          let goToProfile = () => {
            this.props.navigation.navigate('editProfile', {
              name: result.name,
              titleFirst: result.titleFirst,
              titleMiddle: result.titleMiddle,
              titleLast: result.titleLast,
              avatarUrl: result.avatarUrl,
              previous_scene: 'Profile',
            });
          };
          let goToChangePassword = () => {
            this.props.navigation.navigate('changePassword', {
              previous_scene: 'Profile',
            });
          };

          const settingsItems: Array<SettingsItem> = [
            {
              title: 'Edit Profile',
              goTo: goToProfile,
            },
            {
              title: 'Change Password',
              goTo: goToChangePassword,
            },
          ];

          return loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator color={BLUE} size="large" />
            </View>
          ) : (
            <ScrollView
              contentContainerStyle={styles.root}
              showsHorizontalScrollIndicator={false}
              bounces={false}
              horizontal={true}
              pagingEnabled={true}
              scrollEnabled={false}
              ref={this._setScrollViewRef}
            >
              <View style={styles.horizontalPage}>
                <CollapsibleSettings
                  settingsItems={settingsItems}
                  navigation={this.props.navigation}
                  logountFunc={this._toggleLogoutModal}
                />
                <View style={styles.scrollHeight}>
                  <View style={styles.paddedContainer}>
                    <Avatar
                      size="big"
                      source={result.avatarUrl}
                      style={{marginBottom: 10}}
                    />
                    <Text fontWeight="bold" fontSize={LARGE_FONT_SIZE}>
                      {result.name}
                    </Text>
                    <Text style={{color: GREY, marginTop: 5, marginBottom: 20}}>
                      {`${result.titleFirst} ${result.titleMiddle} ${
                        result.titleLast
                      }`}
                    </Text>

                    <View style={styles.insightContainer}>
                      <View style={styles.insightItemContainer}>
                        <View
                          style={{flexDirection: 'row', alignItems: 'center'}}
                        >
                          <Image
                            source={trophyCopper}
                            style={{width: 24, height: 24}}
                          />
                          <Text fontWeight="bold" fontSize={LARGE_FONT_SIZE}>
                            36
                          </Text>
                        </View>
                        <Text style={{color: GREY, marginTop: 5}}>Ranking</Text>
                      </View>
                      <View
                        style={[
                          styles.insightItemContainer,
                          styles.insightItemMiddle,
                        ]}
                      >
                        <Text fontWeight="bold" fontSize={LARGE_FONT_SIZE}>
                          {result.points}
                        </Text>
                        <Text style={{color: GREY, marginTop: 5}}>Points</Text>
                      </View>
                      <TouchableOpacity
                        style={styles.insightItemContainer}
                        activeOpacity={0.6}
                        onPress={this._goToBadges}
                      >
                        <Text fontWeight="bold" fontSize={LARGE_FONT_SIZE}>
                          {result.badges.length}
                        </Text>
                        <Text style={{color: GREY, marginTop: 5}}>Badges</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>

                <View style={styles.contentContainer}>
                  <View style={styles.paddedContainer}>
                    <BMIInsight
                      onPress={this._toggleBMIModal}
                      BMIValue={result.bmi}
                    />
                  </View>
                  <View style={styles.flexRow}>
                    <MHRInsight
                      onPress={this._toggleMHRModal}
                      dob={result.dob}
                    />
                    <FancyRibbonButton
                      onPress={this._togglePage}
                      position="right"
                      content="Exercise Mode"
                      buttonColor={BLUE}
                      textColor={WHITE}
                      parentContainerBackgroundColor={LIGHTER_GREY}
                    />
                  </View>
                </View>
              </View>

              <View style={[styles.horizontalPage, styles.exercisePage]}>
                <FancyRibbonButton
                  onPress={this._togglePage}
                  position="left"
                  content="Back to Profile"
                  buttonColor={WHITE}
                  textColor={BLUE}
                  parentContainerBackgroundColor={BLUE}
                />
                <ExerciseModePlaceholder navigation={this.props.navigation} />
              </View>

              <PopupInfoDialog
                visible={bmiModalVisible}
                title={infoBMI.title}
                message={infoBMI.message}
                onRequestClose={this._toggleBMIModal}
                buttonOnPress={this._goToBMI}
                buttonTitle="Recalculate"
              />
              <PopupInfoDialog
                visible={mhrModalVisible}
                title={infoMHR.title}
                message={infoMHR.message}
                onRequestClose={this._toggleMHRModal}
              />
              <LogoutModal
                visible={logoutModalVisible}
                onOKPress={this._logoutFunc}
                onRequestClose={this._toggleLogoutModal}
              />
            </ScrollView>
          );
        }}
      </Query>
    );
  }

  _logoutFunc = () =>
    this.props.navigation.navigate('authField', {command: 'logout'});

  _goToBMI = () => {
    let {navigation} = this.props;
    this.setState({bmiModalVisible: false});
    navigation.navigate('BMICalculator', {previous_scene: 'Profile'});
  };

  _goToBadges = () => {
    let {navigation} = this.props;
    navigation.navigate('badgesList', {
      previous_scene: 'Profile',
      userID: this.state.userID,
    });
  };

  _toggleBMIModal = () => {
    this.setState({bmiModalVisible: !this.state.bmiModalVisible});
  };
  _toggleMHRModal = () => {
    this.setState({mhrModalVisible: !this.state.mhrModalVisible});
  };
  _toggleLogoutModal = () => {
    this.setState({logoutModalVisible: !this.state.logoutModalVisible});
  };

  _setScrollViewRef = (scrollView: ScrollView) =>
    (this._scrollView = scrollView);

  _togglePage = () => {
    let toIndex = this.state.activeIndex === 0 ? 1 : 0;
    this.setState({activeIndex: toIndex});
    this._scrollView &&
      this._scrollView.scrollTo({
        x: toIndex * SCREEN_WIDTH,
        animated: true,
      });
  };
}

const styles = StyleSheet.create({
  flexRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 20,
    backgroundColor: 'transparent',
  },
  root: {
    flexGrow: 1,
  },
  horizontalPage: {
    width: SCREEN_WIDTH,
  },
  exercisePage: {
    paddingTop: 20,
    backgroundColor: BLUE,
  },
  scrollHeight: {
    backgroundColor: WHITE,
  },
  paddedContainer: {
    alignItems: 'center',
    paddingHorizontal: 20,
    overflow: 'visible',
  },
  insightContainer: {
    flexDirection: 'row',
    width: '100%',
    marginBottom: 20,
  },
  insightItemContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  insightItemMiddle: {
    borderLeftWidth: 2,
    borderRightWidth: 2,
    borderColor: LIGHTER_GREY,
  },
  contentContainer: {
    flex: 1,
    paddingVertical: 20,
    backgroundColor: LIGHTER_GREY,
    borderTopWidth: 1,
    borderColor: LIGHT_GREY,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
  },
});
