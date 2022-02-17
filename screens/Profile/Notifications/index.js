import React, { useContext, useEffect, useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

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

  useEffect(() => {
    let newNotificationsListenerUnsubscribe;

    getNotifications([], setCanShowLoadMore, undefined, setNotifications, user);
    newNotificationsListenerUnsubscribe = newNotificationsListener(
      () => {},
      setNotifications,
      user
    );

    return () => {
      if (newNotificationsListenerUnsubscribe)
        newNotificationsListenerUnsubscribe();
    };
  }, [user]);

  return (
    <Screen navigation={navigation}>
      <ScrollView>
        <View style={{ ...styles.pa16 }}>
          {true && (
            <View style={{ ...styles.box, ...styles.mb16, ...styles.pa32 }}>
              <Text style={{ ...styles.title }}>Your Notifications</Text>
            </View>
          )}
          <View className="bg-white ov-hidden br8">
            <NotificationList
              navigation={navigation}
              notifications={notifications}
            />
          </View>
          {canShowLoadMore && (
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
              style={{ ...styles.buttonPrimary }}
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
