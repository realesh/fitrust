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
} from 'react-native';
import {NavigationScreenProps} from 'react-navigation';
import {Feather as Icon} from '@expo/vector-icons';
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
import fetchFoodSearch, {
  FoodDetail,
} from '../../helpers/Fetchers/fetchFoodSearch';
import {noResults} from '../../assets/images/search';
import {SMALL_FONT_SIZE} from '../../generals/constants/size';

type Props = NavigationScreenProps;

type State = {
  foodsResult: Array<FoodDetail>;
  loading: boolean;
  searchQuery: string;
  totalCals: number;
};

export default class FoodSearchScene extends Component<Props, State> {
  state: State = {
    foodsResult: [],
    loading: false,
    searchQuery: '',
    totalCals: 0,
  };

  _searchBarRef = createRef<TextInput>();

  componentDidMount() {
    this._focusSearchBar();
  }

  componentDidUpdate(_: Props, prevState: State) {
    let {foodsResult} = this.state;
    if (prevState.foodsResult !== foodsResult && foodsResult.length > 0) {
      let totalCals = 0;
      foodsResult.forEach((food) => (totalCals += food.nf_calories));
      this.setState({totalCals});
    }
  }

  _fetchFoodSearch = async () => {
    this.setState({loading: true});
    let result = await fetchFoodSearch(this.state.searchQuery);
    if (result) {
      this.setState({foodsResult: result.foods || [], loading: false});
    }
  };

  _focusSearchBar = () => {
    this._searchBarRef.current && this._searchBarRef.current.focus();
  };

  render() {
    let {loading, foodsResult, searchQuery, totalCals} = this.state;
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
              placeholder="200g fish n chips..."
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
          ) : foodsResult.length > 0 ? (
            <Fragment>
              <FlatList
                data={foodsResult}
                renderItem={this._renderItem}
                showsVerticalScrollIndicator={false}
                keyExtractor={this._keyExtractor}
                ItemSeparatorComponent={this._renderSeparator}
                ListHeaderComponent={this._renderHeader}
              />

              <View style={styles.paddedContainer}>
                <AnimatedButton
                  // loading={loading}
                  onPress={this._handleSubmitAsync}
                  style={styles.alignStretch}
                >
                  Add {totalCals !== 0 && totalCals} Calories
                </AnimatedButton>
              </View>
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
                {
                  'No results yet... \n Start searching like \n "200g fish n chips"'
                }
              </Text>
            </View>
          )}
        </View>
      </View>
    );
  }

  _renderHeader = () =>
    this.state.foodsResult.length > 0 ? (
      <View style={styles.listHeaderContainer}>
        <Text style={styles.smallTextDetail} fontWeight="bold">
          Qty
        </Text>
        <Text style={styles.mediumTextDetail} fontWeight="bold">
          Unit
        </Text>
        <Text style={styles.mediumTextDetail} fontWeight="bold">
          Food
        </Text>
        <Text style={styles.mediumTextDetail} fontWeight="bold">
          Calories
        </Text>
      </View>
    ) : null;

  _renderItem = ({item}: ListRenderItemInfo<FoodDetail>) => {
    return (
      <View style={styles.foodItemContainer}>
        <Image
          source={{uri: item.photo.thumb}}
          style={styles.foodImage}
          resizeMethod="scale"
        />
        <Text style={styles.smallTextDetail}>{item.serving_qty}</Text>
        <Text style={styles.mediumTextDetail}>{item.serving_unit}</Text>
        <Text style={styles.mediumTextDetail}>{item.food_name}</Text>
        <Text style={styles.mediumTextDetail}>{item.nf_calories}</Text>
      </View>
    );
  };

  _renderSeparator = () => <Separator style={styles.separatorMargin} />;

  _keyExtractor = (_item: FoodDetail, index: number) => String(index);

  _onSearchChange = (searchQuery: string) => {
    this.setState({searchQuery});
  };
  _handleSubmitAsync = async () => {};
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
  foodItemContainer: {
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
