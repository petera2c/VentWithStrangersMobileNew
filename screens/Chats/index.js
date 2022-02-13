import React from "react";
import { Text } from "react-native";

import Screen from "../../components/containers/Screen";

function ChatsScreen({ navigation }) {
  return (
    <Screen navigation={navigation}>
      <Text>Chats</Text>
    </Screen>
  );
}

export default ChatsScreen;
