import React, { useContext, useEffect, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

import DisplayName from "../views/DisplayName";
import MakeAvatar from "../views/MakeAvatar";
import StarterModal from "../modals/Starter";

import { UserContext } from "../../context";

import { styles } from "../../styles";

import { startConversation } from "../../components/Vent/util";
import {
  calculateKarma,
  capitolizeFirstChar,
  getUserBasicInfo,
  userSignUpProgress,
} from "../../util";

dayjs.extend(relativeTime);

function UserComponent({
  displayName,
  isUserOnline,
  lastOnline,
  navigation,
  showMessageUser,
  userID,
}) {
  const { user } = useContext(UserContext);

  const [userInfo, setUserInfo] = useState({ displayName });
  const [starterModal, setStarterModal] = useState(false);

  const [karmaPoints, setKarmaPoints] = useState(0);

  useEffect(() => {
    getUserBasicInfo((newUserInfo) => {
      setUserInfo(newUserInfo);
      setKarmaPoints(calculateKarma(newUserInfo));
    }, userID);

    return () => {};
  }, [userID]);

  return (
    <View style={{ ...styles.box, ...styles.mb16, ...styles.pa32 }}>
      <TouchableOpacity
        onPress={() => navigation.jumpTo("Profile", { userID })}
      >
        <View
          style={{ ...styles.flexRow, ...styles.alignCenter, ...styles.mb16 }}
        >
          <View style={{ ...styles.mr8 }}>
            <MakeAvatar
              displayName={userInfo.displayName}
              userBasicInfo={userInfo}
            />
          </View>

          <View>
            <View style={{ ...styles.mb8 }}>
              <DisplayName
                big
                displayName={userInfo.displayName}
                isLink={false}
                isUserOnline={isUserOnline}
                navigation={navigation}
                noAvatar
                userBasicInfo={userInfo}
              />
            </View>
            <Text style={{ ...styles.pTag, ...styles.fs18 }}>
              {karmaPoints} Karma Points
            </Text>
          </View>
        </View>

        {showMessageUser && (
          <View>
            {lastOnline && (
              <Text style={{ ...styles.fs16, ...styles.mb8 }}>
                Last Seen: {dayjs(lastOnline).fromNow()}
              </Text>
            )}
            {(!user || (user && user.uid !== userID)) && (
              <TouchableOpacity
                onPress={() => {
                  const userInteractionIssues = userSignUpProgress(user);

                  if (userInteractionIssues) {
                    if (userInteractionIssues === "NSI") setStarterModal(true);
                    return;
                  }

                  startConversation(navigation, user, userID);
                }}
                style={{ ...styles.buttonPrimary }}
              >
                <Text style={{ ...styles.fs20, ...styles.colorWhite }}>
                  Message {capitolizeFirstChar(userInfo.displayName)}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </TouchableOpacity>
      {starterModal && (
        <StarterModal
          activeModal={starterModal}
          setActiveModal={setStarterModal}
        />
      )}
    </View>
  );
}

export default UserComponent;
