import React from "react";
import { Text } from "react-native";

import Screen from "../../../components/containers/Screen";

function NotificationsScreen({ navigation }) {
  return (
    <Screen navigation={navigation}>
      <Text>Notifications</Text>
    </Screen>
  );
}

export default NotificationsScreen;
