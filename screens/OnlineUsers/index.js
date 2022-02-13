import React from "react";
import { Text } from "react-native";

import Screen from "../../components/containers/Screen";

function OnlineUsersScreen({ navigation }) {
  return (
    <Screen navigation={navigation}>
      <Text>Online Users</Text>
    </Screen>
  );
}

export default OnlineUsersScreen;
