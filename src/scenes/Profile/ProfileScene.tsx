import React, {Component} from 'react';
import {
  View,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
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
import {infoBMI, infoMHR} from './data/profileData';
import BMIInsight from './components/BMIInsight';
import MHRInsight from './components/MHRInsight';
import CollapsibleSettings from './components/CollapsibleSettings';
import FancyRibbonButton from './components/FancyRibbonButton';
import {settingsItems} from './data/settingsDataFixtures';
import ExerciseModePlaceholder from './components/ExerciseModePlaceholder';

type Props = NavigationScreenProps;

type State = {
  bmiModalVisible: boolean;
  mhrModalVisible: boolean;
  activeIndex: number;
};

export default class ProfileScene extends Component<Props, State> {
  state = {
    bmiModalVisible: false,
    mhrModalVisible: false,
    activeIndex: 0,
  };

  _scrollView?: ScrollView;

  render() {
    let {bmiModalVisible, mhrModalVisible} = this.state;

    return (
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
          />
          <View style={styles.scrollHeight}>
            <View style={styles.paddedContainer}>
              <Avatar
                size="big"
                source="https://pbs.twimg.com/profile_images/378800000500168907/7cba3b0f55df5a1a5458c18ba4a5d4a9_400x400.jpeg"
                style={{marginBottom: 10}}
              />
              <Text fontWeight="bold" fontSize={LARGE_FONT_SIZE}>
                Samuel Sandro
              </Text>
              <Text style={{color: GREY, marginTop: 5, marginBottom: 20}}>
                Health Trainee
              </Text>

              <View style={styles.insightContainer}>
                <View style={styles.insightItemContainer}>
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
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
                    2,517
                  </Text>
                  <Text style={{color: GREY, marginTop: 5}}>Points</Text>
                </View>
                <TouchableOpacity
                  style={styles.insightItemContainer}
                  activeOpacity={0.6}
                  onPress={this._goToBadges}
                >
                  <Text fontWeight="bold" fontSize={LARGE_FONT_SIZE}>
                    2
                  </Text>
                  <Text style={{color: GREY, marginTop: 5}}>Badges</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          <View style={styles.contentContainer}>
            <View style={styles.paddedContainer}>
              <BMIInsight onPress={this._toggleBMIModal} />
            </View>
            <View style={styles.flexRow}>
              <MHRInsight onPress={this._toggleMHRModal} />
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
      </ScrollView>
    );
  }

  _goToBMI = () => {
    let {navigation} = this.props;
    this.setState({bmiModalVisible: false});
    navigation.navigate('BMICalculator', {previous_scene: 'Profile'});
  };

  _goToBadges = () => {
    let {navigation} = this.props;
    navigation.navigate('badgesList', {previous_scene: 'Profile'});
  };

  _toggleBMIModal = () => {
    this.setState({bmiModalVisible: !this.state.bmiModalVisible});
  };
  _toggleMHRModal = () => {
    this.setState({mhrModalVisible: !this.state.mhrModalVisible});
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
});
