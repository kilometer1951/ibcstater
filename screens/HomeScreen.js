import React from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Image,
  YellowBox,
} from 'react-native';
import {HeaderButtons, Item} from 'react-navigation-header-buttons';

import CustomHeaderButton from '../components/HeaderButton';
import BottomHeader from '../components/BottomHeader';

import cartHasNoItem from '../assets/icons/cartHasNoItem.png';

YellowBox.ignoreWarnings(['RCTRootView cancelTouches']);
// console.disableYellowBox = true;

const HomeScreen = () => {
  return <BottomHeader />;
};

HomeScreen.navigationOptions = navData => {
  return {
    headerRight: (
      <TouchableOpacity
        style={styles.headerButton}
        onPress={() => {
          console.log('here');
        }}>
        <Image
          source={cartHasNoItem}
          style={{width: 30, height: 30}}
          resizeMode="contain"
        />
      </TouchableOpacity>
    ),
    headerLeft: (
      <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
        <Item
          title="Menu"
          iconName="ios-menu"
          onPress={() => {
            navData.navigation.toggleDrawer();
          }}
        />
      </HeaderButtons>
    ),
  };
};

const styles = StyleSheet.create({
  headerButton: {
    marginHorizontal: 10,
    marginVertical: 10,
  },
  headerButtonText: {
    fontSize: 16,
  },
});

export default HomeScreen;
