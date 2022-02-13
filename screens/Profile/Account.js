import React from "react";
import { Text } from "react-native";

import Screen from "../../components/containers/Screen";

function AccountScreen({ navigation }) {
  return (
    <Screen navigation={navigation}>
      <Text>Account</Text>
    </Screen>
  );
}

export default AccountScreen;
