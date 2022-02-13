import React from "react";
import { Text } from "react-native";

import Screen from "../../../components/containers/Screen";

function TopQuotesMonthScreen({ navigation }) {
  return (
    <Screen navigation={navigation}>
      <Text>Top Quotes of the month!</Text>
    </Screen>
  );
}

export default TopQuotesMonthScreen;
