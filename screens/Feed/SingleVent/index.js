import React from "react";
import { Text } from "react-native";

import Screen from "../../../components/containers/Screen";

function SingleVentScreen({ navigation }) {
  return (
    <Screen navigation={navigation}>
      <Text>Single Vent</Text>
    </Screen>
  );
}

export default SingleVentScreen;
