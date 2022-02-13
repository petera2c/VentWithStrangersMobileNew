import React from "react";
import { Text } from "react-native";

import Screen from "../../components/containers/Screen";

function FeedScreen({ navigation }) {
  return (
    <Screen navigation={navigation}>
      <Text>Feed</Text>
    </Screen>
  );
}

export default FeedScreen;
