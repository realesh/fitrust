import React, {Component} from 'react';
import {View, StyleSheet, AsyncStorage, ActivityIndicator} from 'react-native';
import {Feather as Icon} from '@expo/vector-icons';
import {AreaChart} from 'react-native-svg-charts';
import {Path, Circle} from 'react-native-svg';
import * as shape from 'd3-shape';
import {Text} from '../../generals/core-ui';
import {MEDIUM_FONT_SIZE, SMALL_FONT_SIZE} from '../../generals/constants/size';
import {
  BLUE,
  LIGHT_GREY,
  GREY,
  WHITE,
  DARK_GREY70,
  LIGHTER_GREY,
  GREEN,
  RED,
} from '../../generals/constants/colors';
import SummaryInsights from './components/SummaryInsights';
import {
  TodayActivitiesResponseSummary,
  DEFAULT_TOTAL_DISTANCES,
} from '../../helpers/Fetchers/fetchTodayActivities';
import {
  fetchThisWeekSteps,
  fetchLastWeekSteps,
} from '../../helpers/Fetchers/fetchWeeklySteps';

type StepNumber = number | null;
type DecoratorProps = {
  x: string | number | undefined;
  y: string | number | undefined;
  cx?: number | string;
  cy?: number | string;
  r?: number | string;
  data?: Array<StepNumber>;
};
type LineProps = {line?: string};

type Comparison = {
  type: 'trending-up' | 'trending-down' | 'minus';
  value: number;
  color: string;
};

// type Props = NavigationScreenProps;
type Props = Partial<TodayActivitiesResponseSummary> & {};

type State = {
  loading: boolean;
  thisWeekData: Array<number | undefined>;
  lastWeekData: Array<number | undefined>;
  biggestNumberStep: number;
  comparison: Comparison;
};

export default class StepsChartPage extends Component<Props, State> {
  state: State = {
    loading: true,
    thisWeekData: [],
    lastWeekData: [],
    biggestNumberStep: 0,
    comparison: {
      type: 'minus',
      value: 0,
      color: LIGHT_GREY,
    },
  };

  componentDidMount() {
    this._fetchWeeklyStep();
  }

  _fetchWeeklyStep = async () => {
    let fitbitUserID = await AsyncStorage.getItem('fitbit_user_id');
    let fitbitAccessToken = await AsyncStorage.getItem('fitbit_access_token');
    if (fitbitUserID && fitbitAccessToken) {
      let thisWeekResponse = await fetchThisWeekSteps(
        fitbitUserID,
        fitbitAccessToken,
      );
      let lastWeekResponse = await fetchLastWeekSteps(
        fitbitUserID,
        fitbitAccessToken,
      );
      let thisWeekSteps = thisWeekResponse['activities-steps'].map((step) =>
        Number.parseInt(step.value, 10),
      );
      let lastWeekSteps = lastWeekResponse['activities-steps'].map((step) =>
        Number.parseInt(step.value, 10),
      );

      let biggestNumberStep = 0;
      thisWeekSteps.forEach((step) => {
        if (step > biggestNumberStep) {
          biggestNumberStep = step;
        }
      });
      lastWeekSteps.forEach((step) => {
        if (step > biggestNumberStep) {
          biggestNumberStep = step;
        }
      });

      let lastNumIndex = 0;
      thisWeekSteps.forEach((step, index) => {
        if (thisWeekSteps.length === index + 1 && thisWeekSteps[index] !== 0) {
          lastNumIndex = thisWeekSteps.length;
        } else {
          if (step !== 0 && thisWeekSteps[index + 1] === 0) {
            lastNumIndex = index;
          }
        }
      });

      let thisWeekData = [
        biggestNumberStep / 2,
        biggestNumberStep / 2,
        ...thisWeekSteps.map((step, index) => {
          if (index > lastNumIndex) {
            return undefined;
          }
          return step;
        }),
        undefined,
        undefined,
      ];
      let lastWeekData = [
        biggestNumberStep / 2,
        biggestNumberStep / 2,
        ...lastWeekSteps,
        biggestNumberStep / 2,
        biggestNumberStep / 2,
      ];

      let thisWeekTotal = thisWeekSteps.reduce((a, b) => a + b);
      let lastWeekTotalUntilToday = lastWeekSteps.reduce((a, b, index) => {
        if (index < new Date().getDay()) {
          return a + b;
        }
        return a;
      });

      let comparison: Comparison = {
        type: 'minus',
        value: 0,
        color: LIGHT_GREY,
      };
      if (thisWeekTotal < lastWeekTotalUntilToday) {
        comparison = {
          type: 'trending-down',
          value:
            thisWeekTotal === 0
              ? 100
              : 100 - ((lastWeekTotalUntilToday / thisWeekTotal) * 100 - 100),
          color: RED,
        };
      } else if (lastWeekTotalUntilToday < thisWeekTotal) {
        comparison = {
          type: 'trending-up',
          value:
            lastWeekTotalUntilToday === 0
              ? 100
              : (thisWeekTotal / lastWeekTotalUntilToday) * 100 - 100,
          color: GREEN,
        };
      }

      this.setState({
        biggestNumberStep,
        thisWeekData,
        lastWeekData,
        comparison,
        loading: false,
      });
    }
  };

  render() {
    let {
      loading,
      biggestNumberStep,
      thisWeekData,
      lastWeekData,
      comparison,
    } = this.state;
    let {distances, floors, steps} = this.props;

    const Line = ({line}: LineProps) => {
      if (line) {
        return (
          <Path
            key={'line'}
            d={line}
            stroke={LIGHT_GREY}
            fill={'none'}
            strokeWidth={3}
          />
        );
      }
      return null;
    };
    const LinePrimary = ({line}: LineProps) => {
      if (line) {
        return (
          <Path
            key={'line'}
            d={line}
            stroke={BLUE}
            fill={'none'}
            strokeWidth={4}
          />
        );
      }
      return null;
    };

    const Decorator = (props: DecoratorProps) => {
      let {x, y, data} = props;
      if (data) {
        let lastNumIndex = data.length;
        data.forEach((item, index) => {
          if (typeof item === 'number' && !data[index + 1]) {
            lastNumIndex = index;
          }
        });
        return data.map((value, index) => {
          if (index === lastNumIndex) {
            return (
              <Circle
                key={index}
                cx={x(index)}
                cy={y(value)}
                r={8}
                stroke={BLUE}
                strokeWidth={4}
                fill={WHITE}
              />
            );
          } else {
            return null;
          }
        });
      }
      return null;
    };

    let distanceTotal =
      (distances && distances.filter((d) => d.activity === 'total')) ||
      DEFAULT_TOTAL_DISTANCES;

    let distanceInKM =
      (distanceTotal && distanceTotal[0] && distanceTotal[0].distance) || 0;

    const labelData = [
      '',
      '',
      'Mon',
      'Tue',
      'Wed',
      'Thu',
      'Fri',
      'Sat',
      'Sun',
      '',
      '',
    ];

    return loading ? (
      <View style={styles.loadingContainer}>
        <ActivityIndicator color={BLUE} size="large" />
      </View>
    ) : (
      <View style={styles.root}>
        <View style={styles.transitionContainer} />
        <View style={styles.paddedContainer}>
          <Text
            fontWeight="bold"
            fontSize={MEDIUM_FONT_SIZE}
            style={{marginBottom: 20, alignSelf: 'center'}}
          >
            Today's Summary
          </Text>

          <SummaryInsights
            steps={steps || 0}
            distance={distanceInKM}
            floors={floors || 0}
          />

          <View style={styles.comparisonContainer}>
            <View style={styles.flex}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Icon
                  name={comparison.type}
                  size={30}
                  color={comparison.color}
                  style={styles.marginRight}
                />
                <Text
                  fontWeight="bold"
                  fontSize={35}
                  style={{color: comparison.color}}
                >
                  {comparison.value.toFixed(0)}%
                </Text>
              </View>
              <Text fontSize={SMALL_FONT_SIZE} style={styles.labelText}>
                than last week
              </Text>
            </View>
            <View style={styles.flex}>
              <Text
                fontWeight="bold"
                fontSize={35}
                style={{color: GREEN, textAlign: 'center'}}
              >
                {biggestNumberStep}
              </Text>
              <Text fontSize={SMALL_FONT_SIZE} style={styles.labelText}>
                max steps
              </Text>
            </View>
          </View>
        </View>
        <View style={styles.chartsContainer}>
          <AreaChart
            yMin={0}
            yMax={biggestNumberStep}
            style={{
              height: 140,
              width: '100%',
            }}
            data={lastWeekData}
            contentInset={{top: 30}}
            curve={shape.curveBasis}
            svg={{fill: LIGHTER_GREY}}
          >
            <Line />
          </AreaChart>
          <AreaChart
            yMin={0}
            yMax={biggestNumberStep}
            style={{
              height: 140,
              width: '100%',
              position: 'absolute',
              top: 0,
            }}
            data={thisWeekData}
            contentInset={{top: 30}}
            curve={shape.curveBasis}
            svg={{fill: 'none'}}
          >
            <LinePrimary />
            <Decorator />
          </AreaChart>
          <View style={{flexDirection: 'row'}}>
            {labelData.map((label, index) => (
              <View
                key={'label' + index}
                style={{
                  flex: index === 0 || index === labelData.length - 1 ? 0.5 : 1,
                  backgroundColor: LIGHTER_GREY,
                  paddingVertical: 5,
                  borderBottomColor: LIGHT_GREY,
                  borderBottomWidth: 1,
                }}
              >
                <Text
                  fontSize={SMALL_FONT_SIZE}
                  fontWeight="bold"
                  style={{textAlign: 'center', color: DARK_GREY70}}
                >
                  {label}
                </Text>
              </View>
            ))}
          </View>
          <View style={styles.legendContainer}>
            <View style={styles.legendItem}>
              <View style={styles.lastWeekDot} />
              <Text fontWeight="bold" style={{color: DARK_GREY70}}>
                Last week
              </Text>
            </View>
            <View style={styles.legendItem}>
              <View style={styles.thisWeekDot} />
              <Text fontWeight="bold" style={{color: DARK_GREY70}}>
                This week
              </Text>
            </View>
            <View style={styles.legendItem}>
              <View style={styles.todayDot} />
              <Text fontWeight="bold" style={{color: DARK_GREY70}}>
                Today
              </Text>
            </View>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: WHITE,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: LIGHTER_GREY,
    justifyContent: 'center',
  },
  transitionContainer: {
    backgroundColor: LIGHTER_GREY,
    height: 100,
    width: '100%',
    position: 'absolute',
    top: 0,
    borderBottomWidth: 1,
    borderColor: LIGHT_GREY,
  },
  paddedContainer: {
    padding: 20,
    flex: 1,
  },
  chartsContainer: {
    height: 200,
  },
  legendContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: LIGHT_GREY,
  },
  legendItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  lastWeekDot: {
    backgroundColor: GREY,
    width: 10,
    height: 6,
    marginRight: 10,
  },
  thisWeekDot: {
    backgroundColor: BLUE,
    width: 10,
    height: 6,
    marginRight: 10,
  },
  todayDot: {
    backgroundColor: WHITE,
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 10,
    borderWidth: 2.5,
    borderColor: BLUE,
  },
  comparisonContainer: {
    flexDirection: 'row',
    paddingTop: 20,
    flex: 1,
    alignItems: 'center',
  },
  marginRight: {marginRight: 5},
  flex: {flex: 1},
  labelText: {marginBottom: 10, textAlign: 'center'},
});
