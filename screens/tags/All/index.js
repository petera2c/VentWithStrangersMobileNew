import React, { useEffect, useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

import Screen from "../../../components/containers/Screen";

import { styles } from "../../../styles";

import { getTags } from "./util";

function AllTagsScreen({ navigation }) {
  const [tags, setTags] = useState([]);

  useEffect(() => {
    getTags(setTags);
  }, [setTags, tags]);

  return (
    <Screen goBack navigation={navigation}>
      <View
        style={{
          ...styles.shadowBottom,
          zIndex: 1,
          ...styles.px16,
          ...styles.pt16,
        }}
      >
        <View style={{ ...styles.box, ...styles.pa32 }}>
          <Text style={{ ...styles.title, ...styles.tac, ...styles.mb8 }}>
            All Tag Categories
          </Text>
          <Text style={{ ...styles.pTag, ...styles.tac }}>
            Click on a category to find problems just like yours
          </Text>
        </View>
      </View>
      <ScrollView>
        <View
          style={{
            ...styles.flexRow,
            ...styles.fullCenter,
            ...styles.wrap,
            ...styles.pa16,
          }}
        >
          {tags.map((tag, index) => (
            <Tag key={tag.id} navigation={navigation} tag={tag} />
          ))}
        </View>
      </ScrollView>
    </Screen>
  );
}

function Tag({ navigation, tag }) {
  return (
    <TouchableOpacity
      onPress={() => navigation.navigate("IndividualTag", { tagID: tag.id })}
      style={{
        ...styles.box,
        ...styles.fullCenter,
        ...styles.mx4,
        ...styles.mb8,
        ...styles.pa32,
      }}
    >
      <Text style={{ ...styles.title, ...styles.mb8 }}>{tag.display}</Text>
      <Text style={{ ...styles.pTag }}>{tag.uses ? tag.uses : 0}</Text>
    </TouchableOpacity>
  );
}

export default AllTagsScreen;
