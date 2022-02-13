import React from "react";
import { Text } from "react-native";

import Screen from "../../components/containers/Screen";

function ProfileScreen({ navigation }) {
  return (
    <Screen navigation={navigation}>
      <Text>Profile</Text>
    </Screen>
  );
}

export default ProfileScreen;
