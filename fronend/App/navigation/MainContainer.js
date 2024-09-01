import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { createStackNavigator } from '@react-navigation/stack';

// Screen 
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

// Tab Navigator
const homePage = "Trang chủ";
const movieTheater = "Rạp phim";
const cinematography = "Điện ảnh";
const account = "Tài khoản";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function MainTabs({ navigation }) {
  return (
    <Tab.Navigator
      initialRouteName={account}
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === homePage) {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === movieTheater) {
            iconName = focused ? 'film' : 'film-outline';
          } else if (route.name === cinematography) {
            iconName = focused ? 'camera' : 'camera-outline';
          } else if (route.name === account) {
            iconName = focused ? 'person' : 'person-outline';
          }

          return (
            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
              <Ionicons name={iconName} size={size} color={color} />
              {focused && <Text style={{ color, fontSize: 12, paddingTop: 5 }}>{route.name}</Text>}
            </View>
          );
        },
        tabBarLabel: () => null, // Hide labels from bottom
        tabBarActiveTintColor: '#000080', // Active tab color
        tabBarInactiveTintColor: 'gray', // Inactive tab color
        tabBarLabelStyle: {
          display: 'none', // Hide labels from bottom
        },
        tabBarStyle: {
          height: 55, // Adjust height to fit icon and label
          alignItems: 'center',
          justifyContent: 'flex-start', // Align items at the top
          paddingTop: 10, // Add padding at the top
        },
      })}
    >
      <Tab.Screen name={homePage} component={HomePage} options={{ headerShown: false }} />
      <Tab.Screen name={movieTheater} component={MovieTheater} />
      <Tab.Screen name={cinematography} component={Cinematography} options={{ headerShown: false }} />
      <Tab.Screen name={account} component={Account} options={{ headerShown: false }} />
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
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({});
