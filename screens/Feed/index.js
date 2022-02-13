import React from "react";
import { StyleSheet, Text, View } from "react-native";

import Screen from "../../components/containers/Screen";

function FeedScreen({ navigation }) {
  return (
    <Screen navigation={navigation}>
      <Text>Hello world</Text>
    </Screen>
  );
}

export default FeedScreen;
