import React, {Component} from 'react';
import {View, StyleSheet} from 'react-native';
import {Text} from '../../generals/core-ui';
import {
  HEADER_FONT_SIZE,
  BIG_FONT_SIZE,
  LARGE_FONT_SIZE,
} from '../../generals/constants/size';
import {AreaChart} from 'react-native-svg-charts';
import {Path, Circle} from 'react-native-svg';
import * as shape from 'd3-shape';
import {
  BLUE,
  LIGHT_GREY,
  GREY,
  WHITE,
  DARK_GREY70,
  LIGHTER_GREY,
} from '../../generals/constants/colors';
import SummaryInsights from './components/SummaryInsights';

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

// type Props = NavigationScreenProps;
type Props = {};

type State = {};

export default class StepsChartPage extends Component<Props, State> {
  render() {
    // let {navigation} = this.props;

    const maxNum = 13098;
    const lastWeekData = [
      maxNum / 2,
      maxNum / 2,
      1024,
      5067,
      10567,
      5900,
      9045,
      3567,
      13098,
      maxNum / 2,
      maxNum / 2,
    ];
    const thisWeekData = [
      maxNum / 2,
      maxNum / 2,
      11087,
      7099,
      5817,
      10900,
      12000,
      null,
      null,
      null,
      null,
    ];

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

    return (
      <View style={styles.root}>
        <View style={styles.transitionContainer} />
        <View style={styles.paddedContainer}>
          <Text
            fontWeight="bold"
            fontSize={LARGE_FONT_SIZE}
            style={{marginBottom: 20}}
          >
            Today's Summary
          </Text>

          <SummaryInsights steps={12210} distance={3.34} floors={16} />
        </View>
        <View style={styles.chartsContainer}>
          <AreaChart
            yMin={0}
            yMax={13098}
            style={{
              height: 130,
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
            yMax={13098}
            style={{
              height: 130,
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
    backgroundColor: LIGHTER_GREY,
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
});
