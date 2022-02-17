import React, { useState } from "react";
import { RefreshControl, ScrollView, Text, View } from "react-native";

import Screen from "../../../components/containers/Screen";
import Vent from "../../../components/Vent";

import { styles } from "../../../styles";

function SingleVentScreen({ navigation, route }) {
  const { ventID } = route.params;

  const [refreshing, setRefreshing] = useState(false);
  const [ventFound, setVentFound] = useState();

  useEffect(() => {
    setTimeout(() => setRefreshing(false), 400);
  }, [refreshing, setRefreshing]);

  return (
    <Screen goBack navigation={navigation}>
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => setRefreshing(true)}
          />
        }
      >
        <View style={{ ...styles.pa16 }}>
          {ventFound === false && <Text>Vent Not Found</Text>}
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
        </View>
      </ScrollView>
    </Screen>
  );
}

export default SingleVentScreen;
