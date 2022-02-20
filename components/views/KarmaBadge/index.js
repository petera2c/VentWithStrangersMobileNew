import React, { useEffect, useState } from "react";
import { Text, View } from "react-native";

import { faRocket } from "@fortawesome/pro-solid-svg-icons/faRocket";
import { faMedal } from "@fortawesome/pro-solid-svg-icons/faMedal";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";

import { styles } from "../../../styles";
import { calculateKarma } from "../../../util";

function KarmaBadge({ userBasicInfo }) {
  const [karma, setKarma] = useState(0);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    setKarma(calculateKarma(userBasicInfo));
    setIsAdmin(userBasicInfo ? userBasicInfo.is_admin : false);
  }, [userBasicInfo, userBasicInfo.is_admin]);

  if (isAdmin) return <Text style={{ ...styles.colorMain }}>Moderator</Text>;

  let badgeColor;
  let badgeIcon;
  if (karma >= 10000) {
    badgeColor = "#0062ff";
    badgeIcon = faRocket;
  } else if (karma >= 5000) {
    badgeColor = "#06ac4b";
    badgeIcon = faRocket;
  } else if (karma >= 2500) {
    badgeColor = "#FF101F";
    badgeIcon = faRocket;
  } else if (karma >= 1000) {
    badgeColor = "#ff5100";
    badgeIcon = faRocket;
  } else if (karma >= 500) {
    badgeColor = "#66a1ff";
    badgeIcon = faMedal;
  } else if (karma >= 250) {
    badgeColor = "#07c556";
    badgeIcon = faMedal;
  } else if (karma >= 100) {
    badgeColor = "#ff6670";
    badgeIcon = faMedal;
  } else if (karma >= 50) {
    badgeColor = "#ff9666";
    badgeIcon = faMedal;
  }

  if (badgeColor && badgeIcon)
    return <FontAwesomeIcon icon={badgeIcon} color={badgeColor} size={32} />;
  else return <View />;
}

export default KarmaBadge;
