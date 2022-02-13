import React from "react";
import { Text } from "react-native";

import Screen from "../../components/containers/Screen";

function SettingsScreen({ navigation }) {
  return (
    <Screen navigation={navigation}>
      <Text>Feed</Text>
    </Screen>
  );
}

export default SettingsScreen;
