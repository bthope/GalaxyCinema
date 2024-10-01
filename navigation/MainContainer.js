import { StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Screens
import HomePage from '../screens/HomePage';
import MovieTheater from '../screens/MovieTheater';
import Cinematography from '../screens/Cinematography';
import Account from '../screens/Account';
import Setting from '../screens/Setting';
import Login from '../screens/Login';
import Register from '../screens/Register';
import TimeVenue from '../screens/TimeVenue';
import Theatre from '../screens/Theatre';
import SelectCombo from '../screens/SelectCombo';
import PayMent from '../screens/PayMent';
import InformationPersonal from '../screens/InformationPersonal';
import EditPassWord from '../screens/EditPassWord';
import ForgetPassword from '../screens/ForgetPassword';
import Transaction from '../screens/Transaction';
import TransactionDetail from '../screens/TransactionDetail';

// Tab Navigator
const homePage = "Trang chủ";
const movieTheater = "Rạp phim";
const cinematography = "Điện ảnh";
const account = "Tài khoản";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function MainTabs() {
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check login status from AsyncStorage
    const checkLoginStatus = async () => {
      try {
        const userInfo = await AsyncStorage.getItem('userInfo');
        const loginStatus = await AsyncStorage.getItem('loginStatus');

        if (userInfo && loginStatus === 'đã đăng nhập') {
          setIsLoggedIn(true);
        } else {
          setIsLoggedIn(false);
        }
      } catch (error) {
        console.error('Error checking login status:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkLoginStatus();
  }, []);

  if (isLoading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <Tab.Navigator
      initialRouteName={account}
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          switch (route.name) {
            case homePage:
              iconName = focused ? 'home' : 'home-outline';
              break;
            case movieTheater:
              iconName = focused ? 'film' : 'film-outline';
              break;
            case cinematography:
              iconName = focused ? 'camera' : 'camera-outline';
              break;
            case account:
              iconName = focused ? 'person' : 'person-outline';
              break;
            default:
              iconName = 'home-outline';
          }

          return (
            <View style={styles.iconContainer}>
              <Ionicons name={iconName} size={size} color={color} />
              {focused && <Text style={[styles.tabLabel, { color }]}>{route.name}</Text>}
            </View>
          );
        },
        tabBarLabel: () => null, // Hide labels from bottom
        tabBarActiveTintColor: '#000080', // Active tab color
        tabBarInactiveTintColor: 'gray', // Inactive tab color
        tabBarStyle: styles.tabBar, // Use styles for tab bar
      })}
    >
      <Tab.Screen name={homePage} component={HomePage} options={{ headerShown: false }} />
      <Tab.Screen name={movieTheater} component={MovieTheater} />
      <Tab.Screen name={cinematography} component={Cinematography} options={{ headerShown: false }} />
      <Tab.Screen
        name={account}
        component={Account}
        options={{ headerShown: false }}
      />
    </Tab.Navigator>
  );
}


export default function MainContainer() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="MainTabs" component={MainTabs} />
        <Stack.Screen name="Setting" component={Setting} />
        <Stack.Screen name="Account" component={Account} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Register" component={Register} />
        <Stack.Screen name="TimeVenue" component={TimeVenue} />
        <Stack.Screen name="HomePage" component={HomePage} />
        <Stack.Screen name="Theatre" component={Theatre} />
        <Stack.Screen name="SelectCombo" component={SelectCombo} />
        <Stack.Screen name="PayMent" component={PayMent} />
        <Stack.Screen name="InformationPersonal" component={InformationPersonal} />
        <Stack.Screen name="EditPassWord" component={EditPassWord} />
        <Stack.Screen name="ForgetPassword" component={ForgetPassword} />
        <Stack.Screen name="Transaction" component={Transaction} />
        <Stack.Screen name="TransactionDetail" component={TransactionDetail} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  iconContainer: {
    alignItems: 'center',
  },
  tabLabel: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  tabBar: {
    height: 60,
  },
});
