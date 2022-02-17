import React, { useContext, useEffect, useState } from "react";
import { SafeAreaView, View, Text, TouchableOpacity } from "react-native";
import { createDrawerNavigator } from "@react-navigation/drawer";

import BottomHeader from "../BottomHeader";
import MakeAvatar from "../../views/MakeAvatar";

import {
  OnlineUsersContext,
  RouteContext,
  UserContext,
} from "../../../context";

import { styles } from "../../../styles";

import {
  chatQueueEmptyListener,
  getTotalOnlineUsers,
  getUserAvatars,
} from "../../../util";

const Drawer = createDrawerNavigator();

function DrawerNavigation() {
  const { activeRoute } = useContext(RouteContext);
  const { user } = useContext(UserContext);
  const {
    firstOnlineUsers,
    totalOnlineUsers,
    setFirstOnlineUsers,
    setTotalOnlineUsers,
  } = useContext(OnlineUsersContext);

  const [queueLength, setQueueLength] = useState();
  const [showAccountRoutes, setShowAccountRoutes] = useState();

  useEffect(() => {
    let chatQueueListenerUnsubscribe;

    chatQueueListenerUnsubscribe = chatQueueEmptyListener(setQueueLength);

    getTotalOnlineUsers((totalOnlineUsers) => {
      setTotalOnlineUsers(totalOnlineUsers);
      getUserAvatars(setFirstOnlineUsers);
    });
    return () => {
      if (chatQueueListenerUnsubscribe) chatQueueListenerUnsubscribe();
    };
  }, [setFirstOnlineUsers, setTotalOnlineUsers]);

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

            <TouchableOpacity
              onPress={() => {
                navigation.navigate("OnlineUsers");
              }}
              style={{
                ...styles.flexRow,
                ...styles.alignCenter,
                ...(activeRoute === "OnlineUsers"
                  ? styles.borderBottomMain
                  : styles.borderBottom),
                ...styles.py16,
              }}
            >
              {firstOnlineUsers && (
                <View
                  style={{
                    ...styles.flexRow,
                    ...styles.alignEnd,
                    width: 4 * 40 - 4 * 18,
                  }}
                >
                  {firstOnlineUsers.map((userBasicInfo, index) => (
                    <View
                      key={userBasicInfo.id}
                      style={{
                        transform: [{ translateX: -(index * 18) }],
                      }}
                    >
                      <MakeAvatar
                        displayName={userBasicInfo.displayName}
                        userBasicInfo={userBasicInfo}
                        size="small"
                      />
                    </View>
                  ))}
                  {totalOnlineUsers - firstOnlineUsers.length > 0 && (
                    <View
                      style={{
                        transform: [
                          { translateX: -(firstOnlineUsers.length * 18) },
                        ],
                        ...styles.roundIconSmall,
                      }}
                    >
                      <Text style={{ ...styles.colorWhite, ...styles.fs16 }}>
                        +{totalOnlineUsers - firstOnlineUsers.length}
                      </Text>
                    </View>
                  )}
                </View>
              )}
              <Text
                style={{
                  ...styles.fs24,
                  ...styles.bold,
                  ...(activeRoute === "OnlineUsers"
                    ? styles.colorMain
                    : styles.colorGrey1),
                }}
              >
                {(totalOnlineUsers === 1 ? " Person" : " People") + " Online"}
              </Text>
            </TouchableOpacity>

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
