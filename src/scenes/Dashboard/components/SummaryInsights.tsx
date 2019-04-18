import React from 'react';
import {View, StyleSheet, ViewProps} from 'react-native';
import {BIG_FONT_SIZE} from '../../../generals/constants/size';
import {Text} from '../../../generals/core-ui';
import {BLUE, GREY, WHITE} from '../../../generals/constants/colors';

type SummaryInsightsProps = ViewProps & {
  steps: number;
  distance: number;
  floors: number;
};

export default function SummaryInsights(props: SummaryInsightsProps) {
  let {steps, distance, floors} = props;
  return (
    <View style={styles.insightContainer}>
      <Text fontSize={BIG_FONT_SIZE} style={{marginBottom: 15, color: BLUE}}>
        {`${steps} `}
        <Text
          fontWeight="light"
          fontSize={BIG_FONT_SIZE}
          style={{marginBottom: 15, color: GREY}}
        >
          Steps
        </Text>
      </Text>

      <View style={styles.flexRow}>
        <View style={styles.insightItem}>
          <Text fontWeight="bold" style={{color: BLUE}}>
            {`${distance} `}
            <Text style={{color: GREY}}>km</Text>
          </Text>
        </View>
        <View style={styles.insightItem}>
          <Text fontWeight="bold" style={{color: BLUE}}>
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
    width: '100%',
    borderRadius: 10,
    backgroundColor: WHITE,
    ...shadowSettings,
  },
  flexRow: {
    flexDirection: 'row',
    width: '100%',
  },
  insightItem: {
    flex: 1,
    flexDirection: 'row',
  },
});
