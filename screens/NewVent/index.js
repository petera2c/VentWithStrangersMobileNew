import React from "react";
import { Text } from "react-native";

import Screen from "../../components/containers/Screen";

function NewVentScreen({ navigation }) {
  return (
    <Screen navigation={navigation}>
      <Text>Create Vent</Text>
    </Screen>
  );
}

export default NewVentScreen;
