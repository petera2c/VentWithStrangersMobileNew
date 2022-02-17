import React, { useContext, useState } from "react";
import { SafeAreaView, View, Text, TouchableOpacity } from "react-native";
import { createDrawerNavigator } from "@react-navigation/drawer";

import BottomHeader from "../BottomHeader";
import Rewards from "../../../screens/Rewards";

import { RouteContext, UserContext } from "../../../context";

import { styles } from "../../../styles";

const Drawer = createDrawerNavigator();

function DrawerNavigation() {
  const { activeRoute } = useContext(RouteContext);
  const { user } = useContext(UserContext);

  const [showAccountRoutes, setShowAccountRoutes] = useState();

  return (
    <Drawer.Navigator
      initialRouteName="Home"
      screenOptions={{ drawerPosition: "right", headerShown: false }}
      drawerContent={(props) => {
        const { navigation, state } = props;

        return (
          <SafeAreaView style={{ ...styles.ma16 }}>
            {user && (
              <View>
                <TouchableOpacity
                  onPress={() => {
                    setShowAccountRoutes(!showAccountRoutes);
                  }}
                  style={{ ...styles.py16 }}
                >
                  <Text
                    style={{
                      ...(activeRoute === "Profile"
                        ? styles.colorMain
                        : styles.colorGrey1),
                    }}
                  >
                    Profile
                  </Text>
                </TouchableOpacity>

                {showAccountRoutes && (
                  <View>
                    <SomeButton
                      isActive={activeRoute === "Profile"}
                      onPress={() => {
                        navigation.navigate("Profile");
                      }}
                      title="My Public Profile"
                    />

                    <SomeButton
                      isActive={activeRoute === "Avatar"}
                      onPress={() => {
                        navigation.navigate("Avatar");
                      }}
                      title="Avatar"
                    />

                    <SomeButton
                      isActive={activeRoute === "Account"}
                      onPress={() => {
                        navigation.navigate("Account");
                      }}
                      title="Account"
                    />

                    <SomeButton
                      isActive={activeRoute === "Settings"}
                      onPress={() => {
                        navigation.navigate("Settings");
                      }}
                      title="Settings"
                    />
                  </View>
                )}
              </View>
            )}

            <SomeButton
              isActive={activeRoute === "OnlineUsers"}
              onPress={() => {
                navigation.navigate("OnlineUsers");
              }}
              title="Online Users"
            />

            <SomeButton
              isActive={activeRoute === "QuoteContest"}
              onPress={() => {
                navigation.navigate("QuoteContest");
              }}
              title="Quote Contest"
            />

            <SomeButton
              isActive={activeRoute === "ChatWithStrangers"}
              onPress={() => {
                navigation.navigate("ChatWithStrangers");
              }}
              title="Chat With Strangers"
            />

            <SomeButton
              isActive={activeRoute === "Rewards"}
              onPress={() => {
                navigation.navigate("Rewards");
              }}
              title="Rewards"
            />

            <SomeButton
              isActive={activeRoute === "TopQuotesMonth"}
              onPress={() => {
                navigation.navigate("TopQuotesMonth");
              }}
              title="Feel Good Quotes"
            />

            <SomeButton
              isActive={activeRoute === "Rules"}
              onPress={() => {
                navigation.navigate("Rules");
              }}
              title="Rules"
            />

            <SomeButton
              isActive={activeRoute === "SiteInfo"}
              onPress={() => {
                navigation.navigate("SiteInfo");
              }}
              title="VWS Info"
            />
          </SafeAreaView>
        );
      }}
    >
      <Drawer.Screen component={BottomHeader} name="Home" />
    </Drawer.Navigator>
  );
}

function SomeButton({ isActive, onPress, title }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        ...(isActive ? styles.borderBottomMain : styles.borderBottom),
        ...styles.py16,
      }}
    >
      <Text
        style={{
          ...styles.fs24,
          ...styles.bold,
          ...(isActive ? styles.colorMain : styles.colorGrey1),
        }}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
}

export default DrawerNavigation;
