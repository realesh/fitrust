import React, {Component} from 'react';
import {View, StyleSheet, ScrollView, Image} from 'react-native';
import {NavigationScreenProps} from 'react-navigation';
import {Text, Avatar} from '../../generals/core-ui';
import {SCREEN_HEIGHT, LARGE_FONT_SIZE} from '../../generals/constants/size';
import {
  WHITE,
  GREY,
  LIGHTER_GREY,
  LIGHT_GREY,
} from '../../generals/constants/colors';
import {trophyCopper} from '../../assets/images/profile';
import PopupDialog from '../../generals/components/PopupDialog';
import {infoBMI, infoMHR, infoMission} from './data/profileData';
import BMIInsight from './components/BMIInsight';
import MHRInsight from './components/MHRInsight';
import MissionInsight from './components/MissionInsight';

type Props = NavigationScreenProps;

type State = {
  bmiModalVisible: boolean;
  mhrModalVisible: boolean;
  missionModalVisible: boolean;
};

export default class ProfileScene extends Component<Props, State> {
  state = {
    bmiModalVisible: false,
    mhrModalVisible: false,
    missionModalVisible: false,
  };

  render() {
    let {bmiModalVisible, mhrModalVisible, missionModalVisible} = this.state;

    return (
      <ScrollView
        contentContainerStyle={styles.root}
        showsVerticalScrollIndicator={false}
        pagingEnabled={true}
      >
        <View style={styles.scrollHeight}>
          <View style={styles.paddedContainer}>
            <Avatar size="big" style={{marginBottom: 10}} />
            <Text fontWeight="bold" fontSize={LARGE_FONT_SIZE}>
              Samuel Sandro
            </Text>
            <Text style={{color: GREY, marginTop: 5, marginBottom: 30}}>
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
                style={[styles.insightItemContainer, styles.insightItemMiddle]}
              >
                <Text fontWeight="bold" fontSize={LARGE_FONT_SIZE}>
                  2,517
                </Text>
                <Text style={{color: GREY, marginTop: 5}}>Points</Text>
              </View>
              <View style={styles.insightItemContainer}>
                <Text fontWeight="bold" fontSize={LARGE_FONT_SIZE}>
                  2
                </Text>
                <Text style={{color: GREY, marginTop: 5}}>Badges</Text>
              </View>
            </View>
          </View>
          <View style={[styles.paddedContainer, styles.contentContainer]}>
            <BMIInsight onPress={this._toggleBMIModal} />
            <View style={styles.flexRow}>
              <MHRInsight onPress={this._toggleMHRModal} />
              <MissionInsight onPress={this._toggleMissionModal} />
            </View>
          </View>
        </View>
        <PopupDialog
          visible={bmiModalVisible}
          title={infoBMI.title}
          message={infoBMI.message}
          onRequestClose={this._toggleBMIModal}
          buttonTitle="Recalculate"
          buttonOnPress={this._goToBMI}
        />
        <PopupDialog
          visible={mhrModalVisible}
          title={infoMHR.title}
          message={infoMHR.message}
          onRequestClose={this._toggleMHRModal}
        />
        <PopupDialog
          visible={missionModalVisible}
          title={infoMission.title}
          message={infoMission.message}
          onRequestClose={this._toggleMissionModal}
        />
      </ScrollView>
    );
  }

  _goToBMI = () => {
    let {navigation} = this.props;
    this.setState({bmiModalVisible: false});
    navigation.navigate('BMRCalculator', {previous_scene: 'Profile'});
  };

  _toggleBMIModal = () => {
    this.setState({bmiModalVisible: !this.state.bmiModalVisible});
  };
  _toggleMHRModal = () => {
    this.setState({mhrModalVisible: !this.state.mhrModalVisible});
  };
  _toggleMissionModal = () => {
    this.setState({missionModalVisible: !this.state.missionModalVisible});
  };
}

const styles = StyleSheet.create({
  flexRow: {flexDirection: 'row'},
  root: {
    flexGrow: 1,
  },
  scrollHeight: {
    height: SCREEN_HEIGHT - 65,
    backgroundColor: WHITE,
  },
  paddedContainer: {
    alignItems: 'center',
    paddingTop: 20,
    paddingHorizontal: 20,
    backgroundColor: WHITE,
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
