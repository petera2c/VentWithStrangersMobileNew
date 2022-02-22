import React, { useContext, useEffect, useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
} from "react-native";
import { createDrawerNavigator } from "@react-navigation/drawer";

import BottomHeader from "../BottomHeader";
import DisplayName from "../../views/DisplayName";
import MakeAvatar from "../../views/MakeAvatar";

import { signOut2 } from "../../../util";

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
  const { user, userBasicInfo } = useContext(UserContext);
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
      screenOptions={{ headerShown: false }}
      drawerContent={(props) => {
        const { navigation } = props;

        return (
          <SafeAreaView>
            <ScrollView>
              <View style={{ ...styles.pa16 }}>
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
                          <Text
                            style={{ ...styles.colorWhite, ...styles.fs16 }}
                          >
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
                    {(totalOnlineUsers === 1 ? " Person" : " People") +
                      " Online"}
                  </Text>
                </TouchableOpacity>

                <NavigationLink
                  isActive={activeRoute === "QuoteContest"}
                  onPress={() => {
                    navigation.navigate("QuoteContest");
                  }}
                  title="Quote Contest"
                />

                <NavigationLink
                  isActive={activeRoute === "ChatWithStrangers"}
                  onPress={() => {
                    navigation.navigate("ChatWithStrangers");
                  }}
                  title={
                    "Chat With Strangers" +
                    (queueLength === -1 ? "" : ` (${queueLength})`)
                  }
                />

                <NavigationLink
                  isActive={activeRoute === "Rewards"}
                  onPress={() => {
                    navigation.navigate("Rewards");
                  }}
                  title="Rewards"
                />

                <NavigationLink
                  isActive={activeRoute === "TopQuotesMonth"}
                  onPress={() => {
                    navigation.navigate("TopQuotesMonth");
                  }}
                  title="Feel Good Quotes"
                />

                <NavigationLink
                  isActive={activeRoute === "Search"}
                  onPress={() => {
                    navigation.navigate("Search");
                  }}
                  title="Search"
                />

                <NavigationLink
                  isActive={activeRoute === "Rules"}
                  onPress={() => {
                    navigation.navigate("Rules");
                  }}
                  title="Rules"
                />

                <NavigationLink
                  isActive={activeRoute === "SiteInfo"}
                  onPress={() => {
                    navigation.navigate("SiteInfo");
                  }}
                  title="VWS Info"
                />

                {user && (
                  <View>
                    <TouchableOpacity
                      onPress={() => {
                        setShowAccountRoutes(!showAccountRoutes);
                      }}
                      style={{ ...styles.py16 }}
                    >
                      <DisplayName
                        big
                        displayName={userBasicInfo.displayName}
                        isLink={false}
                        navigation={navigation}
                        userBasicInfo={userBasicInfo}
                      />
                    </TouchableOpacity>

                    {showAccountRoutes && (
                      <View>
                        <NavigationLink
                          isActive={activeRoute === "Profile"}
                          onPress={() => {
                            navigation.navigate("Profile", {
                              userID: user.uid,
                            });
                          }}
                          title="My Public Profile"
                        />

                        <NavigationLink
                          isActive={activeRoute === "Avatar"}
                          onPress={() => {
                            navigation.navigate("Avatar");
                          }}
                          title="Avatar"
                        />

                        <NavigationLink
                          isActive={activeRoute === "Account"}
                          onPress={() => {
                            navigation.navigate("Account");
                          }}
                          title="Account"
                        />

                        <NavigationLink
                          isActive={activeRoute === "Settings"}
                          onPress={() => {
                            navigation.navigate("Settings");
                          }}
                          title="Settings"
                        />
                        <NavigationLink
                          isActive={false}
                          onPress={() => {
                            if (user) signOut2(user.uid);
                          }}
                          title="Sign Out"
                        />
                      </View>
                    )}
                  </View>
                )}
              </View>
            </ScrollView>
          </SafeAreaView>
        );
      }}
    >
      <Drawer.Screen component={BottomHeader} name="Home" />
    </Drawer.Navigator>
  );
}

function NavigationLink({ isActive, onPress, title }) {
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
