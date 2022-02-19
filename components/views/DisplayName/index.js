import React, { useEffect, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";

import KarmaBadge from "../../views/KarmaBadge";
import MakeAvatar from "../../views/MakeAvatar";

import { styles } from "../../../styles";

import { capitolizeFirstChar } from "../../../util";

function DisplayName({
  big,
  displayName,
  isLink = true,
  isUserOnline,
  navigation,
  noAvatar,
  noBadgeOnClick,
  noTooltip,
  userBasicInfo,
  userID,
}) {
  const [capitolizedDisplayName, setCapitolizedDisplayName] = useState(
    "Anonymous"
  );

  useEffect(() => {
    setCapitolizedDisplayName(capitolizeFirstChar(displayName));
  }, [displayName]);

  if (isLink)
    return (
      <View style={{ ...styles.flexRow, ...styles.alignCenter }}>
        <TouchableOpacity
          onPress={() => {
            navigation.jumpTo("Profile", { userID });
          }}
          style={{ ...styles.flexRow, ...styles.alignCenter }}
        >
          <MakeAvatar
            displayName={userBasicInfo.displayName}
            userBasicInfo={userBasicInfo}
          />
          {userBasicInfo && (
            <View style={{ ...styles.flexRow, ...styles.alignCenter }}>
              <Text
                style={{ ...styles.fs20, ...styles.colorGrey11, ...styles.mr8 }}
              >
                {capitolizedDisplayName}
              </Text>
              {isUserOnline === "online" && (
                <View style={{ ...styles.onlineDot, ...styles.mr8 }} />
              )}
            </View>
          )}
        </TouchableOpacity>
        {userBasicInfo && (
          <KarmaBadge
            noOnClick={noBadgeOnClick}
            noTooltip={noTooltip}
            userBasicInfo={userBasicInfo}
          />
        )}
      </View>
    );
  else
    return (
      <View style={{ ...styles.flexRow, ...styles.alignCenter }}>
        <View style={{ ...styles.flexRow, ...styles.alignCenter }}>
          {!noAvatar && (
            <MakeAvatar
              displayName={userBasicInfo.displayName}
              userBasicInfo={userBasicInfo}
            />
          )}
          {userBasicInfo && (
            <View
              style={{
                ...styles.flexRow,
                ...styles.fullCenter,
              }}
            >
              <Text
                style={{
                  ...(big
                    ? styles.fs24
                    : { ...styles.fs20, ...styles.colorGrey11 }),
                  ...styles.mr8,
                }}
              >
                {capitolizedDisplayName}
              </Text>
              {isUserOnline && (
                <View style={{ ...styles.onlineDot, ...styles.mr8 }} />
              )}
              {userBasicInfo && (
                <KarmaBadge
                  noOnClick={noBadgeOnClick}
                  noTooltip={noTooltip}
                  userBasicInfo={userBasicInfo}
                />
              )}
            </View>
          )}
        </View>
      </View>
    );
}

export default DisplayName;
