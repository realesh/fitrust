import React from 'react';
import {
  createAppContainer,
  createStackNavigator,
  NavigationScreenProp,
  createBottomTabNavigator,
  createSwitchNavigator,
  StackNavigatorConfig,
} from 'react-navigation';
import {Feather as Icon} from '@expo/vector-icons';
import {Toolbar} from '../components';
import {
  DashboardScene,
  AuthScene,
  OnBoardingScene,
  ProfileScene,
  LeaderboardScene,
} from '../../scenes';
import {GREY, BLUE, LIGHT_GREY} from '../constants/colors';
import BMRCalculatorScene from '../../scenes/BMR/BMRCalculatorScene';
import ExerciseModeSettingScene from '../../scenes/ExerciseMode/ExerciseModeSettingScene';
import ExerciseModeCountdownScene from '../../scenes/ExerciseMode/ExerciseModeCountdownScene';
import BadgesListScene from '../../scenes/Badges/BadgesListScene';
import BMICalculatorScene from '../../scenes/BMI/BMICalculatorScene';
import EditProfileScene from '../../scenes/EditProfile/EditProfileScene';
import ChangePasswordScene from '../../scenes/ChangePassword/ChangePasswordScene';
import CheckAuthScene from '../../scenes/Auth/CheckAuthScene';
import Placeholder from '../../scenes/Placeholder';
import FoodSearchScene from '../../scenes/SearchNutritionix/FoodSearchScene';
import WorkoutSearchScene from '../../scenes/SearchNutritionix/WorkoutSearchScene';
import AvatarSelectorScene from '../../scenes/Profile/AvatarSelectorScene';
import CouponsListScene from '../../scenes/Dashboard/CouponListScene';
import SubMaxPlaceholder from '../../scenes/SubMax/SubMaxPlaceholder';
import WebViewScene from '../WebViewScene';
import SubMaxTestScene from '../../scenes/SubMax/SubMaxTestScene';

let authStack = createStackNavigator({
  onBoard: {
    screen: OnBoardingScene,
    navigationOptions: () => ({
      header: null,
    }),
  },
  authField: {
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

let dashboardStack = createStackNavigator({
  dashboardHome: {
    screen: DashboardScene,
    navigationOptions: () => ({
      header: null,
    }),
  },
  BMRCalculator: {
    screen: BMRCalculatorScene,
    navigationOptions: () => ({
      header: null,
    }),
  },
  exCouponList: {
    screen: CouponsListScene,
    navigationOptions: () => ({
      header: null,
    }),
  },
});

let profileStack = createStackNavigator({
  profileHome: {
    screen: ProfileScene,
    navigationOptions: () => ({
      header: null,
    }),
  },
  BMICalculator: {
    screen: BMICalculatorScene,
    navigationOptions: () => ({
      header: null,
    }),
  },
  badgesList: {
    screen: BadgesListScene,
    navigationOptions: () => ({
      header: null,
    }),
  },
  editProfile: {
    screen: EditProfileScene,
    navigationOptions: () => ({
      header: null,
    }),
  },
  changePassword: {
    screen: ChangePasswordScene,
    navigationOptions: () => ({
      header: null,
    }),
  },
  avatarSelector: {
    screen: AvatarSelectorScene,
    navigationOptions: () => ({
      header: null,
    }),
  },
});

let leaderboardStack = createStackNavigator({
  home: {
    screen: LeaderboardScene,
    navigationOptions: () => ({
      header: null,
    }),
  },
});

let bottomTab = createBottomTabNavigator(
  {
    leaderboard: {
      screen: leaderboardStack,
      navigationOptions: {
        tabBarIcon: ({tintColor}: {tintColor: string}) => (
          <Icon name="star" size={24} color={tintColor} />
        ),
      },
    },
    dashboard: {
      screen: dashboardStack,
      navigationOptions: {
        tabBarIcon: ({tintColor}: {tintColor: string}) => (
          <Icon name="activity" size={24} color={tintColor} />
        ),
      },
    },
    profile: {
      screen: profileStack,
      navigationOptions: {
        tabBarIcon: ({tintColor}: {tintColor: string}) => (
          <Icon name="user" size={24} color={tintColor} />
        ),
      },
    },
  },
  {
    initialRouteName: 'dashboard',
    animationEnabled: true,
    tabBarOptions: {
      showLabel: false,
      showIcon: true,
      inactiveTintColor: GREY,
      activeTintColor: BLUE,
      style: {
        borderTopColor: LIGHT_GREY,
        borderTopWidth: 1,
        height: 45,
      },
    },
  },
);

let exerciseModeStack = {
  exerciseModeSetting: ExerciseModeSettingScene,
  exerciseModeCountdown: ExerciseModeCountdownScene,
};

let searchStack = {
  foodSearch: FoodSearchScene,
  workoutSearch: WorkoutSearchScene,
};

let subMaxStack = {
  subMaxPlaceholder: SubMaxPlaceholder,
  subMaxTest: SubMaxTestScene,
};

let defaultStackConfig: StackNavigatorConfig = {
  headerMode: 'none',
};

let routeConfig = {
  bottomTab,
  ...exerciseModeStack,
  ...searchStack,
  ...subMaxStack,
  webView: WebViewScene,
  fitbitAuth: Placeholder,
};

let appStack = createStackNavigator(routeConfig, defaultStackConfig);

let mainSwitch = createSwitchNavigator(
  {
    auth: authStack,
    main: appStack,
    check: CheckAuthScene,
  },
  {
    initialRouteName: 'check',
  },
);

const Main = createAppContainer(mainSwitch);

export default Main;
