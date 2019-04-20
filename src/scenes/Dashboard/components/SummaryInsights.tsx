import React from 'react';
import {View, StyleSheet, ViewProps, Image} from 'react-native';
import {BIG_FONT_SIZE, LARGE_FONT_SIZE} from '../../../generals/constants/size';
import {Text} from '../../../generals/core-ui';
import {GREY, WHITE, BLUE30} from '../../../generals/constants/colors';
import {walk} from '../../../assets/images/dashboard';
import numberFormatter from '../../../helpers/numberFormatter';

type SummaryInsightsProps = ViewProps & {
  steps: number;
  distance: number;
  floors: number;
};

export default function SummaryInsights(props: SummaryInsightsProps) {
  let {steps, distance, floors} = props;
  return (
    <View style={styles.insightContainer}>
      <View style={styles.iconContainer}>
        <Image source={walk} style={styles.image} resizeMode="contain" />
      </View>
      <Text
        fontWeight="bold"
        fontSize={BIG_FONT_SIZE}
        style={{marginBottom: 10}}
      >
        {`${numberFormatter(steps)} `}
      </Text>

      <View style={styles.flexRow}>
        <View style={styles.insightItem}>
          <Text style={{color: GREY}}>Distance</Text>
          <Text
            fontWeight="bold"
            fontSize={LARGE_FONT_SIZE}
            // style={{color: BLUE}}
          >
            {`${distance} `}
            <Text style={{color: GREY}}>km</Text>
          </Text>
        </View>
        <View style={styles.insightItem}>
          <Text style={{color: GREY}}>Stairs</Text>
          <Text
            fontWeight="bold"
            fontSize={LARGE_FONT_SIZE}
            // style={{color: BLUE}}
          >
            {`${floors} `}
            <Text style={{color: GREY}}>floors</Text>
          </Text>
        </View>
      </View>
    </View>
  );
}

const shadowSettings = {
  shadowColor: GREY,
  shadowOpacity: 0.5,
  shadowRadius: 10,
  shadowOffset: {width: 0, height: 2},
  elevation: 5,
};

const styles = StyleSheet.create({
  insightContainer: {
    padding: 20,
    alignItems: 'center',
    width: '100%',
    borderRadius: 10,
    backgroundColor: WHITE,
    ...shadowSettings,
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 10,
    backgroundColor: BLUE30,
  },
  image: {
    width: '70%',
    height: '70%',
    marginBottom: 0,
  },
  flexRow: {
    flexDirection: 'row',
    width: '100%',
  },
  insightItem: {
    flex: 1,
  },
});
