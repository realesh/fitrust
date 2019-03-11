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
import {DashboardScene, AuthScene, OnBoardingScene} from '../../scenes';
import {GREY, BLUE, LIGHT_GREY} from '../constants/colors';

let AuthStack = createStackNavigator({
  OnBoard: {
    screen: OnBoardingScene,
    navigationOptions: () => ({
      header: null,
    }),
  },
  Auth: {
    screen: AuthScene,
    navigationOptions: ({
      navigation,
    }: {
      navigation: NavigationScreenProp<any>;
    }) => ({
      header: <Toolbar navigation={navigation} />,
    }),
  },
});

let DashboardStack = createStackNavigator({
  Home: {
    screen: DashboardScene,
    navigationOptions: () => ({
      header: null,
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
    animationEnabled: true,
    tabBarOptions: {
      showLabel: false,
      showIcon: true,
      inactiveTintColor: GREY,
      activeTintColor: BLUE,
      style: {
        backgroundColor: 'rgba(255, 255, 255, 0)',
        borderTopColor: LIGHT_GREY,
        borderTopWidth: 1,
        height: 45,
      },
    },
  },
);

let MainSwitch = createSwitchNavigator(
  {
    Auth: AuthStack,
    Main: BottomTab,
  },
  {
    initialRouteName: 'Main',
  },
);

const Main = createAppContainer(MainSwitch);

export default Main;
