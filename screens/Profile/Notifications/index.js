import React, { useContext, useEffect, useState } from "react";
import { Text } from "react-native";

import Screen from "../../../components/containers/Screen";
import NotificationList from "../../../components/NotificationList";

import { UserContext } from "../../../context";
/*
import {
  getNotifications,
  newNotificationsListener,
} from "../../../components/Header/util";
*/

function NotificationsScreen({ navigation }) {
  return (
    <Screen navigation={navigation}>
      <Text>Notifications</Text>
    </Screen>
  );
}

export default NotificationsScreen;
