import React, {Component} from 'react';
import {View, StyleSheet, ScrollView, Image} from 'react-native';
import {NavigationScreenProps} from 'react-navigation';
import {Text, Avatar, Button} from '../../generals/core-ui';
import {
  SCREEN_HEIGHT,
  LARGE_FONT_SIZE,
  SMALL_FONT_SIZE,
} from '../../generals/constants/size';
import {
  WHITE,
  GREY,
  RED,
  GREEN,
  LIGHTER_GREY,
  LIGHT_GREY,
} from '../../generals/constants/colors';
import {trophyCopper, heartRate} from '../../assets/images/profile';
import PopupDialog from '../../generals/components/PopupDialog';
import {infoBMI, infoMHR} from './data/profileData';

type Props = NavigationScreenProps;

export default class ProfileScene extends Component<Props> {
  state = {
    bmiModalVisible: false,
    mhrModalVisible: false,
  };

  render() {
    let {bmiModalVisible, mhrModalVisible} = this.state;

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
              <View style={styles.insightItemContainer}>
                <Text fontWeight="bold" fontSize={LARGE_FONT_SIZE}>
                  250,000
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
            <View style={styles.boxShadow}>
              <Text fontWeight="bold" fontSize={LARGE_FONT_SIZE}>
                32.2{' '}
                <Text fontWeight="bold" style={{color: RED}}>
                  Obese
                </Text>
              </Text>
              <Text
                fontSize={SMALL_FONT_SIZE}
                style={{color: GREY, marginBottom: 15}}
              >
                Your Current BMI
              </Text>

              <View style={styles.bmiBarContainer}>
                <View style={styles.underBar} />
                <View style={styles.normalBar} />
                <View style={styles.overBar} />
                <View style={styles.obeseBar} />
              </View>
              <View style={{flexDirection: 'row', width: '100%'}}>
                <View style={styles.underContainer}>
                  <Text fontSize={SMALL_FONT_SIZE} style={{color: GREY}}>
                    15
                  </Text>
                </View>
                <View style={styles.normalContainer}>
                  <Text fontSize={SMALL_FONT_SIZE} style={{color: GREY}}>
                    18.5
                  </Text>
                </View>
                <View style={styles.overContainer}>
                  <Text fontSize={SMALL_FONT_SIZE} style={{color: GREY}}>
                    25
                  </Text>
                </View>
                <View style={styles.obeseContainer}>
                  <Text fontSize={SMALL_FONT_SIZE} style={{color: GREY}}>
                    30
                  </Text>
                  <Text fontSize={SMALL_FONT_SIZE} style={{color: GREY}}>
                    40
                  </Text>
                </View>
              </View>

              <Button
                iconName="more-horizontal"
                style={styles.optionsButton}
                fontColor={GREY}
                fontSize={LARGE_FONT_SIZE}
                onPress={this._toggleBMIModal}
              />
            </View>
            <View style={{flexDirection: 'row'}}>
              <View style={[styles.boxShadow, styles.mhrContainer]}>
                <Image
                  source={heartRate}
                  style={{width: 30, height: 30, marginRight: 5}}
                />
                <View style={styles.flexColumn}>
                  <Text
                    fontWeight="bold"
                    fontSize={LARGE_FONT_SIZE}
                    style={{color: WHITE}}
                  >
                    198{' '}
                    <Text
                      fontWeight="bold"
                      style={{color: 'rgba(255,255,255,0.5)'}}
                    >
                      BPM
                    </Text>
                  </Text>

                  <Text
                    fontSize={SMALL_FONT_SIZE}
                    style={{color: 'rgba(255,255,255,0.5)'}}
                  >
                    Current MHR
                  </Text>
                </View>

                <Button
                  iconName="more-horizontal"
                  style={styles.optionsButton}
                  fontColor={'rgba(255,255,255,0.5)'}
                  fontSize={LARGE_FONT_SIZE}
                  onPress={this._toggleMHRModal}
                />
              </View>

              <View style={[styles.boxShadow, {flex: 1, marginLeft: 10}]}>
                <Text fontWeight="bold" fontSize={LARGE_FONT_SIZE}>
                  92{' '}
                  <Text fontWeight="bold" style={{color: GREY}}>
                    Kg
                  </Text>
                </Text>

                <Text fontSize={SMALL_FONT_SIZE} style={{color: GREY}}>
                  Weight
                </Text>
              </View>
            </View>
          </View>
        </View>
        <PopupDialog
          visible={bmiModalVisible}
          title={infoBMI.title}
          message={infoBMI.message}
          onRequestClose={this._toggleBMIModal}
          buttonTitle="Recalculate"
        />
        <PopupDialog
          visible={mhrModalVisible}
          title={infoMHR.title}
          message={infoMHR.message}
          onRequestClose={this._toggleMHRModal}
        />
      </ScrollView>
    );
  }

  _toggleBMIModal = () => {
    this.setState({bmiModalVisible: !this.state.bmiModalVisible});
  };
  _toggleMHRModal = () => {
    this.setState({mhrModalVisible: !this.state.mhrModalVisible});
  };
}

const styles = StyleSheet.create({
  flexRow: {flexDirection: 'row'},
  flexColumn: {flexDirection: 'column'},
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
    width: '90%',
    marginBottom: 20,
  },
  insightItemContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentContainer: {
    flex: 1,
    paddingVertical: 20,
    backgroundColor: LIGHTER_GREY,
    borderTopWidth: 1,
    borderColor: LIGHT_GREY,
  },
  boxShadow: {
    backgroundColor: 'white',
    borderRadius: 10,
    marginBottom: 20,
    padding: 20,
    shadowColor: '#ccc',
    shadowOpacity: 0.5,
    shadowRadius: 10,
    shadowOffset: {width: 0, height: 4},
    elevation: 5,
  },
  bmiBarContainer: {
    flexDirection: 'row',
    width: '100%',
    height: 4,
    marginBottom: 3,
  },
  underBar: {
    flex: 3.5,
    backgroundColor: '#4DD2D3',
    borderRadius: 2,
    marginRight: 5,
  },
  normalBar: {
    flex: 6.5,
    backgroundColor: GREEN,
    borderRadius: 2,
    marginRight: 5,
  },
  overBar: {
    flex: 5,
    backgroundColor: '#EFD422',
    borderRadius: 2,
    marginRight: 5,
  },
  obeseBar: {
    flex: 10,
    backgroundColor: RED,
    borderRadius: 4,
  },
  underContainer: {
    flex: 3.5,
    marginRight: 5,
  },
  normalContainer: {
    flex: 6.5,
    marginRight: 5,
  },
  overContainer: {
    flex: 5,
    marginRight: 5,
  },
  obeseContainer: {
    flex: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  optionsButton: {
    position: 'absolute',
    alignItems: 'center',
    right: 15,
    top: 10,
    paddingHorizontal: 0,
    paddingVertical: 0,
    backgroundColor: 'transparent',
  },
  mhrContainer: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
    backgroundColor: RED,
  },
});
