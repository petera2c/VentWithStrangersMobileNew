import React from "react";
import { SafeAreaView, View } from "react-native";
import { Button } from "react-native-paper";

import { faBars } from "@fortawesome/pro-solid-svg-icons/faBars";
import { faBell } from "@fortawesome/pro-solid-svg-icons/faBell";
import { faComments } from "@fortawesome/pro-solid-svg-icons/faComments";
import { faHouse } from "@fortawesome/pro-solid-svg-icons/faHouse";
import { faPen } from "@fortawesome/pro-solid-svg-icons/faPen";
import { faUser } from "@fortawesome/pro-solid-svg-icons/faUser";

import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";

import { styles } from "../../../styles";

function BottomHeader({ navigation }) {
  return (
    <View style={{ ...styles.flexRow, ...styles.bgWhite }}>
      <Button
        mode="contained"
        onPress={() => navigation.navigate("feed")}
        style={{
          ...styles.fullCenter,
          flex: 1,
          borderRadius: 0,
          ...styles.bgWhite,
        }}
      >
        <FontAwesomeIcon icon={faHouse} size={32} />
      </Button>
      <Button
        mode="contained"
        onPress={() => navigation.navigate("feed")}
        style={{
          ...styles.fullCenter,
          flex: 1,
          borderRadius: 0,
          ...styles.bgWhite,
        }}
      >
        <FontAwesomeIcon icon={faComments} size={32} />
      </Button>
      <Button
        mode="contained"
        onPress={() => navigation.navigate("feed")}
        style={{
          ...styles.fullCenter,
          flex: 1,
          borderRadius: 0,
          ...styles.bgWhite,
        }}
      >
        <FontAwesomeIcon icon={faPen} size={32} />
      </Button>
      <Button
        mode="contained"
        onPress={() => navigation.navigate("feed")}
        style={{
          ...styles.fullCenter,
          flex: 1,
          borderRadius: 0,
          ...styles.bgWhite,
        }}
      >
        <FontAwesomeIcon icon={faUser} size={32} />
      </Button>
      <Button
        mode="contained"
        onPress={() => navigation.navigate("feed")}
        style={{
          ...styles.fullCenter,
          flex: 1,
          borderRadius: 0,
          ...styles.bgWhite,
        }}
      >
        <FontAwesomeIcon icon={faBars} size={32} />
      </Button>
    </View>
  );
}

export default BottomHeader;
