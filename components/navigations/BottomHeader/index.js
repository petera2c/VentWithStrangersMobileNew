import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { SafeAreaView, View } from "react-native";
import { Button } from "react-native-paper";

import { faBars } from "@fortawesome/pro-solid-svg-icons/faBars";
import { faComments } from "@fortawesome/pro-solid-svg-icons/faComments";
import { faHouse } from "@fortawesome/pro-solid-svg-icons/faHouse";
import { faPen } from "@fortawesome/pro-solid-svg-icons/faPen";
import { faUser } from "@fortawesome/pro-solid-svg-icons/faUser";

import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";

import Chats from "../../../screens/Chats";
import Feed from "../../../screens/Feed";
import NewVent from "../../../screens/NewVent";
import Profile from "../../../screens/Profile";
import Drawer from "../Drawer";

import { styles } from "../../../styles";

const Tab = createBottomTabNavigator();

function BottomHeader() {
  return (
    <Tab.Navigator
      initialRouteName="Feed"
      screenOptions={{
        tabBarActiveTintColor: "#e91e63",
      }}
    >
      <Tab.Screen
        component={Feed}
        name="Feed"
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <FontAwesomeIcon icon={faHouse} color={color} size={size} />
          ),
          tabBarLabel: () => {
            return null;
          },
        }}
      />
      <Tab.Screen
        component={Chats}
        name="Chats"
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <FontAwesomeIcon icon={faComments} color={color} size={size} />
          ),
          tabBarLabel: () => {
            return null;
          },
        }}
      />
      <Tab.Screen
        component={NewVent}
        name="NewVent"
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <FontAwesomeIcon icon={faPen} color={color} size={size} />
          ),
          tabBarLabel: () => {
            return null;
          },
        }}
        tabBarOptions={{
          showLabel: false,
        }}
      />
      <Tab.Screen
        component={Profile}
        name="Profile"
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <FontAwesomeIcon icon={faUser} color={color} size={size} />
          ),
          tabBarLabel: () => {
            return null;
          },
        }}
      />
      <Tab.Screen
        component={Drawer}
        name="Drawer"
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <FontAwesomeIcon icon={faBars} color={color} size={size} />
          ),
          tabBarLabel: () => {
            return null;
          },
        }}
      />
    </Tab.Navigator>
  );
}

export default BottomHeader;
