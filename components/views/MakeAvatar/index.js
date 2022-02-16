import React, { useEffect, useState } from "react";
import { Text, View } from "react-native";

import { capitolizeFirstChar } from "../../../util";

import Avatar from "../react-native-avataaars";

import { styles } from "../../../styles";

function MakeAvatar({ className, displayName, size, userBasicInfo }) {
  const [capitolizedDisplayName, setCapitolizedDisplayName] = useState("");

  useEffect(() => {
    setCapitolizedDisplayName(
      capitolizeFirstChar(displayName ? displayName : "Anonymous")[0]
    );
  }, [displayName]);

  if (userBasicInfo && userBasicInfo.avatar) {
    if (size === "large")
      return (
        <View
          style={{
            height: 125,
            width: 125,
            ...styles.fullCenter,
          }}
        >
          <Avatar
            avatarStyle={"Circle"}
            topType={userBasicInfo.avatar.topType}
            accessoriesType={userBasicInfo.avatar.accessoriesType}
            hairColor={userBasicInfo.avatar.hairColor}
            facialHairType={userBasicInfo.avatar.facialHairType}
            clotheType={userBasicInfo.avatar.clotheType}
            eyeType={userBasicInfo.avatar.eyeType}
            eyebrowType={userBasicInfo.avatar.eyebrowType}
            mouthType={userBasicInfo.avatar.mouthType}
            skinColor={userBasicInfo.avatar.skinColor}
          />
        </View>
      );
    else if (size === "small")
      return (
        <View
          style={{
            height: 35,
            width: 35,
            ...styles.fullCenter,
          }}
        >
          <Avatar
            avatarStyle={"Circle"}
            topType={userBasicInfo.avatar.topType}
            accessoriesType={userBasicInfo.avatar.accessoriesType}
            hairColor={userBasicInfo.avatar.hairColor}
            facialHairType={userBasicInfo.avatar.facialHairType}
            clotheType={userBasicInfo.avatar.clotheType}
            eyeType={userBasicInfo.avatar.eyeType}
            eyebrowType={userBasicInfo.avatar.eyebrowType}
            mouthType={userBasicInfo.avatar.mouthType}
            skinColor={userBasicInfo.avatar.skinColor}
          />
        </View>
      );
    else
      return (
        <View
          style={{
            height: 65,
            width: 65,
            ...styles.fullCenter,
          }}
        >
          <Avatar
            avatarStyle={"Circle"}
            topType={userBasicInfo.avatar.topType}
            accessoriesType={userBasicInfo.avatar.accessoriesType}
            hairColor={userBasicInfo.avatar.hairColor}
            facialHairType={userBasicInfo.avatar.facialHairType}
            clotheType={userBasicInfo.avatar.clotheType}
            eyeType={userBasicInfo.avatar.eyeType}
            eyebrowType={userBasicInfo.avatar.eyebrowType}
            mouthType={userBasicInfo.avatar.mouthType}
            skinColor={userBasicInfo.avatar.skinColor}
          />
        </View>
      );
  } else {
    if (size === "large")
      return (
        <View style={{ ...styles.roundIcon, ...styles.mr4 }}>
          <Text style={{ ...styles.colorWhite, ...styles.fs18 }}>
            {capitolizedDisplayName}
          </Text>
        </View>
      );
    else if (size === "small")
      return (
        <View style={{ ...styles.roundIcon, ...styles.mr4 }}>
          <Text style={{ ...styles.colorWhite, ...styles.fs18 }}>
            {capitolizedDisplayName}
          </Text>
        </View>
      );
    else
      return (
        <View style={{ ...styles.roundIcon, ...styles.mr4 }}>
          <Text style={{ ...styles.colorWhite, ...styles.fs18 }}>
            {capitolizedDisplayName}
          </Text>
        </View>
      );
  }
}

export default MakeAvatar;
