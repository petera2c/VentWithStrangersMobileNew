import React from "react";
import { Text } from "react-native";

import Screen from "../../../components/containers/Screen";

function SingleVentScreen({ navigation, route }) {
  console.log(route);
  return (
    <Screen>
      <Text>Single Vent</Text>
    </Screen>
  );
}

export default SingleVentScreen;
