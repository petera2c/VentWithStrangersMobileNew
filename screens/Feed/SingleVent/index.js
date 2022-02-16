import React, { useState } from "react";
import { ScrollView, Text, View } from "react-native";

import Screen from "../../../components/containers/Screen";
import Vent from "../../../components/Vent";

import { styles } from "../../../styles";

function SingleVentScreen({ navigation, route }) {
  const { ventID } = route.params;

  const [ventFound, setVentFound] = useState();

  return (
    <Screen goBack navigation={navigation}>
      <View style={{ ...styles.pa16 }}>
        {ventFound === false && <Text>Vent Not Found</Text>}
        {ventFound === undefined && ventID && (
          <View className="column flex-fill">
            <Vent
              disablePostOnClick={true}
              displayCommentField
              isOnSingleVentPage={true}
              navigation={navigation}
              setVentFound={setVentFound}
              ventID={ventID}
            />
          </View>
        )}
      </View>
    </Screen>
  );
}

export default SingleVentScreen;
