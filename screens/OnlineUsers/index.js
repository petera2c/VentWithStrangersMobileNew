import React, { useContext, useEffect, useState } from "react";
import {
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import Screen from "../../components/containers/Screen";
import UserComp from "../../components/User";

import { OnlineUsersContext } from "../../context";

import { styles } from "../../styles";

import { getTotalOnlineUsers, getUserAvatars } from "../../util";
import { getOnlineUsers } from "./util";

const FETCH_USER_INIT_COUNT = 6;

function OnlineUsersScreen({ navigation }) {
  const [canLoadMoreUsers, setCanLoadMoreUsers] = useState(true);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [userLoadCount, setUserLoadCount] = useState(FETCH_USER_INIT_COUNT);

  const { setFirstOnlineUsers, setTotalOnlineUsers } = useContext(
    OnlineUsersContext
  );

  useEffect(() => {
    getTotalOnlineUsers((totalOnlineUsers) => {
      getOnlineUsers(setCanLoadMoreUsers, setOnlineUsers, userLoadCount);
      setTotalOnlineUsers(totalOnlineUsers);
      getUserAvatars(setFirstOnlineUsers);
    });

    setTimeout(() => setRefreshing(false), 400);
  }, [
    refreshing,
    setFirstOnlineUsers,
    setOnlineUsers,
    setRefreshing,
    setTotalOnlineUsers,
    userLoadCount,
  ]);

  return (
    <Screen navigation={navigation}>
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => setRefreshing(true)}
          />
        }
      >
        <View style={{ ...styles.pa16 }}>
          {onlineUsers.map(({ lastOnline, userID }, index) => {
            return (
              <UserComp
                isUserOnline
                key={index}
                lastOnline={lastOnline}
                navigation={navigation}
                showMessageUser
                userID={userID}
              />
            );
          })}
          {canLoadMoreUsers && (
            <TouchableOpacity
              onPress={() =>
                setUserLoadCount(
                  (userLoadCount) => userLoadCount + FETCH_USER_INIT_COUNT
                )
              }
              style={{ ...styles.buttonPrimary }}
            >
              <Text style={{ ...styles.fs20, ...styles.colorWhite }}>
                Load More People
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </Screen>
  );
}

export default OnlineUsersScreen;
