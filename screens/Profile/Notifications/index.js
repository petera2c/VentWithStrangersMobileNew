import React, { useContext, useEffect, useState } from "react";
import {
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import Screen from "../../../components/containers/Screen";
import NotificationList from "../../../components/NotificationList";

import { UserContext } from "../../../context";

import { styles } from "../../../styles";

import {
  getNotifications,
  newNotificationsListener,
} from "../../../components/navigations/BottomHeader/util";

function NotificationsScreen({ navigation }) {
  const { user } = useContext(UserContext);

  const [canShowLoadMore, setCanShowLoadMore] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    let newNotificationsListenerUnsubscribe;

    if (user) {
      getNotifications(
        [],
        setCanShowLoadMore,
        undefined,
        setNotifications,
        user
      );
      newNotificationsListenerUnsubscribe = newNotificationsListener(
        () => {},
        setNotifications,
        user
      );
    }

    setTimeout(() => setRefreshing(false), 400);

    return () => {
      if (newNotificationsListenerUnsubscribe)
        newNotificationsListenerUnsubscribe();
    };
  }, [refreshing, setRefreshing, user]);

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
          <View style={{ ...styles.box, ...styles.mb16, ...styles.pa32 }}>
            <Text style={{ ...styles.title }}>Your Notifications</Text>
          </View>
          <View>
            <NotificationList
              navigation={navigation}
              notifications={notifications}
            />
          </View>
          {user && canShowLoadMore && (
            <TouchableOpacity
              onPress={() =>
                getNotifications(
                  notifications,
                  setCanShowLoadMore,
                  undefined,
                  setNotifications,
                  user
                )
              }
              style={{ ...styles.buttonPrimary, ...styles.mt16 }}
            >
              <Text style={{ ...styles.fs20, ...styles.colorWhite }}>
                Load More
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </Screen>
  );
}

export default NotificationsScreen;
