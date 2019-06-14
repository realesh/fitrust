import React, {Component} from 'react';
import {View, StyleSheet, ScrollView} from 'react-native';
import {
  BLUE,
  WHITE,
  LIGHTER_GREY,
  LIGHT_GREY,
  GREY,
} from '../../generals/constants/colors';
import {NavigationScreenProp} from 'react-navigation';
import {Toolbar} from '../../generals/components';
import {Text, Button} from '../../generals/core-ui';
import {
  MEDIUM_FONT_SIZE,
  HEADER_FONT_SIZE,
} from '../../generals/constants/size';
import {LinearGradient} from 'expo';

type Props = {
  navigation: NavigationScreenProp<any>;
};

type State = {};

export default class SubMaxPlaceholder extends Component<Props, State> {
  state = {};

  _reference =
    'https://heartzones.com/wp-content/uploads/2016/03/hz-white-paper-1.pdf';

  render() {
    let {navigation} = this.props;

    return (
      <View style={styles.root}>
        <Toolbar navigation={navigation} />
        <View style={styles.headerContainer}>
          <Text
            fontWeight="bold"
            fontSize={HEADER_FONT_SIZE}
            style={{marginBottom: 3}}
          >
            Sub Max Test
          </Text>
          <Text fontWeight="regular" fontSize={MEDIUM_FONT_SIZE}>
            Easy - Moderate - Hard
          </Text>
        </View>
        <LinearGradient
          colors={['#eee', 'rgba(255,255,255,0)']}
          style={styles.shadowBox}
        />

        <ScrollView
          contentContainerStyle={[styles.scroll, styles.paddedContainer]}
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          <Text style={styles.contentText}>
            {
              'Hey there,\nyou are about to enter an easy-moderate-hard Sub Max Test. '
            }
            {
              'This test is aimed to measure your Maximum Heart Rate (MHR) by going through several steps of field test.'
            }
          </Text>
          <Text style={styles.contentText}>
            {
              'By using this test, you are able to get a more precise result since the test is going to measure '
            }
            {'your personal fitness level through each step in the process'}
          </Text>
          <Text style={styles.contentText}>
            {
              'Below are the steps listed that you need to complete in order to get your MHR number:'
            }
          </Text>

          <View style={styles.tableRow}>
            <View style={styles.numContainer}>
              <Text fontWeight="bold" fontSize={MEDIUM_FONT_SIZE}>
                1
              </Text>
            </View>
            <View style={styles.stepDescContainer}>
              <Text>
                Warm up adequately for 5-10 min (do this before you start the
                test)
              </Text>
            </View>
          </View>
          <View style={styles.tableRow}>
            <View style={styles.numContainer}>
              <Text fontWeight="bold" fontSize={MEDIUM_FONT_SIZE}>
                2
              </Text>
            </View>
            <View style={styles.stepDescContainer}>
              <Text>
                EASY: Select any cardiovascular activity that you enjoy such as
                walk-jog-run. Do that activity for 2-minutes or one lap around a
                track at a easy to moderate effort or with a Rating od Perceived
                Exertion (RPE) of 1-3. Input your peak heart-rate at the end of
                2-minutes.
              </Text>
            </View>
          </View>
          <View style={styles.tableRow}>
            <View style={styles.numContainer}>
              <Text fontWeight="bold" fontSize={MEDIUM_FONT_SIZE}>
                3
              </Text>
            </View>
            <View style={styles.stepDescContainer}>
              <Text>
                MODERATE: Do the same activity for the next 2-minutes or one lap
                and increase your effort to a level that feels "moderate to
                somewhat hard" RPE of 4-6. Input your peak heart-rate at the end
                of 2-minutes.
              </Text>
            </View>
          </View>
          <View style={styles.tableRow}>
            <View style={styles.numContainer}>
              <Text fontWeight="bold" fontSize={MEDIUM_FONT_SIZE}>
                4
              </Text>
            </View>
            <View style={styles.stepDescContainer}>
              <Text>
                HARD: Do the same activity for the next 2-minutes or one lap and
                increase your effort to a level that feels "HARD" to "Very
                Hard!" RPE of 6-7. Input your peak heart-rate at the end of
                2-minutes.
              </Text>
            </View>
          </View>
          <View style={[styles.tableRow, styles.marginBottom]}>
            <View style={styles.numContainer}>
              <Text fontWeight="bold" fontSize={MEDIUM_FONT_SIZE}>
                5
              </Text>
            </View>
            <View style={styles.stepDescContainer}>
              <Text>See your MHR number.</Text>
            </View>
          </View>
          <Text style={styles.contentText}>
            Below are the RPE table to describe your feeling of effort:
          </Text>
          <View style={styles.RPETable}>
            <RPEHeader />
            <RPETableRow num={0} desc="Rest" />
            <RPETableRow num={1} desc="Really Easy" />
            <RPETableRow num={2} desc="Easy" />
            <RPETableRow num={3} desc="Moderate" />
            <RPETableRow num={4} desc="Sort of Hard" />
            <RPETableRow num={5} desc="Hard" />
            <RPETableRow num={6} desc="HARD" />
            <RPETableRow num={7} desc="Very Hard!" />
            <RPETableRow num={8} desc="At My Limit!" />
            <RPETableRow num={9} desc="Past My Limit!" />
            <RPETableRow num={10} desc="Destroyed" />
          </View>
          <Text style={styles.contentText}>
            Press start once you're ready and have done your warm up.
          </Text>
          <Button onPress={this._startTest} fontColor={WHITE}>
            START
          </Button>
          <Text style={styles.marginTop}>References:</Text>
          <Text style={styles.blueText} onPress={this._onReferencePress}>
            {this._reference}
          </Text>
        </ScrollView>
      </View>
    );
  }
  _onReferencePress = () => {
    this.props.navigation.navigate('webView', {
      previous_scene: 'Dashboard',
      uri: this._reference,
      title: '',
    });
  };
  _startTest = () => {
    this.props.navigation.navigate('subMaxTest', {
      previous_scene: 'subMaxPlaceholder',
    });
  };
}

type RPERowProps = {num: number; desc: string};
function RPETableRow({num, desc}: RPERowProps) {
  return (
    <View style={[styles.RPETableRow, num % 2 === 0 && styles.RPEEvenRow]}>
      <View style={styles.RPENumContainer}>
        <Text fontWeight="bold">{num}</Text>
      </View>
      <View style={styles.rpeTableDesc}>
        <Text>{desc}</Text>
      </View>
    </View>
  );
}
function RPEHeader() {
  return (
    <View style={styles.RPETableHeader}>
      <View style={styles.RPENumContainer}>
        <Text fontWeight="bold">RPE</Text>
      </View>
      <View style={styles.rpeTableDesc}>
        <Text fontWeight="bold">Description</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {flex: 1},
  scroll: {flexGrow: 1},
  paddedContainer: {padding: 20},
  contentText: {marginBottom: 10},
  blueText: {color: BLUE},
  tableRow: {flexDirection: 'row', marginTop: 10},
  numContainer: {
    width: 25,
  },
  stepDescContainer: {
    flex: 1,
  },
  headerContainer: {
    height: 80,
    paddingHorizontal: 20,
  },
  shadowBox: {
    width: '100%',
    height: 20,
    position: 'absolute',
    top: 140,
  },
  marginBottom: {marginBottom: 20},
  RPETable: {
    width: '80%',
    borderWidth: 1,
    borderColor: GREY,
    borderRadius: 5,
    alignSelf: 'center',
    overflow: 'hidden',
    marginBottom: 20,
  },
  RPENumContainer: {
    height: 30,
    width: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    borderRightWidth: 1,
    borderRightColor: LIGHT_GREY,
  },
  RPETableRow: {flexDirection: 'row'},
  RPETableHeader: {flexDirection: 'row', backgroundColor: LIGHT_GREY},
  RPEEvenRow: {backgroundColor: LIGHTER_GREY},
  rpeTableDesc: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  marginTop: {marginTop: 10, marginBottom: 0},
});
