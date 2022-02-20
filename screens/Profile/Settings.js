import React, { useContext, useEffect, useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useDocument } from "react-firebase-hooks/firestore";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../config/firebase_init";
import { Checkbox } from "react-native-paper";
import { showMessage } from "react-native-flash-message";

import { faTimes } from "@fortawesome/pro-solid-svg-icons/faTimes";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";

import Screen from "../../components/containers/Screen";

import { UserContext } from "../../context";

import { colors, styles } from "../../styles";

import { getUserBasicInfo } from "../../util";
import { getBlockedUsers, unblockUser } from "./util";

function SettingsScreen({ navigation }) {
  const { user } = useContext(UserContext);

  const [blockedUsers, setBlockedUsers] = useState([]);
  const [canLoadMore, setCanLoadMore] = useState(false);

  const settingsRef = doc(db, "users_settings", user.uid);
  const [settingsSnapshot] = useDocument(settingsRef, {
    idField: "id",
  });

  const handleChange = async (name, checked, notify = true) => {
    await updateDoc(settingsRef, { [name]: checked });
    if (notify)
      showMessage({
        message: "Setting updated!",
        type: "success",
      });
  };

  if (!settingsSnapshot || !settingsSnapshot.data())
    return (
      <View>
        <Text style={{ ...styles.titleSmall, ...styles.mb16 }}>Loading</Text>
      </View>
    );

  return (
    <Screen navigation={navigation}>
      <ScrollView>
        <View style={{ ...styles.box, ...styles.ma16, ...styles.pa32 }}>
          <View style={{ ...styles.mb16 }}>
            <Text style={{ ...styles.titleSmall, ...styles.mb16 }}>
              Master Notifications
            </Text>
            <Setting
              description="Recieve a notification I post a new vent"
              handleChange={handleChange}
              setAll
              setting="vent_new"
              settingsSnapshot={settingsSnapshot}
            />
            <Setting
              description="Recieve a notification when my vent recieves a new comment"
              handleChange={handleChange}
              setAll
              setting="vent_commented"
              settingsSnapshot={settingsSnapshot}
            />
            <Setting
              description="Recieve a notification when my vent recieves a new like"
              handleChange={handleChange}
              setAll
              setting="vent_like"
              settingsSnapshot={settingsSnapshot}
            />
            <Setting
              description="Recieve a notification when someone tags me in a vent or comment"
              handleChange={handleChange}
              setAll
              setting="comment_tagged"
              settingsSnapshot={settingsSnapshot}
            />
            <Setting
              description="Recieve a notification when my comment recieves a new like"
              handleChange={handleChange}
              setAll
              setting="comment_like"
              settingsSnapshot={settingsSnapshot}
            />
            <Setting
              description="Recieve a notification when my quote recieves a new like"
              handleChange={handleChange}
              setAll
              setting="quote_like"
              settingsSnapshot={settingsSnapshot}
            />
            <Setting
              description="Recieve a notification when a user signs up using my unique link"
              handleChange={handleChange}
              setAll
              setting="link_sign_up"
              settingsSnapshot={settingsSnapshot}
            />
          </View>

          <View style={{ ...styles.mb16, ...styles.ml16 }}>
            <Text style={{ ...styles.titleSmall, ...styles.mb16 }}>
              Email Notifications
            </Text>
            <Setting
              description="Email me when I post a new vent"
              handleChange={handleChange}
              setting="email_vent_new"
              settingsSnapshot={settingsSnapshot}
            />
            <Setting
              description="Email me when my vent recieves a new comment"
              handleChange={handleChange}
              setting="email_vent_commented"
              settingsSnapshot={settingsSnapshot}
            />
            <Setting
              description="Email me when my vent recieves a new like"
              handleChange={handleChange}
              setting="email_vent_like"
              settingsSnapshot={settingsSnapshot}
            />
            <Setting
              description="Email me when someone tags me in a vent or comment"
              handleChange={handleChange}
              setting="email_comment_tagged"
              settingsSnapshot={settingsSnapshot}
            />
            <Setting
              description="Email me when my comment recieves a new like"
              handleChange={handleChange}
              setting="email_comment_like"
              settingsSnapshot={settingsSnapshot}
            />
            <Setting
              description="Email me when my quote recieves a new like"
              handleChange={handleChange}
              setting="email_quote_like"
              settingsSnapshot={settingsSnapshot}
            />
            <Setting
              description="Email me when a user signs up using my link"
              handleChange={handleChange}
              setting="email_link_sign_up"
              settingsSnapshot={settingsSnapshot}
            />
            <Setting
              description="Receive periodic emails on important issues"
              handleChange={handleChange}
              setting="email_promotions"
              settingsSnapshot={settingsSnapshot}
            />
          </View>

          <View style={{ ...styles.mb16, ...styles.ml16 }}>
            <Text style={{ ...styles.titleSmall, ...styles.mb16 }}>
              Mobile Push Notifications
            </Text>
            <Setting
              description="Send a notification to my phone when I post a new vent"
              handleChange={handleChange}
              setting="mobile_vent_new"
              settingsSnapshot={settingsSnapshot}
            />
            <Setting
              description="Send a notification to my phone when my vent recieves a new comment"
              handleChange={handleChange}
              setting="mobile_vent_commented"
              settingsSnapshot={settingsSnapshot}
            />
            <Setting
              description="Send a notification to my phone when my vent recieves a new like"
              handleChange={handleChange}
              setting="mobile_vent_like"
              settingsSnapshot={settingsSnapshot}
            />
            <Setting
              description="Send a notification to my phone when someone tags me in a vent or comment"
              handleChange={handleChange}
              setting="mobile_comment_tagged"
              settingsSnapshot={settingsSnapshot}
            />
            <Setting
              description="Send a notification to my phone when my comment recieves a new like"
              handleChange={handleChange}
              setting="mobile_comment_like"
              settingsSnapshot={settingsSnapshot}
            />
            <Setting
              description="Send a notification to my phone when my quote recieves a new like"
              handleChange={handleChange}
              setting="mobile_quote_like"
              settingsSnapshot={settingsSnapshot}
            />
            <Setting
              description="Send a notification when a user signs up using my link"
              handleChange={handleChange}
              setting="mobile_link_sign_up"
              settingsSnapshot={settingsSnapshot}
            />
          </View>
          <Text style={{ ...styles.titleSmall, ...styles.mb16 }}>
            Privacy and Content Preferences
          </Text>

          <View style={{ ...styles.alignStart, ...styles.mb16 }}>
            <TouchableOpacity
              onPress={() => {
                if (blockedUsers && blockedUsers.length > 0) {
                  setBlockedUsers([]);
                  setCanLoadMore(false);
                } else
                  getBlockedUsers(
                    [],
                    setBlockedUsers,
                    setCanLoadMore,
                    user.uid
                  );
              }}
              style={{ ...styles.borderBottom, ...styles.mb16, ...styles.pb8 }}
            >
              <Text style={{ ...styles.pTag }}>Blocked Users</Text>
            </TouchableOpacity>

            {blockedUsers.map((blockedUserID, index) => (
              <UserDisplay
                blockedUserID={blockedUserID}
                key={blockedUserID}
                setBlockedUsers={setBlockedUsers}
                userID={user.uid}
              />
            ))}
            {canLoadMore && (
              <TouchableOpacity
                onClick={() => {
                  getBlockedUsers(
                    blockedUsers,
                    setBlockedUsers,
                    setCanLoadMore,
                    user.uid
                  );
                }}
                size="large"
                type="primary"
              >
                <Text>Load More</Text>
              </TouchableOpacity>
            )}
          </View>

          <Text style={{ ...styles.fs18, ...styles.tac }}>
            Your private information will never be shared with anyone. Ever.
          </Text>
        </View>
      </ScrollView>
    </Screen>
  );
}

function UserDisplay({ blockedUserID, setBlockedUsers, userID }) {
  const [userBasicInfo, setUserBasicInfo] = useState({});

  useEffect(() => {
    getUserBasicInfo((userBasicInfo) => {
      setUserBasicInfo(userBasicInfo);
    }, blockedUserID);
  }, [blockedUserID]);

  return (
    <TouchableOpacity
      onPress={() => unblockUser(blockedUserID, setBlockedUsers, userID)}
      style={{ ...styles.buttonSecondary, ...styles.mr8, ...styles.mb8 }}
    >
      <Text style={{ ...styles.fs20, ...styles.colorMain, ...styles.mr8 }}>
        {userBasicInfo.displayName}
      </Text>
      <FontAwesomeIcon icon={faTimes} style={{ ...styles.colorMain }} />
    </TouchableOpacity>
  );
}

function Setting({
  description,
  handleChange,
  setAll,
  settingsSnapshot,
  setting,
}) {
  const master = "master_" + setting;
  const mobile = "mobile_" + setting;
  const email = "email_" + setting;

  let main = master;
  if (!setAll) main = setting;

  return (
    <View
      style={{
        ...styles.flexRow,
        ...styles.alignCenter,
        ...styles.mb8,
      }}
    >
      <View
        style={{
          ...(settingsSnapshot.data()[main] ? {} : styles.borderMain),
          ...styles.br4,
        }}
      >
        <Checkbox
          color={colors.main}
          onPress={() => {
            if (setAll) {
              handleChange(master, !settingsSnapshot.data()[master]);
              handleChange(email, !settingsSnapshot.data()[master], false);
              handleChange(mobile, !settingsSnapshot.data()[master], false);
            } else handleChange(main, !settingsSnapshot.data()[main]);
          }}
          status={settingsSnapshot.data()[main] ? "checked" : "unchecked"}
        />
      </View>
      <Text style={{ ...styles.flexFill, ...styles.pTag, ...styles.ml8 }}>
        {description}
      </Text>
    </View>
  );
}

export default SettingsScreen;
