import React, { useEffect, useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

import Screen from "../../../components/containers/Screen";
import Vent from "../../../components/Vent";

import { styles } from "../../../styles";

import { viewTagFunction } from "../../../util";
import { getTagVents } from "./util";

function IndividualTagScreen({ navigation, route }) {
  const { tagID } = route.params;

  const [canLoadMoreVents, setCanLoadMoreVents] = useState(true);
  const [vents, setVents] = useState([]);

  useEffect(() => {
    getTagVents(setCanLoadMoreVents, setVents, tagID);
  }, [setVents, tagID]);

  return (
    <Screen navigation={navigation} goBack>
      <View
        style={{
          ...styles.shadowBottom,
          zIndex: 1,
          ...styles.px16,
          ...styles.pt16,
        }}
      >
        <View style={{ ...styles.box, ...styles.pa32 }}>
          <Text
            style={{ ...styles.title, ...styles.mb16 }}
          >{`Recent Vents About ${viewTagFunction(tagID)}`}</Text>
          <TouchableOpacity
            onPress={() => navigation.navigate("AllTags")}
            style={{ ...styles.buttonPrimary }}
          >
            <Text style={{ ...styles.fs20, ...styles.colorWhite }}>
              View All Tags
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      <ScrollView style={{ ...styles.pa16 }}>
        {vents.map((vent, index) => (
          <Vent
            key={vent.id}
            navigation={navigation}
            previewMode={true}
            showVentHeader={false}
            ventID={vent.id}
            ventIndex={index}
            ventInit={{ ...vent, id: vent.id }}
          />
        ))}
        {canLoadMoreVents && (
          <TouchableOpacity
            onPress={() => {
              getTagVents(setCanLoadMoreVents, setVents, tagID, vents);
            }}
            style={{ ...styles.buttonPrimary }}
          >
            <Text style={{ ...styles.fs20, ...styles.colorWhite }}>
              Load More Vents
            </Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </Screen>
  );
}

export default IndividualTagScreen;
