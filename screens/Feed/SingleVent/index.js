import React, { useState } from "react";
import { Text } from "react-native";

import Screen from "../../../components/containers/Screen";
import Vent from "../../../components/Vent";

import { styles } from "../../../styles";

function SingleVentScreen({ navigation, route }) {
  const { ventID } = route.params;

  const [ventFound, setVentFound] = useState();

  return (
    <Screen goBack navigation={navigation}>
      {ventFound === false && (
        <Text style={{ ...styles.title, ...styles.mt16 }}>Vent Not Found</Text>
      )}
      {ventFound === undefined && ventID && (
        <Vent
          disablePostOnClick={true}
          displayCommentField
          isOnSingleVentPage={true}
          navigation={navigation}
          setVentFound={setVentFound}
          ventID={ventID}
        />
      )}
    </Screen>
  );
}

export default SingleVentScreen;
