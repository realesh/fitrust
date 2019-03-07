import React from 'react';
import {
  createAppContainer,
  createStackNavigator,
  NavigationScreenProp,
  createBottomTabNavigator,
  createSwitchNavigator,
} from 'react-navigation';
import {Feather as Icon} from '@expo/vector-icons';
import {Toolbar} from '../components';
import {DashboardScene, OnBoardingScene} from '../../scenes';
import {GREY, RED} from '../constants/colors';

let DashboardStack = createStackNavigator({
  Home: {
    screen: DashboardScene,
    navigationOptions: ({
      navigation,
    }: {
      navigation: NavigationScreenProp<any>;
    }) => ({
      header: <Toolbar navigation={navigation} />,
    }),
  },
});

let BottomTab = createBottomTabNavigator(
  {
    Dashboard: {
      screen: DashboardStack,
      navigationOptions: {
        tabBarIcon: ({tintColor}: {tintColor: string}) => (
          <Icon name="home" size={24} color={tintColor} />
        ),
      },
    },
  },
  {
    tabBarOptions: {
      showLabel: false,
      showIcon: true,
      inactiveTintColor: GREY,
      activeTintColor: RED,
      style: {
        backgroundColor: 'transparent',
        borderTopWidth: 0,
        paddingBottom: 10,
      },
    },
  },
);

let MainSwitch = createSwitchNavigator({
  OnBoarding: OnBoardingScene,
  Main: BottomTab,
  Auth: DashboardStack,
});

const Main = createAppContainer(MainSwitch);

export default Main;
