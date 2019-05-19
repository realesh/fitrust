import React, {Component, createRef, Fragment} from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  ListRenderItemInfo,
  Image,
  ActivityIndicator,
  TouchableOpacity,
  TextInput,
  AsyncStorage,
} from 'react-native';
import {NavigationScreenProps} from 'react-navigation';
import {Feather as Icon} from '@expo/vector-icons';
import {Mutation} from 'react-apollo';

import {Toolbar} from '../../generals/components';
import {
  BLUE,
  LIGHT_GREY,
  WHITE,
  WHITE30,
  WHITE60,
} from '../../generals/constants/colors';
import Separator from '../../generals/core-ui/Separator';
import {Text, AnimatedButton} from '../../generals/core-ui';
import {noResults} from '../../assets/images/search';
import {SMALL_FONT_SIZE} from '../../generals/constants/size';
import {USER_DASHBOARD} from '../../graphql/queries/dashboard';
import EditSuccessModal from '../EditProfile/components/EditSuccessModal';
import fetchExerciseSearch, {
  WorkoutDetail,
} from '../../helpers/Fetchers/fetchExerciseSearch';
import {
  UPDATE_WORKOUT,
  UpdateWorkoutResponse,
  UpdateWorkoutVariables,
} from '../../graphql/queries/workoutSearch';

type NavigationScreenParams = {
  currCals: number;
};

type Props = NavigationScreenProps<NavigationScreenParams>;

type State = {
  workoutResult: Array<WorkoutDetail>;
  loading: boolean;
  searchQuery: string;
  totalCals: number;
  successModalVisible: boolean;
};

export default class WorkoutSearchScene extends Component<Props, State> {
  state: State = {
    workoutResult: [],
    loading: false,
    searchQuery: '',
    totalCals: 0,
    successModalVisible: false,
  };

  _searchBarRef = createRef<TextInput>();

  componentDidMount() {
    this._focusSearchBar();
  }

  componentDidUpdate(_: Props, prevState: State) {
    let {workoutResult} = this.state;
    if (prevState.workoutResult !== workoutResult && workoutResult.length > 0) {
      let totalCals = 0;
      workoutResult.forEach((workout) => (totalCals += workout.nf_calories));
      this.setState({totalCals});
    }
  }

  _fetchFoodSearch = async () => {
    this.setState({loading: true});
    let result = await fetchExerciseSearch(this.state.searchQuery);
    if (result) {
      this.setState({workoutResult: result.exercises || [], loading: false});
    }
  };

  _focusSearchBar = () => {
    this._searchBarRef.current && this._searchBarRef.current.focus();
  };

  render() {
    let {
      loading,
      workoutResult,
      searchQuery,
      totalCals,
      successModalVisible,
    } = this.state;
    // let {navigation} = this.props;

    return (
      <View style={styles.root}>
        <Toolbar
          navigation={this.props.navigation}
          containerStyle={styles.toolbarBg}
          fontColor={WHITE}
        />
        <View style={styles.headerContainer}>
          <TouchableOpacity
            style={styles.searchBar}
            activeOpacity={0.6}
            onPress={this._focusSearchBar}
          >
            <Icon
              name="search"
              size={20}
              color={WHITE}
              style={styles.marginHorizontal}
            />
            <TextInput
              ref={this._searchBarRef}
              value={searchQuery}
              onChangeText={this._onSearchChange}
              style={styles.textInput}
              selectionColor={WHITE}
              onSubmitEditing={this._fetchFoodSearch}
              autoCorrect={false}
              placeholder="Run 30 min..."
              placeholderTextColor={WHITE60}
            />
          </TouchableOpacity>
        </View>
        <View
          style={{
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            paddingTop: 20,
            backgroundColor: WHITE,
            flexGrow: 1,
          }}
        >
          {loading ? (
            <View style={styles.placeholderContainer}>
              <ActivityIndicator color={BLUE} size="large" />
            </View>
          ) : workoutResult.length > 0 ? (
            <Fragment>
              <FlatList
                data={workoutResult}
                renderItem={this._renderItem}
                showsVerticalScrollIndicator={false}
                keyExtractor={this._keyExtractor}
                ItemSeparatorComponent={this._renderSeparator}
                ListHeaderComponent={this._renderHeader}
              />

              {this._renderUpdateButton(totalCals)}
            </Fragment>
          ) : (
            <View style={styles.placeholderContainer}>
              <Image
                source={noResults}
                style={styles.image}
                resizeMode="contain"
              />
              <Text
                style={styles.placeholderText}
                fontWeight="light"
                fontSize={SMALL_FONT_SIZE}
              >
                {'No results yet... \n Start searching like \n "Run 30 min"'}
              </Text>
            </View>
          )}
        </View>

        <EditSuccessModal
          visible={successModalVisible}
          onRequestClose={this._toggleSuccessModal}
          onClosePress={this._goBack}
          title="Got it!"
          message="A workout has been logged for you."
        />
      </View>
    );
  }

  _toggleSuccessModal = () => {
    this.setState({successModalVisible: !this.state.successModalVisible});
  };
  _goBack = () => {
    this._toggleSuccessModal();
    this.props.navigation.goBack();
  };

  _renderHeader = () =>
    this.state.workoutResult.length > 0 ? (
      <View style={styles.listHeaderContainer}>
        <Text style={styles.smallTextDetail} fontWeight="bold">
          Name
        </Text>
        <Text style={styles.mediumTextDetail} fontWeight="bold">
          Duration
        </Text>
        <Text style={styles.mediumTextDetail} fontWeight="bold">
          Calories
        </Text>
      </View>
    ) : null;

  _renderItem = ({item}: ListRenderItemInfo<WorkoutDetail>) => {
    return (
      <View style={styles.workoutItemContainer}>
        <Image
          source={{uri: item.photo.thumb}}
          style={styles.foodImage}
          resizeMethod="scale"
        />
        <Text style={styles.smallTextDetail}>{item.name}</Text>
        <Text style={styles.mediumTextDetail}>{item.duration_min} min</Text>
        <Text style={styles.mediumTextDetail}>{item.nf_calories}</Text>
      </View>
    );
  };

  _renderSeparator = () => <Separator style={styles.separatorMargin} />;

  _keyExtractor = (_item: WorkoutDetail, index: number) => String(index);

  _onSearchChange = (searchQuery: string) => {
    this.setState({searchQuery});
  };

  _renderUpdateButton = (totalCals: number) => (
    <Mutation<UpdateWorkoutResponse, UpdateWorkoutVariables>
      mutation={UPDATE_WORKOUT}
    >
      {(updateIntake, {loading}) => {
        let currentCals = this.props.navigation.getParam('currCals', 0);
        let workout = Number.parseInt((totalCals + currentCals).toFixed(0), 10);
        let handleUpdate = async () => {
          try {
            let ID = await AsyncStorage.getItem('userID');
            updateIntake &&
              (await updateIntake({
                variables: {
                  userID: ID || '',
                  workout,
                },
                refetchQueries: [
                  {
                    query: USER_DASHBOARD,
                    variables: {
                      userID: ID,
                    },
                  },
                ],
              }));
            this._toggleSuccessModal();
          } catch (error) {
            // Handle Error
          }
        };

        return (
          <View style={styles.paddedContainer}>
            <AnimatedButton
              loading={loading}
              onPress={handleUpdate}
              style={styles.alignStretch}
            >
              Add {totalCals !== 0 && totalCals} Calories
            </AnimatedButton>
          </View>
        );
      }}
    </Mutation>
  );
}

const styles = StyleSheet.create({
  root: {
    flexGrow: 1,
    backgroundColor: BLUE,
  },
  smallTextDetail: {flex: 1, textAlign: 'center'},
  mediumTextDetail: {flex: 2, textAlign: 'center'},
  listHeaderContainer: {
    flexDirection: 'row',
    marginLeft: 80,
    paddingRight: 10,
  },
  foodImage: {
    height: 60,
    width: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: LIGHT_GREY,
    marginRight: 10,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    height: 40,
    borderRadius: 20,
    backgroundColor: WHITE30,
  },
  image: {
    height: 200,
    width: '100%',
  },
  alignStretch: {alignSelf: 'stretch'},
  placeholderContainer: {flex: 1, justifyContent: 'center'},
  placeholderText: {textAlign: 'center'},
  workoutItemContainer: {
    flexDirection: 'row',
    padding: 10,
    alignItems: 'center',
  },
  toolbarBg: {backgroundColor: 'transparent'},
  separatorMargin: {marginLeft: 80},
  paddedContainer: {padding: 10},
  headerContainer: {
    padding: 20,
    marginBottom: 20,
  },
  marginHorizontal: {marginHorizontal: 10},
  textInput: {flex: 1, color: WHITE},
});
