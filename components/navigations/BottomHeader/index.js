import React, { useContext, useEffect } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { SafeAreaView, TouchableOpacity, View } from "react-native";
import { Button } from "react-native-paper";

import { faBars } from "@fortawesome/pro-solid-svg-icons/faBars";
import { faBell } from "@fortawesome/pro-solid-svg-icons/faBell";
import { faComments } from "@fortawesome/pro-solid-svg-icons/faComments";
import { faHouse } from "@fortawesome/pro-solid-svg-icons/faHouse";
import { faPen } from "@fortawesome/pro-solid-svg-icons/faPen";

import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";

import Rules from "../../../screens/Basic/Rules";
import SiteInfo from "../../../screens/Basic/SiteInfo";

import Feed from "../../../screens/Feed";

import Account from "../../../screens/Profile/Account";
import Avatar from "../../../screens/Profile/Avatar";
import Notifications from "../../../screens/Profile/Notifications";
import Profile from "../../../screens/Profile";
import Settings from "../../../screens/Profile/Settings";

import QuoteContest from "../../../screens/QuoteContest";
import TopQuotesMonth from "../../../screens/QuoteContest/TopQuotesMonth";

import Chats from "../../../screens/Chats";
import ChatWithStrangers from "../../../screens/ChatWithStrangers";
import MakeFriends from "../../../screens/MakeFriends";
import NewVent from "../../../screens/NewVent";
import OnlineUsers from "../../../screens/OnlineUsers";
import Rewards from "../../../screens/Rewards";

import { RouteContext } from "../../../context";

import { styles } from "../../../styles";

const Tab = createBottomTabNavigator();

function BottomHeader({ navigation, route }) {
  const { setActiveRoute } = useContext(RouteContext);

  return (
    <Tab.Navigator
      initialRouteName="Feed"
      screenOptions={{
        tabBarActiveTintColor: "#e91e63",
      }}
      tabBar={({ navigation, state }) => {
        setActiveRoute(state.routes[state.index].name);
        return (
          <SafeAreaView style={{ ...styles.flexRow }}>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate("Feed");
              }}
              style={{
                flex: 1,
                ...styles.fullCenter,
                ...styles.py16,
              }}
            >
              <FontAwesomeIcon
                icon={faHouse}
                size={28}
                style={{
                  ...(state.index === 0 ? styles.colorMain : styles.colorGrey1),
                }}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate("Chats");
              }}
              style={{ flex: 1, ...styles.fullCenter, ...styles.py16 }}
            >
              <FontAwesomeIcon
                icon={faComments}
                size={28}
                style={{
                  ...(state.index === 1 ? styles.colorMain : styles.colorGrey1),
                }}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate("NewVent");
              }}
              style={{ flex: 1, ...styles.fullCenter, ...styles.py16 }}
            >
              <FontAwesomeIcon
                icon={faPen}
                size={28}
                style={{
                  ...(state.index === 2 ? styles.colorMain : styles.colorGrey1),
                }}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate("Notifications");
              }}
              style={{ flex: 1, ...styles.fullCenter, ...styles.py16 }}
            >
              <FontAwesomeIcon
                icon={faBell}
                size={28}
                style={{
                  ...(state.index === 3 ? styles.colorMain : styles.colorGrey1),
                }}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                navigation.openDrawer();
              }}
              style={{ flex: 1, ...styles.fullCenter, ...styles.py16 }}
            >
              <FontAwesomeIcon
                icon={faBars}
                size={28}
                style={{
                  ...(state.index === 4 ? styles.colorMain : styles.colorGrey1),
                }}
              />
            </TouchableOpacity>
          </SafeAreaView>
        );
      }}
    >
      <Tab.Screen
        component={Feed}
        name="Feed"
        options={{
          headerShown: false,
        }}
      />
      <Tab.Screen
        component={Chats}
        name="Chats"
        options={{
          headerShown: false,
        }}
      />
      <Tab.Screen
        component={NewVent}
        name="NewVent"
        options={{
          headerShown: false,
        }}
        tabBarOptions={{
          showLabel: false,
        }}
      />
      <Tab.Screen
        component={Notifications}
        name="Notifications"
        options={{
          headerShown: false,
        }}
      />
      <Tab.Screen
        component={Profile}
        name="Profile"
        options={{
          headerShown: false,
        }}
      />
      <Tab.Screen
        component={Avatar}
        name="Avatar"
        options={{
          headerShown: false,
        }}
      />
      <Tab.Screen
        component={Account}
        name="Account"
        options={{
          headerShown: false,
        }}
      />
      <Tab.Screen
        component={Settings}
        name="Settings"
        options={{
          headerShown: false,
        }}
      />
      <Tab.Screen
        component={OnlineUsers}
        name="OnlineUsers"
        options={{
          headerShown: false,
        }}
      />
      <Tab.Screen
        component={QuoteContest}
        name="QuoteContest"
        options={{
          headerShown: false,
        }}
      />
      <Tab.Screen
        component={ChatWithStrangers}
        name="ChatWithStrangers"
        options={{
          headerShown: false,
        }}
      />
      <Tab.Screen
        component={Rewards}
        name="Rewards"
        options={{
          headerShown: false,
        }}
      />
      <Tab.Screen
        component={TopQuotesMonth}
        name="TopQuotesMonth"
        options={{
          headerShown: false,
        }}
      />
      <Tab.Screen
        component={Rules}
        name="Rules"
        options={{
          headerShown: false,
        }}
      />
      <Tab.Screen
        component={SiteInfo}
        name="SiteInfo"
        options={{
          headerShown: false,
        }}
      />
      <Tab.Screen
        component={MakeFriends}
        name="MakeFriends"
        options={{
          headerShown: false,
        }}
      />
    </Tab.Navigator>
  );
}

export default BottomHeader;
