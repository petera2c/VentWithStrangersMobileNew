import React from "react";
import { Text } from "react-native";

import Screen from "../../components/containers/Screen";

function SearchScreen({ navigation }) {
  return (
    <Screen navigation={navigation}>
      <Text>Search</Text>
    </Screen>
  );
}

export default SearchScreen;
