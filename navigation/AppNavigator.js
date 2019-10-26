import React from 'react';

import {Text, View, StyleSheet} from 'react-native';

import {createStackNavigator} from 'react-navigation-stack';
import {createDrawerNavigator} from 'react-navigation-drawer';
import {createAppContainer} from 'react-navigation';
import Ionicons from 'react-native-vector-icons/Ionicons';

import HomeScreen from '../screens/HomeScreen';
import Fonts from '../constants/Fonts';
import Colors from '../constants/Colors';

const styles = StyleSheet.create({
  sideDrawer: {
    flexDirection: 'row',
    width: '100%',
    padding: 10,
    marginVertical: 10,
  },
});

const AppNavigator = createStackNavigator({
  Home: {
    screen: HomeScreen,
    navigationOptions: {
      headerTitle: (
        <Text style={{fontFamily: Fonts.bold, fontSize: 20}}>
          Counter Coffee
        </Text>
      ),
      headerStyle: {
        backgroundColor: Colors.yellowColor,
      },
      headerTintColor: '#000',
    },
  },
});

const AppDrawer = createDrawerNavigator(
  {
    MealsFavs: {
      screen: AppNavigator,
      navigationOptions: {
        drawerLabel: (
          <View style={styles.sideDrawer}>
            <View>
              <Ionicons name="md-cart" size={24} />
            </View>
            <View>
              <Text
                style={{
                  fontSize: 14,
                  fontFamily: Fonts.regular,
                  marginHorizontal: 20,
                }}>
                Menu
              </Text>
            </View>
          </View>
        ),
      },
    },
  },
  {
    contentOptions: {
      activeTintColor: '#000',
      labelStyle: {
        fontFamily: Fonts.regular,
      },
    },
  },
);

export default createAppContainer(AppDrawer);
