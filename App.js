/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
} from 'react-native';

import AppNavigator from './navigation/AppNavigator';
import Fonts from './constants/Fonts';
import Colors from './constants/Colors';

const App: () => React$Node = () => {
  return (
    <>
      <AppNavigator />
    </>
  );
};

export default App;
